"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import {
  Layers,
  Plus,
  Target,
  DollarSign,
  TrendingUp,
  Clock,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

const columns = ["Ideation", "In Production", "Scheduled", "Live", "Completed"];

export const CampaignsView: React.FC = () => {
  const { campaigns, setIsCreateCampaignModalOpen } = useAppStore();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

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
              Multi-Channel Campaign Manager
            </span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: '#C8A14A', border: '1px solid var(--accent-border)' }}>Kanban & Timeline</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Marketing Campaigns
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Track campaign stages, budget burn rate, ROI attribution, and goal progression.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateCampaignModalOpen(true)}
            className="px-5 py-2.5 rounded-full text-white font-semibold text-xs shadow-md flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)', boxShadow: '0 4px 12px rgba(200,161,74,0.25)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </motion.div>

      {/* Campaign KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[24px] p-5 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <span className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>Total Campaign Budget</span>
          <span className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>$80,000</span>
          <span className="text-[11px] block mt-1 font-semibold" style={{ color: '#C8A14A' }}>$20.6K Spent to date</span>
        </div>
        <div className="rounded-[24px] p-5 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <span className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>Average Campaign ROI</span>
          <span className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>4.8x</span>
          <span className="text-[11px] text-[#22C55E] block mt-1 font-semibold">+1.2x vs Q2 benchmark</span>
        </div>
        <div className="rounded-[24px] p-5 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <span className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>Combined Target Reach</span>
          <span className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>6.42M</span>
          <span className="text-[11px] block mt-1" style={{ color: 'var(--text-muted)' }}>Cross-platform impressions</span>
        </div>
        <div className="rounded-[24px] p-5 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <span className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>Active Campaigns</span>
          <span className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>4 Live</span>
          <span className="text-[11px] block mt-1 font-semibold" style={{ color: '#C8A14A' }}>100% on schedule</span>
        </div>
      </div>

      {/* Kanban Board View */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((col) => {
          const colCampaigns = campaigns.filter((c) => c.status === col);
          return (
            <div key={col} className="rounded-[24px] p-4 space-y-3 shadow-xs" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)' }}>
              <div className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid var(--card-border)' }}>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                  {col}
                </span>
                <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: 'var(--accent-light)', color: '#C8A14A' }}>
                  {colCampaigns.length}
                </span>
              </div>

              <div className="space-y-3">
                {colCampaigns.length === 0 ? (
                  <p className="text-[11px] text-center py-4" style={{ color: 'var(--text-muted)' }}>No campaigns</p>
                ) : (
                  colCampaigns.map((cmp) => (
                    <div
                      key={cmp.id}
                      onClick={() => toast.info(`Inspecting ${cmp.title}`)}
                      className="p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2 shadow-xs"
                      style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md" style={{ background: 'var(--accent-light)', color: '#C8A14A' }}>
                          Budget: {cmp.budget}
                        </span>
                        <MoreHorizontal className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                      </div>

                      <h4 className="text-xs font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                        {cmp.title}
                      </h4>

                      <div className="pt-2 border-t flex items-center justify-between text-[10px]" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                        <span>ROI: <strong className="text-[#22C55E]">{cmp.roi}</strong></span>
                        <span>Reach: {cmp.reach}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
