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
        <h2 className="text-3xl font-bold text-foreground">Why Hire Yasser at Eve?</h2>
        
        <div className="space-y-4 text-muted-foreground">
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Production AI Systems Expert</h3>
            <p><strong>Shipped real production ML systems</strong> with high uptime and real users. Built Kaiser&apos;s CFO-endorsed multi-agent Data Analyst system—<strong>critical for team funding</strong>. Designed ReAct-driven SQL agent with parallel sub-agents achieving ~80% faster analysis on live financial data.</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Advanced Agentic Architecture</h3>
            <p>Deep expertise in <strong>multi-agent orchestration and reasoning systems</strong>. Implemented planner-based architectures that decompose complex tasks into manageable steps. Built consensus patterns, self-check mechanisms, and routing logic for reliable AI decision-making across legal and financial domains.</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Data Scientist Background</h3>
            <p><strong>Data Scientist at Kaiser Permanente</strong> (Finance team). Experience with large-scale data analysis, building evidence-based reports, and translating domain expertise into technical requirements. Strong analytical skills for measuring AI performance and establishing evaluation frameworks.</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Model Integration & Optimization</h3>
            <p>Proficient with <strong>OpenAI Agents SDK, LangChain, RAG, and fine-tuning</strong>. Experience optimizing models on domain-specific data, integrating multiple models into cohesive systems, and building robust evaluation pipelines. Familiar with prompt engineering and model selection for production use cases.</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Full-Stack AI Product Development</h3>
            <p><strong>End-to-end ownership:</strong> FastAPI/Python backends, Next.js/React/TypeScript frontends, cloud deployment (AWS/GCP/Vercel). Ships complete features from spec → prototype → production. Built <strong>Career Titan</strong> (careertitan.co) solo—multi-agent career assistant with job search and resume generation.</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Notable AI Projects</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Kaiser Data Analyst Agent:</strong> Multi-agent system (orchestrator + parallel coding agents + reporter) processing natural language queries on financial data. <strong>Impressed CFOs</strong> as most innovative project on Data Science team.</li>
              <li><strong>Career Titan:</strong> AI career coach with multi-agent routing, job-matching recommender with % fit scores, third-party API integration.</li>
              <li><strong>Web Research Agent:</strong> Added to Kaiser system for pulling latest info and analyzing long documents with current context.</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Technical Foundation</h3>
            <p><strong>Applied Mathematics (UCSB).</strong> Skilled in PyTorch, TensorFlow, scikit-learn, NumPy/SciPy. Experience with ML concepts (CNNs/transfer learning), evaluation frameworks, and statistical analysis.</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Perfect Fit for Eve</h3>
            <p><strong>AI-native mindset:</strong> Understands how to translate domain expertise (legal/finance) into AI solutions. Fast iteration from ambiguous problems to measurable results. Proven ability to work with domain experts and ship user-facing AI features that drive real business value.</p>
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
            <h3 className="text-xl font-semibold text-foreground">Expand to Potential Plaintiffs</h3>
            <p>Build consumer-facing pre-intake to capture leads before they reach competitors:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Pre-screen claims; score strength; flag SOL/notice rules with citations</li>
              <li>Auto-draft polished intake letters from user facts</li>
              <li>Firms that pay a premium could also get advertisement here, thus incentivising them to use the Eve platform</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Premium Placement Model</h3>
            <p>Create transparent lead-gen channel: Offer firms <strong>&ldquo;Premium Placement&rdquo;</strong> (clearly labeled &ldquo;Sponsored&rdquo;) that prioritizes their listing within jurisdiction/practice-area fit—balancing revenue with user trust.</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Reduce Hallucinations</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Citations by default:</strong> Every legal proposition must have a source</li>
              <li><strong>Parallel consensus:</strong> Run multiple sub-agents; compare outputs. Converge → confidence; diverge → queue in humain in the loop.</li>
              <li><strong>Adjudicator pass:</strong> Final reviewer checks claims vs. citations</li>
              <li><strong>RAG + retrieval guards:</strong> Restrict answers to retrieved, jurisdiction-matched passages</li>
              <li><strong>Evaluation & logs:</strong> Track disagreement rate, missing-citation rate</li>
            </ul>
          </div>


          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Multi-Intake Ranking</h3>
            <p>When given multiple intake emails/PDFs:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Extract structured fields automatically</li>
              <li>Score each case (Strength 0-100, SOL risk, Top 3 Risks)</li>
              <li>Produce ranking table with Evidence Highlights</li>
              <li>Generate drafts for top cases, have automatic report ready for lawyers</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">UX for Trust</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Surface uncertainty explicitly; avoid overclaiming</li>
              <li>Show citation sources inline</li>
              <li>Provide checklists and structured outputs</li>
              <li>Human-in-the-loop for low-confidence answers</li>
              <li>&ldquo;Explain-your-answer&rdquo; mode for transparency</li>
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
                    <p className="text-white font-medium text-lg leading-tight tracking-tight">
                      Project Dedicated to the Eve AI team
                    </p>
                    <p className="text-muted-foreground font-normal text-sm tracking-tight">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
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
                      className="w-full h-auto justify-start items-start text-left border border-border/40 rounded-xl px-4 py-3 hover:bg-accent/50 hover:border-border transition-all"
                    >
                      <span className="text-sm text-foreground/80 font-normal">
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
          </div>
        </div>
      )}
    </div>
  );
}
