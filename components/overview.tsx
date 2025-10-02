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
    <div className="w-full h-full flex items-center justify-center px-4 sm:px-6 py-4 sm:py-6 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      
      {/* Minimal accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <motion.div
        key="overview"
        className="w-full mx-auto max-w-5xl relative z-10 pt-16 sm:pt-16 md:pt-16 lg:pt-8 xl:pt-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center gap-4 sm:gap-5 lg:gap-6 text-center">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight font-space-grotesk text-white leading-[1.1]">
              Atlas AI
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-lg font-light font-space-grotesk tracking-wide">
              by <span className="text-white font-normal">Yasser Ali</span>
            </p>
          </div>

          {/* Divider line */}
          <div className="w-16 h-px bg-white/20" />

          {/* Tagline */}
          <p className="text-muted-foreground text-xs sm:text-sm md:text-sm lg:text-base max-w-2xl leading-relaxed font-space-grotesk tracking-wide">
            Production-grade multi-agent AI systems for legal tech
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-2 sm:mt-3 w-full max-w-3xl">
            <Button
              size="lg"
              variant="outline"
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 lg:px-5 lg:py-3.5 text-xs sm:text-sm lg:text-base font-medium border-2 border-white/30 hover:border-white hover:bg-white hover:text-black transition-all duration-200 font-space-grotesk tracking-wide text-white"
              onClick={onWhyHireMe}
            >
              Why hire me?
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 lg:px-5 lg:py-3.5 text-xs sm:text-sm lg:text-base font-medium border-2 border-white/30 hover:border-white hover:bg-white hover:text-black transition-all duration-200 font-space-grotesk tracking-wide text-white"
              onClick={onEveIdeas}
            >
              How Eve can dominate Legal AI
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 lg:px-5 lg:py-3.5 text-xs sm:text-sm lg:text-base font-medium border-2 border-white/30 hover:border-white hover:bg-white hover:text-black transition-all duration-200 font-space-grotesk tracking-wide text-white"
              onClick={onIntake}
            >
              File an intake
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 lg:px-5 lg:py-3.5 text-xs sm:text-sm lg:text-base font-medium border-2 border-white/30 hover:border-white hover:bg-white hover:text-black transition-all duration-200 font-space-grotesk tracking-wide text-white"
              onClick={onOpenIntakes}
            >
              Open intakes
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};