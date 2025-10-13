Atlas
=====

Atlas is a legal AI platform designed to speed up the process of filing an intake and finding the right lawyer. It acts as a bridge between plaintiffs and law firms by providing intelligent intake analysis, legal triage, and two-sided argument preparation.

## Getting Started

When you launch Atlas, you'll be prompted to select your role:

- **Plaintiff/Claimant** - File an intake or get legal assistance
- **Lawyer/Attorney** - Review intakes and research cases

### Plaintiff Interface
Accessible at `/plaintiff`, this interface provides:
- Conversational AI assistant for legal guidance
- Intake form submission and case analysis
- Access to view submitted intakes

### Lawyer Interface
Accessible at `/lawyer`, this interface provides:
- **Left Panel**: Ranked intake list with AI scoring
  - Filter by matter type
  - Sort by score or date
  - View detailed score breakdowns
  - Quick access to intake details
- **Right Panel**: AI research assistant
  - Ask questions about intakes
  - Analyze patterns across cases
  - Research legal issues
  - Access intake database via natural language

AI-Powered Legal Triage – MVP (V1)
----------------------------------

Core Idea
~~~~~~~~~
An AI system that accelerates the legal process for both plaintiffs and lawyers by standardizing intake, scoring case strength, surfacing best arguments, and matching clients with firms.

Features
~~~~~~~~

1. Conversational AI Interface
- Chatbot that calls plaintiff and lawyer agents depending on user’s role
- Natural-language Q&A instead of rigid forms

2. Smart Intake
- Upload or describe case essentials
- AI provides:
  - Feedback → prompts for missing details
  - Case Strength Score (0–100) with breakdown:
    - Liability (40 pts)
    - Damages (30 pts)
    - Evidence (20 pts)
    - Procedural (10 pts)
  - Citations of relevant statutes and precedents
  - Remedies / Next Steps → checklists, drafted filings

3. Case Filtering
- AI ensures intakes meet a minimum legal threshold before submission
- All cases stored in a central database

4. Firm/Lawyer Dashboard
- Browse available cases or auto-rank them based on firm specialty
- Each case includes best arguments for both sides

Positioning
~~~~~~~~~~~
- “AI-Powered Legal Triage” – reduces wasted time on weak/irrelevant cases
- Start narrow: One vertical (e.g., CA employment law) for proof-of-concept
- Pilot with one firm to collect usage data + testimonials
- Build a live metrics dashboard (cases analyzed, time saved, % strong cases flagged)

Features (Technical)
--------------------

Dual-Agent System
~~~~~~~~~~~~~~~~~
- Lawyer Agent: Provides professional legal analysis and advice
- Plaintiff Agent: Advocates from the client’s perspective
- Intelligent agent selection based on conversation context

Document Processing & RAG
~~~~~~~~~~~~~~~~~~~~~~~~~
- Vector Store Integration (OpenAI Vector Stores API)
- Document Upload: PDF, text, and more
- Semantic Search: Finds relevant case law / document sections
- Context Injection: Auto-includes relevant passages in responses

Real-Time Chat
~~~~~~~~~~~~~~
- Streaming Responses for smooth UX
- File Attachments supported
- Chat History per session

Technical Stack
~~~~~~~~~~~~~~~
- Frontend: Next.js 13+ (TypeScript, Tailwind CSS)
- Backend: FastAPI with Python agents framework
- AI: OpenAI GPT models + vector store integration
- Deployment: Vercel-ready, environment-based configs

Quick Start
-----------

Prerequisites
~~~~~~~~~~~~~
- Python 3.11+
- OpenAI API key

Installation
~~~~~~~~~~~~

1. Clone the repository

   ```bash
   git clone https://github.com/yasser100ali/law-ai.git
   cd law-ai
   ```

2. Install dependencies

   ```bash
   # Frontend
   npm install
   # or
   pnpm install

   # Backend
   pip install -r requirements.txt
   ```

3. Environment Setup

   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your OpenAI API key
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run locally

   ```bash
   # Backend
   uvicorn api.index:app --host 0.0.0.0 --port 8000 --reload

   # Frontend
   npm run dev
   ```

5. Open browser

   Navigate to http://localhost:3000

Architecture
------------

System Components
~~~~~~~~~~~~~~~~~

```
Next.js UI (Frontend)  →  FastAPI API (Backend)  →  OpenAI API (AI Models)
        |                          |                          |
        v                          v                          v
Chat Interface + File Upload   Dual Agents (Lawyer/Plaintiff)   Vector Stores + RAG
```

Data Flow
~~~~~~~~~
1. User input captured via chat UI + file uploads
2. Documents processed into vector store (RAG)
3. Orchestrator selects lawyer/plaintiff agent
4. Semantic search enhances context
5. Prompt sent to OpenAI with full context
6. Streaming response returned to user

Configuration
-------------

Environment Variables
~~~~~~~~~~~~~~~~~~~~~

Create `.env.local` with:

```bash
OPENAI_API_KEY=your_openai_api_key_here
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

Support
-------
For questions, issues, or feature requests, please open an issue on GitHub or contact the maintainer.

Built by Yasser Ali (https://github.com/yasser100ali)
