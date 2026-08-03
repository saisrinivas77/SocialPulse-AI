"use client";

import React, { useState } from "react";
import { Sparkles, X, Send, Bot } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

export const AICopilotDock: React.FC = () => {
  const { setCurrentView } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    toast.success("AI Copilot analyzing request...");
    setCurrentView("ai-studio");
    setIsOpen(false);
    setPrompt("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 glass-card border-amber-500/40 p-4 shadow-[0_0_60px_rgba(255,215,0,0.3)] space-y-4 animate-rise-in">
          <div className="flex items-center justify-between border-b border-amber-500/15 pb-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>AI Copilot Quick Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-xs">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleQuickAsk} className="space-y-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask SocialPulse AI anything..."
              className="w-full bg-black/60 border border-amber-500/20 rounded-2xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none h-24 resize-none"
            />
            <button type="submit" className="w-full btn-magnetic btn-gold py-2 text-xs font-bold flex items-center justify-center gap-1.5">
              <span>Run AI Copilot</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-600 text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:scale-110 transition-transform duration-300 group"
          title="Ask AI Copilot"
        >
          <Sparkles className="w-7 h-7 stroke-[2.5] group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};
