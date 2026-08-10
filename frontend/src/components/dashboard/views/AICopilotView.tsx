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
    <div className="space-y-6 pb-12 min-h-[85vh] flex flex-col justify-between font-sans">
      {/* Header & Model Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Sparkles className="w-8 h-8" style={{ color: '#C8A14A' }} /> AI Copilot OS
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Cursor & Perplexity style enterprise AI operating system assistant</p>
        </div>

        {/* Model Switcher Dropdown */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
          <Zap className="w-4 h-4" style={{ color: '#C8A14A' }} />
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
            style={{ color: 'var(--text-primary)' }}
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
              className="flex gap-4 p-5 rounded-3xl border shadow-xs"
              style={{
                background: msg.sender === "user" ? 'var(--accent-light)' : 'var(--card-bg)',
                borderColor: msg.sender === "user" ? 'var(--accent-border)' : 'var(--card-border)',
                marginLeft: msg.sender === "user" ? 'auto' : '0',
                maxWidth: msg.sender === "user" ? '42rem' : '48rem',
              }}
            >
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold shadow-xs text-white"
                style={{
                  background: msg.sender === "user" ? 'linear-gradient(135deg, #C8A14A, #B8922E)' : 'linear-gradient(135deg, #C8A14A, #E8D5A3)',
                }}
              >
                {msg.sender === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: '#C8A14A' }}>
                    {msg.sender === "user" ? "You" : "SocialPulse AI Copilot"}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{msg.timestamp}</span>
                </div>

                {/* Formatted Markdown Output */}
                <div className="text-sm leading-relaxed space-y-2 whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                  {msg.text}
                </div>

                {/* Embedded Recharts Graph if present */}
                {msg.chartData && (
                  <div className="p-4 rounded-2xl border space-y-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
                    <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: '#C8A14A' }}>
                      Forecast & Reach Telemetry Chart
                    </span>
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={msg.chartData}>
                          <defs>
                            <linearGradient id="aiGraph" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#C8A14A" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#C8A14A" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={10} />
                          <YAxis stroke="var(--text-muted)" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: "var(--card-bg)", borderColor: "#C8A14A", color: "var(--text-primary)" }} />
                          <Area type="monotone" dataKey="reach" stroke="#C8A14A" strokeWidth={2} fill="url(#aiGraph)" />
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
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all"
                        style={{ background: 'var(--accent-light)', borderColor: 'var(--accent-border)', color: '#C8A14A' }}
                      >
                        ⚡ {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleCopyText(msg.id, msg.text)}
                className="p-1.5 rounded-lg transition-colors self-start"
                style={{ color: 'var(--text-muted)' }}
                title="Copy message"
              >
                {copiedId === msg.id ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex items-center gap-3 p-4 rounded-3xl border max-w-sm" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <Sparkles className="w-5 h-5 animate-spin" style={{ color: '#C8A14A' }} />
            <span className="text-xs font-bold animate-pulse" style={{ color: '#C8A14A' }}>
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
                className="px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all shrink-0 flex items-center gap-2"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: '#C8A14A' }} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="relative rounded-[28px] border p-2 shadow-xs" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
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
            className="w-full bg-transparent p-3 text-sm focus:outline-none resize-none font-sans"
            style={{ color: 'var(--text-primary)' }}
          />

          <div className="flex items-center justify-between px-3 pb-1 border-t pt-2" style={{ borderColor: 'var(--card-border)' }}>
            <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
              Tip: Shift + Enter for new line • ⌘K for Command Palette
            </span>
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="px-5 py-2 text-xs font-extrabold text-white rounded-full flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)' }}
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
