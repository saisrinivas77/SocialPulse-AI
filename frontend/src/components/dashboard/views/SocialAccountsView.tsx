"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { socialPulseApi } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import {
  RefreshCw,
  Plus,
  Zap,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  BarChart3,
  Globe,
  Radio,
  Trash2,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

// High-fidelity SVG Platform Logos for all 8 supported social networks
const PlatformLogo: React.FC<{ platform: string; className?: string }> = ({ platform, className = "w-6 h-6" }) => {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) {
    return (
      <div className={`rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white p-2 ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </div>
    );
  }
  if (p.includes("linkedin")) {
    return (
      <div className={`rounded-xl bg-[#0A66C2] flex items-center justify-center text-white p-2 ${className}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      </div>
    );
  }
  if (p.includes("twitter") || p === "x") {
    return (
      <div className={`rounded-xl bg-[#111111] dark:bg-[#FAFAF8] text-white dark:text-[#111111] flex items-center justify-center p-2 ${className}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
    );
  }
  if (p.includes("tiktok")) {
    return (
      <div className={`rounded-xl bg-[#000000] text-white flex items-center justify-center p-2 ${className}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
        </svg>
      </div>
    );
  }
  if (p.includes("youtube")) {
    return (
      <div className={`rounded-xl bg-[#FF0000] text-white flex items-center justify-center p-2 ${className}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </div>
    );
  }
  if (p.includes("facebook")) {
    return (
      <div className={`rounded-xl bg-[#1877F2] text-white flex items-center justify-center p-2 ${className}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </div>
    );
  }
  if (p.includes("threads")) {
    return (
      <div className={`rounded-xl bg-[#000000] text-white flex items-center justify-center p-2 ${className}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.8 13.5c-.7 1.2-1.9 2-3.4 2-2.5 0-4.4-2.1-4.4-4.7s1.9-4.7 4.4-4.7c1.8 0 3.1.9 3.7 2.3h-2.1c-.4-.6-1.1-[1]-1.6-[1]-1.3 0-2.3 1.1-2.3 2.4s1 2.4 2.3 2.4c.8 0 1.5-.4 1.8-1.1h1.6z" />
        </svg>
      </div>
    );
  }
  if (p.includes("pinterest")) {
    return (
      <div className={`rounded-xl bg-[#E60023] text-white flex items-center justify-center p-2 ${className}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      </div>
    );
  }
  return (
    <div className={`rounded-xl text-white flex items-center justify-center p-2 ${className}`} style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)' }}>
      <Globe className="w-full h-full" />
    </div>
  );
};

const SUPPORTED_PROVIDERS = [
  { name: "Instagram", key: "instagram", desc: "Business profiles & creator accounts" },
  { name: "Facebook", key: "facebook", desc: "Pages, insights & post publishing" },
  { name: "LinkedIn", key: "linkedin", desc: "Company pages & personal profiles" },
  { name: "Twitter / X", key: "twitter", desc: "Tweets, media & analytics" },
  { name: "YouTube", key: "youtube", desc: "Channel statistics & video metadata" },
  { name: "TikTok", key: "tiktok", desc: "Business accounts & video reach" },
  { name: "Threads", key: "threads", desc: "Meta Threads profile integration" },
  { name: "Pinterest", key: "pinterest", desc: "Pins, boards & impression metrics" },
];

export const SocialAccountsView: React.FC = () => {
  const { socialAccounts, loadUserAccounts } = useAppStore();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedAnalyticsAccount, setSelectedAnalyticsAccount] = useState<any>(null);
  const [activeSyncingId, setActiveSyncingId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("user@socialpulse.ai");
  const [diagnosticError, setDiagnosticError] = useState<string | null>(null);

  useEffect(() => {
    loadUserAccounts();

    if (typeof window !== "undefined") {
      const email = localStorage.getItem("sp_user_email") || "user@socialpulse.ai";
      setUserEmail(email);

      const params = new URLSearchParams(window.location.search);
      const connected = params.get("connected");
      const err = params.get("error");

      if (connected) {
        toast.success(`Successfully connected ${connected.toUpperCase()} channel!`);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (err) {
        setDiagnosticError(err);
        toast.error(`Connection Notice: ${err}`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleOAuthConnect = (providerKey: string) => {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || "https://socialpulse-ai-production.up.railway.app/api/v1";
    toast.loading(`Redirecting to official ${providerKey.toUpperCase()} OAuth gateway...`, {
      id: "oauth-redirect",
    });
    window.location.href = `${apiBase}/auth/${providerKey}/login`;
  };

  const handleDisconnect = async (id: string, platform: string) => {
    try {
      await socialPulseApi.disconnectSocialAccount(id);
      toast.success(`Disconnected ${platform} channel.`);
      loadUserAccounts();
    } catch {
      toast.error(`Failed to disconnect ${platform}.`);
    }
  };

  const handleSyncNow = async (id: string, platform: string) => {
    setActiveSyncingId(id);
    toast.info(`Syncing latest data for ${platform}...`);
    try {
      await socialPulseApi.syncSocialAccount(id);
      await loadUserAccounts();
      toast.success(`Sync completed for ${platform}!`);
    } catch {
      toast.error(`Failed to sync ${platform}.`);
    } finally {
      setActiveSyncingId(null);
    }
  };

  const openAnalyticsModal = (account: any) => {
    setSelectedAnalyticsAccount(account);
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
            <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#C8A14A' }}>
              OAuth & Integration Hub
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'var(--accent-light)', color: '#C8A14A' }}>
              <ShieldCheck className="w-3 h-3" style={{ color: '#C8A14A' }} />
              Logged in as: {userEmail}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Connected Social Accounts
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Real production OAuth connections & live channel metrics for <strong>{userEmail}</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowConnectModal(true)}
          className="px-5 py-2.5 rounded-full text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all"
          style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)', boxShadow: '0 4px 12px rgba(200,161,74,0.25)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Platform</span>
        </button>
      </motion.div>

      {diagnosticError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start justify-between gap-4 text-amber-300 text-sm"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-200">OAuth Provider Diagnostic Message</h4>
              <p className="mt-0.5 text-xs text-amber-300/90">{diagnosticError}</p>
            </div>
          </div>
          <button
            onClick={() => setDiagnosticError(null)}
            className="text-amber-400 hover:text-amber-200 text-xs font-semibold px-2 py-1 bg-amber-500/10 rounded-lg"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Database Channels List or Zero-State */}
      {socialAccounts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[32px] p-8 md:p-12 text-center max-w-4xl mx-auto shadow-sm space-y-6"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'var(--accent-light)', color: '#C8A14A' }}>
            <Globe className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>No Connected Accounts Found</h2>
            <p className="text-sm max-w-md mx-auto mt-2" style={{ color: 'var(--text-secondary)' }}>
              Connect your official social accounts using provider OAuth to view real followers, reach, posts, and engagement telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {SUPPORTED_PROVIDERS.map((prov) => (
              <button
                key={prov.key}
                onClick={() => handleOAuthConnect(prov.key)}
                className="p-4 rounded-2xl border flex flex-col items-center justify-center space-y-3 transition-all group"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}
              >
                <PlatformLogo platform={prov.name} className="w-10 h-10 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Connect {prov.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialAccounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="rounded-[28px] border p-6 flex flex-col justify-between h-full space-y-4 shadow-xs"
              style={{
                background: 'var(--card-bg)',
                borderColor: account.connected ? 'rgba(200, 161, 74, 0.4)' : 'var(--card-border)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={account.avatar}
                      alt={account.username}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                      style={{ border: '1px solid var(--card-border)' }}
                    />
                    <div>
                      <h3 className="text-sm font-extrabold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                        <span>{account.platform}</span>
                        <PlatformLogo platform={account.platform} className="w-4 h-4" />
                      </h3>
                      <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                        {account.username}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-3 h-3 rounded-full border-2 ${
                      account.connected ? "bg-[#22C55E]" : "bg-[#A0A0A0]"
                    }`}
                    style={{ borderColor: 'var(--card-bg)' }}
                    title={account.connected ? "Active OAuth Token" : "Disconnected"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl border text-xs" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
                  <div>
                    <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>Followers</span>
                    <span className="font-extrabold" style={{ color: 'var(--text-primary)' }}>
                      {account.followers}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>Token Status</span>
                    <span className="font-extrabold text-[#22C55E] flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Encrypted</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2" style={{ borderTop: '1px solid var(--card-border)' }}>
                <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  <span>Last Sync:</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {account.lastSynced}
                  </span>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSyncNow(account.id, account.platform)}
                      disabled={activeSyncingId === account.id}
                      className="flex-1 py-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                      style={{ border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${activeSyncingId === account.id ? "animate-spin" : ""}`} style={{ color: '#C8A14A' }} />
                      <span>{activeSyncingId === account.id ? "Syncing..." : "Sync Now"}</span>
                    </button>

                    <button
                      onClick={() => openAnalyticsModal(account)}
                      className="px-3.5 py-2 rounded-full border text-xs font-bold hover:bg-black/5 flex items-center gap-1"
                      style={{ borderColor: 'var(--card-border)' }}
                      title="View Analytics"
                    >
                      <BarChart3 className="w-3.5 h-3.5" style={{ color: '#C8A14A' }} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <button
                      onClick={() => handleOAuthConnect(account.platform.toLowerCase())}
                      className="font-semibold hover:underline flex items-center gap-1"
                      style={{ color: '#C8A14A' }}
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reconnect</span>
                    </button>

                    <button
                      onClick={() => handleDisconnect(account.id, account.platform)}
                      className="text-[#EF4444] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Connect Platform Modal */}
      <AnimatePresence>
        {showConnectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="rounded-[32px] p-6 max-w-lg w-full shadow-2xl relative"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <button
                onClick={() => setShowConnectModal(false)}
                className="absolute right-5 top-5"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-6 h-6" style={{ color: '#C8A14A' }} />
                <h3 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>OAuth Integration Hub</h3>
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                Connect official channel using authenticated user account: <strong style={{ color: '#C8A14A' }}>{userEmail}</strong>
              </p>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {SUPPORTED_PROVIDERS.map((prov) => (
                  <div
                    key={prov.key}
                    className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}
                  >
                    <div className="flex items-center gap-3">
                      <PlatformLogo platform={prov.name} className="w-9 h-9 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{prov.name}</h4>
                        <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{prov.desc}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOAuthConnect(prov.key)}
                      className="px-4 py-2 rounded-full text-white text-xs font-extrabold shadow-xs transition-all flex items-center gap-1 shrink-0"
                      style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)' }}
                    >
                      <span>Connect</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Breakdown Modal */}
      <AnimatePresence>
        {selectedAnalyticsAccount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="rounded-[32px] p-6 max-w-md w-full shadow-2xl relative space-y-4"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <button
                onClick={() => setSelectedAnalyticsAccount(null)}
                className="absolute right-5 top-5"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <PlatformLogo platform={selectedAnalyticsAccount.platform} className="w-10 h-10" />
                <div>
                  <h3 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
                    {selectedAnalyticsAccount.display_name || selectedAnalyticsAccount.platform} Analytics
                  </h3>
                  <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{selectedAnalyticsAccount.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
                  <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>Total Followers</span>
                  <span className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
                    {selectedAnalyticsAccount.followers || selectedAnalyticsAccount.follower_count || 0}
                  </span>
                </div>

                <div className="p-3 rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
                  <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>Reach / Impressions</span>
                  <span className="text-lg font-extrabold" style={{ color: '#C8A14A' }}>
                    {(selectedAnalyticsAccount.reach || selectedAnalyticsAccount.reach_count || 0).toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
                  <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>Posts / Media</span>
                  <span className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
                    {selectedAnalyticsAccount.posts || selectedAnalyticsAccount.posts_count || 0}
                  </span>
                </div>

                <div className="p-3 rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
                  <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>Engagement Rate</span>
                  <span className="text-lg font-extrabold text-[#22C55E]">
                    {typeof selectedAnalyticsAccount.engagement_rate === "number" ? `${selectedAnalyticsAccount.engagement_rate.toFixed(2)}%` : "Not available"}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl text-xs space-y-1" style={{ background: 'var(--accent-light)', color: '#C8A14A' }}>
                <div className="font-bold flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Real Platform API Telemetry Active</span>
                </div>
                <p className="text-[11px] opacity-90">
                  Tokens encrypted with AES-256 Fernet. Celery Beat background sync triggers every 30 minutes.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
