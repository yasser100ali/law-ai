'use client';
import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface OverviewProps {
  onWhyHireMe: () => void;
  onEveIdeas: () => void;
  onIntake: () => void;
  onOpenIntakes: () => void;
}

export const Overview = ({
  onWhyHireMe,
  onEveIdeas,
  onIntake,
  onOpenIntakes,
}: OverviewProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      
      {/* Minimal accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <motion.div
        key="overview"
        className="w-full mx-auto max-w-5xl relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center gap-10 text-center">
          {/* Title */}
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight font-space-grotesk text-white leading-[1.1]">
              Project Dedicated to the
              <br />
              <span className="text-white/90">Eve AI Team</span>
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl font-light font-space-grotesk tracking-wide">
              by <span className="text-white font-normal">Yasser Ali</span>
            </p>
          </div>

          {/* Divider line */}
          <div className="w-24 h-px bg-white/20" />

          {/* Tagline */}
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed font-space-grotesk tracking-wide">
            Production-grade multi-agent AI systems for legal tech
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base font-medium border-2 border-white/30 hover:border-white hover:bg-white hover:text-black transition-all duration-200 font-space-grotesk tracking-wide text-white"
              onClick={onWhyHireMe}
            >
              Why hire me?
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base font-medium border-2 border-white/30 hover:border-white hover:bg-white hover:text-black transition-all duration-200 font-space-grotesk tracking-wide text-white"
              onClick={onEveIdeas}
            >
              How Eve can dominate the Legal AI Market
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base font-medium border-2 border-white/30 hover:border-white hover:bg-white hover:text-black transition-all duration-200 font-space-grotesk tracking-wide text-white"
              onClick={onIntake}
            >
              File an intake with Eve
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base font-medium border-2 border-white/30 hover:border-white hover:bg-white hover:text-black transition-all duration-200 font-space-grotesk tracking-wide text-white"
              onClick={onOpenIntakes}
            >
              Open intakes (lawyers)
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
