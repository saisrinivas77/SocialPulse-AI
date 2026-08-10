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
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { view: "overview", label: "Dashboard", icon: LayoutDashboard },
  { view: "analytics", label: "Analytics", icon: BarChart3 },
  { view: "compare", label: "Compare Platforms", icon: Layers, badge: "NEW" },
  { view: "posts", label: "Posts & Queue", icon: Send },
  { view: "calendar", label: "Calendar", icon: Calendar },
  { view: "ai-studio", label: "AI Studio", icon: Sparkles, badge: "AI" },
  { view: "campaigns", label: "Campaigns", icon: Layers, badge: "LIVE" },
  { view: "social-accounts", label: "Social Accounts", icon: Share2 },
  { view: "reports", label: "Reports", icon: FileSpreadsheet },
  { view: "team", label: "Team", icon: Users },
  { view: "security-center", label: "Security Center", icon: ShieldCheck, badge: "SECURE" },
  { view: "provider-health", label: "Provider Health", icon: ShieldCheck, badge: "DIAGNOSTICS" },
  { view: "auth-debug", label: "Auth Debug", icon: ShieldCheck, badge: "DEBUG" },
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
      const avatar = storedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=C8A14A&color=fff`;
      setUserProfile({
        name,
        role: "Workspace Owner",
        avatar,
      });
    }
  }, []);

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 h-screen transition-all duration-300 ease-out flex flex-col justify-between border-r bg-[var(--bg-primary)] ${
        isSidebarCollapsed ? "w-20" : "w-64"
      }`}
      style={{ borderColor: 'var(--card-border)' }}
    >
      {/* Top Section: Logo & Workspace Switcher */}
      <div className="p-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-4">
          {!isSidebarCollapsed ? (
            <div
              onClick={() => setCurrentView("overview")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold shadow-md" style={{ background: 'linear-gradient(135deg, #C8A14A, #E8D5A3)', boxShadow: '0 4px 12px rgba(200,161,74,0.25)' }}>
                <Sparkles className="w-4 h-4 text-white stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  SocialPulse <span style={{ color: '#C8A14A' }}>AI</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Analytics OS
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setCurrentView("overview")}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white cursor-pointer mx-auto shadow-md"
              style={{ background: 'linear-gradient(135deg, #C8A14A, #E8D5A3)', boxShadow: '0 4px 12px rgba(200,161,74,0.25)' }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg transition-colors hidden sm:flex items-center justify-center"
            style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
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
              className="w-full p-2 rounded-xl transition-all flex items-center justify-between group"
              style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)' }}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-sm">{currentWorkspace.logo}</span>
                <div className="flex flex-col text-left truncate">
                  <span className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {currentWorkspace.name}
                  </span>
                  <span className="text-[10px] font-medium truncate" style={{ color: '#C8A14A' }}>
                    {currentWorkspace.tier}
                  </span>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isWorkspaceMenuOpen ? "rotate-180" : ""}`} style={{ color: 'var(--text-muted)' }} />
            </button>

            {/* Switcher Dropdown */}
            {isWorkspaceMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl shadow-xl p-1 space-y-0.5" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <div className="px-2 py-1 text-[9px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
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
                        ? "font-semibold"
                        : "hover:opacity-80"
                    }`}
                    style={{
                      background: currentWorkspace.id === ws.id ? 'var(--accent-light)' : 'transparent',
                      color: currentWorkspace.id === ws.id ? '#C8A14A' : 'var(--text-secondary)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{ws.logo}</span>
                      <div className="flex flex-col text-left">
                        <span>{ws.name}</span>
                        <span className="text-[9px] font-normal" style={{ color: 'var(--text-muted)' }}>{ws.tier}</span>
                      </div>
                    </div>
                    {currentWorkspace.id === ws.id && <Check className="w-3.5 h-3.5" style={{ color: '#C8A14A' }} />}
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-150 group relative`}
              style={{
                background: isActive ? '#C8A14A' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 400,
                boxShadow: isActive ? '0 4px 12px rgba(200,161,74,0.25)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105`}
                style={{ color: isActive ? '#FFFFFF' : 'var(--text-muted)' }}
              />

              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className="text-[8px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{
                        background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--accent-light)',
                        color: isActive ? '#FFFFFF' : '#C8A14A',
                        border: isActive ? 'none' : '1px solid var(--accent-border)',
                      }}
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
      <div className="p-3" style={{ borderTop: '1px solid var(--card-border)' }}>
        <div
          onClick={() => setCurrentView("settings")}
          className={`p-2 rounded-xl transition-all cursor-pointer flex items-center ${
            isSidebarCollapsed ? "justify-center" : "gap-2.5"
          }`}
          style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)' }}
        >
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-7 h-7 rounded-full object-cover shrink-0"
            style={{ border: '2px solid #C8A14A' }}
          />
          {!isSidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                {userProfile.name}
              </span>
              <span className="text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>
                {userProfile.role}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
