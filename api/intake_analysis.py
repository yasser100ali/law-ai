"""
AI-powered intake analysis using OpenAI Agents SDK.
Provides standardized case strength scoring, assessment, and firm recommendations.
"""

import logging
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
from agents import Agent, Runner, WebSearchTool

load_dotenv()

logger = logging.getLogger(__name__)


async def analyze_intake(intake_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze an intake submission using AI to assess case strength and recommend firms.
    
    Args:
        intake_data: Dictionary containing:
            - name: Client name
            - email: Client email
            - phone: Client phone
            - matterType: Type of legal matter
            - description: Case description
            - location: Client location/jurisdiction
            - incidentDate: When incident occurred
            
    Returns:
        Dictionary with:
            - summary: Quick case summary (2-3 sentences)
            - score: Overall case strength (0-100)
            - scoreBreakdown: Dict with criteria scores
            - reasoning: Detailed explanation
            - recommendedFirms: List of potential law firms
            - warnings: List of time-sensitive issues (SOL, deadlines)
    """
    
    logger.info("=" * 80)
    logger.info("🔍 INTAKE ANALYSIS STARTED")
    logger.info("Matter Type: %s | Location: %s", 
                intake_data.get("matterType", "unknown"),
                intake_data.get("location", "unknown"))
    logger.info("=" * 80)
    
    # Build analysis prompt from intake data
    analysis_prompt = f"""
Analyze this legal intake submission and provide a standardized assessment:

CLIENT INFORMATION:
- Name: {intake_data.get('name', 'Not provided')}
- Location/Jurisdiction: {intake_data.get('location', 'Not provided')}
- Matter Type: {intake_data.get('matterType', 'Not provided')}
- Incident Date: {intake_data.get('incidentDate', 'Not provided')}

CASE DESCRIPTION:
{intake_data.get('description', 'No description provided')}

INSTRUCTIONS:
Provide a comprehensive legal case assessment with the following structure:

1. CASE SUMMARY (2-3 sentences)
   - What happened
   - Key legal issues
   - Parties involved

2. CASE STRENGTH SCORE (0-100)
   Break down score across these criteria:
   - Legal Merit (0-30): Strength of applicable laws, clear violations, precedent
   - Evidence Quality (0-20): Available evidence, documentation, witnesses
   - Damages Potential (0-25): Severity of harm, quantifiable losses, compensable injuries
   - Procedural Viability (0-15): Statute of limitations, jurisdiction, procedural barriers
   - Likelihood of Success (0-10): Overall probability of favorable outcome

3. DETAILED REASONING
   - Which laws/statutes apply and why
   - Strengths of the case
   - Weaknesses and risks
   - Missing information that would strengthen analysis

4. TIME-SENSITIVE WARNINGS
   - Statute of limitations deadlines with specific dates if possible
   - Filing deadlines or notice requirements
   - Evidence preservation urgency

5. RECOMMENDED LAW FIRMS
   - Research and list 5-7 law firms in the client's jurisdiction
   - Firms should specialize in this matter type
   - Include: Firm name, location, practice areas, website, why they're a good fit
   - Cite sources (state bar associations, legal directories)

CRITICAL REQUIREMENTS:
- Use web search to find actual current statutes, deadlines, and real law firms
- Cite all legal sources with jurisdiction
- Be specific about score criteria - show your math
- Only recommend real, verifiable law firms with contact information
- Flag any urgent deadlines prominently

FORMAT YOUR RESPONSE AS JSON:
{{
  "summary": "2-3 sentence case overview",
  "score": 75,
  "scoreBreakdown": {{
    "legalMerit": 25,
    "evidenceQuality": 15,
    "damagesPotential": 20,
    "proceduralViability": 10,
    "likelihoodOfSuccess": 5,
    "explanation": "Brief explanation of scoring"
  }},
  "reasoning": "Detailed analysis with legal citations",
  "warnings": [
    "Statute of limitations expires on [DATE] - CA Civil Code §123",
    "Must file EEOC complaint within 180 days"
  ],
  "recommendedFirms": [
    {{
      "name": "Smith & Associates",
      "location": "San Francisco, CA",
      "practiceAreas": ["Employment Law", "Discrimination"],
      "website": "https://example.com",
      "reasoning": "20+ years experience in CA employment law, strong track record",
      "source": "CA State Bar Directory"
    }}
  ],
  "applicableLaws": [
    {{
      "statute": "California Labor Code § 1102.5",
      "summary": "Whistleblower protection statute",
      "relevance": "Directly applies to retaliation claims"
    }}
  ]
}}
"""

    # Create specialized intake analysis agent
    instructions = """
You are a legal intake analysis specialist. Your role is to:

1. Assess case strength using standardized scoring criteria
2. Research applicable laws and statutes via web search
3. Identify time-sensitive deadlines and risks
4. Recommend appropriate law firms in the client's jurisdiction

SCORING METHODOLOGY:
- Legal Merit (0-30): How strong are the legal claims?
  * 25-30: Clear violation, strong precedent, favorable jurisdiction
  * 15-24: Plausible claims, some precedent, mixed authority
  * 5-14: Weak claims, unfavorable precedent, unclear law
  * 0-4: Frivolous or barred by law

- Evidence Quality (0-20): How good is the evidence?
  * 16-20: Documentary evidence, multiple witnesses, clear documentation
  * 10-15: Some evidence, potential witnesses, partial documentation
  * 5-9: Mostly testimonial, limited corroboration
  * 0-4: Little to no evidence mentioned

- Damages Potential (0-25): How significant are the damages?
  * 20-25: Severe injury/harm, quantifiable losses >$100k, emotional distress
  * 12-19: Moderate harm, losses $20k-$100k
  * 6-11: Minor harm, losses <$20k
  * 0-5: Minimal or no damages

- Procedural Viability (0-15): Can this case proceed?
  * 12-15: Well within SOL, proper jurisdiction, no procedural barriers
  * 7-11: Close to deadlines, some jurisdictional questions
  * 3-6: Near SOL expiration, jurisdictional issues
  * 0-2: SOL expired or fatal procedural defects

- Likelihood of Success (0-10): Overall probability
  * 8-10: Strong case, high probability of favorable outcome
  * 5-7: Moderate case, uncertain outcome
  * 2-4: Weak case, low probability
  * 0-1: Very unlikely to succeed

RESEARCH REQUIREMENTS:
- ALWAYS use web search to verify statutes, deadlines, and firm recommendations
- Cite specific statute numbers and sections
- Calculate actual SOL deadlines based on incident date
- Only recommend real law firms with verifiable websites

TONE: Professional, objective, balanced. Acknowledge uncertainty where it exists.

OUTPUT: Always return valid JSON matching the requested structure.
"""

    agent = Agent(
        name="intake-analyst",
        model="gpt-4.1",
        instructions=instructions,
        tools=[WebSearchTool()],
    )

    try:
        # Run the agent
        logger.info("🤖 Running intake analysis agent...")
        run_result = await Runner.run(starting_agent=agent, input=analysis_prompt)
        logger.info("✅ Intake analysis completed")
        
        # Extract text from RunResult object
        # Log what we got to help debug
        logger.info("RunResult type: %s", type(run_result))
        logger.info("RunResult attributes: %s", dir(run_result))
        
        # Try different ways to extract the result
        result_text = ""
        
        # Method 1: Check if it's just a string (non-async version)
        if isinstance(run_result, str):
            result_text = run_result
        # Method 2: Try .content attribute
        elif hasattr(run_result, 'content'):
            result_text = run_result.content
        # Method 3: Try .messages attribute
        elif hasattr(run_result, 'messages') and run_result.messages:
            for msg in reversed(run_result.messages):
                if hasattr(msg, 'get') and msg.get('role') == 'assistant':
                    result_text = msg.get('content', '')
                    break
                elif hasattr(msg, 'role') and msg.role == 'assistant':
                    result_text = msg.content if hasattr(msg, 'content') else str(msg)
                    break
        # Method 4: Just convert to string
        else:
            result_text = str(run_result)
        
        logger.info("Extracted result text length: %d", len(result_text))
        logger.debug("Raw result text (first 500 chars): %s", result_text[:500])
        
        # Try to parse as JSON, fall back to structured parsing if needed
        import json
        import re
        
        # Extract JSON from markdown code blocks if present
        json_match = re.search(r'```(?:json)?\s*(\{.*\})\s*```', result_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            json_str = result_text
        
        try:
            analysis = json.loads(json_str)
        except json.JSONDecodeError:
            logger.warning("Failed to parse JSON response, using fallback structure")
            # Fallback structure
            analysis = {
                "summary": "Analysis completed. See full reasoning for details.",
                "score": 50,
                "scoreBreakdown": {
                    "legalMerit": 15,
                    "evidenceQuality": 10,
                    "damagesPotential": 12,
                    "proceduralViability": 8,
                    "likelihoodOfSuccess": 5,
                    "explanation": "Unable to parse detailed breakdown"
                },
                "reasoning": result_text,
                "warnings": [],
                "recommendedFirms": [],
                "applicableLaws": []
            }
        
        logger.info("📊 Analysis Score: %d/100", analysis.get("score", 0))
        return analysis
        
    except Exception as e:
        logger.error("❌ Intake analysis failed: %s", str(e), exc_info=True)
        # Return error structure
        return {
            "summary": "Analysis failed due to an error. Please review manually.",
            "score": 0,
            "scoreBreakdown": {
                "legalMerit": 0,
                "evidenceQuality": 0,
                "damagesPotential": 0,
                "proceduralViability": 0,
                "likelihoodOfSuccess": 0,
                "explanation": f"Error: {str(e)}"
            },
            "reasoning": f"Analysis error: {str(e)}",
            "warnings": ["Automated analysis unavailable - manual review required"],
            "recommendedFirms": [],
            "applicableLaws": [],
            "error": str(e)
        }

