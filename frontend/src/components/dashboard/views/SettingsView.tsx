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
          avatar: storedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=C8A14A&color=fff`,
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
              System Configuration
            </span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: '#C8A14A', border: '1px solid var(--accent-border)' }}>Enterprise Grade</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Workspace Settings
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Configure user profiles, subscription plans, developer API keys, and third-party integrations.
          </p>
        </div>
      </motion.div>

      {/* Tab Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs" style={{ borderBottom: '1px solid var(--card-border)' }}>
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
              className="flex items-center gap-2 px-4 py-2 rounded-2xl font-bold transition-all"
              style={{
                background: isActive ? '#C8A14A' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: isActive ? '0 4px 12px rgba(200,161,74,0.25)' : 'none',
              }}
            >
              <Icon className="w-4 h-4" style={{ color: isActive ? '#FFFFFF' : 'var(--text-muted)' }} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "profile" && (
        <div className="rounded-[24px] p-6 space-y-6 max-w-2xl shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>User Profile Information</h3>
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover"
              style={{ border: '2px solid #C8A14A' }}
            />
            <button className="px-4 py-2 rounded-xl text-xs font-semibold hover:border-[#C8A14A] transition-colors" style={{ border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}>
              Change Photo
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3 rounded-xl text-xs outline-none"
                style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#C8A14A'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-3 rounded-xl text-xs outline-none"
                style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#C8A14A'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
              />
            </div>
            <button
              onClick={() => toast.success("Profile saved successfully!")}
              className="px-6 py-2.5 rounded-full text-white font-semibold text-xs shadow-md"
              style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)', boxShadow: '0 4px 12px rgba(200,161,74,0.25)' }}
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-6">
          <div className="rounded-[24px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md" style={{ background: 'var(--accent-light)', color: '#C8A14A' }}>
                Current Active Subscription
              </span>
              <h3 className="text-xl font-extrabold mt-2" style={{ color: 'var(--text-primary)' }}>
                Enterprise Pro Tier
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                $499 / month • Renews on September 1, 2026
              </p>
            </div>

            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-6 py-3 rounded-full text-white font-semibold text-xs shadow-md flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)', boxShadow: '0 4px 12px rgba(200,161,74,0.25)' }}
            >
              <Zap className="w-4 h-4" />
              <span>Change / Upgrade Plan</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === "api" && (
        <div className="rounded-[24px] p-6 space-y-6 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Developer API Keys</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Programmatic access for custom ML pipelines and webhooks.</p>
            </div>
            <button
              onClick={handleGenerateApiKey}
              className="px-4 py-2 rounded-full text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
              style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Key</span>
            </button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((k) => (
              <div key={k.id} className="p-4 rounded-2xl border flex items-center justify-between text-xs" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>{k.name}</h4>
                  <code className="text-[11px] font-mono" style={{ color: '#C8A14A' }}>{k.secret}</code>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>{k.created}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
