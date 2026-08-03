"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Wand2,
  BarChart3,
  Clock,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Predictive Insights",
    description:
      "Deep neural models analyze pattern shifts, audience sentiment, and viral signals across your social profiles in real-time.",
    badge: "AI Core",
  },
  {
    icon: Wand2,
    title: "Smart Copy & Hashtags",
    description:
      "Generate high-converting captions, localized hashtags, and brand-safe replies customized per social network algorithm.",
    badge: "Generator",
  },
  {
    icon: BarChart3,
    title: "Luxury Real-Time Analytics",
    description:
      "Executive level charts tracking reach, engagement density, audience growth rate, and follower demographic shifts.",
    badge: "Analytics",
  },
  {
    icon: Clock,
    title: "Best Posting Window AI",
    description:
      "Know precisely when your global audience is active. Automatically schedule posts at maximum engagement peaks.",
    badge: "Automation",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Social Security",
    description:
      "Multi-brand workspace isolation, fine-grained RBAC roles, OAuth token encryption, and full audit log history.",
    badge: "Security",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Trend Radar",
    description:
      "Detect emerging viral topics, competitor moves, and algorithmic shifts before they saturate your market niche.",
    badge: "Radar",
  },
  {
    icon: FileSpreadsheet,
    title: "Instant Executive Reports",
    description:
      "Export publication-ready PDF summaries, raw CSV datasets, and formatted Excel sheets with a single click.",
    badge: "Reporting",
  },
  {
    icon: Zap,
    title: "Drag & Drop Multi-Scheduler",
    description:
      "Visualize your cross-platform content calendar with drag and drop queue ordering, draft previews, and auto-publishing.",
    badge: "Workflow",
  },
];

export const FeatureCardsSection: React.FC = () => {
  return (
    <section id="features" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            Engineered For Excellence
          </span>
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Everything you need to <span className="gold-gradient-text">dominate social</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Built for enterprise brands, elite agencies, and modern marketing leaders.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card p-6 flex flex-col justify-between relative group cursor-pointer overflow-hidden border-amber-500/15 hover:border-amber-500/40"
              >
                {/* Background Glow */}
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/25 transition-all" />

                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:text-amber-300 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/80 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-400 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 flex items-center text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore feature →</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
