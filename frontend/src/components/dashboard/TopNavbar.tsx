"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  Plus,
  Check,
  CheckCheck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export const TopNavbar: React.FC = () => {
  const {
    isSidebarCollapsed,
    currentWorkspace,
    setWorkspace,
    setIsSearchOpen,
    setIsCreatePostModalOpen,
    notifications,
    unreadNotificationCount,
    markAsRead,
    markAllAsRead,
    setCurrentView,
  } = useAppStore();
  const { theme, setTheme } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const workspaces = [
    { id: "ws-1", name: "Pulse Enterprise", tier: "Enterprise Pro", logo: "⚡" },
    { id: "ws-2", name: "Acme Global Brand", tier: "Growth Pro", logo: "🚀" },
    { id: "ws-3", name: "Personal AI Studio", tier: "Creator Tier", logo: "✨" },
  ];

  return (
    <header
      className={`sticky top-0 z-30 h-16 border-b border-[#ECE8E1] dark:border-[#262623] bg-[#FFFFFF]/90 dark:bg-[#0C0C0B]/90 backdrop-blur-xl transition-all duration-300 flex items-center justify-between px-6 sm:px-8 ${
        isSidebarCollapsed ? "pl-20 sm:pl-24" : "pl-64 sm:pl-72"
      }`}
    >
      {/* Left: Global AI Search Input Trigger */}
      <div
        onClick={() => setIsSearchOpen(true)}
        className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#FAFAF8] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] text-[#5B5B5B] dark:text-[#A0A09B] hover:border-[#C8A14A] hover:text-[#111111] dark:hover:text-[#FAFAF8] transition-all cursor-pointer w-64 sm:w-80 group shadow-xs"
      >
        <Search className="w-4 h-4 text-[#C8A14A] shrink-0 group-hover:scale-105 transition-transform" />
        <span className="text-xs font-normal truncate">Global AI Search (⌘K)...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-[#F9F5EC] text-[#9F7A2F] dark:bg-[#262623] dark:text-[#D7B45D] px-2 py-0.5 rounded-md border border-[#C8A14A]/30 ml-auto">
          ⌘K
        </kbd>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Action "+ Create" Button */}
        <button
          onClick={() => setIsCreatePostModalOpen(true)}
          className="btn-gold-primary px-4 py-2 text-xs flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span className="hidden sm:inline">Create Post</span>
        </button>

        {/* Workspace Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FAFAF8] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] hover:border-[#C8A14A] text-[#111111] dark:text-[#FAFAF8] text-xs font-semibold transition-all shadow-xs"
          >
            <span>{currentWorkspace.logo}</span>
            <span className="hidden md:inline">{currentWorkspace.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#8A8A8A] transition-transform ${showWorkspaceMenu ? "rotate-180" : ""}`} />
          </button>

          {showWorkspaceMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#FFFFFF] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] p-1.5 shadow-2xl space-y-1 z-50">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8A8A] px-3 py-1 block">
                Select Workspace
              </span>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setWorkspace(ws);
                    setShowWorkspaceMenu(false);
                    toast.success(`Switched to ${ws.name}`);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                    ws.id === currentWorkspace.id
                      ? "bg-[#F9F5EC] dark:bg-[#262623] text-[#111111] dark:text-[#FAFAF8] font-bold"
                      : "text-[#5B5B5B] dark:text-[#A0A09B] hover:bg-[#FAFAF8] dark:hover:bg-[#1C1C1A]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{ws.logo}</span>
                    <div className="flex flex-col text-left">
                      <span>{ws.name}</span>
                      <span className="text-[9px] text-[#8A8A8A] font-normal">{ws.tier}</span>
                    </div>
                  </div>
                  {ws.id === currentWorkspace.id && <Check className="w-3.5 h-3.5 text-[#C8A14A]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => {
            const nextTheme = theme === "dark" ? "light" : "dark";
            setTheme(nextTheme);
            toast.info(`Switched to ${nextTheme} luxury mode`);
          }}
          className="p-2.5 rounded-2xl border border-[#ECE8E1] dark:border-[#262623] bg-[#FAFAF8] dark:bg-[#141413] hover:border-[#C8A14A] text-[#111111] dark:text-[#FAFAF8] transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-[#C8A14A]" /> : <Moon className="w-4 h-4 text-[#C8A14A]" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-2xl border border-[#ECE8E1] dark:border-[#262623] bg-[#FAFAF8] dark:bg-[#141413] hover:border-[#C8A14A] text-[#111111] dark:text-[#FAFAF8] transition-colors relative"
          >
            <Bell className="w-4 h-4 text-[#C8A14A]" />
            {unreadNotificationCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C8A14A] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadNotificationCount()}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#FFFFFF] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] p-4 shadow-2xl space-y-3 z-50">
              <div className="flex items-center justify-between border-b border-[#ECE8E1] dark:border-[#262623] pb-2">
                <span className="text-xs font-bold text-[#111111] dark:text-[#FAFAF8] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C8A14A]" /> AI Activity ({unreadNotificationCount()})
                </span>
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-[#C8A14A] hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" /> Clear all
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      n.read
                        ? "bg-[#FAFAF8] dark:bg-[#1C1C1A] border-transparent text-[#5B5B5B] dark:text-[#A0A09B]"
                        : "bg-[#F9F5EC] dark:bg-[#262623] border-[#C8A14A]/30 text-[#111111] dark:text-[#FAFAF8] font-medium"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#C8A14A]">{n.title}</span>
                      <span className="text-[10px] text-[#8A8A8A]">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setCurrentView("notifications");
                  setShowNotifications(false);
                }}
                className="w-full text-center text-xs font-bold text-[#C8A14A] hover:underline pt-2 border-t border-[#ECE8E1] dark:border-[#262623]"
              >
                View full notification hub →
              </button>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-0.5 rounded-2xl border border-[#ECE8E1] dark:border-[#262623] hover:border-[#C8A14A] transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Alex Morgan"
              className="w-8 h-8 rounded-2xl object-cover border border-[#C8A14A]"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#FFFFFF] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] p-1.5 shadow-2xl space-y-1 z-50">
              <div className="px-3 py-2 border-b border-[#ECE8E1] dark:border-[#262623]">
                <p className="text-xs font-bold text-[#111111] dark:text-[#FAFAF8]">Alex Morgan</p>
                <p className="text-[10px] text-[#8A8A8A]">alex@socialpulse.ai</p>
              </div>

              <button
                onClick={() => {
                  setCurrentView("settings");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#5B5B5B] dark:text-[#A0A09B] hover:bg-[#FAFAF8] dark:hover:bg-[#1C1C1A]"
              >
                <User className="w-4 h-4 text-[#C8A14A]" /> Account Settings
              </button>

              <button
                onClick={() => {
                  setCurrentView("team");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#5B5B5B] dark:text-[#A0A09B] hover:bg-[#FAFAF8] dark:hover:bg-[#1C1C1A]"
              >
                <ShieldCheck className="w-4 h-4 text-[#C8A14A]" /> Team & Permissions
              </button>

              <button
                onClick={() => {
                  setCurrentView("landing");
                  setShowProfileMenu(false);
                  toast.info("Logged out from SocialPulse AI workspace");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
