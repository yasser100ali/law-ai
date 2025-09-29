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
      className="w-full mx-auto max-w-3xl px-14 md:mt-24"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex flex-col gap-4 leading-relaxed text-left">
        <div className="flex flex-col gap-1">
          <p className="text-white font-semibold text-3xl">
            Project Eve 
          </p>
          <p className="text-gray-400 font-normal text-xl">
            by Yasser Ali
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
      </div>
    </motion.div>
  );
};
