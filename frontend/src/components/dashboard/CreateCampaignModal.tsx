"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, X, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const CreateCampaignModal: React.FC = () => {
  const { isCreateCampaignModalOpen, setIsCreateCampaignModalOpen } = useAppStore();
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("$10,000");

  if (!isCreateCampaignModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please enter a campaign title");
      return;
    }
    toast.success(`Campaign "${title}" created!`);
    setIsCreateCampaignModalOpen(false);
    setTitle("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] rounded-3xl p-6 space-y-6 shadow-2xl relative text-[#111111] dark:text-[#FAFAF8]"
        >
          <div className="flex items-center justify-between border-b border-[#ECE8E1] dark:border-[#262623] pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#C8A14A]" />
              <h3 className="text-base font-bold">Create New Campaign</h3>
            </div>
            <button
              onClick={() => setIsCreateCampaignModalOpen(false)}
              className="p-1 rounded-xl text-[#8A8A8A]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#5B5B5B] dark:text-[#A0A09B] block mb-1">Campaign Title</label>
              <input
                type="text"
                placeholder="e.g. Q4 Global AI Brand Sprint"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] focus:outline-none focus:border-[#C8A14A]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#5B5B5B] dark:text-[#A0A09B] block mb-1">Allocated Budget ($)</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] focus:outline-none focus:border-[#C8A14A]"
              />
            </div>

            <button type="submit" className="w-full btn-gold-primary py-2.5 text-xs font-bold mt-2">
              Launch Campaign Workflow
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
