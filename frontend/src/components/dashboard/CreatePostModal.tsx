"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const CreatePostModal: React.FC = () => {
  const { isCreatePostModalOpen, setIsCreatePostModalOpen, addPost } = useAppStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<any>("LinkedIn");
  const [status, setStatus] = useState<any>("Scheduled");

  if (!isCreatePostModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Please fill in both post title and content");
      return;
    }

    addPost({
      id: `post-${Date.now()}`,
      title,
      content,
      platform,
      status,
      scheduledTime: status === "Published" ? "Just now" : "Tomorrow at 05:00 PM",
      impressions: status === "Published" ? "1.2K" : "--",
      engagement: status === "Published" ? "4.2%" : "--",
      likes: 0,
      comments: 0,
      shares: 0,
    });

    toast.success(`Post "${title}" ${status === "Published" ? "published" : "scheduled"} on ${platform}!`);
    setIsCreatePostModalOpen(false);
    setTitle("");
    setContent("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-white dark:bg-[#141413] border border-[#ECE8E1] dark:border-[#262623] rounded-3xl p-6 space-y-6 shadow-2xl relative text-[#111111] dark:text-[#FAFAF8]"
        >
          <div className="flex items-center justify-between border-b border-[#ECE8E1] dark:border-[#262623] pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C8A14A]" />
              <h3 className="text-base font-bold">Create Social Post</h3>
            </div>
            <button
              onClick={() => setIsCreatePostModalOpen(false)}
              className="p-1 rounded-xl text-[#8A8A8A]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#5B5B5B] dark:text-[#A0A09B] block mb-1">Post Title</label>
              <input
                type="text"
                placeholder="e.g. Generative Media Architecture Teaser"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] focus:outline-none focus:border-[#C8A14A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#5B5B5B] dark:text-[#A0A09B] block mb-1">Target Network</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Instagram">Instagram</option>
                  <option value="X">X (Twitter)</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#5B5B5B] dark:text-[#A0A09B] block mb-1">Status Action</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="Scheduled">Schedule for Peak Window</option>
                  <option value="Published">Publish Immediately</option>
                  <option value="Draft">Save as Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#5B5B5B] dark:text-[#A0A09B] block mb-1">Post Content Body</label>
              <textarea
                rows={4}
                placeholder="Write your post content or click AI Studio to generate..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1C1C1A] border border-[#ECE8E1] dark:border-[#262623] focus:outline-none focus:border-[#C8A14A] resize-none"
              />
            </div>

            <button type="submit" className="w-full btn-gold-primary py-2.5 text-xs font-bold mt-2 flex items-center justify-center gap-2">
              <Send className="w-3.5 h-3.5" />
              <span>Confirm & Dispatch Post</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
