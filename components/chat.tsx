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
import { WhyHireMePanel } from "@/components/why-hire-panel";
import { EveIdeasPanel } from "@/components/eve-ideas-panel";
import { IntakePanel } from "@/components/intake-panel";
import { OpenIntakesPanel } from "@/components/open-intakes-panel";
import { IntakeRecord } from "@/types/intake";

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