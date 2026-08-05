"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Send,
  Sparkles,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const calendarDays = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  events:
    i === 4
      ? [{ title: "LinkedIn AI Architecture", platform: "LinkedIn", time: "09:30 AM", status: "Published" }]
      : i === 5
      ? [{ title: "X Viral 5 Workflows", platform: "X", time: "04:15 PM", status: "Published" }]
      : i === 6
      ? [{ title: "Instagram AI Teaser", platform: "Instagram", time: "06:00 PM", status: "Scheduled" }]
      : i === 9
      ? [{ title: "YouTube Training Vlog", platform: "YouTube", time: "10:00 AM", status: "Scheduled" }]
      : i === 14
      ? [{ title: "TikTok Creator Reel", platform: "TikTok", time: "07:30 PM", status: "Scheduled" }]
      : [],
}));

export const SchedulerView: React.FC = () => {
  const { posts, setIsCreatePostModalOpen } = useAppStore();
  const [viewMode, setViewMode] = useState<"month" | "agenda">("month");
  const [currentMonth, setCurrentMonth] = useState("August 2026");

  const handleSlotClick = (day: number) => {
    toast.info(`Selected August ${day}, 2026 slot`);
    setIsCreatePostModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE8E1] dark:border-[#262623] pb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0866FF]">
              Publication Timeline
            </span>
            <span className="apple-badge text-[9px] px-2 py-0.5 rounded-full">Multi-channel Sync</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#050505] dark:text-[#E4E6EB]">
            Content Calendar & Schedule
          </h1>
          <p className="text-sm text-[#65676B] dark:text-[#B0B3B8] mt-1">
            Visualize, queue, and rearrange multi-channel posts with automated peak-time delivery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month / Agenda Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10 text-xs">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                viewMode === "month"
                  ? "bg-[#0866FF] text-white shadow-xs"
                  : "text-[#65676B] dark:text-[#B0B3B8]"
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode("agenda")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                viewMode === "agenda"
                  ? "bg-[#0866FF] text-white shadow-xs"
                  : "text-[#65676B] dark:text-[#B0B3B8]"
              }`}
            >
              Agenda List
            </button>
          </div>

          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white font-semibold text-xs shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </button>
        </div>
      </motion.div>

      {/* Calendar Toolbar */}
      <div className="flex items-center justify-between p-4 apple-card">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-[#0866FF]" />
          <h2 className="text-lg font-extrabold text-[#050505] dark:text-[#E4E6EB]">
            {currentMonth}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl border border-black/5 dark:border-white/10 bg-[#F0F2F5] dark:bg-[#242526] text-[#050505] dark:text-[#E4E6EB] hover:border-[#0866FF]">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-3 py-1.5 rounded-xl border border-black/5 dark:border-white/10 text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
            Today
          </button>
          <button className="p-2 rounded-xl border border-black/5 dark:border-white/10 bg-[#F0F2F5] dark:bg-[#242526] text-[#050505] dark:text-[#E4E6EB] hover:border-[#0866FF]">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Body */}
      {viewMode === "month" ? (
        <div className="apple-card p-4 overflow-x-auto">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-[#8A8D91] uppercase tracking-wider">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-2">{day}</div>
            ))}
          </div>

          {/* 31 Day Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((item) => (
              <div
                key={item.day}
                onClick={() => handleSlotClick(item.day)}
                className={`min-h-[110px] p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  item.day === 7
                    ? "bg-[#0866FF]/10 dark:bg-[#0866FF]/20 border-[#0866FF]"
                    : "bg-[#F0F2F5]/50 dark:bg-[#242526]/50 border-black/5 dark:border-white/10 hover:border-[#0866FF]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-extrabold ${
                      item.day === 7
                        ? "text-[#0866FF]"
                        : "text-[#050505] dark:text-[#E4E6EB]"
                    }`}
                  >
                    {item.day}
                  </span>
                  <Plus className="w-3 h-3 text-[#8A8D91] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-1 my-1">
                  {item.events.map((evt, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 rounded-xl bg-white dark:bg-[#18191A] border border-[#0866FF]/30 text-[10px] space-y-0.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0866FF] truncate">{evt.platform}</span>
                        <span className="text-[8px] font-semibold text-[#8A8D91]">{evt.time}</span>
                      </div>
                      <p className="font-medium text-[#050505] dark:text-[#E4E6EB] truncate">
                        {evt.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Agenda View List */
        <div className="apple-card p-6 divide-y divide-black/5 dark:divide-white/10">
          {posts.map((post) => (
            <div key={post.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10 flex items-center justify-center text-[#0866FF] font-bold text-sm">
                  {post.platform[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0866FF]">{post.platform}</span>
                    <span className="text-xs text-[#8A8D91]">• {post.scheduledTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#050505] dark:text-[#E4E6EB] mt-0.5">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1">
                    {post.content}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    post.status === "Published"
                      ? "bg-green-500/10 text-green-600"
                      : post.status === "Scheduled"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-gray-500/10 text-gray-600"
                  }`}
                >
                  {post.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
