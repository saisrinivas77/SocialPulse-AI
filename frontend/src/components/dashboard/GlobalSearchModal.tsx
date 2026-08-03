"use client";

import React, { useState, useEffect } from "react";
import { useAppStore, NavView } from "@/store/useAppStore";
import { socialPulseApi } from "@/lib/api";
import { Search, Sparkles, X, ArrowRight, BarChart2, Wand2, Calendar, Users, Layers, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setCurrentView } = useAppStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const searchItems: { label: string; route: NavView; icon: any; category: string }[] = [
    { label: "Dashboard Overview", route: "overview", icon: BarChart2, category: "Navigation" },
    { label: "Cross-Platform Analytics", route: "analytics", icon: BarChart2, category: "Navigation" },
    { label: "AI Studio Caption Generator", route: "ai-studio", icon: Wand2, category: "AI Tools" },
    { label: "Content Schedule & Calendar", route: "calendar", icon: Calendar, category: "Navigation" },
    { label: "Marketing Campaigns Kanban", route: "campaigns", icon: Layers, category: "Navigation" },
    { label: "Connected Social Networks", route: "social-accounts", icon: Share2, category: "Settings" },
    { label: "Team Members & Permissions", route: "team", icon: Users, category: "Team" },
  ];

  const filtered = searchItems.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-xs px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-white dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Input Box */}
          <div className="p-4 border-b border-[#ECE8E1] dark:border-[#262623] flex items-center gap-3">
            <Search className="w-5 h-5 text-[#C8A14A]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search views, AI tools, reports, or campaigns (⌘K)..."
              className="w-full bg-transparent text-sm text-[#111111] dark:text-[#FAFAF8] focus:outline-none placeholder-[#8A8A8A]"
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 rounded-xl text-[#8A8A8A] hover:bg-[#FAFAF8] dark:hover:bg-[#1C1C1A]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setCurrentView(item.route);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold text-[#111111] dark:text-[#FAFAF8] hover:bg-[#F9F5EC] dark:hover:bg-[#262623] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#C8A14A]" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#8A8A8A] group-hover:text-[#C8A14A]">
                      <span className="text-[10px] font-normal">{item.category}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-[#8A8A8A]">
                No matching results found for "{query}"
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
