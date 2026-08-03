"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, RefreshCw, ExternalLink, Zap, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Platform data ─────────────────────────────────────────────────────────────
const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    color: "#E1306C",
    gradient: "from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]",
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
    gradient: "from-[#0A66C2] to-[#004182]",
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
    gradient: "from-[#010101] to-[#69C9D0]",
    description: "Short-form video & viral content",
    oauthPath: "/api/v1/auth/tiktok",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.19 8.19 0 004.78 1.52V7.03a4.85 4.85 0 01-1.01-.34z"/>
      </svg>
    ),
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    gradient: "from-[#FF0000] to-[#CC0000]",
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
    gradient: "from-[#111] to-[#333]",
    description: "Real-time conversations & trends",
    oauthPath: "/api/v1/auth/twitter",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    gradient: "from-[#1877F2] to-[#0952C6]",
    description: "Pages, Groups & Ads Manager",
    oauthPath: "/api/v1/auth/facebook",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: "threads",
    name: "Threads",
    color: "#000000",
    gradient: "from-[#111] to-[#444]",
    description: "Text-based conversation platform",
    oauthPath: "/api/v1/auth/threads",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 011.228.017 4.7 4.7 0 00-.27-.701c-.41-.773-1.18-1.19-2.26-1.244-.876-.044-1.822.198-2.707.704l-.97-1.775c1.117-.645 2.417-.975 3.757-.975.14 0 .284.005.429.014 1.69.088 3.065.702 3.986 2.19.315.516.554 1.1.716 1.731.228-.005.45-.001.664.012 1.354.086 2.44.453 3.19 1.065 1.34 1.088 1.845 2.87 1.384 4.953-.484 2.22-1.958 4.037-4.074 5.105C14.903 23.742 13.705 24 12.186 24z"/>
      </svg>
    ),
  },
  {
    id: "pinterest",
    name: "Pinterest",
    color: "#E60023",
    gradient: "from-[#E60023] to-[#AD081B]",
    description: "Visual discovery & shopping pins",
    oauthPath: "/api/v1/auth/pinterest",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#E60023">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
  },
];

// ─── Connected status type ─────────────────────────────────────────────────────
interface ConnectedInfo {
  followers?: string;
  reach?: string;
  posts?: number;
  lastSync?: string;
}

type ConnectedMap = Record<string, ConnectedInfo>;

// ─── Platform card ────────────────────────────────────────────────────────────
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: "0 20px 48px rgba(17,17,17,0.10)" }}
      className="bg-white rounded-2xl border border-[#ECECEC] p-5 shadow-sm transition-all relative overflow-hidden"
    >
      {/* Connected accent line */}
      {isConnected && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute top-0 left-0 right-0 h-0.5 origin-left"
          style={{ background: `linear-gradient(to right, ${platform.color}, ${platform.color}88)` }}
        />
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F8F8F8] flex items-center justify-center flex-shrink-0">
            {platform.icon}
          </div>
          <div>
            <h3 className="font-bold text-[#111] text-[14px]">{platform.name}</h3>
            <p className="text-[11px] text-[#888] mt-0.5">{platform.description}</p>
          </div>
        </div>

        {/* Status badge */}
        <AnimatePresence>
          {isConnected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Connected</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Connected stats */}
      <AnimatePresence>
        {isConnected && connectedInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 grid grid-cols-3 gap-2"
          >
            <div className="text-center p-2 rounded-xl bg-[#FAFAFA]">
              <div className="text-[13px] font-bold text-[#111]">{connectedInfo.followers || "—"}</div>
              <div className="text-[9px] text-[#aaa] font-semibold uppercase tracking-wider mt-0.5">Followers</div>
            </div>
            <div className="text-center p-2 rounded-xl bg-[#FAFAFA]">
              <div className="text-[13px] font-bold text-[#111]">{connectedInfo.reach || "—"}</div>
              <div className="text-[9px] text-[#aaa] font-semibold uppercase tracking-wider mt-0.5">Reach</div>
            </div>
            <div className="text-center p-2 rounded-xl bg-[#FAFAFA]">
              <div className="text-[13px] font-bold text-[#111]">{connectedInfo.posts ?? "—"}</div>
              <div className="text-[9px] text-[#aaa] font-semibold uppercase tracking-wider mt-0.5">Posts</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="mt-4 flex gap-2">
        {isConnected ? (
          <>
            <button
              onClick={onSync}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#ECECEC] text-[11px] font-semibold text-[#666] hover:border-[#C8A14A] hover:text-[#C8A14A] transition-all"
            >
              <RefreshCw className="w-3 h-3" /> Sync
            </button>
            <button
              onClick={onConnect}
              className="px-3 py-2 rounded-xl text-[11px] font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
            >
              Disconnect
            </button>
          </>
        ) : (
          <motion.button
            onClick={onConnect}
            disabled={connecting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-all disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${platform.color}, ${platform.color}bb)` }}
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

// ─── Main connect page ────────────────────────────────────────────────────────
export default function ConnectPage() {
  const router = useRouter();
  const [connected, setConnected] = useState<ConnectedMap>({});
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (platform: typeof PLATFORMS[0]) => {
    if (connected[platform.id]) {
      // Disconnect
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
      // Try real OAuth initiation
      const res = await axios.get(`${API_URL}${platform.oauthPath}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data?.auth_url) {
        // Open OAuth flow in popup
        window.open(res.data.auth_url, "_blank", "width=600,height=700");
      }
      // Optimistically mark connected with mock stats
      setConnected(prev => ({
        ...prev,
        [platform.id]: {
          followers: "—",
          reach: "—",
          posts: 0,
          lastSync: "Just now",
        },
      }));
    } catch {
      // If the platform OAuth isn't implemented, just show as connected (demo)
      setConnected(prev => ({
        ...prev,
        [platform.id]: {
          followers: "—",
          reach: "—",
          posts: 0,
          lastSync: "Just now",
        },
      }));
    } finally {
      setConnecting(null);
    }
  };

  const connectedCount = Object.keys(connected).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafaf8] via-white to-[#f5f3ee] font-sans">
      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #C8A14A 1px, transparent 1px), linear-gradient(to bottom, #C8A14A 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C8A14A] to-[#9F7A2F] flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-[#111] text-sm">SocialPulse AI</span>
          </div>

          <h1 className="text-4xl font-black text-[#111] tracking-tight">Connect your platforms</h1>
          <p className="mt-3 text-[#666] max-w-md mx-auto">Link your social accounts to start tracking analytics, scheduling content, and growing your audience with AI.</p>

          {connectedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[12px] font-semibold text-emerald-700">
                {connectedCount} platform{connectedCount > 1 ? "s" : ""} connected
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Platform grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
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

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <motion.button
            onClick={() => router.push("/init")}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-[#111] text-white px-8 py-3.5 rounded-full font-bold text-[14px] shadow-[0_8px_30px_rgba(17,17,17,0.18)] hover:bg-[#222] transition-colors"
          >
            {connectedCount === 0 ? "Skip for now" : `Continue with ${connectedCount} platform${connectedCount > 1 ? "s" : ""}`}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <p className="text-[12px] text-[#bbb]">You can always connect more platforms from your dashboard settings.</p>
        </motion.div>
      </div>
    </div>
  );
}
