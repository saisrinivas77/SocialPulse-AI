"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { Sparkles, ChevronDown } from "lucide-react";

export const LandingHeader: React.FC = () => {
  const { setCurrentView } = useAppStore();

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView("landing")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0866FF] to-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold tracking-tight text-[#050505] dark:text-[#E4E6EB]">
              SocialPulse<span className="text-[#0866FF] font-light ml-0.5">AI</span>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#65676B] dark:text-[#B0B3B8]">
          <button onClick={() => setCurrentView("landing")} className="hover:text-[#0866FF] dark:hover:text-[#0866FF] transition-colors">
            Overview
          </button>
          <button onClick={() => setCurrentView("overview")} className="hover:text-[#0866FF] dark:hover:text-[#0866FF] transition-colors">
            Command Center
          </button>
          <button onClick={() => setCurrentView("ai-studio")} className="hover:text-[#0866FF] dark:hover:text-[#0866FF] transition-colors">
            AI Studio
          </button>
          <button onClick={() => setCurrentView("analytics")} className="hover:text-[#0866FF] dark:hover:text-[#0866FF] transition-colors">
            Analytics
          </button>
          <div className="flex items-center gap-1 cursor-pointer hover:text-[#0866FF] transition-colors">
            <span>Enterprise</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8A8D91]" />
          </div>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView("overview")}
            className="px-5 py-2 rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white font-semibold text-xs shadow-md shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Launch OS
          </button>
        </div>
      </div>
    </header>
  );
};
