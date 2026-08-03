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
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A14A]">
              System Configuration
            </span>
            <span className="luxury-badge text-[9px] px-2 py-0.5 rounded-full">Enterprise Grade</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-[#FAFAF8]">
            Workspace Settings
          </h1>
          <p className="text-sm text-[#5B5B5B] dark:text-[#A0A09B] mt-1">
            Configure user profiles, subscription plans, developer API keys, and third-party integrations.
          </p>
        </div>
      </motion.div>

      {/* Tab Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#ECE8E1] dark:border-[#262623] text-xs">
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
                  ? "bg-[#111111] text-white dark:bg-[#FAFAF8] dark:text-[#111111] shadow-xs"
                  : "text-[#5B5B5B] dark:text-[#A0A09B] hover:text-[#111111] dark:hover:text-[#FAFAF8] hover:bg-[#FAFAF8] dark:hover:bg-[#141413]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#C8A14A]" : "text-[#8A8A8A]"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "profile" && (
        <div className="luxury-card p-6 space-y-6 max-w-2xl">
          <h3 className="text-base font-bold text-[#111111] dark:text-[#FAFAF8]">User Profile Information</h3>
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Alex Morgan"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#C8A14A]"
            />
            <button className="px-4 py-2 rounded-xl border border-[#ECE8E1] dark:border-[#262623] text-xs font-semibold text-[#111111] dark:text-[#FAFAF8] hover:border-[#C8A14A]">
              Change Photo
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#5B5B5B] dark:text-[#A0A09B] block mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="Alex Morgan"
                className="w-full p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] text-xs text-[#111111] dark:text-[#FAFAF8]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#5B5B5B] dark:text-[#A0A09B] block mb-1">Email Address</label>
              <input
                type="email"
                defaultValue="alex@socialpulse.ai"
                className="w-full p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] text-xs text-[#111111] dark:text-[#FAFAF8]"
              />
            </div>
            <button
              onClick={() => toast.success("Profile saved successfully!")}
              className="btn-gold-primary px-6 py-2.5 text-xs font-bold"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-6">
          <div className="luxury-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#FAFAF8] to-[#FFFFFF] dark:from-[#141413] dark:to-[#0C0C0B]">
            <div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md bg-[#F9F5EC] dark:bg-[#262623] text-[#9F7A2F] dark:text-[#D7B45D]">
                Current Active Subscription
              </span>
              <h3 className="text-xl font-extrabold text-[#111111] dark:text-[#FAFAF8] mt-2">
                Enterprise Pro Tier
              </h3>
              <p className="text-xs text-[#5B5B5B] dark:text-[#A0A09B] mt-0.5">
                $499 / month • Renews on September 1, 2026
              </p>
            </div>

            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="btn-gold-primary px-6 py-3 text-xs flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Change / Upgrade Plan</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === "api" && (
        <div className="luxury-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111111] dark:text-[#FAFAF8]">Developer API Keys</h3>
              <p className="text-xs text-[#5B5B5B] dark:text-[#A0A09B]">Programmatic access for custom ML pipelines and webhooks.</p>
            </div>
            <button
              onClick={handleGenerateApiKey}
              className="btn-gold-primary px-4 py-2 text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Key</span>
            </button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((k) => (
              <div key={k.id} className="p-4 rounded-2xl bg-[#FAFAF8] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#111111] dark:text-[#FAFAF8]">{k.name}</h4>
                  <code className="text-[11px] text-[#C8A14A] font-mono">{k.secret}</code>
                </div>
                <span className="text-[#8A8A8A]">{k.created}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
