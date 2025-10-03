import React from "react";
import { motion } from "framer-motion";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-muted/50 rounded-lg p-6 space-y-3"
    >
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      {children}
    </motion.div>
  );
}

export function WhyHireMePanel() {
  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <h2 className="text-3xl font-bold text-foreground">Why Hire Yasser at Eve?</h2>

        {/* 1) Role fit vs. JD (at‑a‑glance) */}
        <Card title="Role Fit vs. Job Description (At‑a‑Glance)">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Develop AI‑Powered Solutions:</strong> Built an , CFO‑endorsed multi‑agent <em>Data Analyst</em> used by real stakeholders; NLQ → Python & SQL Agents on live financial data; added web‑research + long‑doc analysis.</li>
            <li><strong>Optimize & Integrate Models:</strong> Hands‑on with OpenAI Agents SDK, retrieval‑augmented generation, prompt/program synthesis, and latency/throughput tuning via parallel sub‑agents.</li>
            <li><strong>Advance AI Reasoning:</strong> Planner‑based orchestration with self‑check and consensus patterns (parallel agents + adjudicator) to reduce errors and improve reliability.</li>
            <li><strong>Collaboration:</strong> Partnered with product and finance SMEs/CFOs to turn domain needs into shipped features; comfortable pairing with attorneys to capture legal workflows.</li>
            <li><strong>Evaluation Frameworks:</strong> Built harnesses to track disagreement %, missing‑citation %, turnaround time; regression suites for prompts/tools; own data curation → eval → deploy loop.</li>
          </ul>
        </Card>

        {/* 2) Quick impact highlights */}
        <Card title="Quick Impact Highlights">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>ReAct‑driven SQL agent + parallelism → ~<strong>80% faster</strong> analysis (<strong>~5 min → &lt;1 min</strong> per report).</li>
            <li><strong>Sole/lead engineer</strong> for ~4 months from concept → pilot → demo; high uptime with real users.</li>
            <li><strong>1st place</strong> in internal ML competition (chest X‑ray anomaly classifier via transfer learning).</li>
            <li>Shipped end‑to‑end: orchestration, evaluation, backend (FastAPI/Python), frontend (Next.js/TS), and cloud (Vercel/GCP).</li>
          </ul>
        </Card>

        {/* 3) Production AI systems */}
        <Card title="Production AI Systems (Reliable & Safe)">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Citations‑first</strong> outputs with retrieval guards; degrade safely when sources are insufficient.</li>
            <li>Human‑in‑the‑loop gates on low confidence; observability (metrics, logs) for tight feedback loops.</li>
            <li>Latency‑aware designs (parallel tools, streaming) and fault‑tolerant retries.</li>
            <li>Privacy‑minded patterns; zero‑retention calls where needed.</li>
          </ul>
        </Card>

        {/* 4) Agentic architecture */}
        <Card title="Agentic Architecture (Reasoning at Scale)">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Planner decomposes problems; tools: SQL, retrieval, drafting, web research.</li>
            <li>Consensus + adjudicator pass to reconcile divergent answers; highlight uncertainty.</li>
            <li>Routing by jurisdiction/context (legal) or data system (finance); guardrails for out‑of‑scope queries.</li>
            <li>Metrics: disagreement %, missing‑citation %, turnaround time, error budgets.</li>
          </ul>
        </Card>

        {/* 5) Projects & proof */}
        <Card title="Projects & Proof">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Kaiser Data Analyst Agent:</strong> Orchestrator + parallel code agents + reporter; impressed CFOs and tied to team funding. Built a curated <strong>evaluation dataset</strong> of representative data problems to systematically measure error rates, then used it to A/B test different models (GPT, Claude, Gemini, etc) and iterate on prompts—reducing failures and improving code quality with each sprint.</li>
            <li><strong>Web Research Agent:</strong> Long‑document analysis with current context to enrich decisions.</li>
          </ul>
        </Card>

        {/* 6) Technical foundation & why Eve */}
        <Card title="Technical Foundation & Why Eve">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Applied Mathematics (UCSB):</strong> strong stats/optimization; PyTorch, TensorFlow, scikit‑learn, NumPy/SciPy.</li>
            <li><strong>Stack:</strong> FastAPI/Python, Next.js/React/TypeScript, OpenAI APIs/Agents, RAG, CI/CD on Vercel/GCP.</li>
            <li><strong>Mission fit:</strong> Eve&apos;s vision of AI‑native plaintiff firms aligns with my plaintiff‑side intake + case‑scoring wedge; ready to partner with attorneys and ship court‑safe, end‑to‑end features.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
