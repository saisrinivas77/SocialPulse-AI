"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import {
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const DashboardPreviewSection: React.FC = () => {
  const { setCurrentView } = useAppStore();

  return (
    <section id="dashboard-preview" className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            Enterprise Command Center
          </span>
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Designed for <span className="gold-gradient-text">speed & mastery</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Experience the gold standard of social analytics interfaces. Everything you need, zero clutter.
          </p>
        </div>

        {/* Floating 3D Tilt Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 12 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          onClick={() => setCurrentView("overview")}
          className="glass-card p-4 sm:p-6 border-amber-500/40 shadow-[0_0_80px_rgba(255,215,0,0.2)] cursor-pointer group hover:border-amber-400 transition-all duration-500 relative"
        >
          {/* Top Window Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-amber-500/15">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 text-xs font-semibold text-gray-400">
                app.socialpulse.ai/workspace/overview
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <Zap className="w-3.5 h-3.5" /> Realtime Pulse Live
            </div>
          </div>

          {/* Inner Dashboard Layout Preview */}
          <div className="grid grid-cols-12 gap-4 rounded-2xl bg-black/80 p-4 border border-amber-500/10">
            {/* Sidebar Mock */}
            <div className="hidden md:block col-span-3 space-y-4 border-r border-amber-500/10 pr-4">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" /> Pulse AI
              </div>
              <div className="space-y-1">
                {["Overview", "Analytics", "AI Studio", "Scheduler", "Media Library", "Reports"].map(
                  (item, idx) => (
                    <div
                      key={item}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                        idx === 0
                          ? "bg-amber-500 text-black font-bold"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{item}</span>
                      {idx === 2 && (
                        <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded">
                          AI
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Main Workspace Preview */}
            <div className="col-span-12 md:col-span-9 space-y-4">
              {/* Stat Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Followers", val: "25.6K", delta: "+12.3%", icon: Users },
                  { label: "Monthly Reach", val: "1.2M", delta: "+18.3%", icon: Eye },
                  { label: "Engagement", val: "8.45%", delta: "+8.1%", icon: TrendingUp },
                  { label: "Posts Published", val: "120", delta: "+15.2%", icon: Calendar },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/5 border border-amber-500/15 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold">
                        <span>{stat.label}</span>
                        <Icon className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div className="text-lg font-black text-white">{stat.val}</div>
                      <span className="text-[10px] font-bold text-green-400">{stat.delta}</span>
                    </div>
                  );
                })}
              </div>

              {/* AI Recommendation Alert */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <div className="text-xs">
                    <span className="font-bold text-amber-300">AI Viral Signal Detected:</span>
                    <span className="text-gray-300 ml-1">
                      Post #AITrends reel now for +42% reach boost.
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-black bg-amber-400 px-3 py-1 rounded-lg">
                  Apply Now
                </span>
              </div>
            </div>
          </div>

          {/* Hover Overlay CTA */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center">
            <button className="btn-magnetic btn-gold px-8 py-4 text-base font-bold flex items-center gap-3 shadow-2xl">
              <span>Enter Interactive Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
