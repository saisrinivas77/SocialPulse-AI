"use client";

import React from "react";
import { User, ShieldCheck, Award, Zap, CheckCircle2 } from "lucide-react";

export const ProfileView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <User className="w-8 h-8 text-amber-400" /> User Profile & Identity
        </h1>
        <p className="text-xs text-gray-400 mt-1">Manage account security, achievements, and plan subscription</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="glass-card p-6 border-amber-500/20 text-center space-y-4">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            alt="Alex Morgan"
            className="w-24 h-24 rounded-full object-cover border-2 border-amber-400 mx-auto shadow-[0_0_20px_rgba(255,215,0,0.3)]"
          />
          <div>
            <h2 className="text-xl font-extrabold text-white">Alex Morgan</h2>
            <p className="text-xs text-amber-400 font-semibold">Head of Social Media</p>
            <p className="text-[11px] text-gray-400 mt-1">alex@socialpulse.ai</p>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <Zap className="w-3.5 h-3.5 fill-amber-400" /> Enterprise Pro Member
          </div>
        </div>

        {/* Stats & Badges */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 border-amber-500/20 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Account Achievements & Badges
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              {[
                { title: "Viral Maverick", desc: "100K+ reach in 24 hours", icon: "🚀" },
                { title: "AI Wizard", desc: "Generated 500+ captions", icon: "✨" },
                { title: "Consistency Master", desc: "30-day posting streak", icon: "🔥" },
              ].map((badge) => (
                <div key={badge.title} className="p-4 rounded-2xl bg-black/40 border border-amber-500/15 space-y-1">
                  <div className="text-2xl">{badge.icon}</div>
                  <h4 className="text-xs font-bold text-white">{badge.title}</h4>
                  <p className="text-[10px] text-gray-400">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
