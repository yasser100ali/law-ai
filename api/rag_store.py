# api/rag_store.py
from typing import Iterable, Dict, Any, List, Optional
from io import BytesIO
import requests
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv() 

client = OpenAI()

# naive in-memory cache; swap for Redis/DB in prod
_VECTOR_STORES: Dict[str, str] = {}

def ensure_vector_store(chat_id: str, name_prefix: str = "uploads-demo") -> str:
    """Return an existing vector_store_id for this chat, or create one."""
    if chat_id in _VECTOR_STORES:
        return _VECTOR_STORES[chat_id]
    vs = client.vector_stores.create(name=f"{name_prefix}:{chat_id}")
    _VECTOR_STORES[chat_id] = vs.id
    return vs.id

def upload_blobs(vector_store_id: str, attachments: Iterable[Dict[str, Any]]) -> List[str]:
    """Upload any blob URLs in attachments to the vector store. Returns file_ids."""
    file_ids: List[str] = []
    for a in attachments:
        url = a.get("url")
        name = a.get("name") or "file"
        if not url:
            continue
        # fetch from Vercel Blob
        resp = requests.get(url, timeout=60)
        resp.raise_for_status()
        bio = BytesIO(resp.content)
        setattr(bio, "name", name)  # OpenAI SDK reads a .name for filename
        uploaded = client.vector_stores.files.upload_and_poll(
            vector_store_id=vector_store_id,
            file=bio
        )
        file_ids.append(uploaded.id)
    return file_ids

def search_store(vector_store_id: str, query: str, max_results: int = 5, rewrite: bool = True) -> Dict[str, Any]:
    """Run a semantic search over the vector store and return the raw result payload."""
    return client.vector_stores.search(
        vector_store_id=vector_store_id,
        query=query,
        max_num_results=max_results,
        rewrite_query=rewrite
    )

def format_results_for_prompt(results) -> str:
    """
    Accepts the SyncPage[VectorStoreSearchResponse] returned by
    client.vector_stores.search(...).
    Builds a compact, readable string for prompting.
    """
    parts: list[str] = []
    # results.data is a list of VectorStoreSearchResult objects
    for r in results.data:
        fname = getattr(r, "filename", None) or getattr(r, "file_name", None) or "unknown"
        score = getattr(r, "score", None)
        # each r.content is a list of content parts with .type and .text
        texts: list[str] = []
        for c in (r.content or []):
            # newer SDK: c.type == "text", c.text is the string
            t = getattr(c, "text", None)
            if t:
                texts.append(t)
        text_blob = "\n".join(texts).strip()
        parts.append(f"### {fname} (score: {score:.3f})\n{text_blob}")

    return "\n\n".join(parts) if parts else ""