#!/usr/bin/env python3
"""
Quick test script for stored_intake_retrieval tool
Run: python test_db_tool.py
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import the tool
from api.utils.tools import stored_intake_retrieval

def test_retrieval():
    print("=" * 80)
    print("Testing stored_intake_retrieval tool")
    print("=" * 80)
    
    # Check if DATABASE_URL is set
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("❌ ERROR: DATABASE_URL environment variable not set!")
        print("Make sure it's in your .env file")
        sys.exit(1)
    
    print(f"✅ DATABASE_URL found: {db_url[:30]}...")
    print()
    
    # Test 1: Retrieve all intakes
    print("Test 1: Retrieve ALL intakes (no category filter)")
    print("-" * 80)
    try:
        result = stored_intake_retrieval(category=None)
        print(f"Result type: {type(result)}")
        print(f"Result length: {len(str(result)) if result else 0} characters")
        print(f"Result preview: {str(result)[:500]}...")
        print()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        print()
    
    # Test 2: Retrieve employment intakes
    print("Test 2: Retrieve EMPLOYMENT intakes only")
    print("-" * 80)
    try:
        result = stored_intake_retrieval(category="employment")
        print(f"Result type: {type(result)}")
        print(f"Result length: {len(str(result)) if result else 0} characters")
        print(f"Result preview: {str(result)[:500]}...")
        print()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        print()
    
    # Test 3: Retrieve personal injury intakes
    print("Test 3: Retrieve PERSONAL INJURY intakes only")
    print("-" * 80)
    try:
        result = stored_intake_retrieval(category="personal injury")
        print(f"Result type: {type(result)}")
        print(f"Result length: {len(str(result)) if result else 0} characters")
        print(f"Result preview: {str(result)[:500]}...")
        print()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        print()
    
    print("=" * 80)
    print("✅ Testing complete!")
    print("=" * 80)

if __name__ == "__main__":
    test_retrieval()

