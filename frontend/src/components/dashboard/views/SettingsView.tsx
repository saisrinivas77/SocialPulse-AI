"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import {
  User,
  CreditCard,
  Building2,
  Key,
  ShieldCheck,
  Globe,
  Sparkles,
  Check,
  Copy,
  Plus,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export const SettingsView: React.FC = () => {
  const { currentWorkspace, setIsUpgradeModalOpen } = useAppStore();
  const [activeTab, setActiveTab] = useState<"profile" | "billing" | "workspace" | "api" | "security" | "integrations">("profile");

  const [profile, setProfile] = useState({
    name: "User",
    email: "user@socialpulse.ai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("sp_user_name");
      const storedEmail = localStorage.getItem("sp_user_email");
      const storedAvatar = localStorage.getItem("sp_user_avatar");
      if (storedName || storedEmail) {
        const name = storedName || storedEmail?.split("@")[0] || "User";
        setProfile({
          name,
          email: storedEmail || "user@socialpulse.ai",
          avatar: storedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0866FF&color=fff`,
        });
      }
    }
  }, []);

  const [apiKeys, setApiKeys] = useState([
    { id: "key-1", name: "Production Pipeline Key", secret: "sp_live_9482910842...", created: "Jul 12, 2026" },
    { id: "key-2", name: "Zapier Automation Hook", secret: "sp_live_7104928104...", created: "Jun 04, 2026" },
  ]);

  const handleGenerateApiKey = () => {
    const newKey = {
      id: `key-${Date.now()}`,
      name: "New Custom AI API Key",
      secret: `sp_live_${Math.random().toString(36).substring(2, 15)}...`,
      created: "Just now",
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success("Generated new secret API Key!");
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
              System Configuration
            </span>
            <span className="apple-badge text-[9px] px-2 py-0.5 rounded-full">Enterprise Grade</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#050505] dark:text-[#E4E6EB]">
            Workspace Settings
          </h1>
          <p className="text-sm text-[#65676B] dark:text-[#B0B3B8] mt-1">
            Configure user profiles, subscription plans, developer API keys, and third-party integrations.
          </p>
        </div>
      </motion.div>

      {/* Tab Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-black/5 dark:border-white/10 text-xs">
        {[
          { id: "profile", label: "Profile", icon: User },
          { id: "billing", label: "Billing & Plans", icon: CreditCard },
          { id: "workspace", label: "Workspace", icon: Building2 },
          { id: "api", label: "API Keys", icon: Key },
          { id: "security", label: "Security & 2FA", icon: ShieldCheck },
          { id: "integrations", label: "Integrations", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold transition-all ${
                isActive
                  ? "bg-[#0866FF] text-white shadow-xs"
                  : "text-[#65676B] dark:text-[#B0B3B8] hover:text-[#050505] dark:hover:text-[#E4E6EB] hover:bg-[#F0F2F5] dark:hover:bg-[#242526]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#8A8D91]"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "profile" && (
        <div className="apple-card p-6 space-y-6 max-w-2xl">
          <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">User Profile Information</h3>
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#0866FF]"
            />
            <button className="px-4 py-2 rounded-xl border border-black/5 dark:border-white/10 text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] hover:border-[#0866FF]">
              Change Photo
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#65676B] dark:text-[#B0B3B8] block mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10 text-xs text-[#050505] dark:text-[#E4E6EB]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#65676B] dark:text-[#B0B3B8] block mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10 text-xs text-[#050505] dark:text-[#E4E6EB]"
              />
            </div>
            <button
              onClick={() => toast.success("Profile saved successfully!")}
              className="px-6 py-2.5 rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white font-semibold text-xs shadow-md"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-6">
          <div className="apple-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md bg-[#0866FF]/10 text-[#0866FF]">
                Current Active Subscription
              </span>
              <h3 className="text-xl font-extrabold text-[#050505] dark:text-[#E4E6EB] mt-2">
                Enterprise Pro Tier
              </h3>
              <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-0.5">
                $499 / month • Renews on September 1, 2026
              </p>
            </div>

            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-6 py-3 rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white font-semibold text-xs shadow-md flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Change / Upgrade Plan</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === "api" && (
        <div className="apple-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">Developer API Keys</h3>
              <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">Programmatic access for custom ML pipelines and webhooks.</p>
            </div>
            <button
              onClick={handleGenerateApiKey}
              className="px-4 py-2 rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Key</span>
            </button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((k) => (
              <div key={k.id} className="p-4 rounded-2xl bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#050505] dark:text-[#E4E6EB]">{k.name}</h4>
                  <code className="text-[11px] text-[#0866FF] font-mono">{k.secret}</code>
                </div>
                <span className="text-[#8A8D91]">{k.created}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
