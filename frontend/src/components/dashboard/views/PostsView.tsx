"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, PostItem } from "@/store/useAppStore";
import {
  Table,
  Grid,
  Plus,
  Send,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  X,
  Sparkles,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const PostsView: React.FC = () => {
  const { posts, setIsCreatePostModalOpen } = useAppStore();
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  const filteredPosts = posts.filter((p) => {
    if (activeTab === "All") return true;
    return p.status === activeTab;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE8E1] dark:border-[#262623] pb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0866FF]">
              Content Queue & Archive
            </span>
            <span className="apple-badge text-[9px] px-2 py-0.5 rounded-full">
              {posts.length} Total Posts
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#050505] dark:text-[#E4E6EB]">
            Posts & Campaign Queue
          </h1>
          <p className="text-sm text-[#65676B] dark:text-[#B0B3B8] mt-1">
            Inspect performance telemetry, edit drafts, and manage multi-channel publication status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Table / Grid Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10 text-xs">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-xl transition-all ${
                viewMode === "table"
                  ? "bg-[#0866FF] text-white shadow-xs"
                  : "text-[#65676B] dark:text-[#B0B3B8]"
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all ${
                viewMode === "grid"
                  ? "bg-[#0866FF] text-white shadow-xs"
                  : "text-[#65676B] dark:text-[#B0B3B8]"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white font-semibold text-xs shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Post</span>
          </button>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs border-b border-black/5 dark:border-white/10">
        {["All", "Published", "Scheduled", "Draft", "Failed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-2xl font-bold transition-all ${
              activeTab === tab
                ? "bg-[#0866FF] text-white shadow-xs"
                : "text-[#65676B] dark:text-[#B0B3B8] hover:text-[#050505] dark:hover:text-[#E4E6EB] hover:bg-[#F0F2F5] dark:hover:bg-[#242526]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts Content */}
      {viewMode === "table" ? (
        <div className="apple-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0F2F5] dark:bg-[#242526] border-b border-black/5 dark:border-white/10 text-[#8A8D91] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Title & Content</th>
                <th className="py-3.5 px-4">Platform</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Impressions</th>
                <th className="py-3.5 px-4">Engagement</th>
                <th className="py-3.5 px-4">Scheduled Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="hover:bg-[#F0F2F5]/50 dark:hover:bg-[#242526]/50 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-4 max-w-xs">
                    <p className="font-bold text-[#050505] dark:text-[#E4E6EB] truncate">{post.title}</p>
                    <p className="text-[#65676B] dark:text-[#B0B3B8] truncate text-[11px] mt-0.5">{post.content}</p>
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#0866FF]">{post.platform}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        post.status === "Published"
                          ? "bg-[#31A24C]/10 text-[#31A24C]"
                          : post.status === "Scheduled"
                          ? "bg-[#0866FF]/10 text-[#0866FF]"
                          : "bg-gray-500/10 text-gray-600"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-[#050505] dark:text-[#E4E6EB]">{post.impressions}</td>
                  <td className="py-4 px-4 font-semibold text-[#31A24C]">{post.engagement}</td>
                  <td className="py-4 px-4 text-[#8A8D91]">{post.scheduledTime}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(post);
                      }}
                      className="text-xs font-bold text-[#0866FF] hover:underline"
                    >
                      Inspect Drawer →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="apple-card p-6 flex flex-col justify-between space-y-4 cursor-pointer hover:border-[#0866FF]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#0866FF]">{post.platform}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      post.status === "Published"
                        ? "bg-[#31A24C]/10 text-[#31A24C]"
                        : post.status === "Scheduled"
                        ? "bg-[#0866FF]/10 text-[#0866FF]"
                        : "bg-gray-500/10 text-gray-600"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#050505] dark:text-[#E4E6EB] mb-1">{post.title}</h3>
                <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] line-clamp-3">{post.content}</p>
              </div>

              <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-[#8A8D91]">{post.scheduledTime}</span>
                <span className="font-bold text-[#050505] dark:text-[#E4E6EB]">{post.impressions} views</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Post Detail Drawer */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-md bg-white dark:bg-[#18191A] border-l border-black/5 dark:border-white/10 h-full p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0866FF]" />
                    <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">Post Inspection</h3>
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-1 rounded-xl border border-black/5 dark:border-white/10 text-[#65676B] dark:text-[#B0B3B8]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8A8D91]">Platform:</span>
                    <span className="font-bold text-[#0866FF]">{selectedPost.platform}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8A8D91]">Status:</span>
                    <span className="font-bold text-[#050505] dark:text-[#E4E6EB]">{selectedPost.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8A8D91]">Schedule:</span>
                    <span className="font-bold text-[#050505] dark:text-[#E4E6EB]">{selectedPost.scheduledTime}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10 text-sm text-[#050505] dark:text-[#E4E6EB] space-y-2">
                  <h4 className="font-bold">{selectedPost.title}</h4>
                  <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">{selectedPost.content}</p>
                </div>

                {/* Telemetry Numbers */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10">
                    <Heart className="w-3.5 h-3.5 text-[#0866FF] mx-auto mb-1" />
                    <span className="text-xs font-extrabold text-[#050505] dark:text-[#E4E6EB] block">{selectedPost.likes}</span>
                    <span className="text-[9px] text-[#8A8D91]">Likes</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10">
                    <MessageSquare className="w-3.5 h-3.5 text-[#0866FF] mx-auto mb-1" />
                    <span className="text-xs font-extrabold text-[#050505] dark:text-[#E4E6EB] block">{selectedPost.comments}</span>
                    <span className="text-[9px] text-[#8A8D91]">Comments</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10">
                    <Share2 className="w-3.5 h-3.5 text-[#0866FF] mx-auto mb-1" />
                    <span className="text-xs font-extrabold text-[#050505] dark:text-[#E4E6EB] block">{selectedPost.shares}</span>
                    <span className="text-[9px] text-[#8A8D91]">Shares</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  toast.success("Post updated in queue!");
                  setSelectedPost(null);
                }}
                className="w-full rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white py-2.5 text-xs font-bold shadow-md"
              >
                Close & Save Changes
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
