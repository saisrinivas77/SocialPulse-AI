"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, RefreshCw, ExternalLink, Zap, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function ReferenceGridBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#FAFBFD] dark:bg-[#121316]" />
      <div
        className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-20"
        style={{ background: "radial-gradient(circle, rgba(245, 230, 200, 0.6) 0%, rgba(245, 230, 200, 0.15) 50%, transparent 75%)" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-15"
        style={{ background: "radial-gradient(circle, rgba(230, 220, 255, 0.6) 0%, rgba(230, 220, 255, 0.1) 50%, transparent 75%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.045] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />
    </div>
  );
}

const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    color: "#E1306C",
    description: "Photos, Reels, Stories & Shopping",
    oauthPath: "/api/v1/auth/instagram",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="url(#ig)">
        <defs><linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="25%" stopColor="#e6683c"/><stop offset="50%" stopColor="#dc2743"/><stop offset="75%" stopColor="#cc2366"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    color: "#0A66C2",
    description: "Professional network & B2B content",
    oauthPath: "/api/v1/auth/linkedin",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#0A66C2">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "#010101",
    description: "Short-form video & viral content",
    oauthPath: "/api/v1/auth/tiktok",
    icon: (
      <svg className="w-7 h-7 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.19 8.19 0 004.78 1.52V7.03a4.85 4.85 0 01-1.01-.34z"/>
      </svg>
    ),
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    description: "Long-form video & channel analytics",
    oauthPath: "/api/v1/auth/youtube",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    id: "x",
    name: "X (Twitter)",
    color: "#000000",
    description: "Real-time conversations & trends",
    oauthPath: "/api/v1/auth/twitter",
    icon: (
      <svg className="w-6 h-6 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    description: "Pages, Groups & Ads Manager",
    oauthPath: "/api/v1/auth/facebook",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
];

interface ConnectedInfo {
  followers?: string;
  reach?: string;
  posts?: number;
}

type ConnectedMap = Record<string, ConnectedInfo>;

function PlatformCard({
  platform,
  isConnected,
  connectedInfo,
  onConnect,
  onSync,
  connecting,
}: {
  platform: typeof PLATFORMS[0];
  isConnected: boolean;
  connectedInfo?: ConnectedInfo;
  onConnect: () => void;
  onSync: () => void;
  connecting: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: "0 20px 48px rgba(0,0,0,0.06)" }}
      className="bg-white dark:bg-[#18181B] rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] p-6 shadow-xs transition-all relative overflow-hidden"
    >
      {isConnected && (
        <div
          className="absolute top-0 left-0 right-0 h-1 origin-left bg-[#31A24C]"
        />
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FAFBFD] dark:bg-[#27272A] border border-black/5 flex items-center justify-center shrink-0">
            {platform.icon}
          </div>
          <div>
            <h3 className="font-bold text-[#111111] dark:text-white text-base">{platform.name}</h3>
            <p className="text-xs text-[#777777] dark:text-[#A0A0A0] mt-0.5">{platform.description}</p>
          </div>
        </div>

        <AnimatePresence>
          {isConnected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F8ED] border border-[#31A24C]/30"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#31A24C]" />
              <span className="text-[10px] font-bold text-[#31A24C] uppercase tracking-wider">Connected</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex gap-2">
        {isConnected ? (
          <>
            <button
              onClick={onSync}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E5E5EA] text-xs font-semibold text-[#666] hover:border-[#0866FF] hover:text-[#0866FF] transition-all"
            >
              <RefreshCw className="w-3 h-3" /> Sync
            </button>
            <button
              onClick={onConnect}
              className="px-4 py-2 rounded-full text-xs font-semibold text-[#FA383E] hover:bg-[#FEF2F2] transition-all"
            >
              Disconnect
            </button>
          </>
        ) : (
          <motion.button
            onClick={onConnect}
            disabled={connecting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold text-white bg-[#0866FF] hover:bg-[#1877F2] shadow-sm transition-all disabled:opacity-60"
          >
            {connecting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ExternalLink className="w-3.5 h-3.5" />
            )}
            Connect {platform.name}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default function ConnectPage() {
  const router = useRouter();
  const [connected, setConnected] = useState<ConnectedMap>({});
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (platform: typeof PLATFORMS[0]) => {
    if (connected[platform.id]) {
      setConnected(prev => {
        const next = { ...prev };
        delete next[platform.id];
        return next;
      });
      return;
    }

    setConnecting(platform.id);
    try {
      const token = localStorage.getItem("sp_access_token");
      const res = await axios.get(`${API_URL}${platform.oauthPath}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data?.auth_url) {
        window.open(res.data.auth_url, "_blank", "width=600,height=700");
      }
      setConnected(prev => ({
        ...prev,
        [platform.id]: { followers: "—", reach: "—", posts: 0 },
      }));
    } catch {
      setConnected(prev => ({
        ...prev,
        [platform.id]: { followers: "—", reach: "—", posts: 0 },
      }));
    } finally {
      setConnecting(null);
    }
  };

  const connectedCount = Object.keys(connected).length;

  return (
    <div className="min-h-screen relative font-sans overflow-hidden py-12 px-6">
      <ReferenceGridBackground />

      <div className="max-w-4xl mx-auto z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span className="font-extrabold text-[#111111] dark:text-white text-lg tracking-tight">SocialPulse AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#111111] dark:text-white tracking-tight">Connect your platforms</h1>
          <p className="mt-3 text-sm text-[#777777] dark:text-[#A0A0A0] max-w-md mx-auto">Link your social channels to track analytics, generate content with AI, and schedule posts.</p>

          {connectedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7F8ED] border border-[#31A24C]/30"
            >
              <CheckCircle2 className="w-4 h-4 text-[#31A24C]" />
              <span className="text-xs font-bold text-[#31A24C]">
                {connectedCount} platform{connectedCount > 1 ? "s" : ""} connected
              </span>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {PLATFORMS.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              isConnected={!!connected[platform.id]}
              connectedInfo={connected[platform.id]}
              onConnect={() => handleConnect(platform)}
              onSync={() => {}}
              connecting={connecting === platform.id}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <motion.button
            onClick={() => router.push("/init")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-[#0866FF] hover:bg-[#1877F2] text-white px-8 py-3.5 rounded-full font-extrabold text-sm shadow-md transition-all"
          >
            {connectedCount === 0 ? "Skip for now" : `Continue with ${connectedCount} platform${connectedCount > 1 ? "s" : ""}`}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
