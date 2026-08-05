"use client";

import React, { useState, useEffect } from "react";
import { useAppStore, NavView } from "@/store/useAppStore";
import {
  LayoutDashboard,
  BarChart3,
  Sparkles,
  Calendar,
  Layers,
  Share2,
  FileSpreadsheet,
  Settings,
  Users,
  Send,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronDown,
} from "lucide-react";

interface NavItem {
  view: NavView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { view: "overview", label: "Dashboard", icon: LayoutDashboard },
  { view: "analytics", label: "Analytics", icon: BarChart3 },
  { view: "posts", label: "Posts & Queue", icon: Send },
  { view: "calendar", label: "Calendar", icon: Calendar },
  { view: "ai-studio", label: "AI Studio", icon: Sparkles, badge: "AI" },
  { view: "campaigns", label: "Campaigns", icon: Layers, badge: "LIVE" },
  { view: "social-accounts", label: "Social Accounts", icon: Share2 },
  { view: "reports", label: "Reports", icon: FileSpreadsheet },
  { view: "team", label: "Team", icon: Users },
  { view: "security-center", label: "Security Center", icon: ShieldCheck, badge: "SECURE" },
  { view: "settings", label: "Settings", icon: Settings },
];

const workspaces = [
  { id: "ws-1", name: "Pulse Enterprise", tier: "Enterprise Pro", logo: "⚡" },
  { id: "ws-2", name: "Acme Global Brand", tier: "Growth Pro", logo: "🚀" },
  { id: "ws-3", name: "Personal AI Studio", tier: "Creator Tier", logo: "✨" },
];

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isSidebarCollapsed,
    toggleSidebar,
    currentWorkspace,
    setWorkspace,
  } = useAppStore();

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "User",
    role: "Workspace Owner",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("sp_user_name");
      const storedEmail = localStorage.getItem("sp_user_email");
      const storedAvatar = localStorage.getItem("sp_user_avatar");
      const name = storedName || storedEmail?.split("@")[0] || "User";
      const avatar = storedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0866FF&color=fff`;
      setUserProfile({
        name,
        role: "Workspace Owner",
        avatar,
      });
    }
  }, []);

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 h-screen transition-all duration-300 ease-out flex flex-col justify-between border-r border-black/5 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#18191A] ${
        isSidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section: Logo & Workspace Switcher */}
      <div className="p-4 border-b border-black/5 dark:border-white/10">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-4">
          {!isSidebarCollapsed ? (
            <div
              onClick={() => setCurrentView("overview")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0866FF] to-[#7C3AED] flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                <Sparkles className="w-4 h-4 text-white stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-[#050505] dark:text-[#E4E6EB]">
                  SocialPulse <span className="text-[#0866FF]">AI</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#65676B] dark:text-[#B0B3B8] font-semibold">
                  Analytics OS
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setCurrentView("overview")}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0866FF] to-[#7C3AED] flex items-center justify-center text-white cursor-pointer mx-auto shadow-md shadow-blue-500/20"
            >
              <Sparkles className="w-4 h-4" />
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg border border-black/5 dark:border-white/10 bg-[#F0F2F5] dark:bg-[#242526] hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8] transition-colors hidden sm:flex items-center justify-center"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Workspace Switcher */}
        {!isSidebarCollapsed && (
          <div className="relative">
            <button
              onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
              className="w-full p-2 rounded-xl border border-black/5 dark:border-white/10 bg-[#F0F2F5] dark:bg-[#242526] hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-sm">{currentWorkspace.logo}</span>
                <div className="flex flex-col text-left truncate">
                  <span className="text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] truncate">
                    {currentWorkspace.name}
                  </span>
                  <span className="text-[10px] text-[#0866FF] font-medium truncate">
                    {currentWorkspace.tier}
                  </span>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#8A8D91] transition-transform ${isWorkspaceMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Switcher Dropdown */}
            {isWorkspaceMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#FFFFFF] dark:bg-[#242526] border border-black/5 dark:border-white/10 rounded-xl shadow-xl p-1 space-y-0.5">
                <div className="px-2 py-1 text-[9px] uppercase font-bold text-[#8A8D91] tracking-wider">
                  Switch Workspace
                </div>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setWorkspace(ws);
                      setIsWorkspaceMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      currentWorkspace.id === ws.id
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
                    {currentWorkspace.id === ws.id && <Check className="w-3.5 h-3.5 text-[#0866FF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Navigation Scroll Area */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-150 group relative ${
                isActive
                  ? "bg-[#0866FF] text-white font-semibold shadow-md shadow-blue-500/20"
                  : "text-[#65676B] dark:text-[#B0B3B8] hover:text-[#050505] dark:hover:text-white hover:bg-[#F0F2F5] dark:hover:bg-[#242526]"
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? "text-white" : "text-[#8A8D91] group-hover:text-[#0866FF]"
                }`}
              />

              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#0866FF]/10 text-[#0866FF] border border-[#0866FF]/20"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom User Profile */}
      <div className="p-3 border-t border-black/5 dark:border-white/10">
        <div
          onClick={() => setCurrentView("settings")}
          className={`p-2 rounded-xl border border-black/5 dark:border-white/10 bg-[#F0F2F5] dark:bg-[#242526] hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C] transition-all cursor-pointer flex items-center ${
            isSidebarCollapsed ? "justify-center" : "gap-2.5"
          }`}
        >
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-7 h-7 rounded-full object-cover border border-[#0866FF] shrink-0"
          />
          {!isSidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] truncate">
                {userProfile.name}
              </span>
              <span className="text-[10px] text-[#65676B] dark:text-[#B0B3B8] truncate">
                {userProfile.role}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
