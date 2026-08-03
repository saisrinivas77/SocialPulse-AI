"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    quote:
      "SocialPulse AI feels like the analytics layer we always wanted: elegant, sharp, and actually useful in day-to-day work.",
    name: "Alex Morgan",
    role: "Head of Social, Northstar",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote:
      "The dashboard is polished enough for leadership review, but still fast enough for our content team to use every morning.",
    name: "Priya Shah",
    role: "Marketing Director, Luma",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote:
      "Caption generation and best-time predictions save us hours while keeping our brand voice consistent across channels.",
    name: "Jordan Lee",
    role: "Growth Lead, Studio Nine",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            Loved By Marketing Leaders
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            What our <span className="gold-gradient-text">customers say</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-8 flex flex-col justify-between space-y-6 border-amber-500/20 hover:border-amber-500/50"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm italic leading-relaxed">
                  &quot;{rev.quote}&quot;
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-amber-500/15">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-12 h-12 rounded-full object-cover border border-amber-400/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-xs text-amber-400">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
