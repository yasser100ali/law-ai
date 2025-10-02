# Atlas

Atlas is a legal AI meant to speed up the process of filing an intake and finding the right lawyer for a plaintiff.

## Features

### Dual-Agent System
- **Lawyer Agent**: Provides professional legal analysis and advice
- **Plaintiff Agent**: Advocates from the client's perspective
- Intelligent agent selection based on conversation context

### Document Processing & RAG
- **Vector Store Integration**: Powered by OpenAI's vector stores API
- **Document Upload**: Support for PDF, text, and other document formats
- **Semantic Search**: Intelligent retrieval of relevant document sections
- **Context Injection**: Automatically includes relevant document context in responses

### Real-Time Chat
- **Streaming Responses**: Real-time token streaming for smooth UX
- **File Attachments**: Upload and reference documents in conversations
- **Chat History**: Persistent conversation management per chat session

### Technical Stack
- **Frontend**: Next.js 13+ with TypeScript, Tailwind CSS
- **Backend**: FastAPI with Python agents framework
- **AI**: OpenAI GPT models with vector store integration
- **Deployment**: Vercel-ready with environment-based configuration

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yasser100ali/law-ai.git
cd law-ai
```

2. **Install dependencies**
```bash
# Frontend dependencies
npm install
# or
pnpm install

# Python dependencies
pip install -r requirements.txt
```

3. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and add your OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Run locally**
```bash
# Terminal 1: Start FastAPI backend
uvicorn api.index:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Start Next.js frontend
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## Architecture

### System Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js UI    │───▶│   FastAPI API    │───▶│   OpenAI API    │
│   (Frontend)    │    │   (Backend)      │    │   (AI Models)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Chat Interface │    │   Dual Agents    │    │ Vector Stores   │
│  File Upload    │    │   Lawyer/Plaintiff│    │ Document RAG    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Data Flow
1. **User Input** → Chat interface captures message + attachments
2. **Document Processing** → Files uploaded to vector store via RAG system
3. **Agent Selection** → Orchestrator chooses appropriate agent (lawyer/plaintiff)
4. **Context Enhancement** → Semantic search retrieves relevant document sections
5. **AI Generation** → Enhanced prompt sent to OpenAI with full context
6. **Streaming Response** → Real-time response streamed back to user

## Configuration

### Environment Variables

Create `.env.local` with:

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here
BLOB_READ_WRITE_TOKEN => make blob and get token, this uses vercel
# Optional (defaults shown)
```





## Support

For questions, issues, or feature requests, please open an issue on GitHub or contact the maintainer.

---

Built by [Yasser Ali](https://github.com/yasser100ali)
