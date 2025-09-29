# PDF Upload Feature

## Overview
This application now supports uploading PDF files (and other document types) and asking questions about their contents. The AI will read and analyze the uploaded documents and provide responses based on their content.

## Supported File Types
- **PDF files** (.pdf) - up to 50MB, content limited to 50,000 characters (~15k tokens)
- **Text files** (.txt) - up to 10MB, content limited to 30,000 characters
- **CSV files** (.csv) - up to 10MB, content limited to 30,000 characters
- **Excel files** (.xlsx, .xls) - up to 10MB (noted as attached, not fully processed)

**Note:** Large files will be automatically truncated to fit within the AI model's context window. You'll see a message indicating if content was truncated.

## How It Works

### Frontend (multimodal-input.tsx)
1. Users can upload files by:
   - Clicking the paperclip icon
   - Dragging and dropping files anywhere on the page
   - Dragging and dropping files onto the input area

2. Files are converted to base64 data URLs and sent with the message

3. Uploaded files are displayed as removable chips before sending

### Backend (api/index.py & api/chat_agents/orchestrator.py)
1. The API receives attachments in the request data
2. PDF files are processed using `pypdf` library:
   - Base64 content is decoded
   - Text is extracted from all pages
   - Extracted text is added to the user's message

3. The AI agent receives the file content along with the user's question
4. The agent can then analyze and answer questions about the document

## How to Test

1. **Start the backend** (from project root):
   ```bash
   cd api
   python -m uvicorn index:app --reload --port 8000
   ```
   Or if using the module structure:
   ```bash
   uvicorn api.index:app --reload --port 8000
   ```

2. **Start the frontend** (from project root):
   ```bash
   npm run dev
   ```

3. **Test PDF upload**:
   - Open the application in your browser (typically http://localhost:3000)
   - Click the paperclip icon or drag a PDF file onto the page
   - The file should appear as a chip above the input
   - Type a question like "What is this document about?" or "Summarize the key points"
   - Click send
   - The AI will analyze the PDF content and respond

## Example Use Cases

### Legal Document Analysis
- Upload a contract and ask: "What are the key terms of this agreement?"
- Upload an intake form and ask: "Analyze this case and assess its strength"
- Upload multiple documents and ask: "Compare these contracts and highlight differences"

### General Document Q&A
- Upload a research paper and ask: "What are the main findings?"
- Upload meeting notes and ask: "What action items were decided?"
- Upload a report and ask: "Summarize the recommendations"

## Technical Details

### File Processing Flow
```
Frontend (multimodal-input.tsx)
  └─> Converts File to base64 data URL
  └─> Sends via handleSubmit with data.attachments

Backend (api/index.py)
  └─> Extracts attachments from request.data
  └─> Appends to last user message with [File: name (type) - Content: base64]

Backend (api/chat_agents/orchestrator.py)
  └─> process_file_content() detects file markers
  └─> extract_pdf_text_from_base64() decodes and extracts text
  └─> Replaces marker with extracted text
  └─> Agent receives full text context
```

### Key Functions
- `extract_pdf_text_from_base64()` - Decodes base64 and extracts PDF text using pypdf
- `process_file_content()` - Processes file markers in messages and extracts content
- `_format_messages_for_agent()` - Formats messages with attachments for the agent

## Error Handling
- Unsupported file types show error toast
- Files exceeding size limits show error toast
- PDF extraction errors are logged and returned as error messages
- Base64 decoding errors are caught and logged
- **Large files are automatically truncated** to prevent context window overflow
  - PDFs: Limited to 50,000 characters (~12-15k tokens)
  - Text/CSV: Limited to 30,000 characters
  - Truncation messages inform users about content limits

## Development Notes
- All required dependencies (pypdf, requests, etc.) are already in requirements.txt
- CORS is configured for local development
- Next.js rewrites proxy API requests to avoid CORS issues
- The feature works both locally and when deployed to Vercel
