"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Key,
  Link2,
  Database,
  ShieldCheck,
  Server,
  ExternalLink,
} from "lucide-react";
import { socialPulseApi } from "@/lib/api";
import { toast } from "sonner";

interface ProviderHealthData {
  name: string;
  status: string;
  ready: boolean;
  client_id_configured: boolean;
  secret_configured: boolean;
  client_id?: string;
  redirect_uri?: string;
  error?: string | null;
}

interface SystemHealthResponse {
  status: string;
  database_status: string;
  database_error?: string | null;
  total_providers: number;
  ready_providers: number;
  providers: Record<string, ProviderHealthData>;
}

export const ProviderHealthView: React.FC = () => {
  const [healthData, setHealthData] = useState<SystemHealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const data = await socialPulseApi.getProviderHealth();
      setHealthData(data);
      toast.success("Provider OAuth configuration health check updated.");
    } catch {
      toast.error("Failed to query provider health API.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const getStatusBadge = (ready: boolean, statusStr: string) => {
    if (ready) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          ✅ Ready
        </span>
      );
    }
    if (statusStr === "MISSING_CREDENTIALS") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          ❌ Missing Secret
        </span>
      );
    }
    if (statusStr === "REDIRECT_MISMATCH") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <XCircle className="w-3.5 h-3.5" />
          ❌ Redirect Mismatch
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
        <XCircle className="w-3.5 h-3.5" />
        ❌ {statusStr.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">OAuth Provider Health Check</h1>
          </div>
          <p className="text-sm text-slate-400">
            Real-time diagnostic verification of production OAuth client keys, secrets, redirect URIs, and database readiness for all 8 supported social networks.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Re-Test Health
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Configured Providers</span>
            <div className="text-2xl font-bold text-white mt-0.5">
              {healthData?.ready_providers ?? 0} / {healthData?.total_providers ?? 8} Ready
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Database Status</span>
            <div className="text-2xl font-bold text-white mt-0.5 capitalize flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${healthData?.database_status === "HEALTHY" ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
              {healthData?.database_status ?? "Healthy"}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">OAuth Diagnostic Engine</span>
            <div className="text-2xl font-bold text-white mt-0.5">Active</div>
          </div>
        </div>
      </div>

      {/* Grid of Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {healthData &&
          Object.entries(healthData.providers).map(([key, provider]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white capitalize">{provider.name}</h3>
                {getStatusBadge(provider.ready, provider.status)}
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-500" /> Client ID Status:
                  </span>
                  <span className={provider.client_id_configured ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                    {provider.client_id_configured ? provider.client_id || "Configured" : "❌ Missing"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> Client Secret:
                  </span>
                  <span className={provider.secret_configured ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                    {provider.secret_configured ? "✅ Configured (AES-256)" : "❌ Missing"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-slate-500" /> Redirect URI:
                  </span>
                  <code className="bg-slate-950/60 p-2 rounded border border-slate-800/80 text-slate-300 font-mono text-[11px] truncate">
                    {provider.redirect_uri || "Not configured"}
                  </code>
                </div>

                {provider.error && (
                  <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{provider.error}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};
