"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link2, Layers, Cpu, Rocket } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Link2,
    title: "Connect Accounts",
    description: "Link Instagram, LinkedIn, X, TikTok, YouTube, and Facebook in seconds via OAuth security.",
  },
  {
    step: "02",
    icon: Layers,
    title: "Unify Data Streams",
    description: "SocialPulse AI normalizes metrics across networks into a single real-time intelligence hub.",
  },
  {
    step: "03",
    icon: Cpu,
    title: "AI Optimization",
    description: "Generative engines draft copy, predict optimal post timing, and analyze sentiment trends.",
  },
  {
    step: "04",
    icon: Rocket,
    title: "Scale Engagement",
    description: "Schedule multi-channel queues, export executive reports, and accelerate follower growth.",
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 relative bg-black/40 border-y border-amber-500/10 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            Simple 4-Step Pipeline
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            How <span className="gold-gradient-text">SocialPulse AI</span> Works
          </h2>
          <p className="text-gray-400 text-lg">
            From raw platform telemetry to automated viral content orchestration.
          </p>
        </div>

        {/* 4 Steps Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Beam Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/40 to-amber-500/0 -translate-y-6 z-0" />

          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="glass-card p-8 flex flex-col justify-between relative z-10 border-amber-500/20 hover:border-amber-500/50 group"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black text-amber-400/40 group-hover:text-amber-400 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-400 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
