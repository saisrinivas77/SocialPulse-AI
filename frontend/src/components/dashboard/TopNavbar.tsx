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
    socialPulseApi.getCurrentUser().then((user) => {
      if (user) {
        setUserProfile({
          name: user.full_name || "Alex Morgan",
          email: user.email || "alex.morgan.google@gmail.com",
          provider: user.provider || "Google",
          avatar:
            user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.full_name || "Alex Morgan"
            )}&background=0866FF&color=fff`,
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
    <header className="sticky top-0 z-30 h-16 bg-[#FFFFFF]/80 dark:bg-[#18191A]/80 backdrop-blur-md border-b border-black/5 dark:border-white/10 px-4 lg:px-6 flex items-center justify-between transition-colors font-sans">
      {/* Left: Mobile Sidebar Trigger & View Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-base font-extrabold text-[#050505] dark:text-[#E4E6EB] tracking-tight">
            {getViewTitle()}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E7F0FF] text-[#0866FF] dark:bg-[#0866FF]/20 text-[10px] font-bold">
            <Zap className="w-3 h-3 fill-current" /> Live Telemetry
          </span>
        </div>
      </div>

      {/* Right Actions Bar */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Global Search Bar */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8] text-xs hover:bg-[#E4E6E9] dark:hover:bg-[#4E4F50] transition-colors border border-transparent"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Search metrics, posts, tools...</span>
          <kbd className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFFFFF] dark:bg-[#242526] text-[#8A8D91] border border-black/5 dark:border-white/10">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2 rounded-full text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C]"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Upgrade Tier Button */}
        <button
          onClick={() => setIsUpgradeModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white text-xs font-bold shadow-xs transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Enterprise Pro</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] transition-colors"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FA383E]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-80 rounded-2xl bg-[#FFFFFF] dark:bg-[#242526] border border-black/5 dark:border-white/10 p-4 shadow-2xl space-y-3 z-50">
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-2">
                <span className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-semibold text-[#0866FF] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      n.read
                        ? "bg-[#F0F2F5]/50 dark:bg-[#3A3B3C]/40 border-transparent text-[#65676B] dark:text-[#B0B3B8]"
                        : "bg-[#E7F0FF]/50 dark:bg-[#0866FF]/10 border-[#0866FF]/20 text-[#050505] dark:text-[#E4E6EB]"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-0.5">
                      <span>{n.title}</span>
                      <span className="text-[9px] text-[#8A8D91]">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] leading-tight">{n.message}</p>
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

        {/* User Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-0.5 rounded-full border border-black/5 dark:border-white/10 hover:border-[#0866FF] transition-all"
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-7 h-7 rounded-full object-cover border border-[#0866FF]"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-1.5 w-56 rounded-2xl bg-[#FFFFFF] dark:bg-[#242526] border border-black/5 dark:border-white/10 p-2 shadow-2xl space-y-1 z-50">
              <div className="px-3 py-2 border-b border-black/5 dark:border-white/10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-xs font-extrabold text-[#050505] dark:text-[#E4E6EB] truncate">
                    {userProfile.name}
                  </p>
                </div>
                <p className="text-[10px] text-[#8A8D91] truncate mb-1.5">{userProfile.email}</p>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#31A24C] bg-[#E7F8ED] px-2 py-0.5 rounded-full border border-[#31A24C]/30">
                  <CheckCircle2 className="w-2.5 h-2.5 text-[#31A24C]" /> {userProfile.provider} Auth Active
                </span>
              </div>

              <button
                onClick={() => {
                  setCurrentView("settings");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#0866FF]" /> Account Settings
              </button>

              <button
                onClick={() => {
                  setCurrentView("social-accounts");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-[#0866FF]" /> Integrations & Channels
              </button>

              <button
                onClick={() => {
                  setCurrentView("team");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0866FF]" /> Team & Permissions
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
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#FA383E] hover:bg-[#FA383E]/10 transition-colors"
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
