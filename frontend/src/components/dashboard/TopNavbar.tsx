"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Zap,
  Menu,
  ShieldCheck,
  User,
  LogOut,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { socialPulseApi } from "@/lib/api";

export const TopNavbar: React.FC = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const {
    currentView,
    setCurrentView,
    isSidebarCollapsed,
    toggleSidebar,
    setIsSearchOpen,
    setIsUpgradeModalOpen,
    notifications,
    unreadNotificationCount,
    markAllAsRead,
  } = useAppStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Dynamic user profile state
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    provider: string;
    avatar: string;
  }>({
    name: "Alex Morgan",
    email: "alex.morgan.google@gmail.com",
    provider: "Google",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("sp_user_name");
      const storedEmail = localStorage.getItem("sp_user_email");
      const storedAvatar = localStorage.getItem("sp_user_avatar");
      const storedProvider = localStorage.getItem("sp_auth_provider");

      if (storedName || storedEmail) {
        const name = storedName || storedEmail?.split("@")[0] || "User";
        const email = storedEmail || "user@socialpulse.ai";
        setUserProfile({
          name,
          email,
          provider: storedProvider || "OAuth 2.0",
          avatar: storedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=C8A14A&color=fff`,
        });
      }
    }

    socialPulseApi.getCurrentUser().then((user) => {
      if (user && user.email) {
        const name = user.full_name || user.username || user.email.split("@")[0];
        setUserProfile({
          name,
          email: user.email,
          provider: user.provider ? `${user.provider.toUpperCase()} OAuth` : "Google OAuth",
          avatar:
            user.avatar_url ||
            user.profile_image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=C8A14A&color=fff`,
        });
      }
    });
  }, []);

  const unreadCount = unreadNotificationCount();

  const getViewTitle = () => {
    switch (currentView) {
      case "overview":
        return "Executive Command Center";
      case "analytics":
        return "Cross-Platform Intelligence";
      case "ai-studio":
        return "AI Content Studio";
      case "social-accounts":
        return "Connected Social Channels";
      case "calendar":
      case "scheduler":
        return "Autonomous Post Queue";
      case "posts":
        return "Content Repository & Posts";
      case "campaigns":
        return "Multi-Week Campaigns";
      case "reports":
        return "Executive Analytics Reports";
      case "notifications":
        return "System Notifications";
      case "team":
        return "Team & Workspace Permissions";
      case "settings":
        return "Workspace Settings";
      case "profile":
        return "Account Profile";
      case "security-center":
        return "Security & Session Control";
      case "admin":
        return "Super Admin Panel";
      case "media-library":
        return "Media Library & Brand Assets";
      default:
        return "SocialPulse AI";
    }
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between transition-colors font-sans"
      style={{
        background: 'color-mix(in srgb, var(--bg-primary) 85%, transparent)',
        borderBottom: '1px solid var(--card-border)',
      }}
    >
      {/* Left: Mobile Sidebar Trigger & View Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-base font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {getViewTitle()}
          </h1>
          <span
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: 'var(--accent-light)', color: '#C8A14A' }}
          >
            <Zap className="w-3 h-3 fill-current" /> Live Telemetry
          </span>
        </div>
      </div>

      {/* Right Actions Bar */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Global Search Bar */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full text-xs transition-colors border border-transparent"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Search metrics, posts, tools...</span>
          <kbd
            className="px-1.5 py-0.5 rounded text-[9px] font-bold"
            style={{ background: 'var(--card-bg)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' }}
          >
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2 rounded-full transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Upgrade Tier Button */}
        <button
          onClick={() => setIsUpgradeModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-xs font-bold shadow-xs transition-all"
          style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)', boxShadow: '0 4px 12px rgba(200,161,74,0.25)' }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Enterprise Pro</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full transition-colors relative"
            style={{ color: 'var(--text-secondary)' }}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#C8A14A' }} />
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 mt-1.5 w-80 rounded-2xl p-4 shadow-2xl space-y-3 z-50"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <div className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid var(--card-border)' }}>
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-semibold hover:underline"
                    style={{ color: '#C8A14A' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>No notifications yet</p>
                )}
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl border text-xs transition-colors"
                    style={{
                      background: n.read ? 'var(--bg-secondary)' : 'var(--accent-light)',
                      borderColor: n.read ? 'transparent' : 'var(--accent-border)',
                      color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)',
                    }}
                  >
                    <div className="flex items-center justify-between font-bold mb-0.5">
                      <span>{n.title}</span>
                      <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] leading-tight" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setCurrentView("notifications");
                  setShowNotifications(false);
                }}
                className="w-full text-center text-xs font-semibold hover:underline pt-2 block"
                style={{ color: '#C8A14A', borderTop: '1px solid var(--card-border)' }}
              >
                View full activity hub →
              </button>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-0.5 rounded-full transition-all"
            style={{ border: '1px solid var(--card-border)' }}
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-7 h-7 rounded-full object-cover"
              style={{ border: '2px solid #C8A14A' }}
            />
          </button>

          {showProfileMenu && (
            <div
              className="absolute right-0 mt-1.5 w-56 rounded-2xl p-2 shadow-2xl space-y-1 z-50"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--card-border)' }}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-xs font-extrabold truncate" style={{ color: 'var(--text-primary)' }}>
                    {userProfile.name}
                  </p>
                </div>
                <p className="text-[10px] truncate mb-1.5" style={{ color: 'var(--text-muted)' }}>{userProfile.email}</p>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#22C55E] bg-[#E7F8ED] px-2 py-0.5 rounded-full border border-[#22C55E]/30">
                  <CheckCircle2 className="w-2.5 h-2.5 text-[#22C55E]" /> {userProfile.provider} Auth Active
                </span>
              </div>

              <button
                onClick={() => {
                  setCurrentView("settings");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <User className="w-3.5 h-3.5" style={{ color: '#C8A14A' }} /> Account Settings
              </button>

              <button
                onClick={() => {
                  setCurrentView("social-accounts");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Zap className="w-3.5 h-3.5" style={{ color: '#C8A14A' }} /> Integrations & Channels
              </button>

              <button
                onClick={() => {
                  setCurrentView("team");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#C8A14A' }} /> Team & Permissions
              </button>

              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("sp_access_token");
                    localStorage.removeItem("sp_auth_provider");
                    localStorage.removeItem("sp_user_email");
                    localStorage.removeItem("sp_user_name");
                  }
                  router.push("/login");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
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
