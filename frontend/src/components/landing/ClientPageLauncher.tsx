"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { useAppStore } from "@/store/useAppStore";
import { Toaster } from "sonner";

// App Shell & Dashboard Layout
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { GlobalSearchModal } from "@/components/dashboard/GlobalSearchModal";
import { UpgradePlanModal } from "@/components/dashboard/UpgradePlanModal";
import { PdfReportModal } from "@/components/dashboard/PdfReportModal";
import { CreateCampaignModal } from "@/components/dashboard/CreateCampaignModal";
import { InviteTeamModal } from "@/components/dashboard/InviteTeamModal";
import { CreatePostModal } from "@/components/dashboard/CreatePostModal";

// 10 Core Views & Additional Views
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

export const ClientPageLauncher: React.FC = () => {
  const { currentView, isSidebarCollapsed } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const renderDashboardView = () => {
    switch (currentView) {
      case "overview":
        return <OverviewView />;
      case "analytics":
        return <AnalyticsView />;
      case "ai-studio":
        return <AIStudioView />;
      case "social-accounts":
        return <SocialAccountsView />;
      case "calendar":
      case "scheduler":
        return <SchedulerView />;
      case "posts":
        return <PostsView />;
      case "campaigns":
        return <CampaignsView />;
      case "reports":
        return <ReportsView />;
      case "team":
        return <TeamView />;
      case "settings":
        return <SettingsView />;
      case "notifications":
        return <NotificationsView />;
      case "profile":
        return <ProfileView />;
      case "admin":
        return <AdminView />;
      case "media-library":
        return <MediaLibraryView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <QueryProvider>
      <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
        <Toaster position="top-right" richColors />

        {/* Global Modals */}
        <GlobalSearchModal />
        <UpgradePlanModal />
        <PdfReportModal />
        <CreateCampaignModal />
        <InviteTeamModal />
        <CreatePostModal />

        {/* Main SaaS Platform App Shell */}
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative selection:bg-[#0866FF] selection:text-white transition-colors duration-300">
          <Sidebar />
          <TopNavbar />
          <main
            className={`transition-all duration-300 p-6 sm:p-8 ${
              isSidebarCollapsed ? "pl-20 sm:pl-24" : "pl-64 sm:pl-72"
            }`}
          >
            <div className="max-w-[1600px] mx-auto">{renderDashboardView()}</div>
          </main>
        </div>
      </ThemeProvider>
    </QueryProvider>
  );
};
