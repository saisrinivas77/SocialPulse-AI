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
  const [currentUser, setCurrentUser] = React.useState({
    name: "User",
    email: "user@socialpulse.ai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("sp_user_name");
      const storedEmail = localStorage.getItem("sp_user_email");
      const storedAvatar = localStorage.getItem("sp_user_avatar");
      if (storedName || storedEmail) {
        const name = storedName || storedEmail?.split("@")[0] || "User";
        setCurrentUser({
          name,
          email: storedEmail || "user@socialpulse.ai",
          avatar: storedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=C8A14A&color=fff`,
        });
      }
    }
  }, []);

  const displayMembers = teamMembers.map((m) =>
    m.role === "Owner"
      ? {
          ...m,
          name: currentUser.name,
          email: currentUser.email,
          avatar: currentUser.avatar,
        }
      : m
  );

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
              Role-Based Access Control
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'var(--accent-light)', color: '#C8A14A', border: '1px solid var(--accent-border)' }}>
              {teamMembers.length} Members Active
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Team & Permissions
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Manage workspace seats, invite collaborators, and configure granular enterprise permissions.
          </p>
        </div>

        <button
          onClick={() => setIsInviteTeamModalOpen(true)}
          className="px-5 py-2.5 rounded-full text-white font-semibold text-xs shadow-md flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)', boxShadow: '0 4px 12px rgba(200,161,74,0.25)' }}
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </motion.div>

      {/* Team Members List */}
      <div className="rounded-[24px] overflow-hidden shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--card-border)' }}>
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Active Team Members</h3>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Pulse Enterprise Workspace</span>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
          {displayMembers.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
              <p className="text-xs">No team members invited yet.</p>
            </div>
          ) : (
            displayMembers.map((member) => (
              <div key={member.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-2xl object-cover shrink-0"
                    style={{ border: '2px solid #C8A14A' }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{member.name}</h4>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: '#C8A14A' }}>
                        {member.role}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>Active {member.lastActive}</span>
                  <button
                    onClick={() => toast.info(`Editing settings for ${member.name}`)}
                    className="px-3 py-1.5 rounded-xl font-semibold hover:border-[#C8A14A] transition-colors"
                    style={{ border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
                  >
                    Manage Seat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="rounded-[24px] p-6 space-y-4 shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" style={{ color: '#C8A14A' }} />
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            Granular Role Permissions Matrix
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead className="border-b text-xs font-bold" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
              <tr>
                <th className="py-3 px-4 text-left">Module / Feature</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Content Lead</th>
                <th className="py-3 px-4">Analyst</th>
                <th className="py-3 px-4">Reviewer</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
              {permissionsMatrix.map((row) => (
                <tr key={row.module}>
                  <td className="py-3.5 px-4 text-left font-bold" style={{ color: 'var(--text-primary)' }}>{row.module}</td>
                  <td className="py-3.5 px-4">{row.Owner ? <Check className="w-4 h-4 text-[#22C55E] mx-auto" /> : <X className="w-4 h-4 text-[#A0A0A0] mx-auto" />}</td>
                  <td className="py-3.5 px-4">{row.Admin ? <Check className="w-4 h-4 text-[#22C55E] mx-auto" /> : <X className="w-4 h-4 text-[#A0A0A0] mx-auto" />}</td>
                  <td className="py-3.5 px-4">{row["Content Lead"] ? <Check className="w-4 h-4 text-[#22C55E] mx-auto" /> : <X className="w-4 h-4 text-[#A0A0A0] mx-auto" />}</td>
                  <td className="py-3.5 px-4">{row.Analyst ? <Check className="w-4 h-4 text-[#22C55E] mx-auto" /> : <X className="w-4 h-4 text-[#A0A0A0] mx-auto" />}</td>
                  <td className="py-3.5 px-4">{row.Reviewer ? <Check className="w-4 h-4 text-[#22C55E] mx-auto" /> : <X className="w-4 h-4 text-[#A0A0A0] mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
