"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, X } from "lucide-react";
import { toast } from "sonner";

export const InviteTeamModal: React.FC = () => {
  const { isInviteTeamModalOpen, setIsInviteTeamModalOpen } = useAppStore();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Content Lead");

  if (!isInviteTeamModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter team member email");
      return;
    }
    toast.success(`Sent invitation email to ${email} as ${role}!`);
    setIsInviteTeamModalOpen(false);
    setEmail("");
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
              <UserPlus className="w-5 h-5 text-[#C8A14A]" />
              <h3 className="text-base font-bold">Invite Team Member</h3>
            </div>
            <button
              onClick={() => setIsInviteTeamModalOpen(false)}
              className="p-1 rounded-xl text-[#8A8A8A]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#5B5B5B] dark:text-[#A0A09B] block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] focus:outline-none focus:border-[#C8A14A]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#5B5B5B] dark:text-[#A0A09B] block mb-1">Assigned Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] focus:outline-none cursor-pointer font-semibold"
              >
                <option value="Admin">Admin</option>
                <option value="Content Lead">Content Lead</option>
                <option value="Analyst">Analyst</option>
                <option value="Reviewer">Reviewer</option>
              </select>
            </div>

            <button type="submit" className="w-full btn-gold-primary py-2.5 text-xs font-bold mt-2">
              Send Invite Link
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
