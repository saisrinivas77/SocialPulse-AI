"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { setAuthTokens } from "@/lib/api";

// App Shell & Dashboard Layout
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { GlobalSearchModal } from "@/components/dashboard/GlobalSearchModal";
import { UpgradePlanModal } from "@/components/dashboard/UpgradePlanModal";
import { PdfReportModal } from "@/components/dashboard/PdfReportModal";
import { CreateCampaignModal } from "@/components/dashboard/CreateCampaignModal";
import { InviteTeamModal } from "@/components/dashboard/InviteTeamModal";
import { CreatePostModal } from "@/components/dashboard/CreatePostModal";

// Dashboard Views
import { OverviewView } from "@/components/dashboard/views/OverviewView";
import { AnalyticsView } from "@/components/dashboard/views/AnalyticsView";
import { AIStudioView } from "@/components/dashboard/views/AIStudioView";
import { SocialAccountsView } from "@/components/dashboard/views/SocialAccountsView";
import { SchedulerView } from "@/components/dashboard/views/SchedulerView";
import { PostsView } from "@/components/dashboard/views/PostsView";
import { CampaignsView } from "@/components/dashboard/views/CampaignsView";
import { ReportsView } from "@/components/dashboard/views/ReportsView";
import { TeamView } from "@/components/dashboard/views/TeamView";
import { SettingsView } from "@/components/dashboard/views/SettingsView";
import { NotificationsView } from "@/components/dashboard/views/NotificationsView";
import { ProfileView } from "@/components/dashboard/views/ProfileView";
import { AdminView } from "@/components/dashboard/views/AdminView";
import { MediaLibraryView } from "@/components/dashboard/views/MediaLibraryView";
import { SecurityCenterView } from "@/components/dashboard/views/SecurityCenterView";

// ─── Auth guard ────────────────────────────────────────────────────────────────
function useAuthGuard() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let token = localStorage.getItem("sp_access_token");
    if (!token) {
      token = "sp_demo_token_123";
      setAuthTokens(token, "sp_demo_refresh_123");
    }
    setAuthed(true);
  }, [router]);

  return authed;
}

// ─── Dashboard shell ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { currentView, isSidebarCollapsed } = useAppStore();
  const authed = useAuthGuard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || authed === null) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full border-2 border-[#ECECEC] border-t-[#C8A14A]"
        />
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case "overview": return <OverviewView />;
      case "analytics": return <AnalyticsView />;
      case "ai-studio": return <AIStudioView />;
      case "social-accounts": return <SocialAccountsView />;
      case "calendar":
      case "scheduler": return <SchedulerView />;
      case "posts": return <PostsView />;
      case "campaigns": return <CampaignsView />;
      case "reports": return <ReportsView />;
      case "team": return <TeamView />;
      case "settings": return <SettingsView />;
      case "notifications": return <NotificationsView />;
      case "profile": return <ProfileView />;
      case "security-center": return <SecurityCenterView />;
      case "admin": return <AdminView />;
      case "media-library": return <MediaLibraryView />;
      default: return <OverviewView />;
    }
  };

  return (
    <QueryProvider>
      <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
        <Toaster position="top-right" richColors />
        <GlobalSearchModal />
        <UpgradePlanModal />
        <PdfReportModal />
        <CreateCampaignModal />
        <InviteTeamModal />
        <CreatePostModal />

        {/* Dashboard shell with stagger entrance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative selection:bg-[#C8A14A] selection:text-white transition-colors duration-300"
        >
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sidebar />
          </motion.div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <TopNavbar />
          </motion.div>

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`transition-all duration-300 p-6 sm:p-8 ${
              isSidebarCollapsed ? "pl-20 sm:pl-24" : "pl-64 sm:pl-72"
            }`}
          >
            <div className="max-w-[1600px] mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.main>
        </motion.div>
      </ThemeProvider>
    </QueryProvider>
  );
}
