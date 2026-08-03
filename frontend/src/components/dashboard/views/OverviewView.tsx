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
  const { setCurrentView, posts, setIsCreatePostModalOpen } = useAppStore();
  const [timeframe, setTimeframe] = useState("7d");

  // TanStack Query for Live Dashboard Telemetry
  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ["overviewMetrics"],
    queryFn: socialPulseApi.getOverviewMetrics,
  });

  const kpis = [
    {
      title: "Total Followers",
      value: metrics?.totalFollowers || 149820,
      prefix: "",
      suffix: "",
      change: metrics?.followersDelta || "+14.2%",
      isPositive: true,
      icon: Users,
      subtext: "vs. 131.2K last month",
    },
    {
      title: "Cross-Platform Reach",
      value: metrics?.monthlyReach || 2450000,
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
      value: metrics?.engagementRate || 5.84,
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
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A14A]">
              Live Workspace Dashboard
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-[#FAFAF8]">
            Good morning, Alex.
          </h1>
          <p className="text-sm text-[#5B5B5B] dark:text-[#A0A09B] mt-1">
            SocialPulse AI engine is monitoring 8 connected channels. Engagement is up 28.6% this week.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              refetch();
              toast.success("Telemetry refreshed from API!");
            }}
            className="p-2.5 rounded-2xl border border-[#ECE8E1] dark:border-[#262623] bg-[#FAFAF8] dark:bg-[#141413] hover:border-[#C8A14A] text-[#111111] dark:text-[#FAFAF8]"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 text-[#C8A14A] ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="btn-gold-primary px-5 py-2.5 text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create AI Post</span>
          </button>
          <button
            onClick={() => setCurrentView("analytics")}
            className="btn-luxury-secondary px-5 py-2.5 text-xs flex items-center gap-2"
          >
            <BarChart2 className="w-4 h-4 text-[#C8A14A]" />
            <span>Full Analytics</span>
          </button>
        </div>
      </motion.div>

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
              className="luxury-card luxury-card-gold-line p-5 flex flex-col justify-between h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#5B5B5B] dark:text-[#A0A09B]">
                  {kpi.title}
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] flex items-center justify-center text-[#C8A14A]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#111111] dark:text-[#FAFAF8] tracking-tight">
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

              <div className="flex items-center justify-between pt-2 border-t border-[#ECE8E1]/60 dark:border-[#262623]/60 text-[11px]">
                <span
                  className={`font-semibold flex items-center gap-0.5 ${
                    kpi.isPositive ? "text-[#22C55E]" : "text-[#EF4444]"
                  }`}
                >
                  {kpi.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {kpi.change}
                </span>
                <span className="text-[#8A8A8A] truncate max-w-[100px]">{kpi.subtext}</span>
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
          className="lg:col-span-2 luxury-card p-6 flex flex-col justify-between h-full"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#111111] dark:text-[#FAFAF8]">
                  Audience Reach & Growth Trajectory
                </h2>
                <span className="luxury-badge text-[10px] px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>
              <p className="text-xs text-[#5B5B5B] dark:text-[#A0A09B] mt-0.5">
                Aggregated impression telemetry across connected social networks
              </p>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#FAFAF8] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] text-xs">
              {["7d", "30d", "90d", "YTD"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    timeframe === tf
                      ? "bg-[#111111] text-white dark:bg-[#FAFAF8] dark:text-[#111111] shadow-xs"
                      : "text-[#5B5B5B] dark:text-[#A0A09B] hover:text-[#111111]"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8A14A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C8A14A" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="darkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111111" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#111111" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECE8E1" vertical={false} />
                <XAxis dataKey="day" stroke="#8A8A8A" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#8A8A8A" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111111",
                    borderRadius: "14px",
                    border: "1px solid #C8A14A",
                    color: "#FAFAF8",
                    fontSize: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stroke="#C8A14A"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#goldGradient)"
                  name="Impressions"
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#111111"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#darkGradient)"
                  name="Engagements"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#ECE8E1] dark:border-[#262623] text-xs text-[#5B5B5B] dark:text-[#A0A09B]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C8A14A]" /> Reach (68.4K max)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#111111] dark:bg-[#FAFAF8]" /> Engagements (9.4K max)
              </span>
            </div>
            <button
              onClick={() => setCurrentView("analytics")}
              className="text-[#C8A14A] hover:underline font-semibold flex items-center gap-1"
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
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] space-y-2 hover:border-[#C8A14A] transition-all"
                >
                  <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#F9F5EC] dark:bg-[#262623] text-[#9F7A2F] dark:text-[#D7B45D]">
                    {ins.tag}
                  </span>
                  <p className="text-xs font-semibold text-[#111111] dark:text-[#FAFAF8] leading-snug">
                    {ins.title}
                  </p>
                  <button
                    onClick={() => {
                      setCurrentView(ins.route as any);
                      toast.success(`Navigated to ${ins.route}`);
                    }}
                    className="text-[11px] font-bold text-[#C8A14A] hover:underline flex items-center gap-1 pt-1"
                  >
                    {ins.action} <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#ECE8E1] dark:border-[#262623] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span className="text-xs text-[#5B5B5B] dark:text-[#A0A09B]">AI Engine Standby</span>
            </div>
            <button
              onClick={() => setCurrentView("ai-studio")}
              className="text-xs font-bold text-[#111111] dark:text-[#FAFAF8] hover:text-[#C8A14A]"
            >
              Open Studio →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid: Recent Content & Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Content Stream */}
        <div className="lg:col-span-2 luxury-card p-6 space-y-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111111] dark:text-[#FAFAF8]">
                Recent Content Stream
              </h3>
              <p className="text-xs text-[#5B5B5B] dark:text-[#A0A09B]">
                Track performance metrics for published and queued posts
              </p>
            </div>
            <button
              onClick={() => setCurrentView("posts")}
              className="text-xs font-bold text-[#C8A14A] hover:underline"
            >
              View All Posts ({posts.length})
            </button>
          </div>

          <div className="divide-y divide-[#ECE8E1] dark:divide-[#262623]">
            {posts.slice(0, 3).map((post) => (
              <div key={post.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] flex items-center justify-center shrink-0 text-[#C8A14A] font-bold text-xs">
                    {post.platform[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111] dark:text-[#FAFAF8]">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-[#5B5B5B] dark:text-[#A0A09B] line-clamp-1">
                      {post.content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-auto">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      post.status === "Published"
                        ? "bg-green-500/10 text-green-600"
                        : post.status === "Scheduled"
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-gray-500/10 text-gray-600"
                    }`}
                  >
                    {post.status}
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-[#111111] dark:text-[#FAFAF8]">
                      {post.impressions}
                    </span>
                    <span className="text-[10px] text-[#8A8A8A] block">impressions</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Credits & Workspace Usage Meter */}
        <div className="luxury-card p-6 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#111111] dark:text-[#FAFAF8]">
                Monthly AI Generation Credits
              </span>
              <span className="text-xs font-extrabold text-[#C8A14A]">
                14,250 / 20,000
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#C8A14A] to-[#D7B45D] rounded-full w-[71%]" />
            </div>
            <p className="text-[11px] text-[#5B5B5B] dark:text-[#A0A09B] mt-2">
              71% of Enterprise Pro quota used. Resets in 12 days.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAFAF8] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#111111] dark:text-[#FAFAF8]">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Custom Model Training Active
            </div>
            <p className="text-[11px] text-[#5B5B5B] dark:text-[#A0A09B]">
              Your brand voice model is fine-tuned on 1,400+ historical posts.
            </p>
          </div>

          <button
            onClick={() => setCurrentView("settings")}
            className="w-full btn-luxury-secondary py-2.5 text-xs flex items-center justify-center gap-2 font-semibold"
          >
            <Sliders className="w-3.5 h-3.5 text-[#C8A14A]" /> Manage Quota & Settings
          </button>
        </div>
      </div>
    </div>
  );
};
