"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { socialPulseApi } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import {
  Download,
  Eye,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const reportTemplates = [
  {
    id: "rep-1",
    title: "Q3 Executive Performance Brief",
    desc: "Board-level analytics summary covering reach, revenue attribution, and ROI metrics across all connected channels.",
    date: "Aug 01, 2026",
    pages: 12,
    type: "PDF & CSV",
    badge: "Latest",
    badgeColor: "#22C55E",
  },
  {
    id: "rep-2",
    title: "Monthly Brand Sentiment Audit",
    desc: "AI qualitative analysis of 45,000+ comment threads across Instagram & LinkedIn with emotion breakdown.",
    date: "Jul 31, 2026",
    pages: 8,
    type: "PDF",
    badge: "AI Generated",
    badgeColor: "#C8A14A",
  },
  {
    id: "rep-3",
    title: "Competitor Market Share Benchmark",
    desc: "Relative share of voice vs top 5 Silicon Valley social competitors with engagement velocity comparison.",
    date: "Jul 25, 2026",
    pages: 16,
    type: "PDF & Deck",
    badge: "Deck Ready",
    badgeColor: "#8B5CF6",
  },
  {
    id: "rep-4",
    title: "Paid Social ROI Attribution",
    desc: "Granular breakdown of ad conversion funnel from first impression to closed enterprise deal.",
    date: "Jul 20, 2026",
    pages: 6,
    type: "CSV Data",
    badge: "Raw Data",
    badgeColor: "#F59E0B",
  },
  {
    id: "rep-5",
    title: "Cross-Platform Engagement Deep Dive",
    desc: "Post-by-post engagement analysis across LinkedIn, Instagram, X, and TikTok with virality scores.",
    date: "Jul 15, 2026",
    pages: 20,
    type: "PDF & CSV",
    badge: "Multi-Channel",
    badgeColor: "#E1306C",
  },
  {
    id: "rep-6",
    title: "Audience Demographics & Growth Report",
    desc: "Age, gender, location, and interest segmentation across all platforms with 90-day growth trajectory.",
    date: "Jul 10, 2026",
    pages: 10,
    type: "PDF",
    badge: "Audience Intel",
    badgeColor: "#0EA5E9",
  },
  {
    id: "rep-7",
    title: "Video Content Performance Analysis",
    desc: "YouTube & TikTok video funnel analysis: views, watch time, CTR, and subscriber conversion rates.",
    date: "Jul 05, 2026",
    pages: 14,
    type: "PDF & Deck",
    badge: "Video",
    badgeColor: "#FF0000",
  },
  {
    id: "rep-8",
    title: "H1 2026 Annual Growth Summary",
    desc: "Semi-annual executive summary of follower growth, content ROI, campaign performance, and AI workflow savings.",
    date: "Jun 30, 2026",
    pages: 24,
    type: "PDF & CSV",
    badge: "Annual",
    badgeColor: "#D97706",
  },
];

export const ReportsView: React.FC = () => {
  const { setIsPdfReportModalOpen, setSelectedReportTitle } = useAppStore();

  const exportMutation = useMutation({
    mutationFn: ({ format, title }: { format: "pdf" | "csv" | "excel"; title: string }) =>
      socialPulseApi.generateReport(format, title),
    onSuccess: (data) => {
      toast.success(data.message || "Report generated and downloaded!");
    },
    onError: () => {
      toast.error("Failed to generate report.");
    },
  });

  const handleOpenPdf = (title: string) => {
    setSelectedReportTitle(title);
    setIsPdfReportModalOpen(true);
  };

  const handleExport = (format: "pdf" | "csv" | "excel", title: string) => {
    toast.info(`Generating ${format.toUpperCase()} export for ${title}...`);
    exportMutation.mutate({ format, title });
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
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#C8A14A' }}>
              Automated Intelligence Exports
            </span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: '#C8A14A', border: '1px solid var(--accent-border)' }}>Executive Ready</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Reports & Export Center
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Generate, inspect, and schedule white-labeled executive PDF reports and raw CSV telemetry exports.
          </p>
        </div>

        <button
          onClick={() => handleOpenPdf("Custom Executive Report")}
          className="px-5 py-2.5 rounded-full text-white font-semibold text-xs shadow-md flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)', boxShadow: '0 4px 12px rgba(200,161,74,0.25)' }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate New Report</span>
        </button>
      </motion.div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {reportTemplates.map((report, idx) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="rounded-[24px] p-6 flex flex-col justify-between space-y-4 hover:border-[#C8A14A] transition-colors shadow-xs"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md" style={{ background: 'var(--accent-light)', color: '#C8A14A' }}>
                    {report.type}
                  </span>
                  {report.badge && (
                    <span
                      className="text-[9px] font-extrabold uppercase px-2 py-1 rounded-md text-white"
                      style={{ backgroundColor: report.badgeColor }}
                    >
                      {report.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{report.date}</span>
              </div>

              <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {report.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {report.desc}
              </p>
            </div>

            <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--card-border)' }}>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{report.pages} pages • Generated</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenPdf(report.title)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:border-[#C8A14A] flex items-center gap-1.5 transition-colors"
                  style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  <Eye className="w-3.5 h-3.5" style={{ color: '#C8A14A' }} />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handleExport("csv", report.title)}
                  disabled={exportMutation.isPending}
                  className="p-2 rounded-xl text-xs hover:border-[#C8A14A] transition-colors"
                  style={{ border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}
                  title="Download Raw Data"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
