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
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Why Hire Me Panel Component
function WhyHireMePanel() {
  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Why Hire Yasser?</h2>
        
        <div className="space-y-4 text-muted-foreground">
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">🚀 Product Velocity</h3>
            <p>Ships end-to-end features (UI to inference) with clean developer experience. Demonstrated ability to build agentic products from scratch.</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">🎯 Agent Reliability Focus</h3>
            <p>Implements consensus/self-check patterns, citation-first outputs, and JSON-safe responses. Obsessed with reliability through structured evidence and measurable quality metrics.</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">💼 Industry Experience</h3>
            <p>Kaiser Data Science (Finance) — designed agent workflows generating insights from live data. Strong Python/SQL, prompt-engineering, and continuous LLM monitoring concepts.</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">🛠️ Full-Stack Expertise</h3>
            <p><strong>Stack:</strong> Next.js/React/TypeScript, FastAPI/Python, SQL, cloud deploy (GCP/Vercel), vector/RAG, model fine-tuning with Axolotl.</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">🏆 Notable Projects</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Data Analyst AI Agent:</strong> Multi-agent system with orchestrator, parallel coding agents, and reporter. Impressed multiple CFOs as most innovative on team.</li>
              <li><strong>Atlas:</strong> Next.js + FastAPI + GCP/Vercel multi-agent system (SQL-ReAct, PDF RAG, streaming UI).</li>
              <li><strong>Career Titan:</strong> AI career/resume platform with structured YAML/JSON resumes, realtime preview.</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">🎓 Background</h3>
            <p>Applied Mathematics (UCSB). Comfortable with ML (CNNs/transfer learning), orchestration, backend APIs, and evaluation pipelines.</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">✨ Unique Value</h3>
            <p>Clear communicator who turns vague needs into <strong>useful, trustworthy tools</strong>—exactly what Eve needs to win adoption. Takes ambiguous problem statements to working demos with measurable value.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Eve Ideas Panel Component
function EveIdeasPanel() {
  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Ideas to Make Eve Dominate</h2>
        
        <div className="space-y-4 text-muted-foreground">
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">🎯 Expand to Potential Plaintiffs</h3>
            <p>Build consumer-facing pre-intake to capture leads before they reach competitors:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Pre-screen claims; score strength; flag SOL/notice rules with citations</li>
              <li>Auto-draft polished intake letters from user facts</li>
              <li>Recommend suitable firms (neutral criteria + disclosure)</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">💰 Premium Placement Model</h3>
            <p>Create transparent lead-gen channel: Offer firms <strong>&ldquo;Premium Placement&rdquo;</strong> (clearly labeled &ldquo;Sponsored&rdquo;) that prioritizes their listing within jurisdiction/practice-area fit—balancing revenue with user trust.</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">🔒 Reduce Hallucinations</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Citations by default:</strong> Every legal proposition must have a source</li>
              <li><strong>Parallel consensus:</strong> Run multiple sub-agents; compare outputs. Converge → confidence; diverge → expose to user</li>
              <li><strong>Adjudicator pass:</strong> Final reviewer checks claims vs. citations</li>
              <li><strong>RAG + retrieval guards:</strong> Restrict answers to retrieved, jurisdiction-matched passages</li>
              <li><strong>Evaluation & logs:</strong> Track disagreement rate, missing-citation rate</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">⚙️ Ops Integrations</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>CRM push (create matter/leads automatically)</li>
              <li>SOL calculators with jurisdiction rules</li>
              <li>Conflict check prompts</li>
              <li>Templated demand letters with placeholders</li>
              <li>Pattern-jury-instructions linking</li>
              <li>Deposition/ROGs boilerplates</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">📊 Multi-Intake Ranking</h3>
            <p>When given multiple intake emails/PDFs:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Extract structured fields automatically</li>
              <li>Score each case (Strength 0-100, SOL risk, Top 3 Risks)</li>
              <li>Produce ranking table with Evidence Highlights</li>
              <li>Generate draft intake letter for top 1-2 cases</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">🎨 UX for Trust</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Surface uncertainty explicitly; avoid overclaiming</li>
              <li>Show citation sources inline</li>
              <li>Provide checklists and structured outputs</li>
              <li>Human-in-the-loop for low-confidence answers</li>
              <li>&ldquo;Explain-your-answer&rdquo; mode for transparency</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">🚀 Quick Wins → Roadmap</h3>
            <p className="font-semibold">Phase 1 (Quick Wins):</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
              <li>Citation enforcement + parallel consensus</li>
              <li>Plaintiff pre-intake form</li>
            </ul>
            <p className="font-semibold">Phase 2 (Growth):</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
              <li>Premium placement for firms</li>
              <li>Multi-intake ranking system</li>
            </ul>
            <p className="font-semibold">Phase 3 (Scale):</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>CRM integrations</li>
              <li>Advanced template library</li>
              <li>Evaluation metrics dashboard</li>
            </ul>
          </div>
        </div>
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

  const [splitScreenMode, setSplitScreenMode] = React.useState<"none" | "whyhire" | "eveideas">("none");
  const [panelVisible, setPanelVisible] = React.useState(false);
  const rightPanelRef = React.useRef<HTMLDivElement | null>(null);
  const hasMessages = messages.length > 0;

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const handleWhyHireMe = () => {
    setSplitScreenMode("whyhire");
    requestAnimationFrame(() => setPanelVisible(true));
  };

  const handleEveIdeas = () => {
    setSplitScreenMode("eveideas");
    requestAnimationFrame(() => setPanelVisible(true));
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
              <div className="px-4 py-3">
                <div className="flex items-center justify-between gap-4 max-w-3xl mx-auto">
                  <motion.div 
                    className="flex flex-col gap-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <p className="text-white font-semibold text-lg leading-tight">
                      Project Eve 
                    </p>
                    <p className="text-gray-400 font-normal text-sm">
                      by Yasser Ali
                    </p>
                  </motion.div>
                  <motion.div 
                    className="flex flex-row gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="px-3 py-1.5 text-sm font-semibold"
                      onClick={handleWhyHireMe}
                    >
                      Why hire me?
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="px-3 py-1.5 text-sm font-semibold"
                      onClick={handleEveIdeas}
                    >
                      Ideas to make Eve dominate
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
                onSuggestedPrompt={(prompt) => {
                  setInput(prompt);
                  // Automatically submit after a short delay to allow the input to update
                  setTimeout(() => {
                    handleSubmit();
                  }, 100);
                }}
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
          </div>
        </div>
      )}
    </div>
  );
}
