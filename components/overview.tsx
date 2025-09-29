'use client';
import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface OverviewProps {
  onWhyHireMe: () => void;
  onEveIdeas: () => void;
  onSuggestedPrompt?: (prompt: string) => void;
}

const suggestedPrompts = [
  {
    title: "Tell me about Yasser",
    action: "Tell me about Yasser",
  },
  {
    title: "How to use this chatbot",
    action: "How to use this chatbot",
  },
  {
    title: "Help me figure out which case I should take",
    action: "Help me figure out which case I should take",
  },
  {
    title: "How can you help me figure out how strong my case is?",
    action: "How can you help me figure out how strong my case is?",
  },
];

export const Overview = ({ onWhyHireMe, onEveIdeas, onSuggestedPrompt }: OverviewProps) => {
  return (
    <motion.div
      key="overview"
      className="w-full mx-auto max-w-3xl px-10 md:mt-24"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex flex-col gap-8 leading-relaxed text-left">
        <div className="flex flex-col gap-1">
          <p className="text-white font-semibold text-3xl">
            Project Eve 
          </p>
          <p className="text-gray-400 font-normal text-xl">
            by Yasser Ali
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            variant="outline"
            className="px-6 py-3 font-semibold"
            onClick={onWhyHireMe}
          >
            Why hire me?
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-6 py-3 font-semibold"
            onClick={onEveIdeas}
          >
            Ideas to make Eve dominate
          </Button>
        </div>

        {/* Suggested Prompts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestedPrompts.map((prompt, index) => (
            <motion.div
              key={`suggested-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
            >
              <Button
                variant="ghost"
                onClick={() => onSuggestedPrompt?.(prompt.action)}
                className="w-full h-auto justify-start items-start text-left border border-border/40 rounded-xl px-4 py-3 hover:bg-accent/50 hover:border-border transition-all"
              >
                <span className="text-sm text-muted-foreground font-normal">
                  {prompt.title}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
