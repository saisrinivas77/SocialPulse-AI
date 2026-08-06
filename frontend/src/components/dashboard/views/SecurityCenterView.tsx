"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Smartphone,
  Laptop,
  Globe,
  KeyRound,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Loader2,
  Trash2,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { socialPulseApi } from "@/lib/api";

const OAUTH_PROVIDERS = [
  { id: "google", name: "Google Account", icon: "🌐", desc: "Google OAuth 2.0 Identity" },
  { id: "github", name: "GitHub Account", icon: "🐙", desc: "GitHub Identity & Developer SSO" },
  { id: "microsoft", name: "Microsoft Account", icon: "🪟", desc: "Microsoft Azure AD & Enterprise SSO" },
  { id: "linkedin", name: "LinkedIn Account", icon: "💼", desc: "LinkedIn Professional Profile" },
];

export function SecurityCenterView() {
  const [overview, setOverview] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [connectedProviders, setConnectedProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      const [ovData, sessData, providersData] = await Promise.all([
        socialPulseApi.getSecurityOverview(),
        socialPulseApi.getActiveSessions(),
        socialPulseApi.getConnectedAuthProviders(),
      ]);
      setOverview(ovData);
      setSessions(sessData || []);
      setConnectedProviders(providersData || []);
    } catch {
      toast.error("Failed to load security overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  const handleDisconnectProvider = async (provider: string) => {
    if (confirm(`Are you sure you want to disconnect ${provider.toUpperCase()} login provider?`)) {
      try {
        const res = await socialPulseApi.disconnectAuthProvider(provider);
        if (res?.success === false) {
          toast.error("Cannot disconnect your primary or sole authentication provider.");
        } else {
          toast.success(`Disconnected ${provider.toUpperCase()} login provider.`);
          loadSecurityData();
        }
      } catch {
        toast.error(`Failed to disconnect ${provider}.`);
      }
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    try {
      await socialPulseApi.revokeSession(sessionId);
      toast.success("Device session revoked successfully");
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch {
      toast.error("Failed to revoke session");
    }
  };

  const handleLogoutAll = async () => {
    try {
      await socialPulseApi.logoutAllDevices();
      toast.success("Logged out from all active devices");
      loadSecurityData();
    } catch {
      toast.error("Failed to log out all devices");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setUpdatingPassword(true);
    try {
      await socialPulseApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#0866FF] animate-spin" />
      </div>
    );
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#0866FF]" />
            <h1 className="text-2xl font-black text-[#050505] dark:text-[#E4E6EB] tracking-tight">Security & Identity Center</h1>
          </div>
          <p className="text-[14px] text-[#65676B] dark:text-[#B0B3B8] mt-1">
            Manage single sign-on login providers (Google, GitHub, Microsoft, LinkedIn), active login devices, session revocation, and security policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadSecurityData}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#65676B] dark:text-[#B0B3B8] bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 rounded-xl hover:bg-[#F0F2F5] transition"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Status
          </button>
          <button
            onClick={handleLogoutAll}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-red-600 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl hover:bg-red-100 transition"
          >
            <LogOut className="w-4 h-4" /> Logout All Devices
          </button>
        </div>
      </div>

      {/* Security Health Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#8A8D91]">Security Score</span>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#050505] dark:text-[#E4E6EB]">{overview?.security_score || 95}/100</span>
            <span className="text-[12px] font-semibold text-emerald-600">Enterprise Grade</span>
          </div>
          <p className="text-[12px] text-[#8A8D91] mt-2">Protected by JWT token rotation & PKCE OAuth validation.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#8A8D91]">Email Verification</span>
            {overview?.is_verified ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#050505] dark:text-[#E4E6EB]">
              {overview?.is_verified ? "Verified Account" : "Pending Verification"}
            </span>
          </div>
          <p className="text-[12px] text-[#8A8D91] mt-2">{overview?.email}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#8A8D91]">Active Sessions</span>
            <Smartphone className="w-5 h-5 text-[#0866FF]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#050505] dark:text-[#E4E6EB]">{sessions.length} Devices</span>
          </div>
          <p className="text-[12px] text-[#8A8D91] mt-2">Track real-time device telemetry & IP addresses.</p>
        </div>
      </div>

      {/* Connected Login Providers */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-[#050505] dark:text-[#E4E6EB] flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#0866FF]" /> Connected SSO & OAuth Login Providers
        </h2>
        <p className="text-[13px] text-[#65676B] dark:text-[#B0B3B8]">
          Link multiple OAuth identity providers (Google, GitHub, Microsoft, LinkedIn) to your single user profile. Authenticate with any connected provider instantly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 pt-2">
          {OAUTH_PROVIDERS.map((provider) => {
            const linked = connectedProviders.find(
              (p: any) => p.provider?.toLowerCase() === provider.id
            );
            const isConnected = linked?.connected || linked?.is_primary;

            return (
              <div
                key={provider.id}
                className={`p-4 rounded-2xl border ${
                  isConnected
                    ? "border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10"
                    : "border-black/5 dark:border-white/10 bg-[#FAFBFD] dark:bg-[#121316]"
                } flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{provider.icon}</span>
                  <div>
                    <div className="text-sm font-extrabold text-[#050505] dark:text-[#E4E6EB] flex items-center gap-1.5">
                      <span>{provider.name}</span>
                      {isConnected && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Linked ✓
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#65676B] dark:text-[#B0B3B8]">
                      {isConnected ? (
                        <span>Last Login: {linked?.last_login ? new Date(linked.last_login).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}</span>
                      ) : (
                        <span>{provider.desc}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <button
                      onClick={() => handleDisconnectProvider(provider.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 border border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                    >
                      Unlink
                    </button>
                  ) : (
                    <a
                      href={`${apiBase}/auth/${provider.id}/login`}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#0866FF] text-white hover:bg-[#1877F2] transition flex items-center gap-1 shadow-xs"
                    >
                      <span>Connect</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Sessions & Devices */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#050505] dark:text-[#E4E6EB] flex items-center gap-2">
            <Laptop className="w-5 h-5 text-[#0866FF]" /> Active Login Devices & Sessions
          </h2>
          <span className="text-[12px] font-semibold text-[#65676B]">{sessions.length} Active</span>
        </div>

        <div className="divide-y divide-black/5 dark:divide-white/10 border border-black/5 dark:border-white/10 rounded-xl overflow-hidden">
          {sessions.map((sess) => (
            <div key={sess.id} className="p-4 bg-white dark:bg-[#242526] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#FAFBFD] dark:bg-[#121316] border border-black/5 dark:border-white/10 text-[#0866FF]">
                  {sess.device_type === "mobile" ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#050505] dark:text-[#E4E6EB]">
                      {sess.browser_name || "Modern Browser"} on {sess.os_name || "Desktop"}
                    </span>
                    {sess.is_current && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-full">
                        CURRENT DEVICE
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-[#65676B] dark:text-[#B0B3B8] mt-0.5 flex items-center gap-3">
                    <span>IP: {sess.ip_address || "127.0.0.1"}</span>
                    <span>•</span>
                    <span>Last active: {new Date(sess.last_active).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {!sess.is_current && (
                <button
                  onClick={() => handleRevokeSession(sess.id)}
                  className="self-start sm:self-center px-3 py-1.5 text-[12px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Revoke Access
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Change Password Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-[#050505] dark:text-[#E4E6EB] flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-[#0866FF]" /> Update Account Password
        </h2>
        <p className="text-[13px] text-[#65676B] dark:text-[#B0B3B8]">
          Ensure your password is at least 8 characters long and contains uppercase letters, numbers, and symbols.
        </p>

        <form onSubmit={handleChangePassword} className="max-w-xl space-y-4 pt-2">
          <div>
            <label className="block text-[12px] font-bold text-[#65676B] uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-[#FAFBFD] dark:bg-[#121316] text-[14px] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:border-[#0866FF]"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#65676B] uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-[#FAFBFD] dark:bg-[#121316] text-[14px] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:border-[#0866FF]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#65676B] uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-[#FAFBFD] dark:bg-[#121316] text-[14px] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:border-[#0866FF]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updatingPassword}
            className="px-6 py-2.5 bg-[#0866FF] text-white text-[13px] font-bold rounded-xl hover:bg-[#1877F2] transition flex items-center gap-2"
          >
            {updatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
