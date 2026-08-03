"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { AICore3D } from "@/components/3d/AICore3D";
import { ArrowRight, Play, Star, ChevronDown, Zap, Sparkles } from "lucide-react";

export const LandingHero: React.FC = () => {
  const { setCurrentView } = useAppStore();

  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Kicker Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md mb-6"
      >
        <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
          AI OPERATING SYSTEM FOR SOCIAL MEDIA
        </span>
      </motion.div>

      {/* Hero Headline & Subtitle */}
      <div className="max-w-5xl text-center space-y-6 z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02]"
        >
          <span className="block text-white">Understand.</span>
          <span className="block gold-gradient-text">Engage.</span>
          <span className="block text-white">Grow.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="max-w-2xl mx-auto text-base sm:text-xl font-light text-gray-300 tracking-wide leading-relaxed"
        >
          SocialPulse AI turns your social media telemetry into predictive growth strategies with custom neural models and luxury analytics.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-5 pt-2"
        >
          <button
            onClick={() => setCurrentView("overview")}
            className="btn-magnetic btn-gold px-8 py-4 text-sm font-extrabold flex items-center gap-3 shadow-[0_0_35px_rgba(255,215,0,0.4)]"
          >
            <Zap className="w-5 h-5 fill-black" />
            <span>Launch AI OS</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#ai-features"
            className="btn-magnetic btn-glass px-8 py-4 text-sm font-bold flex items-center gap-3 text-white border-amber-500/30 hover:border-amber-400"
          >
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Play className="w-3 h-3 fill-amber-400 ml-0.5" />
            </div>
            <span>Watch Product Demo</span>
          </a>
        </motion.div>
      </div>

      {/* Floating 3D AI Processor Core Canvas with Orbiting Social Icons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="w-full max-w-6xl mt-4 z-10"
      >
        <AICore3D />
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.a
        href="#trusted-companies"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mt-6 flex flex-col items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer z-10"
      >
        <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to explore AI OS</span>
        <ChevronDown className="w-4 h-4 text-amber-400" />
      </motion.a>
    </section>
  );
};
