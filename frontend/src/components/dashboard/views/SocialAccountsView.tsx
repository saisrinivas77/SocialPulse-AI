"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
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
} from "lucide-react";
import { toast } from "sonner";

// High-fidelity SVG Platform Logos
const PlatformLogo: React.FC<{ platform: string; className?: string }> = ({ platform, className = "w-6 h-6" }) => {
  switch (platform) {
    case "Instagram":
      return (
        <div className={`rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white p-2 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </div>
      );
    case "LinkedIn":
      return (
        <div className={`rounded-xl bg-[#0A66C2] flex items-center justify-center text-white p-2 ${className}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </div>
      );
    case "X":
      return (
        <div className={`rounded-xl bg-[#111111] dark:bg-[#FAFAF8] text-white dark:text-[#111111] flex items-center justify-center p-2 ${className}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      );
    case "TikTok":
      return (
        <div className={`rounded-xl bg-[#000000] text-white flex items-center justify-center p-2 ${className}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
          </svg>
        </div>
      );
    case "YouTube":
      return (
        <div className={`rounded-xl bg-[#FF0000] text-white flex items-center justify-center p-2 ${className}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      );
    case "Facebook":
      return (
        <div className={`rounded-xl bg-[#1877F2] text-white flex items-center justify-center p-2 ${className}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
      );
    case "Threads":
      return (
        <div className={`rounded-xl bg-[#000000] text-white flex items-center justify-center p-2 ${className}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.8 13.5c-.7 1.2-1.9 2-3.4 2-2.5 0-4.4-2.1-4.4-4.7s1.9-4.7 4.4-4.7c1.8 0 3.1.9 3.7 2.3h-2.1c-.4-.6-1.1-[1]-1.6-[1]-1.3 0-2.3 1.1-2.3 2.4s1 2.4 2.3 2.4c.8 0 1.5-.4 1.8-1.1h1.6z" />
          </svg>
        </div>
      );
    case "Pinterest":
      return (
        <div className={`rounded-xl bg-[#E60023] text-white flex items-center justify-center p-2 ${className}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={`rounded-xl bg-[#0866FF] text-white flex items-center justify-center p-2 ${className}`}>
          <Zap className="w-full h-full" />
        </div>
      );
  }
};

export const SocialAccountsView: React.FC = () => {
  const { socialAccounts, toggleAccountConnection } = useAppStore();
  const [activeSyncingId, setActiveSyncingId] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [userEmail, setUserEmail] = useState("alex.morgan.google@gmail.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("sp_user_email") || "alex.morgan.google@gmail.com";
      setUserEmail(email);
    }
  }, []);

  const syncMutation = useMutation({
    mutationFn: (accountId: string) => socialPulseApi.syncSocialAccount(accountId),
    onSuccess: (_, accountId) => {
      setActiveSyncingId(null);
      toast.success("Account telemetry synchronized via API!");
    },
    onError: () => {
      setActiveSyncingId(null);
      toast.error("Failed to sync telemetry.");
    },
  });

  const handleSyncNow = (id: string, platform: string) => {
    setActiveSyncingId(id);
    toast.info(`Synchronizing telemetry with ${platform}...`);
    syncMutation.mutate(id);
  };

  const handleConnectToggle = (id: string, platform: string, connected: boolean) => {
    toggleAccountConnection(id);
    if (!connected) {
      toast.success(`Successfully connected ${platform} linked to ${userEmail}!`);
    } else {
      toast.info(`Disconnected ${platform} channel.`);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0866FF]">
              OAuth & Integration Hub
            </span>
            <span className="bg-[#E7F0FF] text-[#0866FF] dark:bg-[#0866FF]/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Linked to {userEmail}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111111] dark:text-white">
            Connected Social Accounts
          </h1>
          <p className="text-sm text-[#777777] dark:text-[#A0A0A0] mt-1">
            Manage Instagram, LinkedIn, YouTube, TikTok, Facebook, X & Pinterest channels for {userEmail}.
          </p>
        </div>

        <button
          onClick={() => setShowConnectModal(true)}
          className="px-5 py-2.5 rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white font-extrabold text-xs shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Channel</span>
        </button>
      </motion.div>

      {/* Grid of Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {socialAccounts.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`bg-white dark:bg-[#18181B] rounded-[28px] border p-6 flex flex-col justify-between h-full space-y-4 shadow-xs ${
              account.connected
                ? "border-[#0866FF]/40 shadow-blue-500/10"
                : "border-black/[0.06] dark:border-white/[0.08] opacity-80"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <PlatformLogo platform={account.platform} className="w-10 h-10 shrink-0 shadow-xs" />
                  <div>
                    <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">
                      {account.platform}
                    </h3>
                    <p className="text-xs text-[#777777] dark:text-[#A0A0A0]">
                      {account.username}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-3 h-3 rounded-full border-2 border-white dark:border-[#18181B] ${
                    account.connected ? "bg-[#31A24C]" : "bg-[#A0A0A0]"
                  }`}
                  title={account.connected ? "Active OAuth Token" : "Disconnected"}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#FAFBFD] dark:bg-[#121316] border border-black/[0.04] dark:border-white/[0.06] text-xs">
                <div>
                  <span className="text-[10px] text-[#777777] dark:text-[#A0A0A0] block">Followers</span>
                  <span className="font-extrabold text-[#111111] dark:text-white">
                    {account.followers}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#777777] dark:text-[#A0A0A0] block">Sync Health</span>
                  <span className="font-extrabold text-[#0866FF]">
                    {account.connected ? `${account.health}%` : "--"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center justify-between text-[11px] text-[#777777] dark:text-[#A0A0A0]">
                <span>Status:</span>
                <span className="font-semibold text-[#111111] dark:text-white">
                  {account.lastSynced}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {account.connected ? (
                  <>
                    <button
                      onClick={() => handleSyncNow(account.id, account.platform)}
                      disabled={activeSyncingId === account.id}
                      className="flex-1 py-2 rounded-full border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-xs font-bold text-[#111111] dark:text-white hover:border-[#0866FF] flex items-center justify-center gap-1.5 transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-[#0866FF] ${activeSyncingId === account.id ? "animate-spin" : ""}`} />
                      <span>{activeSyncingId === account.id ? "Syncing..." : "Sync Now"}</span>
                    </button>

                    <button
                      onClick={() => handleConnectToggle(account.id, account.platform, account.connected)}
                      className="px-3.5 py-2 rounded-full border border-[#FA383E]/20 text-[#FA383E] hover:bg-[#FEF2F2] text-xs font-bold transition-colors"
                      title="Disconnect"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnectToggle(account.id, account.platform, account.connected)}
                    className="w-full py-2 bg-[#0866FF] hover:bg-[#1877F2] text-white rounded-full text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Connect Channel</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Connect Channel Modal */}
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
              className="bg-white dark:bg-[#18181B] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-6 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowConnectModal(false)}
                className="absolute right-5 top-5 text-[#A0A0A0] hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-[#0866FF]" />
                <h3 className="text-xl font-black text-[#111111] dark:text-white">Connect Social Channel</h3>
              </div>
              <p className="text-xs text-[#777777] dark:text-[#A0A0A0] mb-6">
                Authorize channel integration using your authenticated account: <strong className="text-[#0866FF]">{userEmail}</strong>
              </p>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {socialAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-[#FAFBFD] dark:bg-[#121316]"
                  >
                    <div className="flex items-center gap-3">
                      <PlatformLogo platform={acc.platform} className="w-8 h-8 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-[#111111] dark:text-white">{acc.platform}</h4>
                        <p className="text-[10px] text-[#777777]">{acc.connected ? "Connected" : "Available to Link"}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleConnectToggle(acc.id, acc.platform, acc.connected);
                        setShowConnectModal(false);
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                        acc.connected
                          ? "bg-[#FEF2F2] text-[#FA383E]"
                          : "bg-[#0866FF] hover:bg-[#1877F2] text-white shadow-xs"
                      }`}
                    >
                      {acc.connected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
