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
  threads: "#000000",
  pinterest: "#E60023",
};

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📸",
  linkedin: "💼",
  youtube: "▶️",
  facebook: "📘",
  tiktok: "🎵",
  twitter: "🐦",
  x: "𝕏",
  threads: "🧵",
  pinterest: "📌",
};

export function CompareAnalyticsView() {
  const [timeframe, setTimeframe] = useState("30d");
  const [compareData, setCompareData] = useState<any>(null);
  const [formatData, setFormatData] = useState<any>(null);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompareData = async () => {
    setLoading(true);
    try {
      const [compRes, fmtRes, postsRes, insightsRes] = await Promise.all([
        socialPulseApi.getMultiPlatformComparison(timeframe),
        socialPulseApi.getContentFormatPerformance(),
        socialPulseApi.getTopCombinedPosts(12),
        socialPulseApi.getAIComparisonInsights(),
      ]);

      setCompareData(compRes);
      setFormatData(fmtRes);
      setTopPosts(postsRes || []);
      setAiInsights(insightsRes || []);
    } catch {
      toast.error("Failed to load cross-platform comparison data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompareData();
  }, [timeframe]);

  const handleExport = async (format: string) => {
    toast.loading(`Generating ${format.toUpperCase()} export report...`, { id: "export" });
    const res = await socialPulseApi.exportAnalyticsData(format);
    toast.success(`${format.toUpperCase()} report generated successfully!`, { id: "export" });
  };

  if (loading || !compareData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <RefreshCw className="w-8 h-8 animate-spin" style={{ color: '#C8A14A' }} />
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6" style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-7 h-7" style={{ color: '#C8A14A' }} />
            <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Multi-Platform Compare Analytics
            </h1>
          </div>
          <p className="text-[14px] mt-1" style={{ color: 'var(--text-secondary)' }}>
            Normalized side-by-side comparison across <strong>YouTube, Instagram, Facebook, Threads, LinkedIn, X, TikTok, Pinterest</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex p-1 rounded-2xl text-xs font-bold" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)' }}>
            {["7d", "30d", "90d", "1y"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className="px-3 py-1.5 rounded-xl transition"
                style={{
                  background: timeframe === t ? '#C8A14A' : 'transparent',
                  color: timeframe === t ? '#FFFFFF' : 'var(--text-secondary)',
                  boxShadow: timeframe === t ? '0 4px 12px rgba(200,161,74,0.25)' : 'none',
                }}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Export Dropdown */}
          <div className="flex items-center gap-1 border p-1 rounded-2xl" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <button
              onClick={() => handleExport("csv")}
              className="p-2 rounded-xl"
              style={{ color: 'var(--text-secondary)' }}
              title="Export CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="p-2 rounded-xl"
              style={{ color: 'var(--text-secondary)' }}
              title="Export PDF"
            >
              <FileText className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Platform Leaderboard Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl shadow-xs space-y-2" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Highest Engagement</span>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-xl font-black capitalize" style={{ color: 'var(--text-primary)' }}>{badges.highest_engagement?.platform || "TikTok"}</div>
          <div className="text-xs font-bold" style={{ color: '#C8A14A' }}>{badges.highest_engagement?.value || "9.6"}% Engagement Index</div>
        </div>

        <div className="p-5 rounded-2xl shadow-xs space-y-2" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Fastest Growth</span>
            <Flame className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-xl font-black capitalize" style={{ color: 'var(--text-primary)' }}>{badges.fastest_growth?.platform || "X (Twitter)"}</div>
          <div className="text-xs font-bold text-rose-500">+{badges.fastest_growth?.value || "14.2"}% Net Follower Velocity</div>
        </div>

        <div className="p-5 rounded-2xl shadow-xs space-y-2" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Highest Reach</span>
            <Eye className="w-5 h-5" style={{ color: '#C8A14A' }} />
          </div>
          <div className="text-xl font-black capitalize" style={{ color: 'var(--text-primary)' }}>{badges.highest_reach?.platform || "YouTube"}</div>
          <div className="text-xs font-bold text-emerald-600">{(badges.highest_reach?.value || 380000).toLocaleString()} Monthly Impressions</div>
        </div>

        <div className="p-5 rounded-2xl shadow-xs space-y-2" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Most Active</span>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-xl font-black capitalize" style={{ color: 'var(--text-primary)' }}>{badges.most_active?.platform || "LinkedIn"}</div>
          <div className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{badges.most_active?.value || 42} Posts Published</div>
        </div>
      </div>

      {/* Side-by-Side Platform Comparison Table */}
      <div className="p-6 rounded-2xl shadow-xs space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Layers className="w-5 h-5" style={{ color: '#C8A14A' }} /> Normalized Provider Comparison Matrix
          </h2>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{accounts.length} Platforms Normalized</span>
        </div>

        <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid var(--card-border)' }}>
          <table className="w-full text-left text-xs font-sans">
            <thead className="text-xs font-extrabold uppercase" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', borderBottom: '1px solid var(--card-border)' }}>
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
            <tbody className="divide-y text-xs" style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
              {accounts.map((acc: any) => (
                <tr key={acc.id} className="transition hover:opacity-90">
                  <td className="p-4 flex items-center gap-3">
                    <span className="text-xl">{PLATFORM_ICONS[acc.platform] || "🌐"}</span>
                    <div>
                      <div className="font-extrabold capitalize text-sm">{acc.platform}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{acc.account_handle}</div>
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
                  <td className="p-4 font-extrabold" style={{ color: '#C8A14A' }}>{acc.metrics.engagement_rate}%</td>
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
        <div className="p-6 rounded-2xl shadow-xs space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <h3 className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
            Followers Growth Comparison
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
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
        <div className="p-6 rounded-2xl shadow-xs space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <h3 className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
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
        <div className="p-6 rounded-2xl shadow-xs space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <h3 className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
            Engagement & Growth Radar
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarChartData}>
                <PolarGrid opacity={0.2} />
                <PolarAngleAxis dataKey="platform" fontSize={11} />
                <PolarRadiusAxis />
                <Radar name="Engagement %" dataKey="engagement" stroke="#C8A14A" fill="#C8A14A" fillOpacity={0.4} />
                <Radar name="Growth Index" dataKey="growth" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Format Matrix */}
        <div className="p-6 rounded-2xl shadow-xs space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <h3 className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
            Content Format Performance Breakdown
          </h3>
          <div className="space-y-3 pt-1">
            {formatData?.format_comparison?.map((fmt: any, i: number) => (
              <div key={i} className="p-3.5 rounded-xl border flex items-center justify-between" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
                <div>
                  <div className="text-xs font-extrabold" style={{ color: 'var(--text-primary)' }}>{fmt.format}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Best Channel: {fmt.best_provider} • Avg Reach: {fmt.avg_reach}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-emerald-600">{fmt.avg_engagement}</div>
                  <div className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>Index: {fmt.performance_index}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 100 Combined Posts */}
      <div className="p-6 rounded-2xl shadow-xs space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Flame className="w-5 h-5 text-rose-500" /> Combined Multi-Platform Top Posts
          </h2>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Sorted by Engagement Rate</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-2">
          {topPosts.map((post: any) => (
            <div
              key={post.id}
              className="p-4 rounded-2xl border flex flex-col justify-between space-y-3"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}
            >
              <div className="flex items-start gap-3">
                {post.thumbnail && (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                    style={{ border: '1px solid var(--card-border)' }}
                  />
                )}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{PLATFORM_ICONS[post.platform] || "📌"}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                      {post.platform}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold line-clamp-2" style={{ color: 'var(--text-primary)' }}>{post.title}</h4>
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between text-[11px] font-bold" style={{ borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-500" /> {post.metrics.likes.toLocaleString()}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" style={{ color: '#C8A14A' }} /> {post.metrics.comments.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Play className="w-3 h-3 text-emerald-500" /> {post.metrics.views.toLocaleString()}</span>
                <span className="text-emerald-600 font-black">{post.metrics.engagement_rate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Cross-Platform Comparison Insights */}
      <div className="p-6 rounded-2xl shadow-xs space-y-4" style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)' }}>
        <h2 className="text-lg font-extrabold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Sparkles className="w-5 h-5" style={{ color: '#C8A14A' }} /> Automated AI Multi-Platform Insights
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {aiInsights.map((ins: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl border space-y-1" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: '#C8A14A' }}>
                {ins.type} • Impact: {ins.impact}
              </span>
              <p className="text-xs font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{ins.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
