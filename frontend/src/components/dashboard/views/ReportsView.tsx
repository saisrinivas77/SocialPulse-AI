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
    desc: "Board-level analytics summary covering reach, revenue attribution, and ROI metrics.",
    date: "Aug 01, 2026",
    pages: 12,
    type: "PDF & CSV",
  },
  {
    id: "rep-2",
    title: "Monthly Brand Sentiment Audit",
    desc: "AI qualitative analysis of 45,000+ comment threads across Instagram & LinkedIn.",
    date: "Jul 31, 2026",
    pages: 8,
    type: "PDF",
  },
  {
    id: "rep-3",
    title: "Competitor Market Share Benchmark",
    desc: "Relative share of voice vs top 5 Silicon Valley social competitors.",
    date: "Jul 25, 2026",
    pages: 16,
    type: "PDF & Deck",
  },
  {
    id: "rep-4",
    title: "Paid Social ROI Attribution",
    desc: "Granular breakdown of ad conversion funnel from impression to closed deal.",
    date: "Jul 20, 2026",
    pages: 6,
    type: "CSV Data",
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
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0866FF]">
              Automated Intelligence Exports
            </span>
            <span className="apple-badge text-[9px] px-2 py-0.5 rounded-full">Executive Ready</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#050505] dark:text-[#E4E6EB]">
            Reports & Export Center
          </h1>
          <p className="text-sm text-[#65676B] dark:text-[#B0B3B8] mt-1">
            Generate, inspect, and schedule white-labeled executive PDF reports and raw CSV telemetry exports.
          </p>
        </div>

        <button
          onClick={() => handleOpenPdf("Custom Executive Report")}
          className="px-5 py-2.5 rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white font-semibold text-xs shadow-md flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate New Report</span>
        </button>
      </motion.div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTemplates.map((report) => (
          <div
            key={report.id}
            className="apple-card p-6 flex flex-col justify-between space-y-4 hover:border-[#0866FF]"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md bg-[#0866FF]/10 text-[#0866FF]">
                  {report.type}
                </span>
                <span className="text-xs text-[#8A8D91]">{report.date}</span>
              </div>

              <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB] mb-1">
                {report.title}
              </h3>
              <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] leading-relaxed">
                {report.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#8A8D91] font-medium">{report.pages} pages • Generated</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenPdf(report.title)}
                  className="px-3.5 py-1.5 rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#242526] text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] hover:border-[#0866FF] flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-[#0866FF]" />
                  <span>Preview PDF</span>
                </button>

                <button
                  onClick={() => handleExport("csv", report.title)}
                  disabled={exportMutation.isPending}
                  className="p-2 rounded-xl border border-black/5 dark:border-white/10 text-[#65676B] dark:text-[#B0B3B8] hover:border-[#0866FF]"
                  title="Download Raw Data"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
