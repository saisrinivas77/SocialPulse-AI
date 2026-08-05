"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

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
  const router = useRouter();
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
      className={`sticky top-0 z-30 h-14 border-b border-black/5 dark:border-white/10 bg-[#FFFFFF]/80 dark:bg-[#18191A]/80 backdrop-blur-xl transition-all duration-300 flex items-center justify-between px-6 sm:px-8 ${
        isSidebarCollapsed ? "pl-20 sm:pl-24" : "pl-64 sm:pl-72"
      }`}
    >
      {/* Left: Global AI Search Input Trigger */}
      <div
        onClick={() => setIsSearchOpen(true)}
        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10 text-[#65676B] dark:text-[#B0B3B8] hover:border-[#0866FF] hover:text-[#050505] dark:hover:text-white transition-all cursor-pointer w-60 sm:w-72 group text-xs"
      >
        <Search className="w-3.5 h-3.5 text-[#0866FF] shrink-0 group-hover:scale-105 transition-transform" />
        <span className="font-normal truncate">Search AI telemetry (⌘K)...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-white dark:bg-[#3A3B3C] text-[#65676B] dark:text-[#E4E6EB] px-1.5 py-0.5 rounded border border-black/5 dark:border-white/10 ml-auto">
          ⌘K
        </kbd>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Quick Action "+ Create" Button */}
        <button
          onClick={() => setIsCreatePostModalOpen(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Create Post</span>
        </button>

        {/* Workspace Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10 hover:border-[#0866FF] text-[#050505] dark:text-[#E4E6EB] text-xs font-medium transition-all"
          >
            <span>{currentWorkspace.logo}</span>
            <span className="hidden md:inline">{currentWorkspace.name}</span>
            <ChevronDown className={`w-3 h-3 text-[#8A8D91] transition-transform ${showWorkspaceMenu ? "rotate-180" : ""}`} />
          </button>

          {showWorkspaceMenu && (
            <div className="absolute right-0 mt-1.5 w-52 rounded-xl bg-[#FFFFFF] dark:bg-[#242526] border border-black/5 dark:border-white/10 p-1 shadow-2xl space-y-0.5 z-50">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#8A8D91] px-2 py-1 block">
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
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all ${
                    ws.id === currentWorkspace.id
                      ? "bg-[#0866FF]/10 text-[#0866FF] font-semibold"
                      : "text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{ws.logo}</span>
                    <div className="flex flex-col text-left">
                      <span>{ws.name}</span>
                      <span className="text-[9px] text-[#8A8D91] font-normal">{ws.tier}</span>
                    </div>
                  </div>
                  {ws.id === currentWorkspace.id && <Check className="w-3.5 h-3.5 text-[#0866FF]" />}
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
            toast.info(`Switched to ${nextTheme} mode`);
          }}
          className="p-2 rounded-full border border-black/5 dark:border-white/10 bg-[#F0F2F5] dark:bg-[#242526] hover:border-[#0866FF] text-[#050505] dark:text-[#E4E6EB] transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-[#0866FF]" /> : <Moon className="w-3.5 h-3.5 text-[#0866FF]" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full border border-black/5 dark:border-white/10 bg-[#F0F2F5] dark:bg-[#242526] hover:border-[#0866FF] text-[#050505] dark:text-[#E4E6EB] transition-colors relative"
          >
            <Bell className="w-3.5 h-3.5 text-[#0866FF]" />
            {unreadNotificationCount() > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0866FF] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadNotificationCount()}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-80 rounded-2xl bg-[#FFFFFF] dark:bg-[#242526] border border-black/5 dark:border-white/10 p-3.5 shadow-2xl space-y-2.5 z-50">
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-2">
                <span className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0866FF]" /> Activity ({unreadNotificationCount()})
                </span>
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-semibold text-[#0866FF] hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" /> Clear all
                </button>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                      n.read
                        ? "bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8]"
                        : "bg-[#0866FF]/10 text-[#050505] dark:text-[#E4E6EB] font-medium"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#0866FF] text-[11px]">{n.title}</span>
                      <span className="text-[9px] text-[#8A8D91]">{n.timestamp}</span>
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
                className="w-full text-center text-xs font-semibold text-[#0866FF] hover:underline pt-2 border-t border-black/5 dark:border-white/10 block"
              >
                View full activity hub →
              </button>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-0.5 rounded-full border border-black/5 dark:border-white/10 hover:border-[#0866FF] transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Alex Morgan"
              className="w-7 h-7 rounded-full object-cover border border-[#0866FF]"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-[#FFFFFF] dark:bg-[#242526] border border-black/5 dark:border-white/10 p-1 shadow-2xl space-y-0.5 z-50">
              <div className="px-3 py-2 border-b border-black/5 dark:border-white/10">
                <p className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">Alex Morgan</p>
                <p className="text-[10px] text-[#8A8D91]">alex@socialpulse.ai</p>
              </div>

              <button
                onClick={() => {
                  setCurrentView("settings");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C]"
              >
                <User className="w-3.5 h-3.5 text-[#0866FF]" /> Account Settings
              </button>

              <button
                onClick={() => {
                  setCurrentView("team");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0866FF]" /> Team & Permissions
              </button>

              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("sp_access_token");
                  }
                  router.push("/login");
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#FA383E] hover:bg-[#FA383E]/10"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
