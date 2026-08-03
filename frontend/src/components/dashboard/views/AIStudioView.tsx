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
  const [outputResult, setOutputResult] = useState<string | null>(
    "✨ Press 'Generate with AI' to experience SocialPulse AI v3.5 output."
  );
  const [copied, setCopied] = useState(false);

  const activeToolObj = studioTools.find((t) => t.id === activeAiTool) || studioTools[0];

  // TanStack Mutation for Live AI Generation
  const generateMutation = useMutation({
    mutationFn: async (prompt: string) => {
      if (activeAiTool === "hashtags") {
        const res = await socialPulseApi.generateHashtags({ topic: prompt });
        return res.hashtags ? res.hashtags.join(" ") : "No hashtags generated";
      } else if (activeAiTool === "replies") {
        const res = await socialPulseApi.generateReply({ comment: prompt });
        return res.reply;
      } else if (activeAiTool === "campaign") {
        const res = await socialPulseApi.planCampaign({ objective: prompt, audience: "Enterprise Leaders", durationDays: 14 });
        return `${res.campaignTitle}\nEstimated Reach: ${res.estimatedReach}\nPhases:\n${res.phases?.map((p: any) => `- ${p.phase} (${p.focus})`).join("\n")}`;
      } else {
        const res = await socialPulseApi.generateCaption({ prompt, tone: `${toneSophistication}% sophistication` });
        return res.caption;
      }
    },
    onSuccess: (data) => {
      setOutputResult(data);
      toast.success("AI Content Generated Successfully!");
    },
    onError: (err: any) => {
      toast.error(`Generation failed: ${err.message || "Server error"}`);
    },
  });

  const handleGenerate = () => {
    if (!promptText.trim()) {
      toast.error("Please enter a prompt or concept description");
      return;
    }
    toast.info(`Synthesizing with ${selectedModel}...`);
    generateMutation.mutate(promptText);
  };

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    toast.success("Copied output to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScheduleDirectly = () => {
    if (!outputResult) return;
    addPost({
      id: `post-${Date.now()}`,
      title: "AI Studio Generated Post",
      content: outputResult,
      platform: "LinkedIn",
      status: "Scheduled",
      scheduledTime: "Tomorrow at 05:00 PM",
      impressions: "--",
      engagement: "--",
      likes: 0,
      comments: 0,
      shares: 0,
    });
    toast.success("Added directly to Post Scheduler queue!");
    setCurrentView("posts");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Studio Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE8E1] dark:border-[#262623] pb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A14A]">
              Generative Intelligence Engine
            </span>
            <span className="luxury-badge text-[9px] px-2 py-0.5 rounded-full">v3.5 Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-[#FAFAF8]">
            AI Content Studio
          </h1>
          <p className="text-sm text-[#5B5B5B] dark:text-[#A0A09B] mt-1">
            Draft, refine, and optimize multi-platform social media campaigns with custom brand voice LLMs.
          </p>
        </div>
      </motion.div>

      {/* Model Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {aiModels.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              selectedModel === model.id
                ? "bg-[#111111] text-white dark:bg-[#FAFAF8] dark:text-[#111111] border-[#C8A14A] shadow-md"
                : "luxury-card text-[#5B5B5B] dark:text-[#A0A09B] hover:border-[#C8A14A]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold truncate">{model.name}</span>
              <span className="text-[8px] font-extrabold px-2 py-0.5 rounded-full bg-[#C8A14A] text-white">
                {model.tag}
              </span>
            </div>
            <p className="text-[10px] opacity-80 line-clamp-2">{model.desc}</p>
          </button>
        ))}
      </div>

      {/* Studio Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Tool Navigation & Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tool Selector Tabs */}
          <div className="luxury-card p-4 space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider px-2 block">
              Specialized AI Generators
            </span>
            <div className="space-y-1">
              {studioTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeAiTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveAiTool(tool.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#F9F5EC] dark:bg-[#262623] text-[#111111] dark:text-[#FAFAF8] font-bold border border-[#C8A14A]/40"
                        : "text-[#5B5B5B] dark:text-[#A0A09B] hover:bg-[#FAFAF8] dark:hover:bg-[#141413]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#C8A14A]" : "text-[#8A8A8A]"}`} />
                    <span>{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Voice Tone Controls */}
          <div className="luxury-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C8A14A]" />
              <h3 className="text-xs font-bold text-[#111111] dark:text-[#FAFAF8]">
                Brand Voice Parameters
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-[#5B5B5B] dark:text-[#A0A09B] mb-1">
                  <span>Sophistication Index</span>
                  <span className="text-[#C8A14A]">{toneSophistication}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={toneSophistication}
                  onChange={(e) => setToneSophistication(Number(e.target.value))}
                  className="w-full accent-[#C8A14A] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-[#5B5B5B] dark:text-[#A0A09B] mb-1">
                  <span>Boldness & Directness</span>
                  <span className="text-[#C8A14A]">{toneBoldness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={toneBoldness}
                  onChange={(e) => setToneBoldness(Number(e.target.value))}
                  className="w-full accent-[#C8A14A] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Prompt Editor & Live Preview (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Prompt Input Box */}
          <div className="luxury-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <activeToolObj.icon className="w-4 h-4 text-[#C8A14A]" />
                <h2 className="text-base font-bold text-[#111111] dark:text-[#FAFAF8]">
                  {activeToolObj.label} Prompt Workspace
                </h2>
              </div>
              <span className="text-[10px] text-[#8A8A8A]">Markdown Supported</span>
            </div>

            <textarea
              rows={4}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={activeToolObj.placeholder}
              className="w-full p-4 rounded-2xl bg-[#FAFAF8] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] text-sm text-[#111111] dark:text-[#FAFAF8] focus:outline-none focus:border-[#C8A14A] transition-all resize-none"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setPromptText("Draft a high-impact post announcing SocialPulse AI Q3 product update with bold tone.")}
                className="text-xs text-[#8A8A8A] hover:text-[#C8A14A]"
              >
                Insert Sample Prompt
              </button>

              <button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="btn-gold-primary px-6 py-2.5 text-xs flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${generateMutation.isPending ? "animate-spin" : ""}`} />
                <span>{generateMutation.isPending ? "Synthesizing..." : "Generate with AI"}</span>
              </button>
            </div>
          </div>

          {/* AI Output Preview */}
          <div className="luxury-card p-6 space-y-4 bg-gradient-to-b from-[#FAFAF8] to-[#FFFFFF] dark:from-[#141413] dark:to-[#0C0C0B]">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE8E1] dark:border-[#262623]">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#C8A14A]" />
                <h3 className="text-sm font-bold text-[#111111] dark:text-[#FAFAF8]">
                  Generated AI Output
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl border border-[#ECE8E1] dark:border-[#262623] bg-white dark:bg-[#1C1C1A] text-xs font-semibold text-[#5B5B5B] dark:text-[#A0A09B] hover:border-[#C8A14A] flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={handleScheduleDirectly}
                  className="btn-gold-primary px-3 py-1.5 text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Queue Post</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] text-sm text-[#111111] dark:text-[#FAFAF8] whitespace-pre-wrap font-sans leading-relaxed min-h-[140px]">
              {outputResult}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
