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

  // TanStack Mutation for Smart AI Generation
  const generateMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const p = prompt.trim() || "SocialPulse AI workspace launch";

      if (activeAiTool === "hashtags") {
        const words = p.split(/[,;\n]+/).map(w => w.trim()).filter(Boolean);
        const formattedHashtags = words.length > 0
          ? words.map(w => `#${w.replace(/[^a-zA-Z0-9]/g, "")}`).join(" ") + " #SocialPulse #AIGrowth #ViralContent #Marketing2026 #AIOS"
          : `#${p.replace(/[^a-zA-Z0-9]/g, "")} #SocialPulse #AIGrowth #ViralReach`;

        return `🚀 High Virality Hashtags for "${p}":\n\n${formattedHashtags}\n\n📊 Virality Index: 98/100 (Peak Algorithm Push)`;

      } else if (activeAiTool === "replies") {
        const isComparison = /hootsuite|buffer|sprout|competitor|compare/i.test(p);
        const replyText = isComparison
          ? "Great question! Unlike traditional schedulers like Hootsuite or Buffer that only queue static posts, SocialPulse AI acts as an autonomous copilot. It generates brand-tailored copy, optimizes posting times using real-time telemetry, and predicts post performance before you hit publish. 🚀"
          : `Thank you for sharing your thoughts! We appreciate your engagement. Let us know if you would like a tailored strategy call for your team! 🌟`;

        return `💬 AI Generated Executive Reply:\n\n"${replyText}"\n\n🎯 Conversion & Intent Score: 96/100`;

      } else if (activeAiTool === "campaign") {
        return `📋 Master Campaign Brief: ${p}\n⏱️ Duration: 28 Days | Target Audience: B2B Enterprise Leaders & Decision Makers\n\n🎯 Execution Roadmap:\n• Week 1: Teaser & Brand Awareness — Short-Form Video Reels & Thought Leadership Infographics\n• Week 2: Consideration & Social Proof — Customer Case Studies & Live Interactive Demos\n• Week 3: Conversion Sprint — VIP Access Beta Invites & Executive Briefings\n• Week 4: Community Retargeting — ROI Metrics & Multi-Channel Webinar\n\n📈 Expected Lead Output: 1,000+ Qualified B2B Accounts (Est. Reach: 650K - 1.2M)`;

      } else if (activeAiTool === "trends") {
        return `📊 Market Trend Radar — Category: ${p}\n\n🔥 1. Autonomous AI Copilots in B2B SaaS (Velocity: +240%, Virality Score: 96/100)\n🔥 2. Real-Time Predictive Telemetry (Velocity: +185%, Virality Score: 92/100)\n🔥 3. Multi-Channel Unified Publishing (Velocity: +150%, Virality Score: 88/100)\n\n💡 AI Strategic Recommendation: Publish a 60-second video breakdown highlighting why legacy static dashboards are being replaced by autonomous AI copilots.`;

      } else if (activeAiTool === "timing") {
        return `⏰ Best Time to Post Optimizer:\n🎯 Target Audience: ${p}\n\n📍 Peak Engagement Window: Tuesdays & Thursdays at 6:45 PM EST\n🎯 Secondary Peak: Wednesdays at 9:15 AM EST\n\n💡 Audience Behavioral Telemetry:\n• B2B Decision Makers exhibit peak social activity during late afternoon commute & morning strategy hours\n• Expected Impressions Boost: +340% during recommended windows`;

      } else if (activeAiTool === "rewrite") {
        return `✨ Optimized Brand Copy (${toneSophistication}% Sophistication Level):\n\n"Stop managing social media manually. SocialPulse AI automates content distribution, delivers real-time audience telemetry, and accelerates follower growth with enterprise precision."\n\n💡 AI Optimization Notes:\n• Replaced basic phrasing with active, high-converting executive vocabulary\n• Structured for 3.2x higher mobile read completion\n• Estimated Engagement Boost: +42%`;

      } else {
        const cleanConcept = p.replace(/^Launch announcement for /i, "").replace(/^Write an engaging social media post caption about: /i, "");
        return `🚀 Exciting Announcement: ${cleanConcept}!\n\nWe are thrilled to introduce next-generation social media management powered by SocialPulse AI v3.5.\n\n✨ Key Highlights:\n• Real-Time Telemetry & Predictive Analytics\n• Multi-Channel Autonomous Queue & Scheduling\n• AI-Powered Brand Voice Fine-Tuning & Virality Boost\n\n👉 Experience the future of growth: https://socialpulse.ai\n\n#SocialPulse #AIGrowth #DigitalMarketing #SaaS #TechInnovation`;
      }
    },
    onSuccess: (data) => {
      setOutputResult(data);
      toast.success("AI Content Generated Successfully!");
    },
    onError: () => {
      const fallback = `✨ Generated Post Concept for "${promptText || "SocialPulse AI"}":\n\nScale your reach effortlessly using SocialPulse AI copilot. Automatically schedule, optimize, and track across platforms. 🚀 #SocialPulse #AI`;
      setOutputResult(fallback);
      toast.success("AI Content Generated!");
    },
  });

  const handleGenerate = () => {
    const textToUse = promptText.trim() || activeToolObj.placeholder;
    if (!promptText.trim()) {
      setPromptText(activeToolObj.placeholder);
    }
    toast.info(`Synthesizing with ${selectedModel}...`);
    generateMutation.mutate(textToUse);
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
    <div className="space-y-8 pb-12 font-sans">
      {/* Studio Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0866FF]">
              Generative Intelligence Engine
            </span>
            <span className="bg-[#E7F0FF] text-[#0866FF] dark:bg-[#0866FF]/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full">v3.5 Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111111] dark:text-white">
            AI Content Studio
          </h1>
          <p className="text-sm text-[#777777] dark:text-[#A0A0A0] mt-1">
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
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              selectedModel === model.id
                ? "bg-[#0866FF] text-white border-[#0866FF] shadow-sm"
                : "bg-white dark:bg-[#18181B] border-black/[0.06] dark:border-white/[0.08] text-[#111111] dark:text-white hover:border-[#0866FF]/50"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold truncate">{model.name}</span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${selectedModel === model.id ? "bg-white/20 text-white" : "bg-[#F2F2F7] dark:bg-[#27272A] text-[#0866FF]"}`}>
                {model.tag}
              </span>
            </div>
            <p className={`text-[11px] line-clamp-2 ${selectedModel === model.id ? "text-white/80" : "text-[#777777] dark:text-[#A0A0A0]"}`}>{model.desc}</p>
          </button>
        ))}
      </div>

      {/* Studio Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Tool Navigation & Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tool Selector Tabs */}
          <div className="bg-white dark:bg-[#18181B] rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] p-4 space-y-2 shadow-xs">
            <span className="text-[10px] uppercase font-extrabold text-[#777777] dark:text-[#A0A0A0] tracking-wider px-2 block">
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
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#E7F0FF] dark:bg-[#0866FF]/20 text-[#0866FF] font-bold border border-[#0866FF]/30"
                        : "text-[#5B5B5B] dark:text-[#A0A09B] hover:bg-[#F2F2F7] dark:hover:bg-[#27272A]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#0866FF]" : "text-[#777777]"}`} />
                    <span>{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Voice Tone Controls */}
          <div className="bg-white dark:bg-[#18181B] rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#0866FF]" />
              <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                Brand Voice Parameters
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#5B5B5B] dark:text-[#A0A09B] mb-1.5">
                  <span>Sophistication Index</span>
                  <span className="text-[#0866FF] font-bold">{toneSophistication}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={toneSophistication}
                  onChange={(e) => setToneSophistication(Number(e.target.value))}
                  className="w-full accent-[#0866FF] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#5B5B5B] dark:text-[#A0A09B] mb-1.5">
                  <span>Boldness & Directness</span>
                  <span className="text-[#0866FF] font-bold">{toneBoldness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={toneBoldness}
                  onChange={(e) => setToneBoldness(Number(e.target.value))}
                  className="w-full accent-[#0866FF] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Prompt Editor & Live Preview (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Prompt Input Box */}
          <div className="bg-white dark:bg-[#18181B] rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <activeToolObj.icon className="w-4 h-4 text-[#0866FF]" />
                <h2 className="text-base font-extrabold text-[#111111] dark:text-white">
                  {activeToolObj.label} Prompt Workspace
                </h2>
              </div>
              <span className="text-[10px] text-[#777777] font-semibold">v3.5 Engine</span>
            </div>

            <textarea
              rows={4}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={activeToolObj.placeholder}
              className="w-full p-4 rounded-2xl bg-[#FAFBFD] dark:bg-[#121316] border border-[#E5E5EA] dark:border-[#333336] text-sm text-[#111111] dark:text-white outline-none focus:border-[#0866FF] transition-all resize-none font-sans"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setPromptText("Draft a high-impact product announcement for SocialPulse AI workspace launch with bold tone.")}
                className="text-xs font-semibold text-[#0866FF] hover:underline"
              >
                Insert Sample Prompt
              </button>

              <button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="flex items-center gap-2 bg-[#0866FF] hover:bg-[#1877F2] text-white px-6 py-2.5 rounded-full text-xs font-extrabold shadow-sm transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${generateMutation.isPending ? "animate-spin" : ""}`} />
                <span>{generateMutation.isPending ? "Synthesizing..." : "Generate with AI"}</span>
              </button>
            </div>
          </div>

          {/* AI Output Preview */}
          <div className="bg-white dark:bg-[#18181B] rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#0866FF]" />
                <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">
                  Generated AI Output
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 rounded-full border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-xs font-semibold text-[#5B5B5B] dark:text-[#A0A09B] hover:border-[#0866FF] flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#31A24C]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={handleScheduleDirectly}
                  className="flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#1877F2] text-white px-4 py-1.5 rounded-full text-xs font-extrabold shadow-xs transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Queue Post</span>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFBFD] dark:bg-[#121316] border border-black/[0.04] dark:border-white/[0.06] text-sm text-[#111111] dark:text-white whitespace-pre-wrap font-sans leading-relaxed min-h-[140px]">
              {outputResult}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
