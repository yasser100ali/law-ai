from typing import AsyncIterator, Dict, List

from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .chat_agents.orchestrator import stream_chat_py
from .utils.prompt import ClientMessage


load_dotenv(".env")


app = FastAPI()


class Request(BaseModel):
    messages: List[ClientMessage]


def _format_messages_for_agent(messages: List[ClientMessage]) -> List[Dict[str, str]]:
    formatted: List[Dict[str, str]] = []
    for message in messages:
        content = message.content or ""

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
) -> AsyncIterator[str]:
    orchestrator_messages = _format_messages_for_agent(messages)
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
    async def event_stream() -> AsyncIterator[str]:
        async for chunk in _stream_agent_response(request.messages, chat_mode):
            yield chunk

    response = StreamingResponse(event_stream())
    response.headers["x-vercel-ai-data-stream"] = "v1"
    return response