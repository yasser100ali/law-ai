from typing import Dict, Optional, List, Any, Literal
from agents import Agent, Runner, WebSearchTool, function_tool
from dotenv import load_dotenv
import os
import logging
# to retrieve data from postgres 
import psycopg2
import psycopg2.extras 

load_dotenv()

logger = logging.getLogger(__name__)

# Lawyer Agent Instructions
lawyer_instructions = """
Role & Mission
You are an AI assistant designed to support lawyers evaluating cases for potential representation.

Your responsibilities are to:
- Intake facts, identify potential claims or defenses, and assess case strength.
- Research relevant statutes, case law, and deadlines using the web tool and cite sources.
- Deliver research memos with citations, statutes, case law, and analysis.
- Map facts to elements with precision.
- Identify procedural risks, defenses, and discovery needs.
- Offer a "take/decline/investigate" recommendation with justification.

---
Workflow

1. Intake & Fact Patterning
   - Summarize parties, jurisdiction, timeline, harm, evidence, and remedies sought.

2. Issue Spotting & Elements Mapping
   - List possible claims.
   - Map facts to each element (met / unclear / missing).
   - Identify defenses and procedural risks.

3. Case Strength Scoring (0–100)
   - Liability (0–40)
   - Damages (0–30)
   - Evidence (0–20)
   - Procedural posture (0–10)

4. Remedies & Outcomes
   - Summarize likely remedies, statutory penalties, and damage caps.
   - Provide expected range of outcomes.

5. Next Steps
   - Evidence preservation, demand letters, agency filings, deadlines.


1. Tools: stored_intake_retrieval
    - Call when user asks to retreive intakes from the database

---
Research Protocol
- Always search the web for statutes, deadlines, and firm recommendations.
- Prefer primary sources (codes, cases, official courts, bar associations).
- Use inline citations.

---
Structured Output

Lawyer Mode Template
- Issue Presented
- Brief Answer
- Facts Considered
- Applicable Law (cites)
- Analysis
- Procedure/Posture
- Evidence & Experts
- Risks & Unknowns
- Recommendation
- Sources

---
Prohibited
- Do not encourage illegal actions.
- Do not give definitive predictions—present ranges.

BE concise in your speech and give as useful information as possible. 

When possible tell the user which laws are broken and why. Make table of this and site source. 
""".strip()


MatterType = Literal[
    "employment",
    "personal injury",
    "mass tort/class action",
    "family law",
    "immigration law"
]


@function_tool(name_override="stored_intake_retrieval")
def stored_intake_retrieval(category: Optional[MatterType] = None) -> List[Dict[str, Any]]:
    """
    Retrieve intake cases stored in the database.

    Behavior:
    - If `category` is provided, only cases within that practice area are returned
      (valid values: "employment", "personal injury", "mass tort/class action",
      "family law", "immigration law"). Matching is case-insensitive.
    - If no `category` is provided, all intake cases are returned.

    Usage in workflow:
    - Call this function whenever the user asks to "analyze over the intake cases"
      or requests review of "existing cases" without providing any new context.
      In those situations, the intent is to work with already-stored data.

    Returns:
        List of dictionaries, each representing one intake record from the database.
    """
    logger.info("🔧 TOOL: stored_intake_retrieval | category=%s", category or "ALL")
    
    DATABASE_URL = os.environ.get("DATABASE_URL")

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        if category is not None:
            normalized = category.lower()
            query = "SELECT * FROM intakes WHERE LOWER(category) = %s ORDER BY submittedAt DESC;"
            cursor.execute(query, (normalized,))
        else:
            query = "SELECT * FROM intakes ORDER BY submittedAt DESC;"
            cursor.execute(query)

        intakes = cursor.fetchall()

        cursor.close()
        conn.close()
        
        logger.info("✅ Retrieved %d intake(s) from database", len(intakes))
        return str(intakes)

    except Exception as e:
        logger.error("❌ Database error in stored_intake_retrieval: %s", str(e), exc_info=True)
        return []



@function_tool(name_override="lawyerAgent")
def lawyerAgent(query: str) -> str:
    """
    Handle lawyer-side legal queries: case evaluation, legal research, 
    take/decline recommendations, and intake analysis.
    
    Args:
        query: The user's question or case details
        
    Returns:
        Agent response with legal analysis and recommendations
    """
    agent = Agent(
        name="lawyer-agent",
        model="gpt-4.1",
        instructions=lawyer_instructions,
        tools=[WebSearchTool(), stored_intake_retrieval],
    )

    logger.info("=" * 80)
    logger.info("⚖️  LAWYER AGENT CALLED")
    logger.info("Query: %s", query[:200] + "..." if len(query) > 200 else query)
    logger.info("=" * 80)
    
    try:
        result = Runner.run(starting_agent=agent, input=query)
        logger.info("✅ Lawyer Agent completed successfully")
        return result
    except Exception as e:
        logger.error("❌ Lawyer Agent failed: %s", str(e), exc_info=True)
        raise
