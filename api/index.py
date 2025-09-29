from typing import AsyncIterator, Dict, List, Optional, Any

from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .chat_agents.orchestrator import stream_chat_py
from .utils.prompt import ClientMessage


load_dotenv(".env")


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

        # Add attachments to the last user message (most recent)
        if i == len(messages) - 1 and message.role == "user" and attachments:
            for attachment in attachments:
                content += (
                    f"\n[File: {attachment['name']} ({attachment['type']}) - Content: {attachment['content']}]"
                )

        if message.experimental_attachments:
            for attachment in message.experimental_attachments:
                content += (
                    f"\n[File: {attachment.name} ({attachment.contentType}) - URL: {attachment.url}]"
                )

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
    # Extract attachments from request data if present
    attachments = None
    if request.data and "attachments" in request.data:
        attachments = request.data["attachments"]
    
    async def event_stream() -> AsyncIterator[str]:
        async for chunk in _stream_agent_response(request.messages, chat_mode, attachments):
            yield chunk

    response = StreamingResponse(event_stream())
    response.headers["x-vercel-ai-data-stream"] = "v1"
    return response