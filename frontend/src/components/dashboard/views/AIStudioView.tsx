"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { socialPulseApi } from "@/lib/api";
import {
  Sparkles,
  Bot,
  Wand2,
  Hash,
  RefreshCw,
  Target,
  TrendingUp,
  Clock,
  MessageSquare,
  Copy,
  Check,
  Send,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";

const aiModels = [
  { id: "sp-v3", name: "SocialPulse Fine-Tuned v3.5", desc: "Best for brand voice consistency & viral hooks", tag: "RECOMMENDED" },
  { id: "gpt-4o", name: "OpenAI GPT-4o", desc: "High reasoning, multi-language nuance", tag: "FAST" },
  { id: "claude-35", name: "Anthropic Claude 3.5 Sonnet", desc: "Editorial polish, long-form depth", tag: "LUXURY" },
  { id: "deepseek-v3", name: "DeepSeek V3 Analytics", desc: "Quantitative trend analysis & data extraction", tag: "ANALYTICS" },
];

const studioTools = [
  { id: "caption", label: "Caption Generator", icon: Wand2, placeholder: "Describe your post concept or product release..." },
  { id: "hashtags", label: "Viral Hashtags", icon: Hash, placeholder: "Enter niche keywords (e.g. AI SaaS, FinTech, Luxury design)..." },
  { id: "rewrite", label: "Content Rewrite", icon: RefreshCw, placeholder: "Paste existing text to rewrite into sophisticated brand voice..." },
  { id: "campaign", label: "Campaign Brief Builder", icon: Target, placeholder: "Outline your multi-week marketing campaign goals..." },
  { id: "trends", label: "Trend Predictor", icon: TrendingUp, placeholder: "Analyze rising industry trends in Q3 2026..." },
  { id: "timing", label: "Best Time Optimizer", icon: Clock, placeholder: "Target demographic location (e.g. US Tech Founders)..." },
  { id: "replies", label: "Auto-Reply Generator", icon: MessageSquare, placeholder: "Paste user comment or inquiry..." },
];

export const AIStudioView: React.FC = () => {
  const { activeAiTool, setActiveAiTool, addPost, setCurrentView } = useAppStore();
  const [selectedModel, setSelectedModel] = useState("sp-v3");
  const [promptText, setPromptText] = useState("");
  const [toneSophistication, setToneSophistication] = useState(85);
  const [toneBoldness, setToneBoldness] = useState(70);
  const [outputResult, setOutputResult] = useState<string>(
    "✨ Select an AI tool, enter your prompt, and click 'Generate with AI' to experience SocialPulse AI v3.5."
  );
  const [copied, setCopied] = useState(false);

  const activeToolObj = studioTools.find((t) => t.id === activeAiTool) || studioTools[0];

  // TanStack Mutation for Fully Dynamic AI Generation
  const generateMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const p = prompt.trim() || "SocialPulse AI workspace launch";

      if (activeAiTool === "hashtags") {
        const res = await socialPulseApi.generateHashtags({ topic: p });
        return Array.isArray(res) ? res.join(" ") : (res.hashtags ? res.hashtags.join(" ") : "#AI #SocialPulse #Growth");
      }
      if (activeAiTool === "rewrite") {
        const res = await socialPulseApi.optimizeContent(p);
        return res.optimizedContent || p;
      }
      if (activeAiTool === "trends") {
        const res = await socialPulseApi.detectTrends("Enterprise SaaS");
        return Array.isArray(res.trendingTopics)
          ? res.trendingTopics.map((t: any) => `• ${t.name}: ${t.velocity} velocity (${t.viralityScore}% score)`).join("\n")
          : "• AI Agents in Enterprise: +94% surge\n• Real-Time Telemetry Dashboards: +82% volume";
      }

      // Default Caption Generator API Call
      const res = await socialPulseApi.generateCaption({
        prompt: p,
        platform: "LinkedIn",
        tone: toneSophistication > 80 ? "Sophisticated & Authoritative" : "Conversational",
      });

      return (
        res.caption ||
        res.content ||
        `🚀 Unpacking the future of enterprise media intelligence. Built with fine-tuned models trained on 100M+ viral posts.\n\nKey takeaways:\n1. Real-time API telemetry across 8 channels\n2. Zero guesswork publishing\n3. Enterprise security & encryption\n\n#AI #SocialPulse #Growth #Enterprise`
      );
    },
    onSuccess: (data) => {
      setOutputResult(data);
      toast.success("AI Generation Complete!");
    },
    onError: () => {
      toast.error("Failed to generate content. Using fallback generator.");
      setOutputResult(
        `🚀 Unpacking the future of enterprise media intelligence with SocialPulse AI v3.5.\n\n• Real-time provider API sync\n• Autonomous queue management\n• Sophistication index: ${toneSophistication}%\n\n#AI #Growth #Enterprise`
      );
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate(promptText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScheduleDirectly = () => {
    addPost({
      id: `post-${Date.now()}`,
      title: promptText.slice(0, 40) || "AI Generated Content",
      content: outputResult,
      platform: "LinkedIn",
      status: "Scheduled",
      scheduledTime: "Tomorrow at 10:00 AM",
      impressions: "--",
      engagement: "--",
      likes: 0,
      comments: 0,
      shares: 0,
    });
    toast.success("Queued directly into Content Calendar!");
    setCurrentView("posts");
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6"
        style={{ borderBottom: '1px solid var(--card-border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#C8A14A' }}>
              Generative Intelligence Engine
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: '#C8A14A' }}>v3.5 Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            AI Content Studio
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Draft, refine, and optimize multi-platform social media campaigns with fine-tuned brand LLMs.
          </p>
        </div>
      </motion.div>

      {/* Model Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {aiModels.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            className="p-4 rounded-2xl border text-left transition-all relative"
            style={{
              background: selectedModel === model.id ? '#C8A14A' : 'var(--card-bg)',
              borderColor: selectedModel === model.id ? '#C8A14A' : 'var(--card-border)',
              color: selectedModel === model.id ? '#FFFFFF' : 'var(--text-primary)',
              boxShadow: selectedModel === model.id ? '0 4px 16px rgba(200,161,74,0.25)' : 'none',
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold truncate">{model.name}</span>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: selectedModel === model.id ? 'rgba(255,255,255,0.2)' : 'var(--accent-light)', color: selectedModel === model.id ? '#FFFFFF' : '#C8A14A' }}>
                {model.tag}
              </span>
            </div>
            <p className="text-[11px] line-clamp-2" style={{ color: selectedModel === model.id ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)' }}>{model.desc}</p>
          </button>
        ))}
      </div>

      {/* Studio Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Tool Navigation & Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tool Selector Tabs */}
          <div className="rounded-[28px] p-4 space-y-2 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 block" style={{ color: 'var(--text-muted)' }}>
              Specialized AI Generators
            </span>
            <div className="space-y-1">
              {studioTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeAiTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setActiveAiTool(tool.id);
                      setPromptText("");
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: isActive ? 'var(--accent-light)' : 'transparent',
                      color: isActive ? '#C8A14A' : 'var(--text-secondary)',
                      border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: isActive ? '#C8A14A' : 'var(--text-muted)' }} />
                    <span>{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Voice Tone Controls */}
          <div className="rounded-[28px] p-5 space-y-4 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4" style={{ color: '#C8A14A' }} />
              <h3 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                Brand Voice Parameters
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <span>Sophistication Index</span>
                  <span className="font-bold" style={{ color: '#C8A14A' }}>{toneSophistication}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={toneSophistication}
                  onChange={(e) => setToneSophistication(Number(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: '#C8A14A' }}
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <span>Boldness & Directness</span>
                  <span className="font-bold" style={{ color: '#C8A14A' }}>{toneBoldness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={toneBoldness}
                  onChange={(e) => setToneBoldness(Number(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: '#C8A14A' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Prompt Editor & Live Preview (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Prompt Input Box */}
          <div className="rounded-[28px] p-6 space-y-4 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <activeToolObj.icon className="w-4 h-4" style={{ color: '#C8A14A' }} />
                <h2 className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  {activeToolObj.label} Prompt Workspace
                </h2>
              </div>
              <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>v3.5 Engine</span>
            </div>

            <textarea
              rows={4}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={activeToolObj.placeholder}
              className="w-full p-4 rounded-2xl text-sm outline-none transition-all resize-none font-sans"
              style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#C8A14A'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setPromptText("Draft a high-impact product announcement for SocialPulse AI workspace launch with bold tone.")}
                className="text-xs font-semibold hover:underline"
                style={{ color: '#C8A14A' }}
              >
                Insert Sample Prompt
              </button>

              <button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="flex items-center gap-2 text-white px-6 py-2.5 rounded-full text-xs font-extrabold shadow-sm transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)', boxShadow: '0 4px 12px rgba(200,161,74,0.25)' }}
              >
                <Sparkles className={`w-4 h-4 ${generateMutation.isPending ? "animate-spin" : ""}`} />
                <span>{generateMutation.isPending ? "Synthesizing..." : "Generate with AI"}</span>
              </button>
            </div>
          </div>

          {/* AI Output Preview */}
          <div className="rounded-[28px] p-6 space-y-4 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--card-border)' }}>
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" style={{ color: '#C8A14A' }} />
                <h3 className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  Generated AI Output
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
                  style={{ border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-secondary)' }}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={handleScheduleDirectly}
                  className="flex items-center gap-1.5 text-white px-4 py-1.5 rounded-full text-xs font-extrabold shadow-xs transition-all"
                  style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)' }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Queue Post</span>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl border text-sm whitespace-pre-wrap font-sans leading-relaxed min-h-[140px]" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
              {outputResult}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
