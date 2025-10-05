from agents import function_tool
import logging 
from typing import Optional, Literal, List, Dict, Any
import psycopg2
import psycopg2.extras
import os 

logger = logging.getLogger(__name__)

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