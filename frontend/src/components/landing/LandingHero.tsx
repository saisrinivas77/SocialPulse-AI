"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { AICore3D } from "@/components/3d/AICore3D";
import { ArrowRight, Play, ChevronDown, Zap, Sparkles } from "lucide-react";

export const LandingHero: React.FC = () => {
  const { setCurrentView } = useAppStore();

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#18191A]">
      {/* Kicker Badge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0866FF]/20 bg-[#0866FF]/5 dark:bg-[#0866FF]/10 backdrop-blur-md mb-6"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#0866FF]" />
        <span className="text-[11px] font-semibold tracking-wide uppercase text-[#0866FF]">
          AI Operating System for Social Media
        </span>
      </motion.div>

      {/* Hero Headline & Subtitle */}
      <div className="max-w-4xl text-center space-y-6 z-10">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] text-[#050505] dark:text-[#E4E6EB]"
        >
          <span>Understand. </span>
          <span className="meta-gradient-text">Engage. </span>
          <span>Grow.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-xl font-normal text-[#65676B] dark:text-[#B0B3B8] leading-relaxed"
        >
          SocialPulse AI turns your social media telemetry into predictive growth strategies with custom neural models and real-time intelligence.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={() => setCurrentView("overview")}
            className="px-7 py-3.5 rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white text-sm font-semibold flex items-center gap-2.5 shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Launch AI OS</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#ai-features"
            className="px-7 py-3.5 rounded-full bg-[#F0F2F5] dark:bg-[#242526] hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C] text-sm font-semibold flex items-center gap-2.5 text-[#050505] dark:text-[#E4E6EB] transition-all border border-black/5 dark:border-white/10"
          >
            <div className="w-5 h-5 rounded-full bg-[#0866FF]/10 flex items-center justify-center text-[#0866FF]">
              <Play className="w-2.5 h-2.5 fill-[#0866FF] ml-0.5" />
            </div>
            <span>Watch Product Demo</span>
          </a>
        </motion.div>
      </div>

      {/* Floating 3D AI Processor Core Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="w-full max-w-5xl mt-6 z-10"
      >
        <AICore3D />
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.a
        href="#trusted-companies"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mt-6 flex flex-col items-center gap-1.5 text-[#65676B] dark:text-[#B0B3B8] hover:text-[#0866FF] transition-colors cursor-pointer z-10"
      >
        <span className="text-[10px] uppercase tracking-wider font-semibold">Scroll to explore</span>
        <ChevronDown className="w-4 h-4 text-[#0866FF]" />
      </motion.a>
    </section>
  );
};
