import { create } from "zustand";

export type NavView =
  | "landing"
  | "overview"
  | "analytics"
  | "compare"
  | "ai-studio"
  | "social-accounts"
  | "calendar"
  | "scheduler"
  | "posts"
  | "campaigns"
  | "reports"
  | "notifications"
  | "team"
  | "settings"
  | "profile"
  | "security-center"
  | "provider-health"
  | "auth-debug"
  | "admin"
  | "media-library";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "ai" | "insight" | "system" | "alert";
}

export interface SocialAccount {
  id: string;
  platform: "Instagram" | "LinkedIn" | "X" | "TikTok" | "YouTube" | "Facebook" | "Threads" | "Pinterest";
  username: string;
  followers: string;
  connected: boolean;
  lastSynced: string;
  avatar: string;
  health: number;
}

export interface PostItem {
  id: string;
  title: string;
  content: string;
  platform: "Instagram" | "LinkedIn" | "X" | "TikTok" | "YouTube";
  status: "Published" | "Scheduled" | "Draft" | "Failed";
  scheduledTime: string;
  impressions: string;
  engagement: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface CampaignItem {
  id: string;
  title: string;
  status: "Ideation" | "In Production" | "Scheduled" | "Live" | "Completed";
  budget: string;
  spent: string;
  roi: string;
  reach: string;
  startDate: string;
  endDate: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Content Lead" | "Analyst" | "Reviewer";
  avatar: string;
  status: "Active" | "Pending";
  lastActive: string;
}

export interface AppState {
  // Navigation
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Workspace
  currentWorkspace: { id: string; name: string; tier: string; logo: string };
  setWorkspace: (ws: { id: string; name: string; tier: string; logo: string }) => void;

  // Search & Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  isCreateCampaignModalOpen: boolean;
  setIsCreateCampaignModalOpen: (open: boolean) => void;
  isPdfReportModalOpen: boolean;
  setIsPdfReportModalOpen: (open: boolean) => void;
  selectedReportTitle: string;
  setSelectedReportTitle: (title: string) => void;
  isInviteTeamModalOpen: boolean;
  setIsInviteTeamModalOpen: (open: boolean) => void;
  isCreatePostModalOpen: boolean;
  setIsCreatePostModalOpen: (open: boolean) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: () => number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;

  // Social Accounts
  socialAccounts: SocialAccount[];
  toggleAccountConnection: (id: string) => void;
  updateAccountUsername: (id: string, username: string) => void;
  loadUserAccounts: () => void;

  // AI Studio
  activeAiTool: string;
  setActiveAiTool: (tool: string) => void;

  // Posts & Campaigns Data
  posts: PostItem[];
  addPost: (post: PostItem) => void;
  campaigns: CampaignItem[];
  teamMembers: TeamMember[];
}

export const useAppStore = create<AppState>((set, get) => ({
  currentView: "overview",
  setCurrentView: (view) => set({ currentView: view }),

  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  currentWorkspace: {
    id: "ws-1",
    name: "Pulse Enterprise",
    tier: "Enterprise Pro",
    logo: "⚡",
  },
  setWorkspace: (ws) => set({ currentWorkspace: ws }),

  isSearchOpen: false,
  setIsSearchOpen: (open) => set({ isSearchOpen: open }),
  isUpgradeModalOpen: false,
  setIsUpgradeModalOpen: (open) => set({ isUpgradeModalOpen: open }),
  isCreateCampaignModalOpen: false,
  setIsCreateCampaignModalOpen: (open) => set({ isCreateCampaignModalOpen: open }),
  isPdfReportModalOpen: false,
  setIsPdfReportModalOpen: (open) => set({ isPdfReportModalOpen: open }),
  selectedReportTitle: "Q3 Executive Performance Brief",
  setSelectedReportTitle: (title) => set({ selectedReportTitle: title }),
  isInviteTeamModalOpen: false,
  setIsInviteTeamModalOpen: (open) => set({ isInviteTeamModalOpen: open }),
  isCreatePostModalOpen: false,
  setIsCreatePostModalOpen: (open) => set({ isCreatePostModalOpen: open }),

  notifications: [
    {
      id: "n-1",
      title: "Viral Surge Detected",
      message: "Your Instagram Reel reached 142,000+ views with +96% sentiment index.",
      timestamp: "8m ago",
      read: false,
      type: "ai",
    },
    {
      id: "n-2",
      title: "Optimal Posting Window",
      message: "AI recommends publishing LinkedIn post at 6:45 PM EST today for max engagement.",
      timestamp: "32m ago",
      read: false,
      type: "insight",
    },
    {
      id: "n-3",
      title: "OAuth Token Synced",
      message: "LinkedIn Enterprise account re-authenticated successfully.",
      timestamp: "1h ago",
      read: true,
      type: "system",
    },
    {
      id: "n-4",
      title: "Q3 Report Generated",
      message: "Executive PDF and CSV analytics export ready for download.",
      timestamp: "4h ago",
      read: true,
      type: "insight",
    },
  ],
  unreadNotificationCount: () => get().notifications.filter((n) => !n.read).length,
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  socialAccounts: [],

  toggleAccountConnection: (id) =>
    set((state) => {
      const updated = state.socialAccounts.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              connected: !acc.connected,
              lastSynced: !acc.connected ? "Just now" : "Disconnected",
              health: !acc.connected ? 100 : 0,
            }
          : acc
      );
      return { socialAccounts: updated };
    }),

  updateAccountUsername: (id, username) =>
    set((state) => {
      const updated = state.socialAccounts.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              username,
              connected: true,
              lastSynced: "Just now",
              health: 100,
            }
          : acc
      );
      return { socialAccounts: updated };
    }),

  loadUserAccounts: async () => {
    try {
      const { socialPulseApi } = await import("@/lib/api");
      const dbAccounts = await socialPulseApi.getSocialAccounts();
      if (Array.isArray(dbAccounts) && dbAccounts.length > 0) {
        const formatted = dbAccounts.map((item: any) => ({
          id: String(item.id),
          platform: (item.platform || item.provider || "Instagram") as any,
          username: item.account_handle || item.username || "@connected_user",
          followers: typeof item.follower_count === "number" ? item.follower_count.toLocaleString() : (item.followers || "0"),
          connected: item.status === "CONNECTED",
          lastSynced: item.last_synced_at ? new Date(item.last_synced_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
          health: item.sync_health || 100,
          avatar: item.avatar_url || item.profile_picture || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
        }));
        set({ socialAccounts: formatted });
      } else {
        set({ socialAccounts: [] });
      }
    } catch {
      set({ socialAccounts: [] });
    }
  },

  activeAiTool: "caption",
  setActiveAiTool: (tool) => set({ activeAiTool: tool }),

  posts: [
    {
      id: "post-1",
      title: "The Architecture of AI-Driven Media Intelligence",
      content: "Unpacking how generative graph models optimize post distribution in real-time. Full breakdown inside. #AI #Analytics",
      platform: "LinkedIn",
      status: "Published",
      scheduledTime: "Today at 09:30 AM",
      impressions: "48.2K",
      engagement: "6.8%",
      likes: 1240,
      comments: 182,
      shares: 94,
    },
    {
      id: "post-2",
      title: "5 Autonomous Workflows for Modern Growth Teams",
      content: "Stop manually writing captions. Here is how top Silicon Valley marketing teams use SocialPulse AI to scale 10x.",
      platform: "X",
      status: "Published",
      scheduledTime: "Yesterday at 04:15 PM",
      impressions: "92.1K",
      engagement: "8.4%",
      likes: 3420,
      comments: 420,
      shares: 512,
    },
    {
      id: "post-3",
      title: "Product Teaser: Predictive Content Optimization",
      content: "Previewing our next-gen predictive engagement score. Watch AI simulate audience response before you hit publish.",
      platform: "Instagram",
      status: "Scheduled",
      scheduledTime: "Tomorrow at 06:00 PM",
      impressions: "--",
      engagement: "--",
      likes: 0,
      comments: 0,
      shares: 0,
    },
    {
      id: "post-4",
      title: "Q3 AI Benchmark Infographic",
      content: "Key findings from analyzing 5,000 corporate social media channels in Q3 2026.",
      platform: "LinkedIn",
      status: "Draft",
      scheduledTime: "Unscheduled",
      impressions: "--",
      engagement: "--",
      likes: 0,
      comments: 0,
      shares: 0,
    },
    {
      id: "post-5",
      title: "Behind the Scenes: Training SocialPulse v3.5 Models",
      content: "A quick look at how we fine-tune our LLMs on 100M high-performing posts.",
      platform: "YouTube",
      status: "Scheduled",
      scheduledTime: "Aug 6, 2026 at 10:00 AM",
      impressions: "--",
      engagement: "--",
      likes: 0,
      comments: 0,
      shares: 0,
    },
  ],
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),

  campaigns: [
    {
      id: "cmp-1",
      title: "Q3 Product Launch — AI Copilot OS",
      status: "Live",
      budget: "$25,000",
      spent: "$14,200",
      roi: "4.8x",
      reach: "1.8M",
      startDate: "Jul 15, 2026",
      endDate: "Aug 30, 2026",
    },
    {
      id: "cmp-2",
      title: "Enterprise Thought Leadership Sprint",
      status: "In Production",
      budget: "$15,000",
      spent: "$6,400",
      roi: "3.2x",
      reach: "620K",
      startDate: "Aug 01, 2026",
      endDate: "Sep 15, 2026",
    },
    {
      id: "cmp-3",
      title: "Viral TikTok Creator Accelerator",
      status: "Scheduled",
      budget: "$30,000",
      spent: "$0",
      roi: "Est. 5.5x",
      reach: "3.5M Target",
      startDate: "Aug 10, 2026",
      endDate: "Sep 30, 2026",
    },
    {
      id: "cmp-4",
      title: "H2 Brand Refresh & Multi-Channel Reel Series",
      status: "Ideation",
      budget: "$10,000",
      spent: "$0",
      roi: "--",
      reach: "500K",
      startDate: "Sep 01, 2026",
      endDate: "Oct 15, 2026",
    },
  ],

  teamMembers: [
    {
      id: "tm-1",
      name: "Alex Morgan",
      email: "alex@socialpulse.ai",
      role: "Owner",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      status: "Active",
      lastActive: "Now",
    },
    {
      id: "tm-2",
      name: "Elena Rostova",
      email: "elena@socialpulse.ai",
      role: "Content Lead",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
      status: "Active",
      lastActive: "15m ago",
    },
    {
      id: "tm-3",
      name: "Marcus Vance",
      email: "marcus@socialpulse.ai",
      role: "Analyst",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      status: "Active",
      lastActive: "2h ago",
    },
    {
      id: "tm-4",
      name: "Sophia Chen",
      email: "sophia@agency.com",
      role: "Reviewer",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
      status: "Pending",
      lastActive: "Invited 1d ago",
    },
  ],
}));
