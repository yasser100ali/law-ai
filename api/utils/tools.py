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


def retrieve_intakes_from_db(category: Optional[MatterType] = None) -> List[Dict[str, Any]]:
    """
    Retrieve intake cases stored in the database.
    
    This is a regular callable function. Call it directly from tests or API endpoints.
    For agent use, import `stored_intake_retrieval_tool` instead (see bottom of file).

    Args:
        category: Optional matter type to filter by. If None, returns all intakes.

    Returns:
        String representation of list of intake dictionaries from database.
    """
    logger.info("🔧 TOOL: stored_intake_retrieval | category=%s", category or "ALL")
    
    DATABASE_URL = os.environ.get("DATABASE_URL")

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        if category is not None:
            normalized = category.lower()
            # Use "matterType" column (from Prisma schema) and quote it for case-sensitivity
            query = 'SELECT * FROM intakes WHERE LOWER("matterType") = %s ORDER BY "submittedAt" DESC;'
            cursor.execute(query, (normalized,))
        else:
            # Quote column name for case-sensitivity in Postgres
            query = 'SELECT * FROM intakes ORDER BY "submittedAt" DESC;'
            cursor.execute(query)

        intakes = cursor.fetchall()

        cursor.close()
        conn.close()
        
        logger.info("✅ Retrieved %d intake(s) from database", len(intakes))
        return str(intakes)

    except Exception as e:
        logger.error("❌ Database error in retrieve_intakes_from_db: %s", str(e), exc_info=True)
        return []

# Create tool wrapper for agents - this is what gets passed to Agent(..., tools=[...])
stored_intake_retrieval_tool = function_tool(retrieve_intakes_from_db)

