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
    title: "Real-Time Analytics",
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
    title: "Enterprise Security",
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
    title: "Executive Reports",
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
    <section id="features" className="py-20 relative z-10 bg-white dark:bg-[#18191A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-wider text-[#0866FF] font-semibold bg-[#0866FF]/10 px-3.5 py-1 rounded-full border border-[#0866FF]/20">
            Engineered For Precision
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#050505] dark:text-[#E4E6EB]">
            Everything you need to <span className="meta-gradient-text">scale growth</span>
          </h2>
          <p className="text-[#65676B] dark:text-[#B0B3B8] text-base">
            Built for enterprise brands, creator studios, and modern marketing leaders.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="apple-card p-6 flex flex-col justify-between relative group cursor-pointer bg-white dark:bg-[#242526]"
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#0866FF]/10 text-[#0866FF] flex items-center justify-center group-hover:bg-[#0866FF] group-hover:text-white transition-all duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#0866FF] bg-[#0866FF]/10 px-2.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#050505] dark:text-[#E4E6EB] group-hover:text-[#0866FF] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center text-xs font-semibold text-[#0866FF] group-hover:translate-x-1 transition-transform">
                  <span>Learn more →</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
