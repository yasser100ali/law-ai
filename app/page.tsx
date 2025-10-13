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
          <div className="mt-10 flex flex-col gap-3 w-full max-w-lg">
            <h2 className="text-base font-medium text-zinc-400 mb-1 tracking-wide">
              Select your role
            </h2>
            
            <motion.div
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="lg"
                className="w-full py-6 px-6 text-left bg-white/95 hover:bg-white text-black transition-all duration-200 flex items-center justify-between min-h-[72px] rounded-lg border border-zinc-800 hover:border-white group"
                onClick={() => router.push('/plaintiff')}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-base font-semibold tracking-tight">
                    Plaintiff / Claimant
                  </span>
                  <span className="text-xs text-zinc-600 font-normal">
                    File an intake or get legal assistance
                  </span>
                </div>
                <svg 
                  className="w-5 h-5 text-zinc-400 group-hover:text-black group-hover:translate-x-1 transition-all duration-200" 
                  fill="none" 
                  strokeWidth="2" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="lg"
                className="w-full py-6 px-6 text-left bg-white/95 hover:bg-white text-black transition-all duration-200 flex items-center justify-between min-h-[72px] rounded-lg border border-zinc-800 hover:border-white group"
                onClick={() => router.push('/lawyer')}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-base font-semibold tracking-tight">
                    Lawyer / Attorney
                  </span>
                  <span className="text-xs text-zinc-600 font-normal">
                    Review intakes and research cases
                  </span>
                </div>
                <svg 
                  className="w-5 h-5 text-zinc-400 group-hover:text-black group-hover:translate-x-1 transition-all duration-200" 
                  fill="none" 
                  strokeWidth="2" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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

