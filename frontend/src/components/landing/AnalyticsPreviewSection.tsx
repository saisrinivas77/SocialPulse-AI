"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Users, Eye, Heart, Calendar } from "lucide-react";

const trendData = [
  { day: "Mon", reach: 180000, engagement: 24000 },
  { day: "Tue", reach: 220000, engagement: 31000 },
  { day: "Wed", reach: 350000, engagement: 48000 },
  { day: "Thu", reach: 410000, engagement: 59000 },
  { day: "Fri", reach: 680000, engagement: 89000 },
  { day: "Sat", reach: 950000, engagement: 114000 },
  { day: "Sun", reach: 1240000, engagement: 142000 },
];

const platformData = [
  { name: "Instagram", value: 45, color: "#FFD700" },
  { name: "LinkedIn", value: 25, color: "#0A66C2" },
  { name: "TikTok", value: 18, color: "#00F2FE" },
  { name: "X / Twitter", value: 12, color: "#F6C453" },
];

export const AnalyticsPreviewSection: React.FC = () => {
  const [metricTab, setMetricTab] = useState<"reach" | "engagement">("reach");

  return (
    <section id="analytics-preview" className="py-24 relative bg-black/40 border-y border-amber-500/10 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            Precision Intelligence
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Analytics designed for <span className="gold-gradient-text">executive clarity</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Real-time telemetry, follower growth modeling, and cross-channel benchmark charts.
          </p>
        </div>

        {/* Analytics Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Trend Chart */}
          <div className="lg:col-span-2 glass-card p-6 sm:p-8 border-amber-500/20 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" /> Performance Velocity
                </h3>
                <p className="text-xs text-gray-400">Weekly cross-network reach & engagement growth</p>
              </div>

              <div className="flex gap-2 bg-black/60 p-1 rounded-xl border border-amber-500/20">
                <button
                  onClick={() => setMetricTab("reach")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    metricTab === "reach" ? "bg-amber-500 text-black font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Reach
                </button>
                <button
                  onClick={() => setMetricTab("engagement")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    metricTab === "engagement" ? "bg-amber-500 text-black font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Engagement
                </button>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#737373" fontSize={12} tickLine={false} />
                  <YAxis stroke="#737373" fontSize={12} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0d0d0d",
                      borderColor: "rgba(255, 215, 0, 0.3)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={metricTab}
                    stroke="#FFD700"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#goldGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Distribution Pie */}
          <div className="glass-card p-6 sm:p-8 border-amber-500/20 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" /> Platform Share
              </h3>
              <p className="text-xs text-gray-400">Audience breakdown across platforms</p>
            </div>

            <div className="h-56 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0d0d0d",
                      borderColor: "rgba(255, 215, 0, 0.3)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-white">25.6K</span>
                <span className="text-[10px] uppercase tracking-widest text-amber-400">Total Followers</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {platformData.map((p) => (
                <div key={p.name} className="flex items-center gap-2 text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>{p.name}: <strong>{p.value}%</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
