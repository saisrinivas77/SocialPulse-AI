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
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-amber-400" /> Enterprise Admin Console
          </h1>
          <p className="text-xs text-gray-400 mt-1">System status, Redis queue health, API tokens, audit logs, and backend workers</p>
        </div>

        <button
          onClick={() => toast.success("System status refreshed.")}
          className="btn-magnetic btn-gold px-4 py-2.5 text-xs font-bold flex items-center gap-2"
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
            <div key={sys.label} className="glass-card p-5 border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>{sys.label}</span>
                <Icon className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-lg font-black text-white">{sys.val}</div>
              <span className="text-[10px] text-green-400 font-bold flex items-center gap-1">
                <Activity className="w-3 h-3" /> Operational
              </span>
            </div>
          );
        })}
      </div>

      {/* Audit Logs Table */}
      <div className="glass-card p-6 border-amber-500/20 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" /> System Audit Logs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="border-b border-amber-500/15 text-amber-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{log.action}</td>
                  <td className="py-3.5 px-4">{log.user}</td>
                  <td className="py-3.5 px-4 text-gray-400">{log.time}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-500">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
