"use client";

import React, { useState } from "react";
import { ShieldCheck, Cpu, Database, Server, Users, Key, Activity, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const auditLogs = [
  { id: "log-1", action: "API Key Created", user: "alex@socialpulse.ai", time: "10 mins ago", ip: "192.168.1.1" },
  { id: "log-2", action: "Role Modified to Admin", user: "priya@luma.co", time: "45 mins ago", ip: "10.0.0.42" },
  { id: "log-3", action: "Worker Queue Flushed", user: "system_worker", time: "2 hours ago", ip: "127.0.0.1" },
];

export const AdminView: React.FC = () => {
  const [workerStatus, setWorkerStatus] = useState("Healthy (12 Active Workers)");

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6" style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <ShieldCheck className="w-8 h-8" style={{ color: '#C8A14A' }} /> Enterprise Admin Console
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>System status, Redis queue health, API tokens, audit logs, and backend workers</p>
        </div>

        <button
          onClick={() => toast.success("System status refreshed.")}
          className="px-4 py-2.5 text-xs font-bold text-white flex items-center gap-2 rounded-full shadow-md transition-all"
          style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)' }}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh System Telemetry</span>
        </button>
      </div>

      {/* System Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Active REST APIs", val: "111 / 111 Online", icon: Server },
          { label: "Redis Queue Health", val: "0 Jobs Pending", icon: Database },
          { label: "Background Workers", val: "12 Active Nodes", icon: Cpu },
          { label: "Active Subscriptions", val: "1,248 Accounts", icon: Users },
        ].map((sys) => {
          const Icon = sys.icon;
          return (
            <div key={sys.label} className="p-5 rounded-[24px] space-y-3 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <div className="flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                <span>{sys.label}</span>
                <Icon className="w-4 h-4" style={{ color: '#C8A14A' }} />
              </div>
              <div className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{sys.val}</div>
              <span className="text-[10px] text-[#22C55E] font-bold flex items-center gap-1">
                <Activity className="w-3 h-3" /> Operational
              </span>
            </div>
          );
        })}
      </div>

      {/* Audit Logs Table */}
      <div className="p-6 rounded-[24px] space-y-4 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Activity className="w-4 h-4" style={{ color: '#C8A14A' }} /> System Audit Logs
        </h2>
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--card-border)' }}>
          <table className="w-full text-left text-xs font-sans">
            <thead className="text-xs font-bold uppercase tracking-wider" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--card-border)', color: '#C8A14A' }}>
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:opacity-90 transition-colors">
                  <td className="py-3.5 px-4 font-bold" style={{ color: 'var(--text-primary)' }}>{log.action}</td>
                  <td className="py-3.5 px-4">{log.user}</td>
                  <td className="py-3.5 px-4" style={{ color: 'var(--text-muted)' }}>{log.time}</td>
                  <td className="py-3.5 px-4 font-mono" style={{ color: 'var(--text-muted)' }}>{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
