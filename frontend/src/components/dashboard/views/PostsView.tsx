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
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A14A]">
              Content Queue & Archive
            </span>
            <span className="luxury-badge text-[9px] px-2 py-0.5 rounded-full">
              {posts.length} Total Posts
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-[#FAFAF8]">
            Posts & Campaign Queue
          </h1>
          <p className="text-sm text-[#5B5B5B] dark:text-[#A0A09B] mt-1">
            Inspect performance telemetry, edit drafts, and manage multi-channel publication status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Table / Grid Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#FAFAF8] dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] text-xs">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-xl transition-all ${
                viewMode === "table"
                  ? "bg-[#111111] text-white dark:bg-[#FAFAF8] dark:text-[#111111]"
                  : "text-[#5B5B5B] dark:text-[#A0A09B]"
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all ${
                viewMode === "grid"
                  ? "bg-[#111111] text-white dark:bg-[#FAFAF8] dark:text-[#111111]"
                  : "text-[#5B5B5B] dark:text-[#A0A09B]"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="btn-gold-primary px-5 py-2.5 text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Post</span>
          </button>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs border-b border-[#ECE8E1] dark:border-[#262623]">
        {["All", "Published", "Scheduled", "Draft", "Failed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-2xl font-bold transition-all ${
              activeTab === tab
                ? "bg-[#111111] text-white dark:bg-[#FAFAF8] dark:text-[#111111] shadow-xs"
                : "text-[#5B5B5B] dark:text-[#A0A09B] hover:text-[#111111] dark:hover:text-[#FAFAF8] hover:bg-[#FAFAF8] dark:hover:bg-[#141413]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts Content */}
      {viewMode === "table" ? (
        <div className="luxury-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] dark:bg-[#141413] border-b border-[#ECE8E1] dark:border-[#262623] text-[#8A8A8A] font-bold uppercase tracking-wider">
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
            <tbody className="divide-y divide-[#ECE8E1] dark:divide-[#262623]">
              {filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="hover:bg-[#FAFAF8] dark:hover:bg-[#141413] cursor-pointer transition-colors"
                >
                  <td className="py-4 px-4 max-w-xs">
                    <p className="font-bold text-[#111111] dark:text-[#FAFAF8] truncate">{post.title}</p>
                    <p className="text-[#5B5B5B] dark:text-[#A0A09B] truncate text-[11px] mt-0.5">{post.content}</p>
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#C8A14A]">{post.platform}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        post.status === "Published"
                          ? "bg-green-500/10 text-green-600"
                          : post.status === "Scheduled"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-gray-500/10 text-gray-600"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-[#111111] dark:text-[#FAFAF8]">{post.impressions}</td>
                  <td className="py-4 px-4 font-semibold text-[#22C55E]">{post.engagement}</td>
                  <td className="py-4 px-4 text-[#8A8A8A]">{post.scheduledTime}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(post);
                      }}
                      className="text-xs font-bold text-[#C8A14A] hover:underline"
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
              className="luxury-card p-6 flex flex-col justify-between space-y-4 cursor-pointer hover:border-[#C8A14A]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#C8A14A]">{post.platform}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      post.status === "Published"
                        ? "bg-green-500/10 text-green-600"
                        : post.status === "Scheduled"
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-gray-500/10 text-gray-600"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#111111] dark:text-[#FAFAF8] mb-1">{post.title}</h3>
                <p className="text-xs text-[#5B5B5B] dark:text-[#A0A09B] line-clamp-3">{post.content}</p>
              </div>

              <div className="pt-3 border-t border-[#ECE8E1] dark:border-[#262623] flex items-center justify-between text-xs">
                <span className="text-[#8A8A8A]">{post.scheduledTime}</span>
                <span className="font-bold text-[#111111] dark:text-[#FAFAF8]">{post.impressions} views</span>
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
              className="w-full max-w-md bg-white dark:bg-[#141413] border-l border-[#ECE8E1] dark:border-[#262623] h-full p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#ECE8E1] dark:border-[#262623] pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C8A14A]" />
                    <h3 className="text-base font-bold text-[#111111] dark:text-[#FAFAF8]">Post Inspection</h3>
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-1 rounded-xl border border-[#ECE8E1] dark:border-[#262623] text-[#5B5B5B] dark:text-[#A0A09B]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8A8A8A]">Platform:</span>
                    <span className="font-bold text-[#C8A14A]">{selectedPost.platform}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8A8A8A]">Status:</span>
                    <span className="font-bold text-[#111111] dark:text-[#FAFAF8]">{selectedPost.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8A8A8A]">Schedule:</span>
                    <span className="font-bold text-[#111111] dark:text-[#FAFAF8]">{selectedPost.scheduledTime}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] text-sm text-[#111111] dark:text-[#FAFAF8] space-y-2">
                  <h4 className="font-bold">{selectedPost.title}</h4>
                  <p className="text-xs text-[#5B5B5B] dark:text-[#A0A09B]">{selectedPost.content}</p>
                </div>

                {/* Telemetry Numbers */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623]">
                    <Heart className="w-3.5 h-3.5 text-[#C8A14A] mx-auto mb-1" />
                    <span className="text-xs font-extrabold text-[#111111] dark:text-[#FAFAF8] block">{selectedPost.likes}</span>
                    <span className="text-[9px] text-[#8A8A8A]">Likes</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623]">
                    <MessageSquare className="w-3.5 h-3.5 text-[#C8A14A] mx-auto mb-1" />
                    <span className="text-xs font-extrabold text-[#111111] dark:text-[#FAFAF8] block">{selectedPost.comments}</span>
                    <span className="text-[9px] text-[#8A8A8A]">Comments</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623]">
                    <Share2 className="w-3.5 h-3.5 text-[#C8A14A] mx-auto mb-1" />
                    <span className="text-xs font-extrabold text-[#111111] dark:text-[#FAFAF8] block">{selectedPost.shares}</span>
                    <span className="text-[9px] text-[#8A8A8A]">Shares</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  toast.success("Post updated in queue!");
                  setSelectedPost(null);
                }}
                className="w-full btn-gold-primary py-2.5 text-xs font-bold"
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
