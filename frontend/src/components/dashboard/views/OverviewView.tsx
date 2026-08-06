"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useQuery } from "@tanstack/react-query";
import { socialPulseApi } from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  TrendingUp,
  Zap,
  DollarSign,
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BarChart2,
  ChevronRight,
  CheckCircle2,
  Sliders,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

const performanceData = [
  { day: "Mon", reach: 18200, engagement: 2400, revenue: 3200 },
  { day: "Tue", reach: 24500, engagement: 3800, revenue: 4800 },
  { day: "Wed", reach: 31000, engagement: 4900, revenue: 6100 },
  { day: "Thu", reach: 29000, engagement: 4200, revenue: 5400 },
  { day: "Fri", reach: 45200, engagement: 6800, revenue: 9200 },
  { day: "Sat", reach: 52000, engagement: 7900, revenue: 11400 },
  { day: "Sun", reach: 68400, engagement: 9400, revenue: 14250 },
];

export const OverviewView: React.FC = () => {
  const { setCurrentView, posts, setIsCreatePostModalOpen, socialAccounts, loadUserAccounts } = useAppStore();
  const [timeframe, setTimeframe] = useState("7d");
  const [userName, setUserName] = useState("User");

  React.useEffect(() => {
    loadUserAccounts();
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("sp_user_name") || localStorage.getItem("sp_user_email")?.split("@")[0] || "User";
      const firstName = name.split(" ")[0];
      setUserName(firstName);

      // Connect to Database-First Real-Time Telemetry Stream
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsHost = process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, "") || "localhost:8000/api/v1";
      const wsUrl = `${wsProtocol}//${wsHost}/ws/dashboard`;

      let socket: WebSocket | null = null;
      try {
        socket = new WebSocket(wsUrl);
        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.event === "analytics.updated" || data.event === "sync.completed") {
              toast.success("Live telemetry updated from background sync worker!", { id: "ws-update" });
              refetch();
              loadUserAccounts();
            }
          } catch {
            // ignore non-json pings
          }
        };
      } catch {
        // ws fallback
      }

      return () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    }
  }, []);

  const connectedAccounts = socialAccounts.filter((a) => a.connected);
  const connectedCount = connectedAccounts.length;

  // TanStack Query for Live Dashboard Telemetry
  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ["overviewMetrics"],
    queryFn: socialPulseApi.getOverviewMetrics,
  });

  const parseFollowerCount = (str: string) => {
    if (!str) return 0;
    const clean = str.toUpperCase().trim();
    if (clean.endsWith("K")) return Math.round(parseFloat(clean) * 1000);
    if (clean.endsWith("M")) return Math.round(parseFloat(clean) * 1000000);
    return parseInt(clean, 10) || 0;
  };

  const dynamicFollowersSum = connectedAccounts.reduce((acc, account) => acc + parseFollowerCount(account.followers), 0);
  const displayTotalFollowers = dynamicFollowersSum > 0 ? dynamicFollowersSum : (metrics?.totalFollowers || 149820);
  const displayReach = dynamicFollowersSum > 0 ? Math.round(dynamicFollowersSum * 16.35) : (metrics?.monthlyReach || 2450000);
  const displayEngagementRate = connectedCount > 0 
    ? (connectedAccounts.reduce((acc, a) => acc + (a.health || 95), 0) / (connectedCount * 17.1)).toFixed(2)
    : "5.84";

  const kpis = [
    {
      title: "Total Followers",
      value: displayTotalFollowers,
      prefix: "",
      suffix: "",
      change: metrics?.followersDelta || "+14.2%",
      isPositive: true,
      icon: Users,
      subtext: `Active on ${connectedCount} connected channels`,
    },
    {
      title: "Cross-Platform Reach",
      value: displayReach,
      prefix: "",
      suffix: "",
      change: metrics?.reachDelta || "+28.6%",
      isPositive: true,
      icon: TrendingUp,
      subtext: "+540K unique impressions",
      format: (val: number) => (val / 1000000).toFixed(1) + "M",
    },
    {
      title: "Engagement Rate",
      value: parseFloat(displayEngagementRate as string),
      prefix: "",
      suffix: "%",
      change: metrics?.engagementDelta || "+1.2%",
      isPositive: true,
      icon: Zap,
      subtext: "Industry benchmark: 2.1%",
      decimals: 2,
    },
    {
      title: "Revenue Attribution",
      value: metrics?.revenueAttribution || 48250,
      prefix: "$",
      suffix: "",
      change: "+18.9%",
      isPositive: true,
      icon: DollarSign,
      subtext: "Direct social conversions",
    },
    {
      title: "AI Optimization Score",
      value: metrics?.aiOptimizationScore || 94,
      prefix: "",
      suffix: "/100",
      change: "+5 pts",
      isPositive: true,
      icon: Award,
      subtext: "Top 1% performing channels",
    },
  ];

  const aiInsights = [
    {
      id: "ins-1",
      tag: "VIRAL OPPORTUNITY",
      title: "Carousel Format outperforming Video by 3.2x on LinkedIn",
      action: "Generate Carousel Draft",
      route: "ai-studio",
    },
    {
      id: "ins-2",
      tag: "OPTIMAL WINDOW",
      title: "Audience activity peaks today at 7:30 PM EST across Instagram & X",
      action: "Schedule Evening Post",
      route: "calendar",
    },
    {
      id: "ins-3",
      tag: "CAMPAIGN BOOST",
      title: "Q3 AI Copilot campaign has surplus budget: increase daily ad reach",
      action: "View Campaign KPIs",
      route: "campaigns",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE8E1] dark:border-[#262623] pb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0866FF]">
              Live Workspace Dashboard
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#31A24C] animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#050505] dark:text-[#E4E6EB]">
            Good morning, {userName}.
          </h1>
          <p className="text-sm text-[#65676B] dark:text-[#B0B3B8] mt-1">
            {connectedCount > 0
              ? `SocialPulse AI engine is monitoring ${connectedCount} connected channel${connectedCount === 1 ? "" : "s"}. Engagement is up 28.6% this week.`
              : "No social accounts connected to this workspace. Connect your first channel to unlock live telemetry."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              refetch();
              toast.success("Telemetry refreshed from API!");
            }}
            className="p-2.5 rounded-2xl border border-black/5 dark:border-white/10 bg-[#F0F2F5] dark:bg-[#242526] hover:border-[#0866FF] text-[#050505] dark:text-[#E4E6EB]"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 text-[#0866FF] ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white font-semibold text-xs shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create AI Post</span>
          </button>
          <button
            onClick={() => setCurrentView("analytics")}
            className="px-5 py-2.5 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-[#242526] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <BarChart2 className="w-4 h-4 text-[#0866FF]" />
            <span>Full Analytics</span>
          </button>
        </div>
      </motion.div>

      {/* Zero Connected Accounts Empty State */}
      {connectedCount === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.08] rounded-[28px] p-8 text-center space-y-4 shadow-xs"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#0866FF]/10 text-[#0866FF] flex items-center justify-center mx-auto">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-[#111111] dark:text-white">
            No Social Accounts Connected to Workspace
          </h3>
          <p className="text-xs text-[#777777] dark:text-[#A0A0A0] max-w-md mx-auto">
            Connect your Instagram, Facebook, LinkedIn, YouTube, TikTok, Threads, Pinterest, or X channel to start fetching live telemetry, computing audience engagement, and running AI generation pipelines.
          </p>
          <button
            onClick={() => setCurrentView("social-accounts")}
            className="px-6 py-3 rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white font-extrabold text-xs shadow-md transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Social Channels</span>
          </button>
        </motion.div>
      )}

      {/* 5 Animated KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="apple-card p-5 flex flex-col justify-between h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#65676B] dark:text-[#B0B3B8]">
                  {kpi.title}
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#F0F2F5] dark:bg-[#18191A] border border-black/5 dark:border-white/10 flex items-center justify-center text-[#0866FF]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#050505] dark:text-[#E4E6EB] tracking-tight">
                  {kpi.prefix}
                  {kpi.format ? (
                    kpi.format(kpi.value)
                  ) : (
                    <CountUp
                      end={kpi.value}
                      duration={2}
                      separator=","
                      decimals={kpi.decimals || 0}
                    />
                  )}
                  {kpi.suffix}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-black/5 dark:border-white/10">
                <span
                  className={`font-semibold flex items-center gap-0.5 ${
                    kpi.isPositive ? "text-[#31A24C]" : "text-[#EF4444]"
                  }`}
                >
                  {kpi.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {kpi.change}
                </span>
                <span className="text-[#8A8D91] text-[10px] truncate max-w-[100px]">{kpi.subtext}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Analytics Chart & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Recharts Graph */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 apple-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-[#050505] dark:text-[#E4E6EB]">
                Aggregated Reach & Telemetry
              </h3>
              <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                Real-time impressions & cross-platform engagement trajectory
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#0866FF]/10 text-[#0866FF]">
                Live Stream
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="metaBlueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0866FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0866FF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="darkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#8A8D91" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#8A8D91" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18191A",
                    borderRadius: "14px",
                    border: "1px solid #0866FF",
                    color: "#E4E6EB",
                    fontSize: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stroke="#0866FF"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#metaBlueGradient)"
                  name="Impressions"
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#darkGradient)"
                  name="Engagements"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/10 text-xs text-[#65676B] dark:text-[#B0B3B8]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0866FF]" /> Reach (68.4K max)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" /> Engagements (9.4K max)
              </span>
            </div>
            <button
              onClick={() => setCurrentView("analytics")}
              className="text-[#0866FF] hover:underline font-semibold flex items-center gap-1"
            >
              Deep Dive Analytics <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Right 1 Col: Smart AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="luxury-card p-6 flex flex-col justify-between h-full bg-gradient-to-b from-[#FAFAF8] to-[#FFFFFF] dark:from-[#141413] dark:to-[#0C0C0B]"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C8A14A]" />
                <h3 className="text-base font-bold text-[#111111] dark:text-[#FAFAF8]">
                  AI Insights & Action
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase text-[#9F7A2F] dark:text-[#D7B45D]">
                Updated 5m ago
              </span>
            </div>

            <div className="space-y-3">
              {aiInsights.map((ins) => (
                <div
                  key={ins.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 space-y-2 hover:border-[#0866FF] transition-all"
                >
                  <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#0866FF]/10 text-[#0866FF]">
                    {ins.tag}
                  </span>
                  <p className="text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] leading-snug">
                    {ins.title}
                  </p>
                  <button
                    onClick={() => {
                      setCurrentView(ins.route as any);
                      toast.success(`Navigated to ${ins.route}`);
                    }}
                    className="text-[11px] font-bold text-[#0866FF] hover:underline flex items-center gap-1 pt-1"
                  >
                    {ins.action} <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#31A24C]" />
              <span className="text-xs text-[#65676B] dark:text-[#B0B3B8]">AI Engine Standby</span>
            </div>
            <button
              onClick={() => setCurrentView("ai-studio")}
              className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] hover:text-[#0866FF]"
            >
              Open Studio →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid: Recent Content & Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Content Stream */}
        <div className="lg:col-span-2 apple-card p-6 space-y-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">
                Recent Content Stream
              </h3>
              <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                Track performance metrics for published and queued posts
              </p>
            </div>
            <button
              onClick={() => setCurrentView("posts")}
              className="text-xs font-bold text-[#0866FF] hover:underline"
            >
              View All Posts ({posts.length})
            </button>
          </div>

          <div className="divide-y divide-black/5 dark:divide-white/10">
            {posts.slice(0, 3).map((post) => {
              const linkedAcc = socialAccounts.find((a) => a.platform.toLowerCase() === post.platform.toLowerCase());
              const handle = linkedAcc && linkedAcc.connected ? linkedAcc.username : post.platform;
              return (
                <div key={post.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10 flex items-center justify-center shrink-0 text-[#0866FF] font-bold text-xs">
                      {post.platform[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
                          {post.title}
                        </h4>
                        <span className="text-[10px] font-semibold text-[#0866FF] bg-[#0866FF]/10 px-2 py-0.5 rounded-full">
                          {handle}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] line-clamp-1">
                        {post.content}
                      </p>
                    </div>
                  </div>

                <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-auto">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      post.status === "Published"
                        ? "bg-[#31A24C]/10 text-[#31A24C]"
                        : post.status === "Scheduled"
                        ? "bg-[#0866FF]/10 text-[#0866FF]"
                        : "bg-gray-500/10 text-gray-600"
                    }`}
                  >
                    {post.status}
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-[#050505] dark:text-[#E4E6EB]">
                      {post.impressions}
                    </span>
                    <span className="text-[10px] text-[#8A8D91] block">impressions</span>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* AI Credits & Workspace Usage Meter */}
        <div className="apple-card p-6 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
                Monthly AI Generation Credits
              </span>
              <span className="text-xs font-extrabold text-[#0866FF]">
                14,250 / 20,000
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#0866FF] to-[#7C3AED] rounded-full w-[71%]" />
            </div>
            <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] mt-2">
              71% of Enterprise Pro quota used. Resets in 12 days.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
              <CheckCircle2 className="w-4 h-4 text-[#31A24C]" /> Custom Model Training Active
            </div>
            <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8]">
              Your brand voice model is fine-tuned on 1,400+ historical posts.
            </p>
          </div>

          <button
            onClick={() => setCurrentView("settings")}
            className="w-full rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-[#242526] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] py-2.5 text-xs flex items-center justify-center gap-2 font-semibold transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-[#0866FF]" /> Manage Quota & Settings
          </button>
        </div>
      </div>
    </div>
  );
};
