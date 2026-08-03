"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Layers,
  BarChart3,
  Bot,
  Globe2,
  Calendar,
  FolderOpen,
  FileText,
  ArrowRight,
  Volume2,
  VolumeX,
  CheckCircle2,
  Send,
  Download,
  ShieldCheck,
  Play,
  TrendingUp,
} from "lucide-react";
import { socialPulseApi } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

interface SceneOverlaysProps {
  progress: number;
}

export const SceneOverlays: React.FC<SceneOverlaysProps> = ({ progress }) => {
  const { setCurrentView } = useAppStore();

  // Ambient Audio State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // AI Studio State (Scene 5)
  const [prompt, setPrompt] = useState("Generate viral prompt for product launch campaign");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Analytics Metrics State (Scene 4)
  const [metrics, setMetrics] = useState({
    followers: 25640,
    reach: "1.24M",
    engagement: "8.45%",
    posts: 120,
  });

  // Scheduled Posts State (Scene 7)
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);

  // Hydrate live backend endpoints
  useEffect(() => {
    async function loadData() {
      const overview = await socialPulseApi.getOverviewMetrics();
      if (overview) {
        setMetrics({
          followers: overview.totalFollowers || 25640,
          reach: `${(overview.monthlyReach / 1000000).toFixed(2)}M`,
          engagement: `${overview.engagementRate}%`,
          posts: overview.totalPosts || 120,
        });
      }
      const posts = await socialPulseApi.getScheduledPosts();
      if (posts) {
        setScheduledPosts(posts);
      }
    }
    loadData();
  }, []);

  const handleGenerateCaption = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setAiResponse(null);

    const res = await socialPulseApi.generateCaption({ prompt });
    setIsGenerating(false);
    setAiResponse(res.caption);
    toast.success("AI Caption generated!");
  };

  const handleExportReport = async (format: "pdf" | "csv" | "excel") => {
    toast.loading(`Generating ${format.toUpperCase()} executive report...`);
    const res = await socialPulseApi.generateReport(format, "Last 30 Days");
    toast.dismiss();
    toast.success(`Downloaded ${res.filename}`);
  };

  return (
    <div className="relative w-full h-full pointer-events-none z-10 flex flex-col justify-between p-6 sm:p-12 text-white">
      {/* Top Ambient HUD Bar */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-2xl border border-amber-500/25 px-4 py-2 rounded-full shadow-[0_0_30px_rgba(255,215,0,0.15)]">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold text-amber-300 uppercase tracking-widest">
            {progress < 0.1
              ? "Scene 01 // Revealing Essence"
              : progress < 0.2
              ? "Scene 02 // UI Fragment Orbit"
              : progress < 0.3
              ? "Scene 03 // Dashboard Assembly"
              : progress < 0.4
              ? "Scene 04 // Software Layer Dive"
              : progress < 0.5
              ? "Scene 05 // AI Studio"
              : progress < 0.6
              ? "Scene 06 // Analytics Data World"
              : progress < 0.7
              ? "Scene 07 // Holographic Scheduler"
              : progress < 0.8
              ? "Scene 08 // Media Cosmos"
              : progress < 0.9
              ? "Scene 09 // Executive Reports"
              : "Scene 10 // Re-Convergence"}
          </span>
        </div>

        {/* Ambient Audio Toggle */}
        <button
          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
          className="flex items-center space-x-2 bg-black/60 backdrop-blur-2xl border border-amber-500/30 px-4 py-2 rounded-full text-xs font-medium text-amber-400 hover:border-amber-400 transition-all pointer-events-auto shadow-[0_0_30px_rgba(255,215,0,0.15)]"
        >
          {isPlayingAudio ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          <div className="flex items-end space-x-0.5 h-3">
            {[40, 80, 60, 100, 50].map((h, i) => (
              <div
                key={i}
                className={`w-0.5 bg-amber-400 rounded-full transition-all duration-300 ${
                  isPlayingAudio ? "animate-pulse" : "opacity-30"
                }`}
                style={{ height: isPlayingAudio ? `${h}%` : "20%" }}
              />
            ))}
          </div>
        </button>
      </div>

      {/* CENTER STAGE OVERLAYS */}
      <div className="relative w-full max-w-5xl mx-auto flex-1 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {/* SCENE 1: LOGO & ESSENCE (0.00 - 0.10) */}
          {progress <= 0.1 && (
            <motion.div
              key="scene1"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6 pointer-events-auto"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-500/30 px-5 py-2 rounded-full backdrop-blur-xl">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  Apple & Tesla Level AI OS Launch
                </span>
              </div>

              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-extrabold tracking-tight text-white leading-none">
                SocialPulse{" "}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,215,0,0.5)]">
                  AI
                </span>
              </h1>

              <div className="flex items-center justify-center space-x-6 text-xl sm:text-3xl font-light text-zinc-300">
                <span>Understand.</span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Engage.</span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Grow.</span>
              </div>
            </motion.div>
          )}

          {/* SCENE 2: UI FRAGMENT ORBIT (0.10 - 0.20) */}
          {progress > 0.1 && progress <= 0.2 && (
            <motion.div
              key="scene2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4 pointer-events-auto"
            >
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-amber-400 text-xs font-mono">
                <Zap className="w-3.5 h-3.5" />
                <span>UI FRAGMENT DISPERSION</span>
              </div>
              <h2 className="text-3xl sm:text-6xl font-extrabold text-white">
                Deconstructing into <span className="text-amber-400">Floating Modules</span>
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
                Analytics cards, scheduler queues, media hubs, and AI caption generators float in 3D perspective space.
              </p>
            </motion.div>
          )}

          {/* SCENE 3: DASHBOARD ASSEMBLY (0.20 - 0.30) */}
          {progress > 0.2 && progress <= 0.3 && (
            <motion.div
              key="scene3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl bg-black/75 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-[0_0_50px_rgba(255,215,0,0.15)] pointer-events-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6 text-amber-400" />
                  <div>
                    <h3 className="text-lg font-bold text-white">Assembled Enterprise Dashboard</h3>
                    <p className="text-xs text-zinc-400">Snapping modules together dynamically</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xs text-zinc-400 font-mono">Total Followers</p>
                  <p className="text-2xl font-extrabold text-white mt-1">{metrics.followers.toLocaleString()}</p>
                  <span className="text-[10px] text-emerald-400 font-bold">+12.3% growth</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xs text-zinc-400 font-mono">Monthly Reach</p>
                  <p className="text-2xl font-extrabold text-amber-400 mt-1">{metrics.reach}</p>
                  <span className="text-[10px] text-emerald-400 font-bold">+18.3% reach</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xs text-zinc-400 font-mono">Engagement Rate</p>
                  <p className="text-2xl font-extrabold text-cyan-400 mt-1">{metrics.engagement}</p>
                  <span className="text-[10px] text-cyan-400 font-bold">Top 1% Benchmark</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xs text-zinc-400 font-mono">Scheduled Posts</p>
                  <p className="text-2xl font-extrabold text-purple-400 mt-1">{metrics.posts}</p>
                  <span className="text-[10px] text-purple-400 font-bold">Auto-queued</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* SCENE 4: SOFTWARE LAYER DIVE (0.30 - 0.40) */}
          {progress > 0.3 && progress <= 0.4 && (
            <motion.div
              key="scene4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4 pointer-events-auto"
            >
              <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 rounded-full text-cyan-400 text-xs font-mono">
                <Layers className="w-3.5 h-3.5" />
                <span>TRAVELLING INSIDE SOFTWARE</span>
              </div>
              <h2 className="text-3xl sm:text-6xl font-extrabold text-white">
                Flying Through <span className="text-cyan-400">Application Layers</span>
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
                The dashboard explodes in 3D depth as the camera moves directly into the core AI engines.
              </p>
            </motion.div>
          )}

          {/* SCENE 5: AI STUDIO MORPH (0.40 - 0.50) */}
          {progress > 0.4 && progress <= 0.5 && (
            <motion.div
              key="scene5"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-3xl bg-black/80 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-purple-500/30 shadow-[0_0_50px_rgba(139,92,246,0.2)] pointer-events-auto space-y-6"
            >
              <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
                <Bot className="w-6 h-6 text-purple-400 animate-bounce" />
                <div>
                  <h3 className="text-lg font-bold text-white">AI Studio Streaming Engine</h3>
                  <p className="text-xs text-zinc-400">Real-time campaign caption generation</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter campaign prompt..."
                  className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={handleGenerateCaption}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-amber-500 text-white font-bold rounded-xl text-sm hover:brightness-110 flex items-center gap-2 transition-all shadow-lg"
                >
                  {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Generate</span>
                </button>
              </div>

              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-zinc-200 text-sm leading-relaxed"
                >
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-mono mb-2">
                    <CheckCircle2 className="w-4 h-4" /> AI Generated Stream Output
                  </div>
                  {aiResponse}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* SCENE 6: ANALYTICS WORLD (0.50 - 0.60) */}
          {progress > 0.5 && progress <= 0.6 && (
            <motion.div
              key="scene6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4 pointer-events-auto"
            >
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-mono">
                <Globe2 className="w-3.5 h-3.5" />
                <span>3D DATA MOUNTAINS & AUDIENCE GLOBE</span>
              </div>
              <h2 className="text-3xl sm:text-6xl font-extrabold text-white">
                Data Assembled into <span className="text-emerald-400">Visual Landscapes</span>
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
                Fly low across engagement charts, audience heatmaps, and global follower terrain.
              </p>
            </motion.div>
          )}

          {/* SCENE 7: HOLOGRAPHIC SCHEDULER (0.60 - 0.70) */}
          {progress > 0.6 && progress <= 0.7 && (
            <motion.div
              key="scene7"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl bg-black/80 backdrop-blur-3xl p-6 rounded-3xl border border-cyan-500/30 pointer-events-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Smart Calendar Queue</h3>
                </div>
                <span className="text-xs text-cyan-400 font-mono">Auto-Optimized Posting</span>
              </div>

              <div className="space-y-3">
                {scheduledPosts.map((post, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                        {post.platform}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white line-clamp-1">{post.content}</p>
                        <span className="text-[10px] text-zinc-400">{post.engagementEstimate}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] rounded-full font-mono">
                      {post.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SCENE 8: MEDIA COSMOS (0.70 - 0.80) */}
          {progress > 0.7 && progress <= 0.8 && (
            <motion.div
              key="scene8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4 pointer-events-auto"
            >
              <div className="inline-flex items-center space-x-2 bg-pink-500/10 border border-pink-500/30 px-4 py-1.5 rounded-full text-pink-400 text-xs font-mono">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>INTELLIGENT MEDIA COSMOS</span>
              </div>
              <h2 className="text-3xl sm:text-6xl font-extrabold text-white">
                Media Assets <span className="text-pink-400">Arrange Themselves</span>
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
                Smart asset management with visual search, automated background removal, and instant aspect ratio resizing.
              </p>
            </motion.div>
          )}

          {/* SCENE 9: REPORT SYNTHESIS (0.80 - 0.90) */}
          {progress > 0.8 && progress <= 0.9 && (
            <motion.div
              key="scene9"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl bg-black/80 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-amber-500/30 pointer-events-auto text-center space-y-6"
            >
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-amber-400 text-xs font-mono">
                <FileText className="w-3.5 h-3.5" />
                <span>EXECUTIVE REPORT BINDER</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Assembling <span className="text-amber-400">Executive Reports</span>
              </h2>

              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => handleExportReport("pdf")}
                  className="px-5 py-3 bg-red-500/20 border border-red-500/40 text-red-300 font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-red-500/30 transition-all shadow-lg"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button
                  onClick={() => handleExportReport("excel")}
                  className="px-5 py-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-emerald-500/30 transition-all shadow-lg"
                >
                  <Download className="w-4 h-4" /> Export Excel
                </button>
                <button
                  onClick={() => handleExportReport("csv")}
                  className="px-5 py-3 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-cyan-500/30 transition-all shadow-lg"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
            </motion.div>
          )}

          {/* SCENE 10: RE-CONVERGENCE & ACTION (0.90 - 1.00) */}
          {progress > 0.9 && (
            <motion.div
              key="scene10"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8 pointer-events-auto"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-amber-400/20 border border-amber-500/40 px-5 py-2 rounded-full backdrop-blur-xl">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  Fortune 500 Enterprise Ready
                </span>
              </div>

              <h2 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white tracking-tight">
                Understand. Engage.{" "}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  Grow.
                </span>
              </h2>

              <p className="max-w-xl mx-auto text-zinc-400 text-base sm:text-lg font-light">
                Step into the future of social media intelligence with SocialPulse AI.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentView("overview")}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold rounded-2xl text-base shadow-[0_0_40px_rgba(255,215,0,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-3"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentView("ai-studio")}
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-2xl text-base hover:bg-white/10 transition-all backdrop-blur-xl"
                >
                  Schedule Demo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM SCROLL PROGRESS BAR */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between pt-6 border-t border-white/10 pointer-events-auto">
        <div className="flex items-center space-x-3 text-xs font-mono text-zinc-400">
          <span className="text-amber-400 font-bold">{(progress * 100).toFixed(0)}%</span>
          <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-150"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-zinc-500 font-mono hidden sm:block">Scroll to direct the cinematic experience</span>
      </div>
    </div>
  );
};
