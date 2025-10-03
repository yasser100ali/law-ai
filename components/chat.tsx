"use client";

import React from "react";
import { PreviewMessage, ThinkingMessage } from "@/components/message";
import { MultimodalInput } from "@/components/multimodal-input";
import { Overview } from "@/components/overview";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import type { Message } from "ai";
// @ts-ignore - ai/react types issue with moduleResolution
import { useChat } from "ai/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";


function WhyHireMePanel() {
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
            <li><strong>Mission fit:</strong> Eve’s vision of AI‑native plaintiff firms aligns with my plaintiff‑side intake + case‑scoring wedge; ready to partner with attorneys and ship court‑safe, end‑to‑end features.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

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

function EveIdeasPanel() {
  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <h2 className="text-3xl font-bold text-foreground">How Eve can dominate Legal AI</h2>

        {/* 1) Market size & context */}
        <IdeaCard title="Market Size (Why Now)">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Legal tech spend:</strong> ≈ <strong>$27–32B</strong>, growing high single digits; overall legal services are ≈ <strong>$1T+</strong>.</li>
            <li><strong>Where adoption starts:</strong> Research/drafting, intake & triage, and eDiscovery/CLM are the fastest-moving GenAI entry points.</li>
            <li><strong>Eve’s focus:</strong> Win the first touch with claimants, then expand into firm workflows.</li>
          </ul>
        </IdeaCard>

        {/* 2) Plaintiff wedge */}
        <IdeaCard title="Plaintiff-Side Intake & Case Score (Your Wedge)">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Turn a user’s story into a structured <em>case portfolio</em>: <strong>Strength (0–100)</strong>, <strong>deadline window (SOL)</strong>, <strong>top gaps</strong>, and <strong>venue fit</strong>.</li>
            <li>Ask missing questions so law-firm time is <strong>well-spent</strong>; output a clean, lawyer-ready report.</li>
            <li>Route to best-fit firms by jurisdiction/practice. If a firm takes the case, <strong>Eve earns a commission</strong>; optional, clearly labeled <em>Premium Placement</em> for visibility.</li>
            <li>Result: aligned incentives and Eve becomes the default first stop for claimants.</li>
          </ul>
        </IdeaCard>

        {/* 3) Trust by design */}
        <IdeaCard title="Trust by Design (Court-Safe)">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Citations by default:</strong> Every legal point links to a source; answers stay within the correct jurisdiction.</li>
            <li><strong>Safety net:</strong> Low-confidence answers get flagged for human review; auto AI-use disclosures where required.</li>
            <li><strong>Simple quality metrics:</strong> citation coverage, error catch-rate, turnaround time.</li>
          </ul>
        </IdeaCard>

        {/* 4) Intake → Drafts leverage */}
        <IdeaCard title="From Intake to Drafts—Fast">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Auto-extract from emails/PDFs; rank multiple intakes; show <em>why</em> a case scored high/low.</li>
            <li>One-click drafts: demand letter, chronology, discovery requests; fewer back-and-forths.</li>
            <li><strong>KPIs:</strong> time-to-first-draft ↓, signed-case conversion ↑.</li>
          </ul>
        </IdeaCard>

        {/* 5) Marketplace & incentives */}
        <IdeaCard title="Clear Marketplace & Aligned Incentives">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Firms ranked by fit and performance; <em>Sponsored</em> spots are obvious and limited.</li>
            <li><strong>Revenue:</strong> commission on signed matters + premium placement; transparent and predictable.</li>
            <li>As users start with Eve, partnering becomes a competitive necessity for firms.</li>
          </ul>
        </IdeaCard>
      </div>
    </div>
  );
}

// Rename this helper for EveIdeasPanel so it doesn't collide with the other one
function IdeaCard({ title, children }: { title: string; children: React.ReactNode }) {
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

type IntakeRecord = {
  id: string;
  submittedAt: string;
  shareWithMarketplace: boolean;
  form: {
    fullName: string;
    email: string;
    phone: string;
    jurisdiction: string;
    matterType: string;
    summary: string;
    goals: string;
    urgency: string;
  };
};

function IntakePanel({
  onIntakeSubmitted,
}: {
  onIntakeSubmitted: (record: IntakeRecord) => void;
}) {
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    jurisdiction: "",
    matterType: "",
    summary: "",
    goals: "",
    urgency: "",
  });
  const [shareWithMarketplace, setShareWithMarketplace] = React.useState(true);
  const [consent, setConsent] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  const handleChange = (
    field: keyof typeof formData,
  ): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> => {
    return (event) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulate a network request for now. This is where an API call would go.
    setTimeout(() => {
      setIsSubmitting(false);
      setHasSubmitted(true);
      const record: IntakeRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        submittedAt: new Date().toISOString(),
        shareWithMarketplace,
        form: { ...formData },
      };
      onIntakeSubmitted(record);
      toast.success(
        shareWithMarketplace
          ? "Your intake is ready to share with matched firms."
          : "Your intake has been saved."
      );
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        jurisdiction: "",
        matterType: "",
        summary: "",
        goals: "",
        urgency: "",
      });
      setConsent(false);
      setShareWithMarketplace(true);
    }, 650);
  };

  const isValid =
    formData.fullName.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.summary.trim().length > 0 &&
    consent;

  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-foreground">File an Intake</h2>
          <p className="text-muted-foreground leading-relaxed">
            Capture the essentials of your legal matter once and let Eve handle the heavy lifting.
            We&apos;ll structure your intake so that future marketplace partners can review cases ranked by
            their fit—saving you the time of repeating your story to multiple firms.
          </p>
          <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Coming soon</p>
            <p>
              After submission, you&apos;ll be able to post this intake to Eve&apos;s firm board where participating
              firms are ranked by how well they match your needs. For now, fill out the form below to get
              started and we&apos;ll notify you when sharing is available.
            </p>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">Full name *</span>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange("fullName")}
                placeholder="Jane Doe"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">Email *</span>
              <input
                type="email"
                required
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="jane@example.com"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">Phone</span>
              <input
                type="tel"
                value={formData.phone}
                onChange={handleChange("phone")}
                placeholder="(555) 123-4567"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">Jurisdiction</span>
              <input
                type="text"
                value={formData.jurisdiction}
                onChange={handleChange("jurisdiction")}
                placeholder="e.g. California, Los Angeles County"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              />
            </label>
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-sm font-medium text-foreground">Matter type</span>
              <select
                value={formData.matterType}
                onChange={(event) => {
                  setFormData((prev) => ({
                    ...prev,
                    matterType: event.target.value,
                  }));
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <option value="">Select matter type</option>
                <option value="employment">Employment</option>
                <option value="personal injury">Personal Injury</option>
                <option value="mass tort/class action">Mass Tort/Class Action</option>
                <option value="family law">Family Law</option>
                <option value="immigration law">Immigration Law</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Describe what happened *</span>
            <Textarea
              required
              value={formData.summary}
              onChange={handleChange("summary")}
              placeholder="Give us the key facts, timeline, and parties involved."
              className="min-h-[140px]"
            />
          </label>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">What outcome are you hoping for?</span>
              <Textarea
                value={formData.goals}
                onChange={handleChange("goals")}
                placeholder="Settlement goals, desired remedies, or open questions."
                className="min-h-[100px]"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">Deadlines or urgency</span>
              <Textarea
                value={formData.urgency}
                onChange={handleChange("urgency")}
                placeholder="Upcoming court dates, statutes of limitation, or other timing notes."
                className="min-h-[100px]"
              />
            </label>
          </div>

          <div className="space-y-3 rounded-lg border border-border/60 bg-background/40 p-4">
            <p className="text-sm font-medium text-foreground">Marketplace preview</p>
            <p className="text-sm text-muted-foreground">
              Opt in to share this intake with Eve&apos;s partner firms when the board launches. We&apos;ll rank interested firms
              by how closely they match your case profile so you can review the best fits first.
            </p>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border border-input"
                checked={shareWithMarketplace}
                onChange={(event) => setShareWithMarketplace(event.target.checked)}
              />
              Share my intake with matched firms when available
            </label>
          </div>

          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border border-input"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>
              I understand that Eve is not my attorney and that submitting this form does not create a lawyer-client relationship.
              My information will be handled in accordance with Eve&apos;s privacy practices.
            </span>
          </label>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Submitting..." : hasSubmitted ? "Update intake" : "Submit intake"}
            </Button>
            {hasSubmitted && (
              <p className="text-sm text-muted-foreground">
                Intake saved. We&apos;ll email you when sharing to firms is live.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function OpenIntakesPanel({
  records,
}: {
  records: IntakeRecord[];
}) {
  const [matterFilter, setMatterFilter] = React.useState<string>("All");

  const matterTypes = React.useMemo(() => {
    const unique = new Set<string>();
    records.forEach((record) => {
      const trimmed = record.form.matterType.trim();
      if (trimmed.length > 0) {
        unique.add(trimmed);
      }
    });
    return ["All", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [records]);

  const filteredRecords = React.useMemo(() => {
    if (matterFilter === "All") {
      return records;
    }

    return records.filter(
      (record) => record.form.matterType.trim() === matterFilter,
    );
  }, [records, matterFilter]);

  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-foreground">
            Open Intakes (for lawyers only)
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Review the latest claimant submissions and filter by matter type to
            focus on the cases that best match your practice areas.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Matter type</p>
            <p className="text-xs text-muted-foreground">
              Filter intakes by the matter type provided by the claimant.
            </p>
          </div>
          <select
            value={matterFilter}
            onChange={(event) => setMatterFilter(event.target.value)}
            className="w-full sm:w-56 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            {matterTypes.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? "All matter types" : type}
              </option>
            ))}
          </select>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-8 text-center">
            <p className="text-sm font-medium text-foreground">
              {records.length === 0
                ? "No intakes have been filed yet."
                : "No intakes match this matter type filter."}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Once claimants submit intake forms, they will appear here for
              review.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => {
              const submittedDate = new Date(record.submittedAt);
              const formattedDate = submittedDate.toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              });

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border border-border/60 bg-background/70 p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {record.form.fullName || "Anonymous claimant"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formattedDate}
                        {record.form.jurisdiction && ` · ${record.form.jurisdiction}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {record.form.matterType && (
                        <span className="rounded-full border border-border/60 px-3 py-1 text-foreground">
                          {record.form.matterType}
                        </span>
                      )}
                      <span className="rounded-full border border-border/60 px-3 py-1">
                        {record.shareWithMarketplace
                          ? "Opted into marketplace"
                          : "Private intake"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-foreground/90">
                    <div>
                      <p className="font-medium text-foreground">Summary</p>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {record.form.summary || "No summary provided."}
                      </p>
                    </div>

                    {record.form.goals && (
                      <div>
                        <p className="font-medium text-foreground">Desired outcome</p>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {record.form.goals}
                        </p>
                      </div>
                    )}

                    {record.form.urgency && (
                      <div>
                        <p className="font-medium text-foreground">Urgency notes</p>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {record.form.urgency}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col">
                        {record.form.email && (
                          <span>
                            <span className="font-medium text-foreground/80">Email:</span> {record.form.email}
                          </span>
                        )}
                        {record.form.phone && (
                          <span>
                            <span className="font-medium text-foreground/80">Phone:</span> {record.form.phone}
                          </span>
                        )}
                      </div>
                      <span>
                        Intake ID: <code className="text-foreground/80">{record.id}</code>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function Chat() {
  const chatId = "001";

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
  } = useChat({
    maxSteps: 4,
    onError: (error: Error) => {
      if (error.message.includes("Too many requests")) {
        toast.error(
          "You are sending too many messages. Please try again later.",
        );
      }
    },
  });

  const [splitScreenMode, setSplitScreenMode] = React.useState<
    "none" | "whyhire" | "eveideas" | "intake" | "openIntakes"
  >("none");
  const [panelVisible, setPanelVisible] = React.useState(false);
  const rightPanelRef = React.useRef<HTMLDivElement | null>(null);
  const hasMessages = messages.length > 0;
  const [intakeRecords, setIntakeRecords] = React.useState<IntakeRecord[]>([]);

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const openPanel = React.useCallback(
    (
      mode: "whyhire" | "eveideas" | "intake" | "openIntakes",
      { ensureVisible = true }: { ensureVisible?: boolean } = {},
    ) => {
      setSplitScreenMode(mode);
      if (ensureVisible) {
        requestAnimationFrame(() => setPanelVisible(true));
      }
    },
    [],
  );

  const handleWhyHireMe = () => {
    openPanel("whyhire");
  };

  const handleEveIdeas = () => {
    openPanel("eveideas");
  };

  const handleIntake = () => {
    openPanel("intake");
  };

  const handleOpenIntakes = () => {
    openPanel("openIntakes");
  };

  const handleIntakeSubmitted = (record: IntakeRecord) => {
    setIntakeRecords((prev) => [record, ...prev]);
    openPanel("openIntakes");
  };

  const handleBackToChat = () => {
    setPanelVisible(false);
    const node = rightPanelRef.current;
    if (node) {
      const onDone = () => {
        setSplitScreenMode("none");
        node.removeEventListener("transitionend", onDone);
      };
      node.addEventListener("transitionend", onDone);
    } else {
      setTimeout(() => setSplitScreenMode("none"), 320);
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Chat area */}
      <div
        className={cn("flex flex-col h-full transition-[width] duration-300 ease-out overflow-hidden")}
        style={{
          width: panelVisible ? "50%" : "100%",
        }}
      >
        <div className="flex flex-col h-full bg-background overflow-hidden">
          {/* Sticky header that appears after first message */}
          {hasMessages && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="flex-shrink-0 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
            >
              <div className="px-4 py-4">
                <div className="flex flex-col gap-3 max-w-4xl mx-auto">
                  <motion.div 
                    className="flex flex-col gap-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <p className="text-white font-medium text-base sm:text-lg leading-tight tracking-tight">
                      Atlas AI
                    </p>
                    <p className="text-muted-foreground font-normal text-xs sm:text-sm tracking-tight">
                      by Yasser Ali
                    </p>
                  </motion.div>
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-auto px-3 py-2.5 text-xs sm:text-sm font-semibold whitespace-normal leading-snug"
                      onClick={handleOpenIntakes}
                    >
                      Open intakes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-auto px-3 py-2.5 text-xs sm:text-sm font-semibold whitespace-normal leading-snug"
                      onClick={handleIntake}
                    >
                      File an intake
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-auto px-3 py-2.5 text-xs sm:text-sm font-semibold whitespace-normal leading-snug"
                      onClick={handleWhyHireMe}
                    >
                      Why hire me?
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-auto px-3 py-2.5 text-xs sm:text-sm font-semibold whitespace-normal leading-snug"
                      onClick={handleEveIdeas}
                    >
                      How Eve can dominate Legal AI
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          <div
            ref={messagesContainerRef}
            className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-auto pt-4 px-4"
          >
            {/* Show overview centered when no messages */}
            {!hasMessages && (
              <Overview
                onWhyHireMe={handleWhyHireMe}
                onEveIdeas={handleEveIdeas}
                onIntake={handleIntake}
                onOpenIntakes={handleOpenIntakes}
              />
            )}

            {messages.map((message: Message, index: number) => (
              <PreviewMessage
                key={message.id}
                chatId={chatId}
                message={message}
                isLoading={isLoading && messages.length - 1 === index}
              />
            ))}

            {isLoading &&
              messages.length > 0 &&
              messages[messages.length - 1].role === "user" && <ThinkingMessage />}

            <div
              ref={messagesEndRef}
              className="shrink-0 min-w-[24px] min-h-[24px]"
            />
          </div>

          <div className="flex-shrink-0 mx-auto px-4 bg-background pb-4 md:pb-6 w-full md:max-w-3xl">
            {/* Suggested Prompts - only show when no messages */}
            {!hasMessages && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 [@media(max-height:750px)]:hidden">
                {[
                  { title: "Tell me about Yasser.", action: "Tell me about Yasser" },
                  { title: "How can I use this chatbot?", action: "How can I use this chatbot?" },
                  { title: "How do you determine how strong a case is?", action: "How do you determine how strong a case is?" },
                  { title: "How can I reduce hallucinations?", action: "How can I reduce hallucinations?" },
                ].map((prompt, index) => (
                  <motion.div
                    key={`suggested-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setInput(prompt.action);
                        setTimeout(() => {
                          handleSubmit();
                        }, 100);
                      }}
                      className="w-full h-auto justify-start items-start text-left border border-border/40 rounded-xl px-4 py-3 hover:bg-accent/50 hover:border-border transition-all whitespace-normal"
                    >
                      <span className="text-sm text-foreground/80 font-normal break-words">
                        {prompt.title}
                      </span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
            
            <MultimodalInput
              chatId={chatId}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          </div>
        </div>
      </div>

      {/* Right panel */}
      {(splitScreenMode !== "none" || panelVisible) && (
        <div
          ref={rightPanelRef}
          className="flex flex-col h-full border-l bg-background transition-[width] duration-300 ease-out overflow-hidden"
          style={{ width: panelVisible ? "50%" : "0%" }}
        >
          <div className="flex-shrink-0 p-2">
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-7 w-7 rounded-full bg-red-500 hover:bg-red-600 border-red-500 text-white shadow-sm transition-colors"
              onClick={handleBackToChat}
              title="Close split screen"
            >
              <span className="text-xs">×</span>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {splitScreenMode === "whyhire" && <WhyHireMePanel />}
            {splitScreenMode === "eveideas" && <EveIdeasPanel />}
            {splitScreenMode === "intake" && (
              <IntakePanel onIntakeSubmitted={handleIntakeSubmitted} />
            )}
            {splitScreenMode === "openIntakes" && (
              <OpenIntakesPanel records={intakeRecords} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}