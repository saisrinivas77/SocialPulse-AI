"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  Calendar,
  Filter,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Sparkles,
  ArrowUpRight,
  Globe,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

const growthData = [
  { month: "Jan", instagram: 24000, linkedin: 18000, x: 32000, tiktok: 45000 },
  { month: "Feb", instagram: 28000, linkedin: 22000, x: 38000, tiktok: 52000 },
  { month: "Mar", instagram: 35000, linkedin: 29000, x: 44000, tiktok: 68000 },
  { month: "Apr", instagram: 42000, linkedin: 34000, x: 49000, tiktok: 84000 },
  { month: "May", instagram: 51000, linkedin: 39000, x: 58000, tiktok: 98000 },
  { month: "Jun", instagram: 64800, linkedin: 42100, x: 89400, tiktok: 124500 },
];

const platformBreakdown = [
  { platform: "TikTok", followers: "124.5K", color: "#C8A14A" },
  { platform: "X", followers: "89.4K", color: "#111111" },
  { platform: "Instagram", followers: "64.8K", color: "#9F7A2F" },
  { platform: "LinkedIn", followers: "42.1K", color: "#5B5B5B" },
  { platform: "YouTube", followers: "31.2K", color: "#ECE8E1" },
];

const demographics = [
  { country: "United States", share: 42 },
  { country: "United Kingdom", share: 18 },
  { country: "Germany", share: 14 },
  { country: "Canada", share: 12 },
  { country: "Australia", share: 8 },
];

const heatMapHours = ["9 AM", "12 PM", "3 PM", "6 PM", "9 PM"];
const heatMapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const AnalyticsView: React.FC = () => {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  const handleExport = (type: string) => {
    toast.success(`Exporting ${type} report for ${dateRange}...`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Analytics Header & Control Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE8E1] dark:border-[#262623] pb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A14A]">
              Performance Telemetry
            </span>
            <span className="luxury-badge text-[9px] px-2 py-0.5 rounded-full">Multi-channel</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-[#FAFAF8]">
            Cross-Platform Analytics
          </h1>
          <p className="text-sm text-[#5B5B5B] dark:text-[#A0A09B] mt-1">
            Comprehensive breakdown of growth, engagement velocity, and demographic distribution.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Filter */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FAFAF8] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-[#C8A14A]" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Q3 2026">Q3 2026</option>
              <option value="Year to Date">Year to Date</option>
            </select>
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FAFAF8] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] text-xs font-semibold">
            <Filter className="w-3.5 h-3.5 text-[#C8A14A]" />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="All">All Networks</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="X">X (Twitter)</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>

          {/* Export Buttons */}
          <button
            onClick={() => handleExport("PDF")}
            className="btn-gold-primary px-4 py-2 text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </motion.div>

      {/* Top 4 Quick Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="luxury-card p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between text-xs text-[#5B5B5B] dark:text-[#A0A09B] mb-2">
            <span>Total Impressions</span>
            <Eye className="w-4 h-4 text-[#C8A14A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#111111] dark:text-[#FAFAF8]">
            3,842,100
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#22C55E] mt-2 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +32.4% vs previous period
          </div>
        </div>

        <div className="luxury-card p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between text-xs text-[#5B5B5B] dark:text-[#A0A09B] mb-2">
            <span>Link Clicks & CTR</span>
            <MousePointer className="w-4 h-4 text-[#C8A14A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#111111] dark:text-[#FAFAF8]">
            184,920 <span className="text-sm font-normal text-[#8A8A8A]">(4.8% CTR)</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#22C55E] mt-2 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.9% link conversions
          </div>
        </div>

        <div className="luxury-card p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between text-xs text-[#5B5B5B] dark:text-[#A0A09B] mb-2">
            <span>Active Audience Growth</span>
            <Users className="w-4 h-4 text-[#C8A14A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#111111] dark:text-[#FAFAF8]">
            +18,420
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#22C55E] mt-2 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> Net new followers
          </div>
        </div>

        <div className="luxury-card p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between text-xs text-[#5B5B5B] dark:text-[#A0A09B] mb-2">
            <span>Virality Velocity Score</span>
            <Sparkles className="w-4 h-4 text-[#C8A14A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#111111] dark:text-[#FAFAF8]">
            9.2 / 10
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#22C55E] mt-2 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> High viral probability
          </div>
        </div>
      </div>

      {/* Main Growth Multi-Line Recharts Graph */}
      <div className="luxury-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#111111] dark:text-[#FAFAF8]">
              Cross-Network Growth Comparison (6 Months)
            </h3>
            <p className="text-xs text-[#5B5B5B] dark:text-[#A0A09B]">
              Track individual follower velocity per channel (Gold/Charcoal palette)
            </p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECE8E1" vertical={false} />
              <XAxis dataKey="month" stroke="#8A8A8A" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#8A8A8A" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111111",
                  borderRadius: "14px",
                  border: "1px solid #C8A14A",
                  color: "#FAFAF8",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="tiktok" fill="#C8A14A" radius={[6, 6, 0, 0]} name="TikTok" />
              <Bar dataKey="x" fill="#111111" radius={[6, 6, 0, 0]} name="X" />
              <Bar dataKey="instagram" fill="#9F7A2F" radius={[6, 6, 0, 0]} name="Instagram" />
              <Bar dataKey="linkedin" fill="#5B5B5B" radius={[6, 6, 0, 0]} name="LinkedIn" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demographics & Optimal Timing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Geography */}
        <div className="luxury-card p-6 space-y-4 flex flex-col justify-between h-full">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#C8A14A]" />
            <h3 className="text-base font-bold text-[#111111] dark:text-[#FAFAF8]">
              Geographic Audience Distribution
            </h3>
          </div>

          <div className="space-y-3">
            {demographics.map((item) => (
              <div key={item.country} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#111111] dark:text-[#FAFAF8]">
                  <span>{item.country}</span>
                  <span className="text-[#C8A14A]">{item.share}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAFAF8] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C8A14A] to-[#D7B45D] rounded-full"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimal Posting Time Heatmap */}
        <div className="luxury-card p-6 space-y-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C8A14A]" />
              <h3 className="text-base font-bold text-[#111111] dark:text-[#FAFAF8]">
                Audience Heatmap Matrix
              </h3>
            </div>
            <span className="text-[10px] text-[#C8A14A] font-bold">Peak: Wed 6 PM</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead>
                <tr>
                  <th className="py-2 text-left text-[#8A8A8A] font-medium">Day</th>
                  {heatMapHours.map((h) => (
                    <th key={h} className="py-2 text-[#8A8A8A] font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatMapDays.map((d, i) => (
                  <tr key={d} className="border-t border-[#ECE8E1]/50 dark:border-[#262623]/50">
                    <td className="py-2.5 text-left font-bold text-[#111111] dark:text-[#FAFAF8]">{d}</td>
                    {heatMapHours.map((_, hIndex) => {
                      const intensity = ((i + hIndex * 2) % 5) + 1;
                      const bgClasses = [
                        "bg-[#FAFAF8] dark:bg-[#141413]",
                        "bg-[#F9F5EC] text-[#9F7A2F]",
                        "bg-[#C8A14A]/40 text-white font-bold",
                        "bg-[#C8A14A]/70 text-white font-bold",
                        "bg-[#C8A14A] text-white font-extrabold shadow-sm",
                      ];
                      return (
                        <td key={hIndex} className="p-1">
                          <div
                            className={`w-full py-1.5 rounded-lg text-[10px] ${
                              bgClasses[intensity - 1]
                            }`}
                          >
                            {intensity * 20}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
