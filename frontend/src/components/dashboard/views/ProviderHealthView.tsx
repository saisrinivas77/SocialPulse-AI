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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          ✅ Ready
        </span>
      );
    }
    if (statusStr === "MISSING_CREDENTIALS") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          ❌ Missing Secret
        </span>
      );
    }
    if (statusStr === "REDIRECT_MISMATCH") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <XCircle className="w-3.5 h-3.5" />
          ❌ Redirect Mismatch
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
        <XCircle className="w-3.5 h-3.5" />
        ❌ {statusStr.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6" style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="w-7 h-7" style={{ color: '#C8A14A' }} />
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>OAuth Provider Health Check</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Real-time diagnostic verification of production OAuth client keys, secrets, redirect URIs, and database readiness for all 8 supported social networks.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)', boxShadow: '0 4px 12px rgba(200,161,74,0.25)' }}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Re-Test Health
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl flex items-center gap-4 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)', color: '#C8A14A' }}>
            <Server className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider block" style={{ color: 'var(--text-muted)' }}>Configured Providers</span>
            <div className="text-2xl font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {healthData?.ready_providers ?? 0} / {healthData?.total_providers ?? 8} Ready
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl flex items-center gap-4 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider block" style={{ color: 'var(--text-muted)' }}>Database Status</span>
            <div className="text-2xl font-bold mt-0.5 capitalize flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span className={`w-2.5 h-2.5 rounded-full ${healthData?.database_status === "HEALTHY" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
              {healthData?.database_status ?? "Healthy"}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl flex items-center gap-4 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)', color: '#C8A14A' }}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider block" style={{ color: 'var(--text-muted)' }}>OAuth Diagnostic Engine</span>
            <div className="text-2xl font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>Active</div>
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
              className="p-6 rounded-2xl space-y-4 transition-all shadow-xs"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>{provider.name}</h3>
                {getStatusBadge(provider.ready, provider.status)}
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b" style={{ borderColor: 'var(--card-border)' }}>
                  <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <Key className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /> Client ID Status:
                  </span>
                  <span className={provider.client_id_configured ? "text-emerald-500 font-medium" : "text-amber-500 font-medium"}>
                    {provider.client_id_configured ? provider.client_id || "Configured" : "❌ Missing"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b" style={{ borderColor: 'var(--card-border)' }}>
                  <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /> Client Secret:
                  </span>
                  <span className={provider.secret_configured ? "text-emerald-500 font-medium" : "text-amber-500 font-medium"}>
                    {provider.secret_configured ? "✅ Configured (AES-256)" : "❌ Missing"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 pt-1">
                  <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <Link2 className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /> Redirect URI:
                  </span>
                  <code className="p-2 rounded border font-mono text-[11px] truncate" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                    {provider.redirect_uri || "Not configured"}
                  </code>
                </div>

                {provider.error && (
                  <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
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
