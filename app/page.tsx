'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="w-full h-full flex items-center justify-center px-4 sm:px-6 py-4 sm:py-6 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      
      {/* Minimal accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <motion.div
        key="role-selection"
        className="w-full mx-auto max-w-5xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center gap-6 sm:gap-8 text-center">
          {/* Title */}
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Atlas AI
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl font-light tracking-wide">
              by <span className="text-white font-normal">Yasser Ali</span>
            </p>
          </div>

          {/* Divider line */}
          <div className="w-20 h-px bg-white/20" />

          {/* Tagline */}
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed tracking-wide">
            Production-grade multi-agent AI systems for legal tech
          </p>

          {/* Role Selection */}
          <div className="mt-8 flex flex-col gap-4 w-full max-w-md">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
              I am a...
            </h2>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                className="w-full py-6 text-base sm:text-lg font-medium bg-white text-black hover:bg-white/90 transition-all duration-200 tracking-wide flex flex-col items-center"
                onClick={() => router.push('/plaintiff')}
              >
                <span>Plaintiff / Claimant</span>
                <span className="text-xs sm:text-sm font-normal mt-1 opacity-70">
                  File an intake or get legal assistance
                </span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                className="w-full py-6 text-base sm:text-lg font-medium bg-primary text-white hover:bg-primary/90 transition-all duration-200 tracking-wide flex flex-col items-center"
                onClick={() => router.push('/lawyer')}
              >
                <span>Lawyer / Attorney</span>
                <span className="text-xs sm:text-sm font-normal mt-1 opacity-70">
                  Review intakes and research cases
                </span>
              </Button>
            </motion.div>
          </div>

          {/* Additional info */}
          <p className="text-muted-foreground text-xs sm:text-sm max-w-xl mt-4 leading-relaxed">
            Atlas AI connects plaintiffs with legal assistance and helps lawyers efficiently review and research potential cases using advanced AI technology.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

