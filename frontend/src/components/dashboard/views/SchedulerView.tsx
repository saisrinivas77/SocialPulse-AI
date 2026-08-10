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
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6"
        style={{ borderBottom: '1px solid var(--card-border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#C8A14A' }}>
              Publication Timeline
            </span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: '#C8A14A', border: '1px solid var(--accent-border)' }}>Multi-channel Sync</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Content Calendar & Schedule
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Visualize, queue, and rearrange multi-channel posts with automated peak-time delivery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month / Agenda Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-2xl text-xs" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)' }}>
            <button
              onClick={() => setViewMode("month")}
              className="px-3 py-1.5 rounded-xl font-semibold transition-all"
              style={{
                background: viewMode === "month" ? '#C8A14A' : 'transparent',
                color: viewMode === "month" ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: viewMode === "month" ? '0 4px 12px rgba(200,161,74,0.25)' : 'none',
              }}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode("agenda")}
              className="px-3 py-1.5 rounded-xl font-semibold transition-all"
              style={{
                background: viewMode === "agenda" ? '#C8A14A' : 'transparent',
                color: viewMode === "agenda" ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: viewMode === "agenda" ? '0 4px 12px rgba(200,161,74,0.25)' : 'none',
              }}
            >
              Agenda List
            </button>
          </div>

          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="px-5 py-2.5 rounded-full text-white font-semibold text-xs shadow-md flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)', boxShadow: '0 4px 12px rgba(200,161,74,0.25)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </button>
        </div>
      </motion.div>

      {/* Calendar Toolbar */}
      <div className="flex items-center justify-between p-4 rounded-[24px] shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5" style={{ color: '#C8A14A' }} />
          <h2 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
            {currentMonth}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl transition-colors" style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}>
            Today
          </button>
          <button className="p-2 rounded-xl transition-colors" style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Body */}
      {viewMode === "month" ? (
        <div className="rounded-[24px] p-4 overflow-x-auto shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
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
                className="min-h-[110px] p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group"
                style={{
                  background: item.day === 7 ? 'var(--accent-light)' : 'var(--bg-secondary)',
                  borderColor: item.day === 7 ? '#C8A14A' : 'var(--card-border)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-extrabold"
                    style={{ color: item.day === 7 ? '#C8A14A' : 'var(--text-primary)' }}
                  >
                    {item.day}
                  </span>
                  <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} />
                </div>

                <div className="space-y-1 my-1">
                  {item.events.map((evt, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 rounded-xl border text-[10px] space-y-0.5 shadow-xs"
                      style={{ background: 'var(--card-bg)', borderColor: 'var(--accent-border)' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold truncate" style={{ color: '#C8A14A' }}>{evt.platform}</span>
                        <span className="text-[8px] font-semibold" style={{ color: 'var(--text-muted)' }}>{evt.time}</span>
                      </div>
                      <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
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
        <div className="rounded-[24px] p-6 divide-y shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderColor: 'var(--card-border)' }}>
          {posts.length === 0 ? (
            <p className="text-xs text-center py-6" style={{ color: 'var(--text-muted)' }}>No scheduled posts in queue.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl border flex items-center justify-center font-bold text-sm" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)', color: '#C8A14A' }}>
                    {post.platform[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: '#C8A14A' }}>{post.platform}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>• {post.scheduledTime}</span>
                    </div>
                    <h3 className="text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                      {post.title}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
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
            ))
          )}
        </div>
      )}
    </div>
  );
};
