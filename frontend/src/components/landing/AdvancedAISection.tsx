"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { CheckCircle2, Play, ArrowRight, Sparkles } from "lucide-react";

export const AdvancedAISection: React.FC = () => {
  const { setCurrentView } = useAppStore();

  const benefits = [
    "Multi-platform analytics",
    "AI-powered insights",
    "Real-time dashboards",
    "Secure & privacy-first",
  ];

  return (
    <section className="py-24 relative z-10 bg-black/50 border-y border-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text & Features Content matching reference image */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Advanced AI. <br />
                <span className="gold-gradient-text">Beautiful Analytics.</span>
              </h2>
              <p className="text-gray-300 text-lg font-light max-w-xl leading-relaxed">
                Built for creators, marketers and brands who want to grow faster with smarter decisions.
              </p>
            </div>

            {/* Checkmark List */}
            <div className="space-y-3.5 pt-2">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-3 text-base text-gray-200 font-medium">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <button
                onClick={() => setCurrentView("overview")}
                className="btn-magnetic btn-gold px-8 py-3.5 text-sm font-extrabold flex items-center gap-2 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
              >
                <span>Start Free Trial</span>
              </button>

              <a
                href="#pricing"
                className="text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
              >
                <span>See Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Visual: Dashboard Preview Card + Floating 3D Gold Metallic Sphere */}
          <div className="relative flex items-center justify-center">
            {/* Dashboard Browser Preview Window */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-full max-w-lg glass-card p-4 border-amber-500/30 shadow-[0_0_60px_rgba(255,215,0,0.2)] relative z-10"
            >
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-amber-500/15">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-[10px] text-gray-400 ml-2 font-mono">Overview Dashboard</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-black/80 p-6 space-y-4 border border-amber-500/10">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Engagement Telemetry</span>
                  <span className="text-amber-400 font-extrabold">+18.3%</span>
                </div>

                <div className="h-40 rounded-xl bg-gradient-to-tr from-amber-500/10 to-amber-500/5 border border-amber-500/20 flex items-center justify-center relative">
                  <div className="w-14 h-14 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center text-amber-400 shadow-xl cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-amber-400 ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating 3D Gold Sphere matching reference design */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 10, 0],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -right-6 w-36 h-36 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 shadow-[0_20px_50px_rgba(255,215,0,0.5)] z-20 border-2 border-amber-300 pointer-events-none"
              style={{
                boxShadow: "inset -10px -10px 25px rgba(0,0,0,0.4), 0 20px 50px rgba(255,215,0,0.4)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
