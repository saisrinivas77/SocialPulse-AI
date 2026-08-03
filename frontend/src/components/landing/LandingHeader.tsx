"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { Sparkles, ChevronDown } from "lucide-react";

export const LandingHeader: React.FC = () => {
  const { setCurrentView } = useAppStore();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#050507]/80 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView("landing")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-600 flex items-center justify-center shadow-[0_0_25px_rgba(255,215,0,0.4)] group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-extrabold tracking-tight text-white">
              SocialPulse<span className="text-amber-400 font-light ml-1">AI</span>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <button onClick={() => setCurrentView("landing")} className="hover:text-amber-400 transition-colors">
            Overview
          </button>
          <button onClick={() => setCurrentView("overview")} className="hover:text-amber-400 transition-colors">
            Command Center
          </button>
          <button onClick={() => setCurrentView("ai-studio")} className="hover:text-amber-400 transition-colors">
            AI Studio
          </button>
          <button onClick={() => setCurrentView("analytics")} className="hover:text-amber-400 transition-colors">
            Analytics
          </button>
          <div className="flex items-center gap-1 cursor-pointer hover:text-amber-400 transition-colors">
            <span>Enterprise</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </div>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView("overview")}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(255,215,0,0.35)] hover:scale-105 transition-all"
          >
            Launch OS
          </button>
        </div>
      </div>
    </header>
  );
};
