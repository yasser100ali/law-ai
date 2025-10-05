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



---
Research Protocol
- Always search the web for statutes, deadlines, and firm recommendations.
- Prefer primary sources (codes, cases, official courts, bar associations).
- Use inline citations.
- Always include a numerical score for the strength of the case. 

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
        tools=[WebSearchTool()],
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
