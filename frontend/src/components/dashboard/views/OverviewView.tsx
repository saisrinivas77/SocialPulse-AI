"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useQuery } from "@tanstack/react-query";
import { socialPulseApi } from "@/lib/api";
import {
  Users,
  TrendingUp,
  Zap,
  Award,
  ArrowUpRight,
  Plus,
  BarChart2,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  Layers,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export const OverviewView: React.FC = () => {
  const {
    setCurrentView,
    posts,
    setIsCreatePostModalOpen,
    socialAccounts,
    loadUserAccounts,
    selectedAccountId,
    setSelectedAccountId,
  } = useAppStore();

  const [userName, setUserName] = useState("User");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadUserAccounts();

    if (typeof window !== "undefined") {
      const name =
        localStorage.getItem("sp_user_name") ||
        localStorage.getItem("sp_user_email")?.split("@")[0] ||
        "User";
      setUserName(name.split(" ")[0]);

      // Detect OAuth redirect ?connected={provider} URL parameter
      const params = new URLSearchParams(window.location.search);
      const connectedProvider = params.get("connected");
      const errParam = params.get("error");

      if (connectedProvider) {
        const provName =
          connectedProvider.charAt(0).toUpperCase() + connectedProvider.slice(1);
        toast.success(`${provName} connected successfully!`, {
          id: "oauth-success-toast",
          duration: 5000,
        });

        // Clean up URL parameter cleanly without reloading
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (errParam) {
        toast.error(`Account Connection Notice: ${errParam}`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // Real-Time WebSocket Telemetry
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsHost =
        process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, "") ||
        "localhost:8000/api/v1";
      const wsUrl = `${wsProtocol}//${wsHost}/ws/dashboard`;

      let socket: WebSocket | null = null;
      try {
        socket = new WebSocket(wsUrl);
        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (
              data.event === "analytics.updated" ||
              data.event === "sync.completed"
            ) {
              toast.success("Live telemetry updated from sync worker!", {
                id: "ws-update",
              });
              refetch();
              loadUserAccounts();
            }
          } catch {
            // ignore non-json pings
          }
        };
      } catch {
        // ws fallback
      }

      return () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    }
  }, []);

  const connectedAccounts = socialAccounts.filter((a) => a.connected);
  const connectedCount = connectedAccounts.length;

  // Selected account record (or null if "all")
  const selectedAccount =
    selectedAccountId !== "all"
      ? connectedAccounts.find((a) => a.id === selectedAccountId)
      : null;

  // TanStack Query for Backend Dashboard Analytics
  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ["dashboardOverview", selectedAccountId],
    queryFn: () => socialPulseApi.getOverviewMetrics(),
  });

  // Calculate Real Metric Values
  const getDisplayMetrics = () => {
    if (connectedCount === 0) {
      return {
        followers: 0,
        reach: 0,
        posts: 0,
        engagementRate: 0.0,
        reachLabel: "0",
      };
    }

    if (selectedAccount) {
      return {
        followers: selectedAccount.follower_count || 0,
        reach: selectedAccount.reach_count || 0,
        posts: selectedAccount.posts_count || 0,
        engagementRate: selectedAccount.engagement_rate || 0.0,
        reachLabel:
          selectedAccount.reach_count > 0
            ? selectedAccount.reach_count.toLocaleString()
            : "Not available",
      };
    }

    // Workspace Aggregated Metrics
    const totalFollowers = connectedAccounts.reduce(
      (sum, acc) => sum + (acc.follower_count || 0),
      0
    );
    const totalReach = connectedAccounts.reduce(
      (sum, acc) => sum + (acc.reach_count || 0),
      0
    );
    const totalPosts = connectedAccounts.reduce(
      (sum, acc) => sum + (acc.posts_count || 0),
      0
    );
    const avgEngagement =
      connectedCount > 0
        ? connectedAccounts.reduce(
            (sum, acc) => sum + (acc.engagement_rate || 0.0),
            0
          ) / connectedCount
        : 0.0;

    return {
      followers: totalFollowers,
      reach: totalReach,
      posts: totalPosts,
      engagementRate: avgEngagement,
      reachLabel: totalReach > 0 ? totalReach.toLocaleString() : "Not available",
    };
  };

  const metrics = getDisplayMetrics();

  // Handle Manual Sync Now Action
  const handleSyncNow = async () => {
    if (connectedCount === 0) {
      toast.error("No social accounts connected to sync.");
      return;
    }

    setIsSyncing(true);
    toast.info("Synchronizing latest data from social platform APIs...");

    try {
      if (selectedAccount) {
        await socialPulseApi.syncSocialAccount(selectedAccount.id);
      } else {
        await Promise.all(
          connectedAccounts.map((acc) => socialPulseApi.syncSocialAccount(acc.id))
        );
      }
      await loadUserAccounts();
      await refetch();
      toast.success("Synchronized latest data!");
    } catch {
      toast.error("Data synchronization failed. Please check token permissions.");
    } finally {
      setIsSyncing(false);
    }
  };

  const kpiCards = [
    {
      title: "Total Followers",
      value: metrics.followers,
      isString: false,
      change: connectedCount > 0 ? "Real API" : "No Data",
      isPositive: true,
      icon: Users,
      subtext: selectedAccount
        ? `@${selectedAccount.username}`
        : `Aggregated across ${connectedCount} channels`,
    },
    {
      title: "Cross-Platform Reach",
      value: metrics.reachLabel,
      isString: typeof metrics.reachLabel === "string",
      change: metrics.reach > 0 ? "Live Metrics" : "Not Available",
      isPositive: metrics.reach > 0,
      icon: TrendingUp,
      subtext: "Official provider telemetry",
    },
    {
      title: "Calculated Engagement Rate",
      value: metrics.engagementRate,
      prefix: "",
      suffix: "%",
      isString: false,
      decimals: 2,
      change: metrics.engagementRate > 0 ? "Calculated" : "0.00%",
      isPositive: true,
      icon: Zap,
      subtext: "(likes + comments + shares) / followers",
    },
    {
      title: "Total Posts Count",
      value: metrics.posts,
      isString: false,
      change: "Synced",
      isPositive: true,
      icon: BarChart2,
      subtext: "Published channel media",
    },
    {
      title: "Connection Health",
      value: connectedCount > 0 ? (selectedAccount ? selectedAccount.health : 100) : 0,
      prefix: "",
      suffix: "%",
      isString: false,
      change: connectedCount > 0 ? "Connected" : "Disconnected",
      isPositive: connectedCount > 0,
      icon: Award,
      subtext: "OAuth token status",
    },
  ];

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Hero Welcome Header & Account Selector */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6"
        style={{ borderBottom: '1px solid var(--card-border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#C8A14A' }}>
              Production Social Media Analytics
            </span>
            {connectedCount > 0 ? (
              <span className="bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                Live Sync Active
              </span>
            ) : (
              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                No Accounts Connected
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Good day, {userName}.
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {connectedCount > 0
              ? `Displaying latest synced data for ${
                  selectedAccount
                    ? `${selectedAccount.platform} (@${selectedAccount.username})`
                    : `${connectedCount} connected social channels`
                }.`
              : "Connect your official social media channels to start visualizing real analytics."}
          </p>
        </div>

        {/* Action Controls & Connected Account Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Account Selector Dropdown */}
          {connectedCount > 0 && (
            <div className="relative">
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="appearance-none pl-10 pr-9 py-2.5 rounded-full text-xs font-extrabold cursor-pointer shadow-xs transition-all focus:outline-none"
                style={{
                  border: '1px solid var(--card-border)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="all">
                  🌐 All Accounts ({connectedCount} Connected)
                </option>
                {connectedAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.platform} (@{acc.username})
                  </option>
                ))}
              </select>
              <Layers className="w-4 h-4 absolute left-3.5 top-3 pointer-events-none" style={{ color: '#C8A14A' }} />
            </div>
          )}

          {/* Sync Now Button */}
          <button
            onClick={handleSyncNow}
            disabled={isSyncing || connectedCount === 0}
            className="px-4 py-2.5 rounded-full text-xs font-extrabold shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
            style={{
              border: '1px solid var(--card-border)',
              background: 'var(--card-bg)',
              color: 'var(--text-primary)',
            }}
            title="Sync Latest API Data"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isSyncing ? "animate-spin" : ""
              }`}
              style={{ color: '#C8A14A' }}
            />
            <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
          </button>

          {/* Connect Account Button */}
          <button
            onClick={() => setCurrentView("social-accounts")}
            className="px-5 py-2.5 rounded-full text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all"
            style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)', boxShadow: '0 4px 12px rgba(200,161,74,0.25)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Connect Channel</span>
          </button>
        </div>
      </motion.div>

      {/* ZERO CONNECTED ACCOUNTS EMPTY STATE */}
      {connectedCount === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[32px] p-8 md:p-12 text-center space-y-6 shadow-sm max-w-4xl mx-auto"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'var(--accent-light)', color: '#C8A14A' }}>
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
              Connect Your First Social Account
            </h3>
            <p className="text-sm max-w-lg mx-auto mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              No social channels are connected to this workspace yet. Connect your Instagram Business, Facebook Page, LinkedIn, YouTube, or X channel to start fetching live telemetry and real analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView("social-accounts")}
              className="px-7 py-3.5 rounded-full text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)', boxShadow: '0 6px 16px rgba(200,161,74,0.3)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Connect Social Accounts</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* REAL ANALYTICS KPI CARDS GRID */}
      {connectedCount > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiCards.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="rounded-[24px] p-5 flex flex-col justify-between h-full shadow-xs transition-all"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                    {kpi.title}
                  </span>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', color: '#C8A14A' }}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="my-2">
                  <div className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {kpi.isString ? (
                      <span>{kpi.value}</span>
                    ) : (
                      <>
                        {kpi.prefix}
                        <CountUp
                          end={kpi.value as number}
                          duration={1.5}
                          separator=","
                          decimals={kpi.decimals || 0}
                        />
                        {kpi.suffix}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2" style={{ borderTop: '1px solid var(--card-border)' }}>
                  <span className="font-extrabold text-[#22C55E] flex items-center gap-0.5 text-[11px]">
                    <Check className="w-3 h-3" />
                    {kpi.change}
                  </span>
                  <span className="text-[10px] truncate max-w-[120px]" style={{ color: 'var(--text-muted)' }}>
                    {kpi.subtext}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* DASHBOARD CHARTS & REAL RECENT ACTIVITY */}
      {connectedCount > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Real Telemetry Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 rounded-[28px] p-6 space-y-4 shadow-xs"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
                  Latest Synced Data
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {selectedAccount
                    ? `Telemetry history for @${selectedAccount.username}`
                    : "Aggregated follower trajectory across connected platforms"}
                </p>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E]">
                Synced Data
              </span>
            </div>

            <div className="h-64 w-full flex items-center justify-center text-center p-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'var(--accent-light)', color: '#C8A14A' }}>
                  <BarChart2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Channel Followers: {metrics.followers.toLocaleString()}
                </h4>
                <p className="text-xs max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Telemetry is fetched periodically directly from official provider APIs. Click "Sync Now" to refresh immediately.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Connected Channels Summary */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-[28px] p-6 flex flex-col justify-between h-full space-y-4 shadow-xs"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black" style={{ color: 'var(--text-primary)' }}>
                  Connected Channels ({connectedCount})
                </h3>
                <button
                  onClick={() => setCurrentView("social-accounts")}
                  className="text-xs font-bold hover:underline"
                  style={{ color: '#C8A14A' }}
                >
                  Manage →
                </button>
              </div>

              <div className="space-y-3">
                {connectedAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccountId(acc.id)}
                    className="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3"
                    style={{
                      borderColor: selectedAccountId === acc.id ? '#C8A14A' : 'var(--card-border)',
                      background: selectedAccountId === acc.id ? 'var(--accent-light)' : 'var(--bg-secondary)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.username}
                        className="w-9 h-9 rounded-full object-cover"
                        style={{ border: '1px solid var(--card-border)' }}
                      />
                      <div>
                        <h4 className="text-xs font-extrabold flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                          <span>{acc.platform}</span>
                        </h4>
                        <p className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                          @{acc.username}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="font-extrabold block" style={{ color: 'var(--text-primary)' }}>
                        {acc.followers}
                      </span>
                      <span className="text-[10px] text-[#22C55E] font-semibold">
                        ● Connected
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentView("social-accounts")}
              className="w-full rounded-full border py-2.5 text-xs flex items-center justify-center gap-2 font-extrabold transition-colors"
              style={{
                border: '1px solid var(--card-border)',
                background: 'var(--card-bg)',
                color: 'var(--text-primary)',
              }}
            >
              <Plus className="w-3.5 h-3.5" style={{ color: '#C8A14A' }} /> Connect Another Account
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
