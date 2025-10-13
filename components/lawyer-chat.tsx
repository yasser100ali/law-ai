"use client";

import React from "react";
import { PreviewMessage, ThinkingMessage } from "@/components/message";
import { MultimodalInput } from "@/components/multimodal-input";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import type { Message } from "ai";
// @ts-ignore - ai/react types issue with moduleResolution
import { useChat } from "ai/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IntakeRecord } from "@/types/intake";
import { motion } from "framer-motion";

interface LawyerChatProps {
  intakeRecords: IntakeRecord[];
}

export function LawyerChat({ intakeRecords }: LawyerChatProps) {
  const chatId = "lawyer-001";

  const backendUrl = process.env.NODE_ENV === "development" 
    ? "http://127.0.0.1:8000"
    : process.env.RAILWAY_URL || "https://law-ai-production-01cd.up.railway.app";

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
    api: `${backendUrl}/api/chat?chat_mode=lawyer`,
    maxSteps: 4,
    onError: (error: Error) => {
      if (error.message.includes("Too many requests")) {
        toast.error(
          "You are sending too many messages. Please try again later.",
        );
      }
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const hasMessages = messages.length > 0;

  // Suggested prompts for lawyers
  const suggestedPrompts = [
    { 
      title: "What are the highest-scoring intakes?", 
      action: "Show me the highest-scoring intakes and explain their strengths." 
    },
    { 
      title: "Analyze intakes by matter type", 
      action: "Analyze the distribution of intakes by matter type and highlight any patterns." 
    },
    { 
      title: "Show me cases with strong evidence", 
      action: "Which intakes have the strongest evidence quality scores?" 
    },
    { 
      title: "Identify urgent cases", 
      action: "Show me the most urgent cases that need immediate attention." 
    },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="px-4 py-4">
          <div className="flex flex-col gap-2 max-w-4xl mx-auto">
            <div className="flex flex-col gap-0.5">
              <p className="text-white font-medium text-base sm:text-lg leading-tight tracking-tight">
                Lawyer Research Assistant
              </p>
              <p className="text-muted-foreground font-normal text-xs sm:text-sm tracking-tight">
                Ask questions about intakes, analyze cases, and research legal issues
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-auto pt-4 px-4"
      >
        {!hasMessages && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
            <div className="flex flex-col gap-2 max-w-2xl">
              <h2 className="text-2xl font-bold text-foreground">
                Research Intakes with AI
              </h2>
              <p className="text-muted-foreground text-sm">
                I can help you analyze intakes, identify patterns, research legal issues, 
                and provide insights to help you make informed decisions about which cases to take.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>📊 <strong>{intakeRecords.length}</strong> total intakes available</p>
              {intakeRecords.length > 0 && (
                <>
                  <p>
                    ⭐ Highest score: <strong>{Math.max(...intakeRecords.map(r => r.aiScore || 0))}/100</strong>
                  </p>
                  <p>
                    📁 Matter types: <strong>{new Set(intakeRecords.map(r => r.form?.matterType).filter(Boolean)).size}</strong>
                  </p>
                </>
              )}
            </div>
          </div>
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

      {/* Input area */}
      <div className="flex-shrink-0 mx-auto px-4 bg-background pb-4 md:pb-6 w-full md:max-w-3xl">
        {/* Suggested Prompts */}
        {!hasMessages && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {suggestedPrompts.map((prompt, index) => (
              <motion.div
                key={`suggested-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
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
  );
}

