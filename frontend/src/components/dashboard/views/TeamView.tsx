"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import {
  Users,
  UserPlus,
  Shield,
  Check,
  X,
  Mail,
  MoreVertical,
  Key,
} from "lucide-react";
import { toast } from "sonner";

const permissionsMatrix = [
  { module: "AI Studio Prompting", Owner: true, Admin: true, "Content Lead": true, Analyst: false, Reviewer: false },
  { module: "Direct Post Publishing", Owner: true, Admin: true, "Content Lead": true, Analyst: false, Reviewer: false },
  { module: "Analytics Telemetry", Owner: true, Admin: true, "Content Lead": true, Analyst: true, Reviewer: true },
  { module: "OAuth Key Management", Owner: true, Admin: true, "Content Lead": false, Analyst: false, Reviewer: false },
  { module: "Billing & Subscriptions", Owner: true, Admin: false, "Content Lead": false, Analyst: false, Reviewer: false },
];

export const TeamView: React.FC = () => {
  const { teamMembers, setIsInviteTeamModalOpen } = useAppStore();

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
              Role-Based Access Control
            </span>
            <span className="luxury-badge text-[9px] px-2 py-0.5 rounded-full">{teamMembers.length} Members Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-[#FAFAF8]">
            Team & Permissions
          </h1>
          <p className="text-sm text-[#5B5B5B] dark:text-[#A0A09B] mt-1">
            Manage workspace seats, invite collaborators, and configure granular enterprise permissions.
          </p>
        </div>

        <button
          onClick={() => setIsInviteTeamModalOpen(true)}
          className="btn-gold-primary px-5 py-2.5 text-xs flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </motion.div>

      {/* Team Members List */}
      <div className="luxury-card overflow-hidden">
        <div className="p-4 border-b border-[#ECE8E1] dark:border-[#262623] flex items-center justify-between">
          <h3 className="text-base font-bold text-[#111111] dark:text-[#FAFAF8]">Active Team Members</h3>
          <span className="text-xs text-[#8A8A8A]">Pulse Enterprise Workspace</span>
        </div>

        <div className="divide-y divide-[#ECE8E1] dark:divide-[#262623]">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-2xl object-cover border border-[#C8A14A]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#111111] dark:text-[#FAFAF8]">{member.name}</h4>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#F9F5EC] dark:bg-[#262623] text-[#9F7A2F] dark:text-[#D7B45D]">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs text-[#5B5B5B] dark:text-[#A0A09B] mt-0.5">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-[#8A8A8A]">Active {member.lastActive}</span>
                <button
                  onClick={() => toast.info(`Editing settings for ${member.name}`)}
                  className="px-3 py-1.5 rounded-xl border border-[#ECE8E1] dark:border-[#262623] font-semibold text-[#111111] dark:text-[#FAFAF8] hover:border-[#C8A14A]"
                >
                  Manage Seat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="luxury-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#C8A14A]" />
          <h3 className="text-base font-bold text-[#111111] dark:text-[#FAFAF8]">
            Granular Role Permissions Matrix
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead className="bg-[#FAFAF8] dark:bg-[#141413] border-b border-[#ECE8E1] dark:border-[#262623] text-[#8A8A8A] font-bold">
              <tr>
                <th className="py-3 px-4 text-left">Module / Feature</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Content Lead</th>
                <th className="py-3 px-4">Analyst</th>
                <th className="py-3 px-4">Reviewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE8E1] dark:divide-[#262623]">
              {permissionsMatrix.map((row) => (
                <tr key={row.module}>
                  <td className="py-3.5 px-4 text-left font-bold text-[#111111] dark:text-[#FAFAF8]">{row.module}</td>
                  <td className="py-3.5 px-4">{row.Owner ? <Check className="w-4 h-4 text-[#22C55E] mx-auto" /> : <X className="w-4 h-4 text-[#8A8A8A] mx-auto" />}</td>
                  <td className="py-3.5 px-4">{row.Admin ? <Check className="w-4 h-4 text-[#22C55E] mx-auto" /> : <X className="w-4 h-4 text-[#8A8A8A] mx-auto" />}</td>
                  <td className="py-3.5 px-4">{row["Content Lead"] ? <Check className="w-4 h-4 text-[#22C55E] mx-auto" /> : <X className="w-4 h-4 text-[#8A8A8A] mx-auto" />}</td>
                  <td className="py-3.5 px-4">{row.Analyst ? <Check className="w-4 h-4 text-[#22C55E] mx-auto" /> : <X className="w-4 h-4 text-[#8A8A8A] mx-auto" />}</td>
                  <td className="py-3.5 px-4">{row.Reviewer ? <Check className="w-4 h-4 text-[#22C55E] mx-auto" /> : <X className="w-4 h-4 text-[#8A8A8A] mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
