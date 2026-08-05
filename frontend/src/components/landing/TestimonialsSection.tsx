"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    quote:
      "SocialPulse AI feels like the analytics layer we always wanted: elegant, sharp, and hyper-responsive.",
    name: "Alex Morgan",
    role: "Head of Social, Northstar",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote:
      "The dashboard is clean enough for executive reporting, yet deep enough for our growth team daily operations.",
    name: "Priya Shah",
    role: "Marketing Director, Luma",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote:
      "Caption generation and best-time predictions save us hours while keeping our brand voice identical across platforms.",
    name: "Jordan Lee",
    role: "Growth Lead, Studio Nine",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 relative z-10 bg-[#F0F2F5] dark:bg-[#242526]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-wider text-[#0866FF] font-semibold bg-[#0866FF]/10 px-3.5 py-1 rounded-full border border-[#0866FF]/20">
            Customer Feedback
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#050505] dark:text-[#E4E6EB]">
            Loved by marketing <span className="meta-gradient-text">innovators</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="apple-card p-6 flex flex-col justify-between space-y-6 bg-white dark:bg-[#18191A]"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#0866FF]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#0866FF]" />
                  ))}
                </div>
                <p className="text-[#050505] dark:text-[#E4E6EB] text-sm leading-relaxed">
                  &quot;{rev.quote}&quot;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-black/5 dark:border-white/10">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#0866FF]/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#050505] dark:text-[#E4E6EB]">{rev.name}</h4>
                  <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
