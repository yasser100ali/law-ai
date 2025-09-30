'use client';
import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface OverviewProps {
  onWhyHireMe: () => void;
  onEveIdeas: () => void;
}

export const Overview = ({ onWhyHireMe, onEveIdeas }: OverviewProps) => {
  return (
    <motion.div
      key="overview"
      className="w-full mx-auto max-w-3xl px-10 md:mt-24"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex flex-col gap-4 leading-relaxed text-left">
        <div className="flex flex-col gap-2">
          <p className="text-white font-medium text-3xl tracking-tight">
            Project Dedicated to the Eve AI team
          </p>
          <p className="text-muted-foreground font-normal text-xl tracking-tight">
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
            How Eve will dominate.
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
