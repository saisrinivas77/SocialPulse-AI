"use client";

import React, { useState } from "react";
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
  { view: "ai-studio", label: "AI Studio", icon: Sparkles, badge: "AI OS" },
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

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 h-screen transition-all duration-300 ease-out flex flex-col justify-between border-r border-[#ECE8E1] dark:border-[#262623] bg-[#FFFFFF] dark:bg-[#0C0C0B] ${
        isSidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section: Logo & Workspace Switcher */}
      <div className="p-4 border-b border-[#ECE8E1] dark:border-[#262623]">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-4">
          {!isSidebarCollapsed ? (
            <div
              onClick={() => setCurrentView("overview")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#C8A14A] via-[#D7B45D] to-[#9F7A2F] flex items-center justify-center text-white font-bold shadow-[0_4px_16px_rgba(200,161,74,0.3)]">
                <Sparkles className="w-4 h-4 text-white stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-[#111111] dark:text-[#FAFAF8]">
                  SocialPulse <span className="text-[#C8A14A]">AI</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#8A8A8A] font-semibold">
                  Analytics OS
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setCurrentView("overview")}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C8A14A] via-[#D7B45D] to-[#9F7A2F] flex items-center justify-center text-white cursor-pointer mx-auto shadow-[0_4px_16px_rgba(200,161,74,0.3)]"
            >
              <Sparkles className="w-5 h-5" />
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-xl border border-[#ECE8E1] dark:border-[#262623] bg-[#FAFAF8] dark:bg-[#141413] hover:border-[#C8A14A] text-[#5B5B5B] dark:text-[#A0A09B] transition-colors hidden sm:flex items-center justify-center"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Workspace Switcher */}
        {!isSidebarCollapsed && (
          <div className="relative">
            <button
              onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
              className="w-full p-2.5 rounded-xl border border-[#ECE8E1] dark:border-[#262623] bg-[#FAFAF8] dark:bg-[#141413] hover:border-[#C8A14A] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-base">{currentWorkspace.logo}</span>
                <div className="flex flex-col text-left truncate">
                  <span className="text-xs font-semibold text-[#111111] dark:text-[#FAFAF8] truncate">
                    {currentWorkspace.name}
                  </span>
                  <span className="text-[10px] text-[#C8A14A] font-medium truncate">
                    {currentWorkspace.tier}
                  </span>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#8A8A8A] transition-transform ${isWorkspaceMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Switcher Dropdown */}
            {isWorkspaceMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#FFFFFF] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] rounded-2xl shadow-xl p-1.5 space-y-1">
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider">
                  Switch Workspace
                </div>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setWorkspace(ws);
                      setIsWorkspaceMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                      currentWorkspace.id === ws.id
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
                    {currentWorkspace.id === ws.id && <Check className="w-3.5 h-3.5 text-[#C8A14A]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Navigation Scroll Area */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs transition-all duration-200 group relative ${
                isActive
                  ? "bg-[#111111] text-[#FFFFFF] dark:bg-[#FAFAF8] dark:text-[#111111] font-semibold shadow-md"
                  : "text-[#5B5B5B] dark:text-[#A0A09B] hover:text-[#111111] dark:hover:text-[#FAFAF8] hover:bg-[#FAFAF8] dark:hover:bg-[#141413]"
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? "text-[#C8A14A]" : "text-[#8A8A8A] group-hover:text-[#C8A14A]"
                }`}
              />

              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-[#C8A14A] text-white"
                          : "bg-[#F9F5EC] text-[#9F7A2F] dark:bg-[#262623] dark:text-[#D7B45D] border border-[#C8A14A]/30"
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
      <div className="p-3 border-t border-[#ECE8E1] dark:border-[#262623]">
        <div
          onClick={() => setCurrentView("settings")}
          className={`p-2.5 rounded-2xl border border-[#ECE8E1] dark:border-[#262623] bg-[#FAFAF8] dark:bg-[#141413] hover:border-[#C8A14A] transition-all cursor-pointer flex items-center ${
            isSidebarCollapsed ? "justify-center" : "gap-3"
          }`}
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Alex Morgan"
            className="w-8 h-8 rounded-full object-cover border border-[#C8A14A] shrink-0"
          />
          {!isSidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-[#111111] dark:text-[#FAFAF8] truncate">
                Alex Morgan
              </span>
              <span className="text-[10px] text-[#8A8A8A] truncate">
                VP of Growth & Strategy
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
