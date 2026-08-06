"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Trophy,
  Flame,
  Zap,
  Star,
  Users,
  Eye,
  TrendingUp,
  BarChart3,
  Share2,
  Download,
  Filter,
  RefreshCw,
  Sparkles,
  Play,
  MessageSquare,
  Heart,
  ExternalLink,
  Layers,
  FileSpreadsheet,
  FileText,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";
import { socialPulseApi } from "@/lib/api";

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#E1306C",
  linkedin: "#0A66C2",
  youtube: "#FF0000",
  facebook: "#1877F2",
  tiktok: "#00F2FE",
  twitter: "#1DA1F2",
  x: "#1DA1F2",
  pinterest: "#E60023",
  threads: "#A0A0A0",
};

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📸",
  linkedin: "💼",
  youtube: "🎥",
  facebook: "📘",
  tiktok: "🎵",
  twitter: "🐦",
  x: "𝕏",
  pinterest: "📌",
  threads: "🧵",
};

export function CompareAnalyticsView() {
  const [timeframe, setTimeframe] = useState("30d");
  const [compareData, setCompareData] = useState<any>(null);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [formatData, setFormatData] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [comp, posts, formats, insights] = await Promise.all([
        socialPulseApi.getMultiPlatformComparison(timeframe),
        socialPulseApi.getTopCombinedPosts(100),
        socialPulseApi.getContentFormatPerformance(),
        socialPulseApi.getAIComparisonInsights(),
      ]);
      setCompareData(comp);
      setTopPosts(posts || []);
      setFormatData(formats);
      setAiInsights(insights || []);
    } catch {
      toast.error("Failed to load multi-platform comparison telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeframe]);

  const handleExport = async (format: string) => {
    toast.loading(`Generating ${format.toUpperCase()} export report...`, { id: "export" });
    const res = await socialPulseApi.exportAnalyticsData(format);
    toast.success(`${format.toUpperCase()} report generated successfully!`, { id: "export" });
  };

  if (loading || !compareData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <RefreshCw className="w-8 h-8 text-[#0866FF] animate-spin" />
      </div>
    );
  }

  const accounts = compareData.accounts || [];
  const badges = compareData.badges || {};

  // Construct chart series
  const lineChartData = [
    { day: "Week 1", instagram: 24200, linkedin: 8100, youtube: 5400, tiktok: 52000, facebook: 18900, twitter: 3950 },
    { day: "Week 2", instagram: 24800, linkedin: 8250, youtube: 5600, tiktok: 55400, facebook: 19050, twitter: 4010 },
    { day: "Week 3", instagram: 25100, linkedin: 8350, youtube: 5750, tiktok: 58900, facebook: 19150, twitter: 4060 },
    { day: "Week 4", instagram: 25430, linkedin: 8420, youtube: 5920, tiktok: 61200, facebook: 19200, twitter: 4100 },
  ];

  const pieChartData = accounts.map((a: any) => ({
    name: a.platform.toUpperCase(),
    value: a.metrics.followers,
    color: PLATFORM_COLORS[a.platform] || "#8884d8",
  }));

  const radarChartData = accounts.slice(0, 6).map((a: any) => ({
    platform: a.platform.toUpperCase(),
    engagement: a.metrics.engagement_rate * 10,
    growth: a.metrics.growth_rate * 8,
    reach: Math.round(a.metrics.reach / 10000),
  }));

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-[#0866FF]" />
            <h1 className="text-3xl font-black text-[#050505] dark:text-[#E4E6EB] tracking-tight">
              Multi-Platform Compare Analytics
            </h1>
          </div>
          <p className="text-[14px] text-[#65676B] dark:text-[#B0B3B8] mt-1">
            Normalized side-by-side comparison across <strong>YouTube, Instagram, Facebook, Threads, LinkedIn, X, TikTok, Pinterest</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex bg-[#FAFBFD] dark:bg-[#121316] p-1 rounded-2xl border border-black/5 dark:border-white/10 text-xs font-bold">
            {["7d", "30d", "90d", "1y"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  timeframe === t
                    ? "bg-[#0866FF] text-white shadow-xs"
                    : "text-[#65676B] dark:text-[#B0B3B8] hover:text-[#050505]"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Export Dropdown */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 p-1 rounded-2xl">
            <button
              onClick={() => handleExport("csv")}
              className="p-2 hover:bg-[#F0F2F5] dark:hover:bg-white/10 rounded-xl text-[#65676B] title='Export CSV'"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="p-2 hover:bg-[#F0F2F5] dark:hover:bg-white/10 rounded-xl text-[#65676B] title='Export PDF'"
            >
              <FileText className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Platform Leaderboard Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">🏆 Highest Growth Rate</span>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#050505] dark:text-[#E4E6EB] capitalize">
              {PLATFORM_ICONS[badges.highest_growth?.platform] || "🚀"} {badges.highest_growth?.platform}
            </span>
          </div>
          <p className="text-xs font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {badges.highest_growth?.value} monthly follower growth
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-500/5 border border-rose-500/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">🔥 Highest Engagement</span>
            <Flame className="w-5 h-5 text-rose-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#050505] dark:text-[#E4E6EB] capitalize">
              {PLATFORM_ICONS[badges.highest_engagement?.platform] || "🔥"} {badges.highest_engagement?.platform}
            </span>
          </div>
          <p className="text-xs font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {badges.highest_engagement?.value} average engagement rate
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">🚀 Fastest Growing</span>
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#050505] dark:text-[#E4E6EB] capitalize">
              {PLATFORM_ICONS[badges.fastest_growing?.platform] || "⚡"} {badges.fastest_growing?.platform}
            </span>
          </div>
          <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {badges.fastest_growing?.value} total audience
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">⭐ Best Overall Reach</span>
            <Star className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#050505] dark:text-[#E4E6EB] capitalize">
              {PLATFORM_ICONS[badges.best_performing?.platform] || "⭐"} {badges.best_performing?.platform}
            </span>
          </div>
          <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {badges.best_performing?.value} monthly reach
          </p>
        </div>
      </div>

      {/* Side-by-Side Platform Comparison Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#050505] dark:text-[#E4E6EB] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0866FF]" /> Normalized Provider Comparison Matrix
          </h2>
          <span className="text-xs text-[#65676B]">{accounts.length} Platforms Normalized</span>
        </div>

        <div className="overflow-x-auto border border-black/5 dark:border-white/10 rounded-2xl">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#FAFBFD] dark:bg-[#121316] text-[#65676B] dark:text-[#B0B3B8] font-extrabold uppercase border-b border-black/5 dark:border-white/10">
              <tr>
                <th className="p-4">Platform</th>
                <th className="p-4">Status</th>
                <th className="p-4">Followers / Audience</th>
                <th className="p-4">Growth %</th>
                <th className="p-4">Monthly Reach</th>
                <th className="p-4">Video Views</th>
                <th className="p-4">Engagement %</th>
                <th className="p-4">Posts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10 text-[#050505] dark:text-[#E4E6EB]">
              {accounts.map((acc: any) => (
                <tr key={acc.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  <td className="p-4 flex items-center gap-3">
                    <span className="text-xl">{PLATFORM_ICONS[acc.platform] || "🌐"}</span>
                    <div>
                      <div className="font-extrabold capitalize text-sm">{acc.platform}</div>
                      <div className="text-[11px] text-[#65676B] dark:text-[#B0B3B8]">{acc.account_handle}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    {acc.connected ? (
                      <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-500/20 rounded-full">
                        Connected ✓
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-[11px] font-bold text-gray-500 bg-gray-100 dark:bg-white/10 rounded-full">
                        Benchmark
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-black text-sm">{acc.metrics.followers.toLocaleString()}</td>
                  <td className="p-4 font-bold text-emerald-600">+{acc.metrics.growth_rate}%</td>
                  <td className="p-4 font-semibold">{acc.metrics.reach.toLocaleString()}</td>
                  <td className="p-4 font-semibold">{acc.metrics.video_views.toLocaleString()}</td>
                  <td className="p-4 font-extrabold text-[#0866FF]">{acc.metrics.engagement_rate}%</td>
                  <td className="p-4 font-semibold">{acc.metrics.posts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Followers Growth Comparison */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#050505] dark:text-[#E4E6EB]">
            Followers Growth Comparison
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tiktok" stroke={PLATFORM_COLORS.tiktok} strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="instagram" stroke={PLATFORM_COLORS.instagram} strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="facebook" stroke={PLATFORM_COLORS.facebook} strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="linkedin" stroke={PLATFORM_COLORS.linkedin} strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="youtube" stroke={PLATFORM_COLORS.youtube} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audience Share Distribution */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#050505] dark:text-[#E4E6EB]">
            Audience Distribution (Donut Chart)
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value">
                  {pieChartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Rate Radar Comparison */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#050505] dark:text-[#E4E6EB]">
            Engagement & Growth Radar
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarChartData}>
                <PolarGrid opacity={0.2} />
                <PolarAngleAxis dataKey="platform" fontSize={11} />
                <PolarRadiusAxis />
                <Radar name="Engagement %" dataKey="engagement" stroke="#0866FF" fill="#0866FF" fillOpacity={0.4} />
                <Radar name="Growth Index" dataKey="growth" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Format Matrix */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#050505] dark:text-[#E4E6EB]">
            Content Format Performance Breakdown
          </h3>
          <div className="space-y-3 pt-1">
            {formatData?.format_comparison?.map((fmt: any, i: number) => (
              <div key={i} className="p-3.5 rounded-xl border border-black/5 dark:border-white/10 bg-[#FAFBFD] dark:bg-[#121316] flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-[#050505] dark:text-[#E4E6EB]">{fmt.format}</div>
                  <div className="text-[11px] text-[#65676B]">Best Channel: {fmt.best_provider} • Avg Reach: {fmt.avg_reach}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-emerald-600">{fmt.avg_engagement}</div>
                  <div className="text-[10px] font-bold text-[#888]">Index: {fmt.performance_index}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 100 Combined Posts */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#050505] dark:text-[#E4E6EB] flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" /> Combined Multi-Platform Top Posts
          </h2>
          <span className="text-xs text-[#65676B]">Sorted by Engagement Rate</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-2">
          {topPosts.map((post: any) => (
            <div
              key={post.id}
              className="p-4 rounded-2xl border border-black/5 dark:border-white/10 bg-[#FAFBFD] dark:bg-[#121316] flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start gap-3">
                {post.thumbnail && (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-black/10"
                  />
                )}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{PLATFORM_ICONS[post.platform] || "📌"}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white dark:bg-white/10 border border-black/5 text-[#050505] dark:text-[#E4E6EB]">
                      {post.platform}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-[#050505] dark:text-[#E4E6EB] line-clamp-2">{post.title}</h4>
                </div>
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] text-[#65676B] dark:text-[#B0B3B8] font-bold">
                <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-500" /> {post.metrics.likes.toLocaleString()}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-blue-500" /> {post.metrics.comments.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Play className="w-3 h-3 text-emerald-500" /> {post.metrics.views.toLocaleString()}</span>
                <span className="text-emerald-600 font-black">{post.metrics.engagement_rate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Cross-Platform Comparison Insights */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 border border-blue-500/20 shadow-xs space-y-4">
        <h2 className="text-lg font-extrabold text-[#050505] dark:text-[#E4E6EB] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#0866FF]" /> Automated AI Multi-Platform Insights
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {aiInsights.map((ins: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 space-y-1">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-[#0866FF]">
                {ins.type} • Impact: {ins.impact}
              </span>
              <p className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] mt-1">{ins.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
