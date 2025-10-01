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