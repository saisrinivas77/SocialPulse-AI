"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";

const reviews = [
  {
    quote:
      "SocialPulse AI feels like the analytics layer we always wanted: elegant, sharp, and hyper-responsive. Our team's reporting time dropped by 70% in the first week.",
    name: "Alex Morgan",
    role: "Head of Social, Northstar",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    platform: "LinkedIn",
    date: "Aug 2026",
    rating: 5,
    verified: true,
  },
  {
    quote:
      "The dashboard is clean enough for executive reporting, yet deep enough for our growth team's daily operations. The multi-channel view is unparalleled.",
    name: "Priya Shah",
    role: "Marketing Director, Luma",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    platform: "Instagram",
    date: "Jul 2026",
    rating: 5,
    verified: true,
  },
  {
    quote:
      "Caption generation and best-time predictions save us hours while keeping our brand voice identical across all platforms. A true force multiplier.",
    name: "Jordan Lee",
    role: "Growth Lead, Studio Nine",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    platform: "TikTok",
    date: "Jul 2026",
    rating: 5,
    verified: true,
  },
  {
    quote:
      "We replaced three separate analytics subscriptions with SocialPulse AI and saved over $12,000 annually. The ROI attribution alone is worth every penny.",
    name: "Marcus Vance",
    role: "VP Growth, Axiom Labs",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    platform: "X (Twitter)",
    date: "Jun 2026",
    rating: 5,
    verified: true,
  },
  {
    quote:
      "The AI Copilot feature writes captions faster than any human copywriter I've hired. The sentiment analysis is shockingly accurate for our luxury fashion audience.",
    name: "Isabella Chen",
    role: "Creative Director, Velour Studios",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    platform: "Instagram",
    date: "Aug 2026",
    rating: 5,
    verified: true,
  },
  {
    quote:
      "Scheduling a month of content used to take our team an entire day. With SocialPulse's calendar and AI optimization, we do it in under 90 minutes now.",
    name: "Daniel Okafor",
    role: "Content Strategy Lead, PeakMedia",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
    platform: "YouTube",
    date: "Jul 2026",
    rating: 5,
    verified: true,
  },
  {
    quote:
      "The competitor benchmarking and share-of-voice reports are board-ready without any formatting. Our CMO presents these directly to investors every quarter.",
    name: "Sofia Reyes",
    role: "Head of Analytics, NovaBrand",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    platform: "LinkedIn",
    date: "Jun 2026",
    rating: 5,
    verified: true,
  },
  {
    quote:
      "Best-time posting predictions boosted our Instagram engagement rate from 2.1% to 7.8% in just 6 weeks. The data-backed decisions are a complete game changer.",
    name: "Ryan Nakamura",
    role: "Digital Marketing Manager, Fluxe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80",
    platform: "Instagram",
    date: "Aug 2026",
    rating: 5,
    verified: true,
  },
  {
    quote:
      "SocialPulse AI's team collaboration features let our 12-person content team work in perfect sync. Role-based permissions and live notifications are a lifesaver.",
    name: "Amara Johnson",
    role: "Social Media Lead, Crescent Digital",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=120&q=80",
    platform: "Facebook",
    date: "Jul 2026",
    rating: 5,
    verified: true,
  },
];

const PLATFORM_COLORS: Record<string, string> = {
  LinkedIn: "#0A66C2",
  Instagram: "#E1306C",
  TikTok: "#010101",
  "X (Twitter)": "#14171A",
  YouTube: "#FF0000",
  Facebook: "#1877F2",
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
      />
    ))}
  </div>
);

export const TestimonialsSection: React.FC = () => {
  const row1 = reviews.slice(0, 5);
  const row2 = reviews.slice(4);

  return (
    <section className="py-24 relative z-10 bg-[#F0F2F5] dark:bg-[#1C1D1E] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-wider text-[#0866FF] font-semibold bg-[#0866FF]/10 px-3.5 py-1 rounded-full border border-[#0866FF]/20">
            Trusted by 3,200+ Marketing Teams
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#050505] dark:text-[#E4E6EB]">
            Loved by marketing <span className="meta-gradient-text">innovators</span>
          </h2>
          <p className="text-sm text-[#65676B] dark:text-[#B0B3B8] max-w-lg mx-auto leading-relaxed">
            From solo creators to enterprise teams — here's what our customers say about SocialPulse AI.
          </p>
          {/* Aggregate Rating */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-[#050505] dark:text-[#E4E6EB]">4.9 / 5.0</span>
            <span className="text-xs text-[#65676B] dark:text-[#B0B3B8]">· 3,200+ verified reviews</span>
          </div>
        </div>

        {/* Row 1 — Static grid (first 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.slice(0, 3).map((rev, idx) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="apple-card p-6 flex flex-col justify-between space-y-5 bg-white dark:bg-[#18191A] group hover:shadow-lg transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <StarRating rating={rev.rating} />
                  {rev.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#31A24C]">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-[#050505] dark:text-[#E4E6EB] text-sm leading-relaxed">
                  &quot;{rev.quote}&quot;
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 pt-4 border-t border-black/5 dark:border-white/10">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#050505] dark:text-[#E4E6EB] truncate">{rev.name}</h4>
                    <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] truncate">{rev.role}</p>
                  </div>
                  <span
                    className="text-[9px] font-extrabold uppercase px-2 py-1 rounded-md text-white flex-shrink-0"
                    style={{ backgroundColor: PLATFORM_COLORS[rev.platform] || "#0866FF" }}
                  >
                    {rev.platform}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Row 2 — Scrolling ticker strip */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex gap-5 animate-marquee"
            style={{ width: "max-content" }}
          >
            {[...reviews.slice(3), ...reviews.slice(3)].map((rev, idx) => (
              <div
                key={`${rev.name}-${idx}`}
                className="w-[340px] flex-shrink-0 apple-card p-6 flex flex-col justify-between space-y-5 bg-white dark:bg-[#18191A]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <StarRating rating={rev.rating} />
                    {rev.verified && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-[#31A24C]">
                        <BadgeCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[#050505] dark:text-[#E4E6EB] text-sm leading-relaxed line-clamp-4">
                    &quot;{rev.quote}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-black/5 dark:border-white/10">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] truncate">{rev.name}</h4>
                    <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] truncate">{rev.role}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className="text-[9px] font-extrabold uppercase px-2 py-1 rounded-md text-white block"
                      style={{ backgroundColor: PLATFORM_COLORS[rev.platform] || "#0866FF" }}
                    >
                      {rev.platform}
                    </span>
                    <span className="text-[10px] text-[#8A8D91] mt-1 block">{rev.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F0F2F5] dark:from-[#1C1D1E] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#F0F2F5] dark:from-[#1C1D1E] to-transparent z-10" />
        </div>
      </div>

      {/* Marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 32s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};
