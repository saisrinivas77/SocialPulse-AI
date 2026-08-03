"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Share2, Printer, X, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";

export const PdfReportModal: React.FC = () => {
  const { isPdfReportModalOpen, setIsPdfReportModalOpen, selectedReportTitle } = useAppStore();

  if (!isPdfReportModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl bg-white dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] rounded-3xl h-[85vh] flex flex-col justify-between shadow-2xl overflow-hidden relative"
        >
          {/* Modal Header */}
          <div className="p-4 border-b border-[#ECE8E1] dark:border-[#262623] flex items-center justify-between bg-[#FAFAF8] dark:bg-[#0C0C0B]">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C8A14A]" />
              <div>
                <h3 className="text-sm font-bold text-[#111111] dark:text-[#FAFAF8]">
                  {selectedReportTitle}
                </h3>
                <span className="text-[10px] text-[#8A8A8A]">Generated Executive Preview • 12 Pages</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.success("PDF sent to connected printer")}
                className="p-2 rounded-xl border border-[#ECE8E1] dark:border-[#262623] text-[#5B5B5B] dark:text-[#A0A09B] hover:border-[#C8A14A]"
                title="Print"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText("https://app.socialpulse.ai/reports/share/x94821");
                  toast.success("Sharable report link copied to clipboard!");
                }}
                className="px-3 py-1.5 rounded-xl border border-[#ECE8E1] dark:border-[#262623] text-xs font-semibold text-[#111111] dark:text-[#FAFAF8] hover:border-[#C8A14A] flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-[#C8A14A]" />
                <span>Share Link</span>
              </button>

              <button
                onClick={() => toast.success("Downloading PDF...")}
                className="btn-gold-primary px-4 py-1.5 text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={() => setIsPdfReportModalOpen(false)}
                className="p-2 rounded-xl border border-[#ECE8E1] dark:border-[#262623] text-[#8A8A8A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Simulated PDF Viewer Paper Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-[#FAFAF8] dark:bg-[#0C0C0B] flex justify-center">
            <div className="w-full max-w-2xl bg-white dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] rounded-2xl p-8 space-y-8 shadow-md text-[#111111] dark:text-[#FAFAF8]">
              {/* Report Header */}
              <div className="flex items-center justify-between border-b border-[#ECE8E1] dark:border-[#262623] pb-6">
                <div>
                  <span className="text-xl font-extrabold gold-gradient-text">SocialPulse AI</span>
                  <p className="text-[10px] text-[#8A8A8A] uppercase tracking-wider font-semibold">Executive Performance Audit</p>
                </div>
                <div className="text-right text-xs text-[#8A8A8A]">
                  <p className="font-bold text-[#111111] dark:text-[#FAFAF8]">Period: July 2026</p>
                  <p>Prepared for: Alex Morgan</p>
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#C8A14A]">
                  1. Executive Summary
                </h4>
                <p className="text-xs leading-relaxed text-[#5B5B5B] dark:text-[#A0A09B]">
                  During the period of July 2026, SocialPulse AI monitored 8 primary social channels. Cross-platform reach expanded by +28.6% to 2.45M total impressions. Viral sentiment index remained consistently high at +96% positive response.
                </p>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] text-center">
                <div>
                  <span className="text-[10px] text-[#8A8A8A] uppercase block">Total Reach</span>
                  <span className="text-lg font-extrabold text-[#111111] dark:text-[#FAFAF8]">2.45M</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8A8A8A] uppercase block">Engagement Rate</span>
                  <span className="text-lg font-extrabold text-[#C8A14A]">5.84%</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8A8A8A] uppercase block">Attributed Revenue</span>
                  <span className="text-lg font-extrabold text-[#22C55E]">$48,250</span>
                </div>
              </div>

              {/* Watermark / Footer */}
              <div className="pt-8 border-t border-[#ECE8E1] dark:border-[#262623] text-center text-[10px] text-[#8A8A8A]">
                Confidential Document • Generated by SocialPulse AI Engine v3.5
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
