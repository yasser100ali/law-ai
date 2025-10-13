import json 
import time
import logging 
import os
import re
import requests
import base64
from io import BytesIO, StringIO
from typing import List, Any, Dict, AsyncIterator
from dotenv import load_dotenv
from agents import Agent, Runner, WebSearchTool, CodeInterpreterTool
from pypdf import PdfReader 


# subagent
from .plaintiff_agent import plaintiffAgent
from .lawyer_agent import lawyerAgent

# tools 
from ..utils.tools import stored_intake_retrieval_tool


load_dotenv()

logger = logging.getLogger(__name__)

def extract_pdf_text_from_url(url: str, max_chars: int = 50000) -> str:
    """Extract text from PDF file from URL using pypdf
    
    Args:
        url: URL to the PDF file
        max_chars: Maximum characters to extract (default 50000 ~ 12-15k tokens)
    """
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        pdf_file = BytesIO(response.content)
        pdf_reader = PdfReader(pdf_file)
        
        total_pages = len(pdf_reader.pages)
        text = ""
        truncated = False
        
        for i, page in enumerate(pdf_reader.pages, 1):
            if len(text) >= max_chars:
                truncated = True
                break
                
            page_text = page.extract_text()
            if page_text:  # Guard against None
                # Check if adding this page would exceed limit
                if len(text) + len(page_text) > max_chars:
                    remaining = max_chars - len(text)
                    text += page_text[:remaining] + f"\n\n[Content truncated at {remaining} characters on page {i}]"
                    truncated = True
                    break
                else:
                    text += f"\n--- Page {i} ---\n{page_text}"
        
        result = text.strip()
        
        if truncated:
            result += f"\n\n[Note: PDF has {total_pages} pages. Content was truncated to fit context limits. Only the first {len(result)} characters are shown.]"
        else:
            result = f"[PDF contains {total_pages} pages, {len(result)} characters]\n\n{result}"
            
        return result
    except Exception as e:
        logger.error(f"Error extracting PDF text from URL: {e}")
        return f"[Error reading PDF: {str(e)}]"

def extract_pdf_text_from_base64(base64_data: str, max_chars: int = 50000) -> str:
    """Extract text from PDF file from base64 data URL using pypdf
    
    Args:
        base64_data: Base64 encoded PDF data
        max_chars: Maximum characters to extract (default 50000 ~ 12-15k tokens)
    """
    try:
        # Remove the data URL prefix if present (e.g., "data:application/pdf;base64,")
        if "base64," in base64_data:
            base64_data = base64_data.split("base64,")[1]
        
        # Decode base64 to bytes
        pdf_bytes = base64.b64decode(base64_data)
        
        # Create BytesIO object and read PDF
        pdf_file = BytesIO(pdf_bytes)
        pdf_reader = PdfReader(pdf_file)
        
        total_pages = len(pdf_reader.pages)
        text = ""
        truncated = False
        
        for i, page in enumerate(pdf_reader.pages, 1):
            if len(text) >= max_chars:
                truncated = True
                break
                
            page_text = page.extract_text()
            if page_text:  # Guard against None
                # Check if adding this page would exceed limit
                if len(text) + len(page_text) > max_chars:
                    remaining = max_chars - len(text)
                    text += page_text[:remaining] + f"\n\n[Content truncated at {remaining} characters on page {i}]"
                    truncated = True
                    break
                else:
                    text += f"\n--- Page {i} ---\n{page_text}"
        
        result = text.strip()
        
        if truncated:
            result += f"\n\n[Note: PDF has {total_pages} pages. Content was truncated to fit context limits. Only the first {len(result)} characters are shown.]"
        else:
            result = f"[PDF contains {total_pages} pages, {len(result)} characters]\n\n{result}"
        
        return result
    except Exception as e:
        logger.error(f"Error extracting PDF text from base64: {e}")
        return f"[Error reading PDF: {str(e)}]"



def process_file_content(content: str) -> str:
    """Process message content and extract file contents"""
    # Pattern for URL-based files: [File: filename (mediaType) - URL: url]
    url_file_pattern = r'\[File: ([^(]+) \(([^)]+)\) - URL: ([^\]]+)\]'
    
    # Pattern for base64 content: [File: filename (mediaType) - Content: base64data]

    content_file_pattern = re.compile(
        r'\[File:\s*(.+?)\s*\(([^)]+)\)\s*-\s*Content:\s*(.+?)\]',
        flags=re.DOTALL
    )    
    
    def replace_url_file_ref(match):
        filename = match.group(1).strip()
        media_type = match.group(2).strip()
        url = match.group(3).strip()
        
        if media_type == 'application/pdf':
            file_content = extract_pdf_text_from_url(url)
            return f"[PDF File: {filename}]\n{file_content}\n[End of PDF]"
        else:
            return f"[File: {filename} ({media_type}) - Content not processed]"
    
    def replace_content_file_ref(match):
        filename = match.group(1).strip()
        media_type = match.group(2).strip()
        base64_content = match.group(3).strip()
        max_text_chars = 30000  # Limit for text files
        
        if media_type == 'application/pdf':
            file_content = extract_pdf_text_from_base64(base64_content)
            return f"\n\n[PDF File: {filename}]\n{file_content}\n[End of PDF]\n\n"
        elif media_type in ['text/plain', 'text/csv']:
            # Decode text files directly
            try:
                if "base64," in base64_content:
                    base64_content = base64_content.split("base64,")[1]
                text_content = base64.b64decode(base64_content).decode('utf-8')
                
                # Truncate if too long
                if len(text_content) > max_text_chars:
                    truncated = text_content[:max_text_chars]
                    return f"\n\n[Text File: {filename}]\n{truncated}\n\n[Content truncated. Showing first {max_text_chars} of {len(text_content)} characters]\n[End of File]\n\n"
                else:
                    return f"\n\n[Text File: {filename}]\n{text_content}\n[End of File]\n\n"
            except Exception as e:
                logger.error(f"Error decoding text file: {e}")
                return f"[File: {filename} - Error decoding: {str(e)}]"
        elif media_type in ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']:
            # For Excel/CSV files, just note that it's attached
            return f"\n\n[Excel/CSV File: {filename} - Data file attached]\n\n"
        else:
            return f"[File: {filename} ({media_type}) - Content not processed]"
    
    # Process both patterns
    processed = re.sub(url_file_pattern, replace_url_file_ref, content)
    processed = re.sub(content_file_pattern, replace_content_file_ref, processed)
    
    return processed



def to_agent_messages(history: List[Dict[str, Any]]):
    msgs = []
    for m in history:
        role = m.get("role", "user").lower()
        text = str(m.get("content", ""))
        
        # Process file content if present
        processed_text = process_file_content(text)

        if role == "system":
            msgs.append({"content": processed_text, "role": "developer", "type": "message"})
        elif role == "assistant":
            msgs.append({"content": processed_text, "role": "assistant", "type": "message"})
        else:
            msgs.append({"content": processed_text, "role": "user", "type": "message"})

    return msgs

async def stream_chat_py(
    messages: List[Dict[str, Any]],
    selected_chat_mode: str,
) -> AsyncIterator[str]:

    start_time = time.time()
    logger.info("=" * 100)
    logger.info("🚀 ORCHESTRATOR STARTED")
    logger.info("Messages count: %d | Mode: %s", len(messages or []), selected_chat_mode)
    
    # Log the last user message for context
    if messages:
        last_msg = messages[-1]
        last_content = str(last_msg.get("content", ""))[:300]
        logger.info("Last message preview: %s%s", 
                   last_content, 
                   "..." if len(str(last_msg.get("content", ""))) > 300 else "")
    logger.info("=" * 100)


    
    instructions = """
    You are part of a full-stack demo built by AI Engineer **Yasser Ali** (Next.js frontend, FastAPI+Python backend). 
    This project showcases two legal AI agents (for plaintiffs and for lawyers) under a single orchestrator, plus a Q&A 
    about Yasser's background. The company audience is **Eve**, a startup building AI to help lawyers work faster.

    ──────────────────────────────────────────────────────────────────────────────
    SYSTEM GOALS
    - Give Eve a hands-on demo of a dual-agent legal assistant:
    1) plaintiffAgent — helps potential plaintiffs understand their case and prepare for counsel.
    2) lawyerAgent — helps lawyers triage, research, and memo a case quickly.
    - Also answer questions about **Yasser** (skills, projects, philosophy) to support hiring decisions.
    - Always be honest, source-driven, and explicit about uncertainty.

    DISCLAIMER (show succinctly atop substantive legal responses)
    "I'm not your lawyer. This is general information, not legal advice. Laws vary by jurisdiction and change frequently—verify with a licensed attorney. If you face urgent deadlines (e.g., statute of limitations), contact counsel immediately."

    ──────────────────────────────────────────────────────────────────────────────
    ROUTING / MODES
    - If the user appears to be a **potential plaintiff**, route to **plaintiffAgent**.
    - If the user self-identifies as a **lawyer** or frames the question in counsel terms, route to **lawyerAgent**.
    - If unclear: ask one targeted question ("Are you seeking guidance as a potential plaintiff, or analysis as counsel?").
    - Both sub-agents must use the web search tool for statutes, deadlines, and firm recommendations and **cite sources**.

    Agents: 
    1. plaintiffAgent
    2. lawyerAgent
    3. stored_intake_retrieval - When the user asks to access the database of intakes. 

    Research Protocol (both agents)
    - Use web search for legal specifics and firm recs; prefer primary sources (.gov, court sites, official codes).
    - Provide 2–5 reputable citations for any legal rule, deadline, or recommendation.
    - Summarize disagreements/splits if authorities conflict; surface uncertainty explicitly.

    Multi-Intake & Ranking
    - When given multiple intake emails/PDFs/texts, extract structured fields, score each case, and produce:
    - A ranking table (CaseID, Theory, Jurisdiction, SOL risk, Strength 0–100, Top 3 Risks, Evidence Highlights).
    - A one-paragraph rationale per case.
    - Offer a draft outbound intake letter for the **top 1–2** cases.

    Attachments / Files
    - Accept short text or PDFs (intake forms). If multiple, batch analyze and rank as above.
    - If unable to read a file, ask for text or a readable PDF copy.

    ──────────────────────────────────────────────────────────────────────────────
    ABOUT YASSER (use for "Why hire Yasser?" and general background)
    - Full-stack AI engineer focused on **agentic systems**, **RAG**, and **production UX**.
    - Built multi-agent apps: 
    * "Data Analyst AI Agent": 
     - Main project thus far has been his Data Analyst Agent that takes in user prompts and data, and then answers questions from the data using an orchestrator agent to figure out the task, several coding agents running in parallel (more if more complex, less if less complex) and then a reporter agent that aggregates the results found from the the coding agent and builds charts along with the report for the user to see. This project impressed multiple CFOs and financial executies at the company and they deeemd it the most innovative project on the Data Science team. 
    • "Atlas" — Next.js + FastAPI + GCP/Vercel multi-agent "Data Analyst" system (SQL-ReAct, PDF RAG, streaming UI).  
    • "Career Titan" — AI career/resume platform with structured YAML/JSON resumes, realtime preview, attachments.  
    - Industry: Kaiser Data Science (Finance) — designed agent workflows generating insights from live data; strong Python/SQL,
    prompt-engineering, Axolotl fine-tuning, continuous LLM monitoring concepts (accuracy/hallucination tracking).
    - Background: Applied Mathematics (UCSB). Comfortable with ML (CNNs/transfer learning), orchestration (Next.js/React/TS),
    backend APIs (FastAPI), and evaluation pipelines.
    - Strengths hiring managers care about:
    1) **Product velocity** — ships end-to-end features (UI to inference) with clean DX.  
    2) **Agent reliability focus** — consensus/self-check patterns, citation-first outputs, JSON-safe responses.  
    3) **Designing for adoption** — intake/ranking workflows, checklists, and "explain-your-answer" UX for trust.  
    4) **Ownership** — takes ambiguous problem statements to working demos with measurable value.

    ──────────────────────────────────────────────────────────────────────────────
    FAQ BUTTON HANDLERS (answer these crisply if user clicks/asks)

    1) "What are some ideas to further improve Eve?"
    - Expand scope beyond lawyers to **potential plaintiffs** (consumer-facing pre-intake). The agent can:
    • Pre-screen claims; score strength; flag SOL/notice rules with citations.
    • Auto-draft a polished **intake letter** from user facts.
    • Recommend suitable firms (neutral criteria + disclosure).  
    - Dual benefit / business model: offer a transparent **Premium Placement** to firms (clearly labeled "Sponsored") that 
    prioritizes their listing within reason and jurisdiction/practice-area fit—creating a lead-gen channel for Eve.
    - Reliability upgrades: enforce **cite-every-claim**, structured outputs, automatic uncertainty flags, and human-in-the-loop
    checkpoints for low-confidence or high-variance answers.
    - Ops integrations: CRM push (create matter/leads), SOL calculators, conflict check prompts, templated demand letters,
    pattern-jury-instructions linking, and deposition/ROGs boilerplates with placeholders.

    2) "How could we reduce hallucinations in AI Agents?"
    - **Citations by default**: every legal proposition or deadline must have a source (statute/case/court/agency page).
    - **Parallel consensus**: run multiple sub-agents (different prompts/tools) in parallel; compare outputs.  
    If they converge → higher confidence; if they diverge → expose differences to user and elevate to **human-review**.
    - **Adjudicator pass**: a final reviewer agent checks claims vs. citations (regex/semantic matches) and enforces schema.
    - **RAG + retrieval guards**: restrict legal answers to retrieved, jurisdiction-matched passages; highlight quoted spans.
    - **Evaluation & logs**: track disagreement rate, missing-citation rate, and edit distance vs. ground truth in regression tests.

    3) "How could I use this chatbot?"
    - Ask about **Yasser** (projects, decisions, stack choices) or request a **live demo** of plaintiff/lawyer flows.
    - Upload one or more **intake forms** (short PDFs or text) and have the system **analyze & rank** case strength.
    - For lawyers: paste a fact pattern; get an **issue-spotted memo** with controlling authority and a take/decline call.
    - For potential plaintiffs: describe your situation; receive a **case snapshot**, **strength score**, **next steps**, and a 
    **draft letter** to send to law firms—plus **firm recommendations** with citations.
    - Ask for "**JSON output**" to integrate directly with your pipeline/CRM.

    4) "Why hire Yasser?"
    - Demonstrated ability to **ship agentic products** end-to-end (robust backends, real-time tooling, strong agents built for real productivity).
    - Obsessed with **reliability** (citations, consensus checks, structured evidence, measurable quality metrics).
    - Versatile stack: **Next.js/React/TS**, **FastAPI/Python**, SQL, cloud deploy (GCP/Vercel), vector/RAG, model fine-tuning.
    - Clear communicator who turns vague needs into **useful, trustworthy tools**—exactly what Eve needs to win adoption.

    ──────────────────────────────────────────────────────────────────────────────
    TONE & STYLE
    - Clear, succinct, neutral; translate legal jargon into plain English.
    - Surface uncertainty; avoid overclaiming. Use bullets, tables, and checklists.
    - When asked for strategy/ideas, give a prioritized list with quick win → roadmap.

    EXAMPLES / PROMPTS USERS CAN TRY
    - "Here are 3 intake emails—rank them and write a one-page memo for the strongest case."  
    - "Analyze this employment termination timeline for retaliation; cite CA authority and give a take/decline call."  
    - "Draft a neutral intake letter from these facts for an NYC wage case and list 5 suitable firms with citations."  
    - "Show how Eve could monetize plaintiff pre-intake without harming trust."  
    - "Why should Eve trust your legal answers? Explain your consensus + citation approach."  

    OUTPUT MODES
    - Markdown by default. Offer an optional **JSON block** with fields:
    {mode, jurisdiction, facts_snapshot, claims, elements_map, case_strength_score, risks, deadlines, recommendation, sources}.

    REMINDERS
    - Never present legal specifics without citations. 
    - If laws vary by state or are unsettled, describe the split and recommend attorney review.
    - If given multiple files, produce a **ranking table** first, then per-case summaries.

    END OF SYSTEM INSTRUCTIONS
    """.strip() 
    


    agent = Agent(
        name="agent",
        model="gpt-4.1",
        instructions=instructions,
        tools=[
            WebSearchTool(),
            plaintiffAgent,
            lawyerAgent,
            stored_intake_retrieval_tool
        ]
    )

    agent_input = to_agent_messages(messages)
    logger.debug("agent_input_preview=%s", json.dumps(agent_input[-3:], ensure_ascii=False))

    logger.info("📋 Orchestrator Agent Configuration:")
    logger.info("  - Model: %s", getattr(agent, "model", "unknown"))
    logger.info("  - Available tools: WebSearchTool, plaintiffAgent, lawyerAgent")
    logger.info("  - Message history length: %d", len(agent_input))

    start_time = time.time()

    try:
        logger.info("▶️  Starting Runner.run_streamed...")

        streamed = Runner.run_streamed(agent, input=agent_input)
        logger.info("✅ Runner.run_streamed stream established")

        async for ev in streamed.stream_events():
            et = getattr(ev, "type", "")
            
            # Log all event types for debugging
            if et:
                logger.debug("📡 stream_event | type=%s", et)
            
            # Log tool calls specifically
            if "tool" in et.lower() or "function" in et.lower():
                logger.info("🔧 TOOL EVENT DETECTED: %s | data=%s", et, getattr(ev, "data", "N/A"))

            if et == "raw_response_event":
                data = getattr(ev, "data", None)
                if data and hasattr(data, "__class__") and "ResponseTextDeltaEvent" in str(data.__class__):
                    delta = getattr(data, "delta", "")
                    if delta:
                        yield f"0:{json.dumps(delta)}\n"

            elif et in ("text.delta", "response.text.delta", "agent.output_text.delta"):
                chunk = getattr(ev, "delta", None) or getattr(ev, "text", "")
                if chunk:
                    yield f"0:{json.dumps(chunk)}\n"

            elif et in ("error", "agent.error", "run.error"):
                msg = str(getattr(ev, "error", "unknown_error"))
                logger.error("stream_event error | type=%s message=%s", et, msg)
                error_payload = {
                    "finishReason": "error",
                    "usage": {"promptTokens": 0, "completionTokens": 0},
                    "isContinued": False,
                    "error": msg,
                }
                yield f"e:{json.dumps(error_payload)}\n"
                return

        finish_payload = {
            "finishReason": "stop",
            "usage": {"promptTokens": 0, "completionTokens": 0},
            "isContinued": False,
        }
        yield f"e:{json.dumps(finish_payload)}\n"

    except Exception as e:
        logger.exception("stream_chat_py unhandled exception")
        error_payload = {
            "finishReason": "error",
            "usage": {"promptTokens": 0, "completionTokens": 0},
            "isContinued": False,
            "error": str(e),
        }
        yield f"e:{json.dumps(error_payload)}\n"

    finally:
        duration = time.time() - start_time
        logger.info("=" * 100)
        logger.info("🏁 ORCHESTRATOR FINISHED | duration=%d ms", int(duration * 1000))
        logger.info("=" * 100)
