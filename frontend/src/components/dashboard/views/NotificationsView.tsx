"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { Bell, CheckCheck, Sparkles, AlertCircle, Info, Zap } from "lucide-react";
import { toast } from "sonner";

export const NotificationsView: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useAppStore();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Bell className="w-8 h-8 text-amber-400" /> Notifications Feed
          </h1>
          <p className="text-xs text-gray-400 mt-1">Real-time alerts, AI viral signals, and system telemetry updates</p>
        </div>

        <button
          onClick={() => {
            markAllAsRead();
            toast.success("All notifications marked as read.");
          }}
          className="btn-magnetic btn-glass px-4 py-2.5 text-xs font-bold flex items-center gap-2"
        >
          <CheckCheck className="w-4 h-4 text-amber-400" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={`glass-card p-5 border cursor-pointer transition-all flex items-start gap-4 ${
              n.read ? "border-white/10 opacity-70" : "border-amber-500/30 bg-amber-500/5"
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              {n.type === "ai" ? <Sparkles className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{n.title}</h3>
                <span className="text-[10px] text-gray-400">{n.timestamp}</span>
              </div>
              <p className="text-xs text-gray-300 font-light leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
