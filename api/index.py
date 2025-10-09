from typing import AsyncIterator, Dict, List, Optional, Any
import logging
import psycopg2
import psycopg2.extras

from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .chat_agents.orchestrator import stream_chat_py
from .utils.prompt import ClientMessage
from .rag_store import ensure_vector_store, upload_blobs, search_store, format_results_for_prompt
from .utils.tools import stored_intake_retrieval_tool
from .intake_analysis import analyze_intake
from openai import OpenAI

load_dotenv(".env")

logger = logging.getLogger(__name__)
client = OpenAI()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AttachmentData(BaseModel):
    name: str
    type: str
    content: str  # base64 data URL


class Request(BaseModel):
    messages: List[ClientMessage]
    data: Optional[Dict[str, Any]] = None


def _format_messages_for_agent(
    messages: List[ClientMessage],
    attachments: Optional[List[Dict[str, str]]] = None
) -> List[Dict[str, str]]:
    formatted: List[Dict[str, str]] = []

    for i, message in enumerate(messages):
        content = message.content or ""

        # Debug: Print all messages and their structure
        print(f"DEBUG: Processing message {i}: role={message.role}, content='{content[:100]}...'")
        print(f"DEBUG: Message has attachments: {bool(attachments)}")

        # Attach extra info to the *last* user message
        if i == len(messages) - 1 and message.role == "user" and attachments:
            print(f"DEBUG: Found {len(attachments)} attachments")
            for j, attachment in enumerate(attachments):
                print(f"DEBUG: Attachment {j}: {attachment}")
                if "content" in attachment:
                    # Inline content (old flow)
                    content += (
                        f"\n[File: {attachment['name']} ({attachment['type']}) - Content: {attachment['content']}]"
                    )
                    print(f"DEBUG: Added inline content for {attachment['name']}")
                elif "url" in attachment:
                    # Blob URL (new flow)
                    content += (
                        f"\n[File: {attachment['name']} ({attachment['type']}) - URL: {attachment['url']}]"
                    )
                    print(f"DEBUG: Added blob URL for {attachment['name']}: {attachment['url']}")
                else:
                    print(f"DEBUG: Attachment {j} has no content or url: {list(attachment.keys())}")

        # Handle experimental_attachments if present
        if getattr(message, "experimental_attachments", None):
            print(f"DEBUG: Found experimental_attachments: {message.experimental_attachments}")
            for attachment in message.experimental_attachments:
                content += (
                    f"\n[File: {attachment.name} ({attachment.contentType}) - URL: {attachment.url}]"
                )
                print(f"DEBUG: Added experimental attachment: {attachment.name}")

        print(f"DEBUG: Final content for message {i}: '{content[:200]}...'")

        formatted.append({
            "role": message.role,
            "content": content,
        })

    return formatted


def _stream_agent_response(
    messages: List[ClientMessage],
    selected_chat_mode: str,
    attachments: Optional[List[Dict[str, str]]] = None,
) -> AsyncIterator[str]:
    orchestrator_messages = _format_messages_for_agent(messages, attachments)
    return stream_chat_py(
        messages=orchestrator_messages,
        selected_chat_mode=selected_chat_mode,
    )

@app.post("/api/chat")
async def handle_chat_data(
    request: Request,
    protocol: str = Query("data"),
    chat_mode: str = Query("default"),
):
    # attachments + chatId from the frontend
    attachments = None
    chat_id = "default"
    if request.data:
        attachments = request.data.get("attachments")
        chat_id = request.data.get("chatId", "default")

    # 1) RAG ingest (only if new attachments present)
    vector_store_id = ensure_vector_store(chat_id)
    if attachments:
        upload_blobs(vector_store_id, attachments)

    # 2) OPTIONAL: semantic search now, and inject into the last user message
    # Grab the last user message text
    last_user_text = ""
    for m in reversed(request.messages):
        if m.role == "user":
            last_user_text = m.content or ""
            break
    if last_user_text:
        search_results = client.vector_stores.search(
            vector_store_id=vector_store_id,
            query=last_user_text,
            rewrite_query=True
        )
        retrieved = format_results_for_prompt(search_results)
        if retrieved:
            # append a synthetic system/dev note with retrieved snippets
            # (or append to the last user message—either is fine; I prefer a short system block)
            request.messages.append(
                ClientMessage(role="system", content=f"[RETRIEVED CONTEXT]\n{retrieved}")
            )

    async def event_stream() -> AsyncIterator[str]:
        async for chunk in _stream_agent_response(request.messages, chat_mode, attachments):
            yield chunk

    response = StreamingResponse(event_stream())
    response.headers["x-vercel-ai-data-stream"] = "v1"
    return response


class IntakeAnalysisRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    matterType: str
    description: str
    location: Optional[str] = None
    incidentDate: Optional[str] = None


@app.post("/api/intakes/analyze")
async def analyze_intake_submission(request: IntakeAnalysisRequest):
    """
    Analyze an intake submission using AI to assess case strength,
    provide scoring, and recommend law firms.
    """
    logger.info("📋 Intake analysis requested for matter type: %s", request.matterType)
    
    intake_data = {
        "name": request.name,
        "email": request.email,
        "phone": request.phone,
        "matterType": request.matterType,
        "description": request.description,
        "location": request.location,
        "incidentDate": request.incidentDate,
    }
    
    # Run AI analysis (await the async function)
    analysis = await analyze_intake(intake_data)
    
    logger.info("✅ Analysis completed with score: %d/100", analysis.get("score", 0))
    
    return {
        "success": True,
        "analysis": analysis
    }


# Database connection helper
def get_db_connection():
    """Get a database connection using the DATABASE_URL environment variable"""
    import os
    DATABASE_URL = os.environ.get("DATABASE_URL")
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable not set")
    return psycopg2.connect(DATABASE_URL)


class IntakeCreateRequest(BaseModel):
    shareWithMarketplace: bool
    form: Dict[str, Any]


@app.get("/api/intakes")
async def get_intakes():
    """Get all intakes from database"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        cursor.execute('SELECT * FROM intakes ORDER BY "submittedAt" DESC')
        intakes = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # Transform to match frontend expectations
        transformed_intakes = []
        for intake in intakes:
            transformed = {
                "id": intake["id"],
                "submittedAt": intake["submittedAt"].isoformat() if intake.get("submittedAt") else None,
                "shareWithMarketplace": intake.get("shareWithMarketplace", False),
                "form": {
                    "fullName": intake.get("fullName"),
                    "email": intake.get("email"),
                    "phone": intake.get("phone"),
                    "jurisdiction": intake.get("jurisdiction"),
                    "matterType": intake.get("matterType"),
                    "summary": intake.get("summary"),
                    "goals": intake.get("goals"),
                    "urgency": intake.get("urgency"),
                },
                "aiSummary": intake.get("aiSummary"),
                "aiScore": intake.get("aiScore"),
                "aiScoreBreakdown": intake.get("aiScoreBreakdown"),
                "aiReasoning": intake.get("aiReasoning"),
                "aiWarnings": intake.get("aiWarnings"),
                "recommendedFirms": intake.get("recommendedFirms"),
                "applicableLaws": intake.get("applicableLaws"),
            }
            transformed_intakes.append(transformed)
        
        return transformed_intakes
        
    except Exception as e:
        logger.error("Error fetching intakes: %s", str(e), exc_info=True)
        return {"error": "Failed to fetch intakes"}, 500


@app.post("/api/intakes")
async def create_intake(request: IntakeCreateRequest):
    """Create a new intake with AI analysis"""
    try:
        form = request.form
        
        # Run AI analysis
        analysis = None
        try:
            logger.info("Running AI analysis for intake...")
            analysis = await analyze_intake({
                "name": form.get("fullName"),
                "email": form.get("email"),
                "phone": form.get("phone"),
                "matterType": form.get("matterType"),
                "description": f"{form.get('summary', '')}\n\nGoals: {form.get('goals', '')}\n\nUrgency: {form.get('urgency', '')}",
                "location": form.get("jurisdiction"),
                "incidentDate": None,
            })
            logger.info("AI analysis completed, score: %s", analysis.get("score") if analysis else "N/A")
        except Exception as e:
            logger.error("AI analysis failed: %s", str(e), exc_info=True)
        
        # Insert into database
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        cursor.execute('''
            INSERT INTO intakes (
                "shareWithMarketplace", "fullName", email, phone, jurisdiction, 
                "matterType", summary, goals, urgency,
                "aiSummary", "aiScore", "aiScoreBreakdown", "aiReasoning",
                "aiWarnings", "recommendedFirms", "applicableLaws"
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            ) RETURNING *
        ''', (
            request.shareWithMarketplace,
            form.get("fullName"),
            form.get("email"),
            form.get("phone"),
            form.get("jurisdiction"),
            form.get("matterType"),
            form.get("summary"),
            form.get("goals"),
            form.get("urgency"),
            analysis.get("summary") if analysis else None,
            analysis.get("score") if analysis else None,
            psycopg2.extras.Json(analysis.get("scoreBreakdown")) if analysis and analysis.get("scoreBreakdown") else None,
            analysis.get("reasoning") if analysis else None,
            psycopg2.extras.Json(analysis.get("warnings")) if analysis and analysis.get("warnings") else None,
            psycopg2.extras.Json(analysis.get("recommendedFirms")) if analysis and analysis.get("recommendedFirms") else None,
            psycopg2.extras.Json(analysis.get("applicableLaws")) if analysis and analysis.get("applicableLaws") else None,
        ))
        
        intake = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        # Transform response
        transformed = {
            "id": intake["id"],
            "submittedAt": intake["submittedAt"].isoformat() if intake.get("submittedAt") else None,
            "shareWithMarketplace": intake.get("shareWithMarketplace", False),
            "form": {
                "fullName": intake.get("fullName"),
                "email": intake.get("email"),
                "phone": intake.get("phone"),
                "jurisdiction": intake.get("jurisdiction"),
                "matterType": intake.get("matterType"),
                "summary": intake.get("summary"),
                "goals": intake.get("goals"),
                "urgency": intake.get("urgency"),
            },
            "aiSummary": intake.get("aiSummary"),
            "aiScore": intake.get("aiScore"),
            "aiScoreBreakdown": intake.get("aiScoreBreakdown"),
            "aiReasoning": intake.get("aiReasoning"),
            "aiWarnings": intake.get("aiWarnings"),
            "recommendedFirms": intake.get("recommendedFirms"),
            "applicableLaws": intake.get("applicableLaws"),
        }
        
        return transformed
        
    except Exception as e:
        logger.error("Error creating intake: %s", str(e), exc_info=True)
        return {"error": "Failed to create intake"}, 500


@app.delete("/api/intakes/{intake_id}")
async def delete_intake(intake_id: str):
    """Delete an intake by ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if exists
        cursor.execute('SELECT id FROM intakes WHERE id = %s', (intake_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return {"error": "Intake not found"}, 404
        
        # Delete
        cursor.execute('DELETE FROM intakes WHERE id = %s', (intake_id,))
        conn.commit()
        cursor.close()
        conn.close()
        
        return {"success": True}
        
    except Exception as e:
        logger.error("Error deleting intake: %s", str(e), exc_info=True)
        return {"error": "Failed to delete intake"}, 500


