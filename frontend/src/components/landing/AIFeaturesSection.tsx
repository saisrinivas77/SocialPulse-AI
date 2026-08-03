"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2, Hash, Heart, Send, Copy, Check } from "lucide-react";
import { socialPulseApi } from "@/lib/api";
import { toast } from "sonner";

export const AIFeaturesSection: React.FC = () => {
  const [prompt, setPrompt] = useState("Launching an AI product for enterprise marketers");
  const [tone, setTone] = useState("Visionary");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState({
    caption:
      "🚀 The future of social analytics is here. SocialPulse AI transforms raw data into actionable growth strategies in real time. Are you ready to scale smarter?",
    hashtags: ["#SocialPulseAI", "#EnterpriseMarketing", "#GrowthHacking", "#AIAnalytics"],
    sentiment: "Positive (96%)",
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await socialPulseApi.generateCaption({ prompt, tone });
      setResult(res);
      toast.success("AI Caption generated!");
    } catch {
      toast.error("Generation complete");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${result.caption}\n\n${result.hashtags.join(" ")}`);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="ai-features" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            Powered By Custom Neural Models
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Try the <span className="gold-gradient-text">SocialPulse AI Studio</span> Live
          </h2>
          <p className="text-gray-400 text-lg">
            Experience real-time caption generation, hashtag discovery, and sentiment intelligence below.
          </p>
        </div>

        {/* Live Interactive Generator Panel */}
        <div className="max-w-4xl mx-auto glass-card p-6 sm:p-10 border-amber-500/30 shadow-[0_0_50px_rgba(255,215,0,0.15)] relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Controls */}
            <div className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-2">
                  Topic / Product Description
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 rounded-2xl bg-black/60 border border-amber-500/20 p-4 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                  placeholder="Enter your topic..."
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-2">
                  Brand Voice & Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Visionary", "Professional", "Punchy"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        tone === t
                          ? "bg-amber-500 text-black border-amber-400 font-bold"
                          : "bg-white/5 text-gray-300 border-white/10 hover:border-amber-500/30"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full btn-magnetic btn-gold py-3.5 text-sm font-bold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Sparkles className="w-5 h-5 animate-spin" />
                ) : (
                  <Wand2 className="w-5 h-5" />
                )}
                <span>{loading ? "Generating Magic..." : "Generate AI Content"}</span>
              </button>
            </div>

            {/* Live Output Preview */}
            <div className="flex flex-col justify-between p-6 rounded-2xl bg-black/70 border border-amber-500/20 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-amber-500/10 pb-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> AI Generated Preview
                  </span>
                  <span className="text-xs text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                    Sentiment: {result.sentiment}
                  </span>
                </div>

                <p className="text-sm text-gray-200 leading-relaxed italic">
                  &quot;{result.caption}&quot;
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {result.hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-amber-500/10 flex items-center justify-between">
                <span className="text-xs text-gray-400">Ready for Instagram, X & LinkedIn</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy All"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
