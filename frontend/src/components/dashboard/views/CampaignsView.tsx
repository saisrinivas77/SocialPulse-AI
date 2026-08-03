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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE8E1] dark:border-[#262623] pb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A14A]">
              Multi-Channel Campaign Manager
            </span>
            <span className="luxury-badge text-[9px] px-2 py-0.5 rounded-full">Kanban & Timeline</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-[#FAFAF8]">
            Marketing Campaigns
          </h1>
          <p className="text-sm text-[#5B5B5B] dark:text-[#A0A09B] mt-1">
            Track campaign stages, budget burn rate, ROI attribution, and goal progression.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateCampaignModalOpen(true)}
            className="btn-gold-primary px-5 py-2.5 text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </motion.div>

      {/* Campaign KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="luxury-card p-5">
          <span className="text-xs text-[#5B5B5B] dark:text-[#A0A09B] block mb-1">Total Campaign Budget</span>
          <span className="text-2xl font-extrabold text-[#111111] dark:text-[#FAFAF8]">$80,000</span>
          <span className="text-[11px] text-[#C8A14A] block mt-1 font-semibold">$20.6K Spent to date</span>
        </div>
        <div className="luxury-card p-5">
          <span className="text-xs text-[#5B5B5B] dark:text-[#A0A09B] block mb-1">Average Campaign ROI</span>
          <span className="text-2xl font-extrabold text-[#111111] dark:text-[#FAFAF8]">4.8x</span>
          <span className="text-[11px] text-[#22C55E] block mt-1 font-semibold">+1.2x vs Q2 benchmark</span>
        </div>
        <div className="luxury-card p-5">
          <span className="text-xs text-[#5B5B5B] dark:text-[#A0A09B] block mb-1">Combined Target Reach</span>
          <span className="text-2xl font-extrabold text-[#111111] dark:text-[#FAFAF8]">6.42M</span>
          <span className="text-[11px] text-[#8A8A8A] block mt-1">Cross-platform impressions</span>
        </div>
        <div className="luxury-card p-5">
          <span className="text-xs text-[#5B5B5B] dark:text-[#A0A09B] block mb-1">Active Campaigns</span>
          <span className="text-2xl font-extrabold text-[#111111] dark:text-[#FAFAF8]">4 Live</span>
          <span className="text-[11px] text-[#C8A14A] block mt-1 font-semibold">100% on schedule</span>
        </div>
      </div>

      {/* Kanban Board View */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((col) => {
          const colCampaigns = campaigns.filter((c) => c.status === col);
          return (
            <div key={col} className="luxury-card p-4 space-y-3 bg-[#FAFAF8]/50 dark:bg-[#141413]/50">
              <div className="flex items-center justify-between pb-2 border-b border-[#ECE8E1] dark:border-[#262623]">
                <span className="text-xs font-bold text-[#111111] dark:text-[#FAFAF8] uppercase tracking-wider">
                  {col}
                </span>
                <span className="w-5 h-5 rounded-full bg-[#C8A14A]/10 text-[#C8A14A] text-[10px] font-bold flex items-center justify-center">
                  {colCampaigns.length}
                </span>
              </div>

              <div className="space-y-3">
                {colCampaigns.map((cmp) => (
                  <div
                    key={cmp.id}
                    onClick={() => toast.info(`Inspecting ${cmp.title}`)}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] hover:border-[#C8A14A] cursor-pointer transition-all space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#F9F5EC] dark:bg-[#262623] text-[#9F7A2F] dark:text-[#D7B45D]">
                        Budget: {cmp.budget}
                      </span>
                      <MoreHorizontal className="w-3.5 h-3.5 text-[#8A8A8A]" />
                    </div>

                    <h4 className="text-xs font-bold text-[#111111] dark:text-[#FAFAF8] leading-snug">
                      {cmp.title}
                    </h4>

                    <div className="pt-2 border-t border-[#ECE8E1] dark:border-[#262623] flex items-center justify-between text-[10px] text-[#8A8A8A]">
                      <span>ROI: <strong className="text-[#22C55E]">{cmp.roi}</strong></span>
                      <span>Reach: {cmp.reach}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
