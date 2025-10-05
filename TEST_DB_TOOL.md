# Testing stored_intake_retrieval Tool

This guide shows you how to test the `stored_intake_retrieval` function in `api/utils/tools.py` using different methods.

## Prerequisites

1. Make sure your FastAPI server is running:
   ```bash
   uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
   ```

2. Ensure `DATABASE_URL` is set in your `.env` file:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

3. Verify you have data in your `intakes` table:
   ```bash
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM intakes;"
   ```

---

## Method 1: Python Test Script (Recommended for Quick Testing)

Run the standalone test script:

```bash
python test_db_tool.py
```

**What it does:**
- Tests retrieving all intakes (no filter)
- Tests retrieving employment intakes only
- Tests retrieving personal injury intakes only
- Shows detailed output including result length and preview

**Expected Output:**
```
================================================================================
Testing stored_intake_retrieval tool
================================================================================
✅ DATABASE_URL found: postgresql://user:pass...
INFO:api.utils.tools:🔧 TOOL: stored_intake_retrieval | category=ALL
INFO:api.utils.tools:✅ Retrieved 5 intake(s) from database

Test 1: Retrieve ALL intakes (no category filter)
--------------------------------------------------------------------------------
Result type: <class 'str'>
Result length: 2547 characters
Result preview: [{'id': '123', 'name': 'John Doe', 'category': 'employment', ...}]
...
```

---

## Method 2: Using curl (Test via FastAPI Endpoint)

### Test 1: Retrieve ALL intakes
```bash
curl -X GET "http://localhost:8000/api/test/intakes" | jq
```

**Expected Response:**
```json
{
  "success": true,
  "category": "all",
  "result": "[{'id': '...', 'name': '...', 'category': 'employment', ...}]",
  "result_type": "<class 'str'>",
  "result_length": 2547
}
```

### Test 2: Retrieve EMPLOYMENT intakes only
```bash
curl -X GET "http://localhost:8000/api/test/intakes?category=employment" | jq
```

**Expected Response:**
```json
{
  "success": true,
  "category": "employment",
  "result": "[{'id': '...', 'category': 'employment', ...}]",
  "result_type": "<class 'str'>",
  "result_length": 1234
}
```

### Test 3: Retrieve PERSONAL INJURY intakes
```bash
curl -X GET "http://localhost:8000/api/test/intakes?category=personal%20injury" | jq
```

Note: URL encode spaces as `%20` or use quotes:
```bash
curl -X GET 'http://localhost:8000/api/test/intakes?category=personal injury' | jq
```

### Test 4: Other categories
```bash
# Family Law
curl -X GET 'http://localhost:8000/api/test/intakes?category=family law' | jq

# Immigration Law
curl -X GET 'http://localhost:8000/api/test/intakes?category=immigration law' | jq

# Mass Tort/Class Action
curl -X GET 'http://localhost:8000/api/test/intakes?category=mass tort/class action' | jq
```

### Test 5: Invalid category (should return empty or all)
```bash
curl -X GET "http://localhost:8000/api/test/intakes?category=invalid" | jq
```

---

## Method 3: Using Browser

Simply visit these URLs in your browser:

1. **All intakes:**  
   http://localhost:8000/api/test/intakes

2. **Employment only:**  
   http://localhost:8000/api/test/intakes?category=employment

3. **Personal injury only:**  
   http://localhost:8000/api/test/intakes?category=personal%20injury

---

## Method 4: Using Postman/Insomnia

1. Create a new GET request
2. URL: `http://localhost:8000/api/test/intakes`
3. Add query parameter (optional):
   - Key: `category`
   - Value: `employment` (or any valid category)
4. Send the request

---

## Method 5: Test Within Agent Flow (Full Integration)

Send a message to your chat interface asking the lawyer agent to retrieve intakes:

**Example prompts:**
- "Show me all the intakes in the database"
- "Analyze the employment law cases we have stored"
- "What personal injury intakes do we have?"

**Watch the logs for:**
```
⚖️  LAWYER AGENT CALLED
Query: Show me all the intakes in the database
🔧 TOOL: stored_intake_retrieval | category=ALL
✅ Retrieved 5 intake(s) from database
✅ Lawyer Agent completed successfully
```

---

## Troubleshooting

### Error: "DATABASE_URL environment variable not set"
- Check your `.env` file in the project root
- Make sure it's loaded: `python -c "from dotenv import load_dotenv; load_dotenv(); import os; print(os.getenv('DATABASE_URL'))"`

### Error: "psycopg2.OperationalError: could not connect to server"
- Verify your database is running
- Check connection string format: `postgresql://user:password@host:port/database`
- Test with psql: `psql $DATABASE_URL -c "SELECT 1;"`

### Error: "relation 'intakes' does not exist"
- Your database schema might not be set up
- Run migrations: `npx prisma migrate dev` (if using Prisma)
- Or check your schema manually

### Returns empty array `[]`
- No data in the `intakes` table - add some test data
- Check if category name matches exactly (case-insensitive but spelling matters)
- Verify with: `psql $DATABASE_URL -c "SELECT category, COUNT(*) FROM intakes GROUP BY category;"`

### Error: "Runner() takes no arguments"
This is the error you're seeing. The `openai-agents` library API changed. The agents are instantiating the Runner incorrectly. This is already fixed in your recent changes where you moved from:
```python
agent = Runner(_LAWYER_AGENT).run(query)
```
to:
```python
result = Runner.run(starting_agent=agent, input=query)
```

---

## Quick Verification Checklist

- [ ] FastAPI server is running (check terminal for "Uvicorn running on...")
- [ ] `.env` file exists with `DATABASE_URL`
- [ ] Database connection works (`psql $DATABASE_URL -c "SELECT 1;"`)
- [ ] `intakes` table exists and has data
- [ ] Run Python test script: `python test_db_tool.py`
- [ ] Test with curl: `curl http://localhost:8000/api/test/intakes | jq`
- [ ] Check logs for emoji indicators: `🔧 TOOL: stored_intake_retrieval`

---

## Expected Data Structure

The function returns a string representation of a list of dictionaries. Each intake should look like:

```python
{
    'id': 'clx123abc...',
    'name': 'John Doe',
    'email': 'john@example.com',
    'phone': '555-1234',
    'category': 'employment',
    'description': 'I was wrongfully terminated...',
    'submittedAt': datetime.datetime(2025, 10, 5, ...)
}
```

---

## Next Steps After Successful Test

1. ✅ Verify tool works standalone (Python script or curl)
2. ✅ Test within orchestrator (check logs for tool calls)
3. ✅ Verify agent uses tool when prompted
4. ✅ Check output formatting is useful for the agent
5. ✅ Add error handling for edge cases (empty DB, connection failures)

---

**Last Updated:** October 5, 2025

