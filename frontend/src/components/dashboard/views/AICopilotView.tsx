"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Wand2,
  TrendingUp,
  Calendar,
  FileSpreadsheet,
  RefreshCw,
  Copy,
  Check,
  Zap,
  ChevronDown,
  Layers,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { socialPulseApi } from "@/lib/api";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  chartData?: { day: string; reach: number; engagement: number }[];
  suggestions?: string[];
  actionType?: string;
}

const quickActionChips = [
  { label: "Generate Campaign", icon: Wand2 },
  { label: "Generate Caption", icon: Sparkles },
  { label: "Analyze Audience", icon: Layers },
  { label: "Optimize Schedule", icon: Calendar },
  { label: "Predict Engagement", icon: TrendingUp },
  { label: "Create Report", icon: FileSpreadsheet },
  { label: "Rewrite Content", icon: RefreshCw },
];

const sampleChart = [
  { day: "Mon", reach: 180000, engagement: 24000 },
  { day: "Tue", reach: 240000, engagement: 32000 },
  { day: "Wed", reach: 380000, engagement: 54000 },
  { day: "Thu", reach: 490000, engagement: 68000 },
  { day: "Fri", reach: 720000, engagement: 95000 },
];

export const AICopilotView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "ai",
      text: "⚡ **Welcome to SocialPulse AI Copilot.**\nI am your enterprise AI operating system assistant. Ask me to generate campaigns, analyze audience telemetry, optimize posting schedules, or forecast reach.",
      timestamp: "Just now",
      suggestions: [
        "Generate a 30-day viral AI campaign for Instagram & LinkedIn",
        "Predict peak engagement window for next week",
        "Analyze positive vs negative sentiment trends",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Pulse-GPT 4.5 Enterprise");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = promptText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInput("");
    setLoading(true);

    try {
      // Execute backend REST API or simulated streaming response
      const apiRes = await socialPulseApi.generateCaption({ prompt: textToSend });

      setTimeout(() => {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `### 🎯 Strategy Response (${selectedModel})\n\n**Generated Campaign / Copy Strategy:**\n> "${apiRes.caption}"\n\n**Recommended Hashtag Density:**\n${apiRes.hashtags.map((h: string) => `\`${h}\``).join(" ")}\n\n**AI Sentiment Modeling:**\n- Positive Signal: **94.2%**\n- Algorithmic Conversion Boost: **+38%**`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          chartData: sampleChart,
          suggestions: [
            "Schedule this post to calendar",
            "Generate variant for TikTok & Reels",
            "Export summary as PDF report",
          ],
        };
        setMessages((prev) => [...prev, aiMsg]);
        setLoading(false);
      }, 1000);
    } catch {
      toast.error("AI response executed.");
      setLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 min-h-[85vh] flex flex-col justify-between">
      {/* Header & Model Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/15 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-amber-400" /> AI Copilot OS
          </h1>
          <p className="text-xs text-gray-400 mt-1">Cursor & Perplexity style enterprise AI operating system assistant</p>
        </div>

        {/* Model Switcher Dropdown */}
        <div className="flex items-center gap-2 bg-[#0F1115] border border-amber-500/20 px-4 py-2 rounded-2xl">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
          >
            <option value="Pulse-GPT 4.5 Enterprise">Pulse-GPT 4.5 Enterprise</option>
            <option value="Pulse-Vision 2.0 Multimodal">Pulse-Vision 2.0 Multimodal</option>
            <option value="Pulse-DeepSeek Neural">Pulse-DeepSeek Neural</option>
          </select>
        </div>
      </div>

      {/* Main Conversation Stream Panel */}
      <div className="flex-1 space-y-6 overflow-y-auto max-h-[580px] pr-2">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 p-5 rounded-3xl border ${
                msg.sender === "user"
                  ? "bg-amber-500/10 border-amber-500/30 ml-auto max-w-2xl"
                  : "glass-card border-amber-500/20 max-w-3xl"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold ${
                  msg.sender === "user"
                    ? "bg-amber-500 text-black"
                    : "bg-gradient-to-tr from-amber-500 to-yellow-600 text-black shadow-lg"
                }`}
              >
                {msg.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">
                    {msg.sender === "user" ? "You" : "SocialPulse AI Copilot"}
                  </span>
                  <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                </div>

                {/* Formatted Markdown Output */}
                <div className="text-sm text-gray-200 leading-relaxed space-y-2 whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Embedded Recharts Graph if present */}
                {msg.chartData && (
                  <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/20 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Forecast & Reach Telemetry Chart
                    </span>
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={msg.chartData}>
                          <defs>
                            <linearGradient id="aiGraph" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FFD700" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="day" stroke="#737373" fontSize={10} />
                          <YAxis stroke="#737373" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: "#0F1115", borderColor: "#FFD700" }} />
                          <Area type="monotone" dataKey="reach" stroke="#FFD700" strokeWidth={2} fill="url(#aiGraph)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* AI Follow-up Suggestion Chips */}
                {msg.suggestions && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sug)}
                        className="text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 transition-all"
                      >
                        ⚡ {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleCopyText(msg.id, msg.text)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 transition-colors self-start"
                title="Copy message"
              >
                {copiedId === msg.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex items-center gap-3 p-4 rounded-3xl glass-card border-amber-500/20 max-w-sm">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            <span className="text-xs font-bold text-amber-300 animate-pulse">
              SocialPulse AI Copilot is thinking...
            </span>
          </div>
        )}
      </div>

      {/* Quick Action Chips Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickActionChips.map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                key={chip.label}
                onClick={() => handleSendMessage(`Execute ${chip.label} for our active brand profiles`)}
                className="px-3.5 py-2 rounded-2xl bg-[#0F1115] border border-amber-500/20 hover:border-amber-400 text-xs font-bold text-gray-300 hover:text-amber-300 transition-all shrink-0 flex items-center gap-2"
              >
                <Icon className="w-3.5 h-3.5 text-amber-400" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Bar matching Cursor / Perplexity AI OS Prompt */}
        <div className="relative glass-card border-amber-500/40 p-2 shadow-[0_0_50px_rgba(255,215,0,0.2)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            rows={2}
            placeholder="Ask SocialPulse AI Copilot... (Press Enter to send)"
            className="w-full bg-transparent p-3 text-sm text-white placeholder-gray-500 focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between px-3 pb-1 border-t border-amber-500/10 pt-2">
            <span className="text-[10px] text-gray-500 font-semibold">
              Tip: Shift + Enter for new line • ⌘K for Command Palette
            </span>
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="btn-magnetic btn-gold px-5 py-2 text-xs font-extrabold flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
