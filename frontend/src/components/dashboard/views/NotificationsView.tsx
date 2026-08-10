"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { Bell, CheckCheck, Sparkles, AlertCircle, Info, Zap } from "lucide-react";
import { toast } from "sonner";

export const NotificationsView: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useAppStore();

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6" style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Bell className="w-8 h-8" style={{ color: '#C8A14A' }} /> Notifications Feed
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Real-time alerts, AI viral signals, and system telemetry updates</p>
        </div>

        <button
          onClick={() => {
            markAllAsRead();
            toast.success("All notifications marked as read.");
          }}
          className="px-4 py-2.5 text-xs font-bold flex items-center gap-2 rounded-full border transition-all"
          style={{ border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
        >
          <CheckCheck className="w-4 h-4" style={{ color: '#C8A14A' }} />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-[24px] p-8 text-center" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>No notifications found in feed.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className="p-5 border cursor-pointer transition-all flex items-start gap-4 rounded-[24px] shadow-xs"
              style={{
                background: n.read ? 'var(--card-bg)' : 'var(--accent-light)',
                borderColor: n.read ? 'var(--card-border)' : 'var(--accent-border)',
                opacity: n.read ? 0.75 : 1,
              }}
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)', color: '#C8A14A' }}>
                {n.type === "ai" ? <Sparkles className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{n.title}</h3>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{n.timestamp}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
