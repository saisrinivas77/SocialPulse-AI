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
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6"
        style={{ borderBottom: '1px solid var(--card-border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#C8A14A' }}>
              Content Queue & Archive
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'var(--accent-light)', color: '#C8A14A', border: '1px solid var(--accent-border)' }}>
              {posts.length} Total Posts
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Posts & Campaign Queue
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Inspect performance telemetry, edit drafts, and manage multi-channel publication status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Table / Grid Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-2xl text-xs" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)' }}>
            <button
              onClick={() => setViewMode("table")}
              className="p-2 rounded-xl font-semibold transition-all"
              style={{
                background: viewMode === "table" ? '#C8A14A' : 'transparent',
                color: viewMode === "table" ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: viewMode === "table" ? '0 4px 12px rgba(200,161,74,0.25)' : 'none',
              }}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className="p-2 rounded-xl font-semibold transition-all"
              style={{
                background: viewMode === "grid" ? '#C8A14A' : 'transparent',
                color: viewMode === "grid" ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: viewMode === "grid" ? '0 4px 12px rgba(200,161,74,0.25)' : 'none',
              }}
              title="Grid Cards"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="px-5 py-2.5 rounded-full text-white font-semibold text-xs shadow-md flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)', boxShadow: '0 4px 12px rgba(200,161,74,0.25)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Create New Post</span>
          </button>
        </div>
      </motion.div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs" style={{ borderBottom: '1px solid var(--card-border)' }}>
        {["All", "Published", "Scheduled", "Draft"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-2xl font-bold transition-all"
              style={{
                background: isActive ? '#C8A14A' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: isActive ? '0 4px 12px rgba(200,161,74,0.25)' : 'none',
              }}
            >
              {tab} Posts
            </button>
          );
        })}
      </div>

      {/* Posts Content */}
      {viewMode === "table" ? (
        <div className="rounded-[24px] overflow-hidden shadow-xs" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-xs font-bold uppercase tracking-wider" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
                <tr>
                  <th className="py-3.5 px-4">Post Title / Preview</th>
                  <th className="py-3.5 px-4">Platform</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Scheduled / Published</th>
                  <th className="py-3.5 px-4">Impressions</th>
                  <th className="py-3.5 px-4">Engagement</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                      No posts found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="transition hover:opacity-90">
                      <td className="py-4 px-4">
                        <div className="font-extrabold line-clamp-1" style={{ color: 'var(--text-primary)' }}>{post.title}</div>
                        <p className="text-[11px] line-clamp-1 mt-0.5" style={{ color: 'var(--text-secondary)' }}>{post.content}</p>
                      </td>
                      <td className="py-4 px-4 font-semibold" style={{ color: '#C8A14A' }}>{post.platform}</td>
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
                      <td className="py-4 px-4 font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>{post.scheduledTime}</td>
                      <td className="py-4 px-4 font-bold" style={{ color: 'var(--text-primary)' }}>{post.impressions}</td>
                      <td className="py-4 px-4 font-bold text-emerald-600">{post.engagement}</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="text-xs font-bold hover:underline"
                          style={{ color: '#C8A14A' }}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="rounded-[24px] p-6 flex flex-col justify-between space-y-4 cursor-pointer transition-all shadow-xs"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold" style={{ color: '#C8A14A' }}>{post.platform}</span>
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
                <h3 className="text-base font-bold line-clamp-1" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
                <p className="text-xs line-clamp-3 mt-2" style={{ color: 'var(--text-secondary)' }}>{post.content}</p>
              </div>

              <div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--card-border)' }}>
                <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>{post.scheduledTime}</span>
                <span className="font-extrabold text-emerald-600">{post.engagement}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Detail Drawer / Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="rounded-[32px] p-6 max-w-md w-full shadow-2xl relative space-y-4"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute right-5 top-5"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: '#C8A14A' }} />
                <h3 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>Post Performance Telemetry</h3>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold" style={{ color: '#C8A14A' }}>{selectedPost.platform}</span>
                  <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>{selectedPost.scheduledTime}</span>
                </div>
                <h4 className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>{selectedPost.title}</h4>
                <p className="text-xs p-3 rounded-2xl border mt-2 whitespace-pre-wrap" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}>
                  {selectedPost.content}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-3 rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
                  <Heart className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: '#C8A14A' }} />
                  <span className="text-xs font-extrabold block" style={{ color: 'var(--text-primary)' }}>{selectedPost.likes.toLocaleString()}</span>
                  <span className="text-[9px] block" style={{ color: 'var(--text-muted)' }}>Likes</span>
                </div>
                <div className="p-3 rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
                  <MessageSquare className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: '#C8A14A' }} />
                  <span className="text-xs font-extrabold block" style={{ color: 'var(--text-primary)' }}>{selectedPost.comments.toLocaleString()}</span>
                  <span className="text-[9px] block" style={{ color: 'var(--text-muted)' }}>Comments</span>
                </div>
                <div className="p-3 rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
                  <Share2 className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: '#C8A14A' }} />
                  <span className="text-xs font-extrabold block" style={{ color: 'var(--text-primary)' }}>{selectedPost.shares.toLocaleString()}</span>
                  <span className="text-[9px] block" style={{ color: 'var(--text-muted)' }}>Shares</span>
                </div>
              </div>

              <button
                onClick={() => {
                  toast.success("Post updated!");
                  setSelectedPost(null);
                }}
                className="w-full rounded-full text-white py-2.5 text-xs font-bold shadow-md"
                style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)' }}
              >
                Close Inspection
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
