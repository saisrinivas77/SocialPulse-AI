"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useInView,
  useScroll,
  useMotionTemplate,
} from "framer-motion";
import {
  ArrowRight, Zap, Sparkles, BarChart3, Brain, Shield, Globe2, TrendingUp,
  Users, Star, CheckCircle2, Menu, X, Activity, Play, ChevronDown, Clock,
  Radio, Layers, BrainCircuit, Wand2, Lock, BarChart2, Calendar,
  RefreshCw, Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 0: UTILITY HOOKS & PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

/** Counts from 0 → target when element scrolls into view */
function useAnimatedCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const started = useRef(false);

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      const t0 = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setCount(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, [inView, target, duration]);

  return { count, ref };
}

/** Pulsing live dot */
function PulseDot({ color = "#10B981" }: { color?: string }) {
  return (
    <span className="relative flex items-center justify-center w-2 h-2 flex-shrink-0">
      <motion.span
        className="absolute inline-flex rounded-full"
        style={{ backgroundColor: color, width: 8, height: 8 }}
        animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="relative inline-flex rounded-full w-2 h-2" style={{ backgroundColor: color }} />
    </span>
  );
}

/** Section fade-in on scroll */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: BACKGROUND CANVAS EFFECTS
// ─────────────────────────────────────────────────────────────────────────────

/** Animated mesh-gradient noise background */
function MeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base layer */}
      <div className="absolute inset-0 bg-[#FFFFFF] dark:bg-[#18191A]" />
      {/* Animated subtle Meta blue blobs */}
      <motion.div
        className="absolute -top-60 -left-60 w-[900px] h-[900px] rounded-full opacity-30 dark:opacity-20"
        style={{ background: "radial-gradient(circle, rgba(8, 102, 255, 0.15) 0%, rgba(8, 102, 255, 0.03) 40%, transparent 70%)" }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, 15, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 -right-60 w-[700px] h-[700px] rounded-full opacity-25 dark:opacity-15"
        style={{ background: "radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(124, 58, 237, 0.02) 40%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], rotate: [0, -12, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
}

/** Floating particles */
function Particles() {
  const [pts, setPts] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; dur: number }>>([]);

  useEffect(() => {
    setPts(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.8 + Math.random() * 2,
        delay: Math.random() * 8,
        dur: 12 + Math.random() * 18,
      }))
    );
  }, []);

  if (pts.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {pts.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: p.id % 3 === 0 ? "#0866FF" : p.id % 3 === 1 ? "#7C3AED" : "#1877F2",
            opacity: 0.15,
          }}
          animate={{ y: [0, -45, 0], opacity: [0.07, 0.22, 0.07] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/** Mouse-reactive spotlight */
function MouseSpotlight() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const fn = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [mx, my]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: useTransform(
          [sx, sy],
          ([x, y]: number[]) =>
            `radial-gradient(800px circle at ${x}px ${y}px, rgba(8,102,255,0.05) 0%, transparent 65%)`
        ),
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

function Nav({ onLaunch }: { onLaunch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Features", "Solutions", "Pricing", "Enterprise"];

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 dark:bg-[#18191A]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0866FF] to-[#7C3AED] flex items-center justify-center shadow-md shadow-blue-500/20">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-black text-[#050505] dark:text-white tracking-tight text-[15px]">
            SocialPulse <span className="text-[#0866FF]">AI</span>
          </span>
        </div>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="text-[13px] font-medium text-[#65676B] dark:text-white/60 hover:text-[#0866FF] dark:hover:text-white transition-colors">
              {l}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a href="/login" className="text-[13px] font-medium text-[#65676B] dark:text-white/60 hover:text-[#0866FF] transition-colors">
            Sign In
          </a>
          <motion.button
            onClick={onLaunch}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#1877F2] text-white text-[13px] font-bold px-5 py-2 rounded-full shadow-md shadow-blue-500/25 transition-all"
          >
            Launch Workspace <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-[#050505] dark:text-white/80" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-[#18191A]/95 backdrop-blur-2xl border-t border-black/5 dark:border-white/10 px-6 py-5 space-y-4"
          >
            {links.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-[#65676B] dark:text-white/60 hover:text-[#0866FF]">
                {l}
              </a>
            ))}
            <button
              onClick={onLaunch}
              className="w-full bg-[#0866FF] hover:bg-[#1877F2] text-white text-sm font-bold py-3 rounded-full shadow-md"
            >
              Launch Workspace
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: LIVE ACTIVITY TICKER
// ─────────────────────────────────────────────────────────────────────────────

const LIVE_EVENTS = [
  { platform: "Instagram", action: "Post reached 42K impressions in 2h", icon: "📸" },
  { platform: "TikTok", action: "Viral hook generated — 91% predicted CTR", icon: "🎵" },
  { platform: "LinkedIn", action: "AI-optimized post published to 28K followers", icon: "💼" },
  { platform: "YouTube", action: "Shorts trending — 8.7K views · 1h window", icon: "▶️" },
  { platform: "X / Twitter", action: "Engagement spike detected — +340% above baseline", icon: "✖️" },
  { platform: "Facebook", action: "Audience segment analysis ready for review", icon: "👥" },
  { platform: "Pinterest", action: "Pin saved 2,190 times this week", icon: "📌" },
  { platform: "Threads", action: "Sentiment analysis — 94.2% positive signal", icon: "🧵" },
];

function LiveTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % LIVE_EVENTS.length), 3500);
    return () => clearInterval(id);
  }, []);
  const evt = LIVE_EVENTS[idx];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-2 text-[11.5px] min-w-0"
      >
        <span className="text-white/70 truncate">
          <span className="text-white font-semibold">{evt.icon} {evt.platform}</span>
          {" — "}{evt.action}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: HERO DASHBOARD MOCK
// ─────────────────────────────────────────────────────────────────────────────

function HeroDashboardMock() {
  const [liveBar, setLiveBar] = useState(94);
  const [reach, setReach] = useState(4.21);
  const [eng, setEng] = useState(8.4);
  const bars = [38, 55, 42, 68, 52, 84, 60, 90, 74, 82, 66, liveBar];

  useEffect(() => {
    const id = setInterval(() => {
      setLiveBar(82 + Math.floor(Math.random() * 16));
      setReach((r) => parseFloat((r + 0.01).toFixed(2)));
      setEng((e) => parseFloat((e + Math.random() * 0.04 - 0.02).toFixed(1)));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(8,102,255,0.15)] bg-[#0D0D10]">
      {/* Glow border top */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#0866FF]/60 to-transparent" />

      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0A0A0D] border-b border-white/[0.05]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <div className="flex-1 mx-4 bg-white/[0.05] rounded-full px-3 py-0.5 text-[10px] text-white/30 font-mono">
          app.socialpulse.ai/dashboard
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
          <PulseDot color="#10B981" />
          <span>Live</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex gap-4">
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col gap-1 w-32 flex-shrink-0">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#0866FF] to-[#7C3AED] flex items-center justify-center mb-3 shadow-md shadow-blue-500/20">
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          {["Overview", "Analytics", "AI Studio", "Scheduler", "Posts", "Security"].map((item) => (
            <div key={item}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-medium ${
                item === "Overview" ? "bg-[#0866FF]/15 text-[#0866FF]" : "text-white/30"
              }`}
            >
              <div className={`w-1 h-1 rounded-full ${item === "Overview" ? "bg-[#0866FF]" : "bg-white/20"}`} />
              {item}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 space-y-3 min-w-0">
          {/* Stat row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Total Reach", val: `${reach.toFixed(2)}M`, trend: "+12.4%", color: "#0866FF" },
              { label: "Engagement", val: `${eng.toFixed(1)}%`, trend: "+3.1%", color: "#7C3AED" },
              { label: "AI Posts", val: "3,248", trend: "+18.7%", color: "#10B981" },
              { label: "Revenue", val: "$84.5K", trend: "+9.3%", color: "#1877F2" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-2.5"
              >
                <div className="text-[9px] text-white/40 font-medium">{s.label}</div>
                <div className="text-sm font-black text-white mt-0.5 tabular-nums">{s.val}</div>
                <div className="text-[8px] font-bold mt-0.5" style={{ color: s.color }}>↑ {s.trend}</div>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-bold text-white/60">Engagement Over Time</div>
              <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold">
                <Activity className="w-2.5 h-2.5" /> Live
              </div>
            </div>
            <div className="flex items-end gap-1 h-16">
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 rounded-t-[2px]"
                  style={{
                    background: i === bars.length - 1
                      ? "linear-gradient(to top, #0866FF, #7C3AED)"
                      : i > bars.length - 4
                        ? "rgba(8,102,255,0.3)"
                        : "rgba(255,255,255,0.06)"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Platform badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {["IG", "TT", "LI", "YT", "X"].map((p) => (
              <div key={p} className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[9px] font-bold text-white/40">
                {p} <span className="text-emerald-400">●</span>
              </div>
            ))}
            <div className="text-[9px] text-white/20 ml-1">5 platforms active</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: HERO
// ─────────────────────────────────────────────────────────────────────────────

function Hero({ onLaunch }: { onLaunch: () => void }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-16">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0866FF]/25 bg-[#0866FF]/10 backdrop-blur-sm mb-8"
      >
        <PulseDot color="#0866FF" />
        <Sparkles className="w-3.5 h-3.5 text-[#0866FF]" />
        <span className="text-[10.5px] font-bold tracking-[0.15em] text-[#0866FF] uppercase">
          AI-Powered Social Intelligence Platform
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl text-5xl sm:text-6xl md:text-7xl lg:text-[86px] font-black text-[#050505] dark:text-white leading-[1.02] tracking-[-0.045em]"
      >
        Turn Social Noise{" "}
        <br className="hidden sm:block" />
        <span className="meta-gradient-text">
          into Revenue.
        </span>
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.38 }}
        className="mt-6 max-w-2xl text-lg sm:text-xl text-[#65676B] dark:text-white/45 leading-relaxed font-light"
      >
        One command center for analytics, AI content generation, scheduling and predictive growth —
        across every social network your brand lives on.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.52 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <motion.button
          onClick={onLaunch}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="group flex items-center gap-2 bg-[#0866FF] hover:bg-[#1877F2] text-white px-8 py-4 rounded-full font-black text-sm shadow-lg shadow-blue-500/25 transition-all"
        >
          <Zap className="w-4 h-4 fill-white" />
          Launch Workspace
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </motion.button>

        <motion.a
          href="#features"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="group flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-sm text-[#050505] dark:text-white/70 border border-black/10 dark:border-white/[0.12] bg-[#F0F2F5] dark:bg-white/[0.04] backdrop-blur-sm hover:border-[#0866FF] hover:text-[#0866FF] dark:hover:text-white transition-all"
        >
          <div className="w-5 h-5 rounded-full bg-[#0866FF]/10 flex items-center justify-center">
            <Play className="w-2.5 h-2.5 fill-[#0866FF] text-[#0866FF] ml-0.5" />
          </div>
          See How It Works
        </motion.a>
      </motion.div>

      {/* Social proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        className="mt-8 flex items-center gap-3 text-[12.5px] text-[#65676B] dark:text-white/35"
      >
        <div className="flex -space-x-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-[#060608] bg-gradient-to-br from-[#0866FF]/40 to-[#7C3AED]/40" />
          ))}
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3 h-3 fill-[#0866FF] text-[#0866FF]" />)}
        </div>
        <span>Loved by <span className="text-[#050505] dark:text-white/60 font-semibold">marketing teams worldwide</span></span>
      </motion.div>

      {/* Live ticker */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-5 flex items-center gap-3 px-4 py-2 rounded-full border border-black/5 dark:border-white/[0.08] bg-[#F0F2F5] dark:bg-white/[0.03] backdrop-blur-sm text-[11.5px] max-w-lg overflow-hidden"
      >
        <div className="flex items-center gap-1.5 text-emerald-500 font-bold whitespace-nowrap">
          <PulseDot color="#10B981" />
          Live
        </div>
        <Radio className="w-3 h-3 text-[#65676B] dark:text-white/20 flex-shrink-0" />
        <LiveTicker />
      </motion.div>

      {/* Dashboard mock */}
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.3, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="mt-16 w-full max-w-5xl"
      >
        <HeroDashboardMock />
        {/* Glow below */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#0866FF]/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="mt-14 flex flex-col items-center gap-1.5 text-white/20"
      >
        <span className="text-[9px] uppercase tracking-[0.2em] font-bold">Scroll to explore</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: PLATFORM MARQUEE
// ─────────────────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  { name: "Instagram", color: "#E1306C" },
  { name: "TikTok", color: "#69C9D0" },
  { name: "LinkedIn", color: "#0A66C2" },
  { name: "YouTube", color: "#FF0000" },
  { name: "X / Twitter", color: "#FFFFFF" },
  { name: "Facebook", color: "#1877F2" },
  { name: "Pinterest", color: "#BD081C" },
  { name: "Threads", color: "#FFFFFF" },
];

function PlatformMarquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative py-10 border-y border-white/[0.05] overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#060608] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#060608] to-transparent pointer-events-none" />

      <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-5">
        Connect every platform · One workspace
      </p>

      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {items.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] whitespace-nowrap"
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-[12.5px] font-semibold text-white/50">{p.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7: ANIMATED METRICS
// ─────────────────────────────────────────────────────────────────────────────

const METRICS = [
  { prefix: "", target: 12400, suffix: "+", label: "Workspaces Created", sub: "since global launch", color: "#0866FF" },
  { prefix: "", target: 8, suffix: "", label: "Platforms Supported", sub: "Instagram to Pinterest", color: "#7C3AED" },
  { prefix: "", target: 99, suffix: ".9%", label: "System Reliability", sub: "across all services", color: "#10B981" },
  { prefix: "", target: 3200, suffix: "+", label: "AI Posts / Day", sub: "generated by the platform", color: "#1877F2" },
];

function MetricsStrip() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#65676B] dark:text-white/25">
            Platform performance
          </p>
        </FadeUp>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {METRICS.map((m, i) => {
            const { count, ref } = useAnimatedCounter(m.target, 2200);
            return (
              <motion.div
                key={m.label}
                ref={ref as React.Ref<HTMLDivElement>}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.07] rounded-2xl p-6 text-center hover:border-[#0866FF]/30 transition-all group shadow-sm"
              >
                <div
                  className="absolute inset-x-0 top-0 h-[1px] rounded-t-2xl opacity-60"
                  style={{ background: `linear-gradient(90deg, transparent, ${m.color}, transparent)` }}
                />
                <div className="text-3xl md:text-4xl font-black text-[#050505] dark:text-white tabular-nums">
                  {m.prefix}{count.toLocaleString()}{m.suffix}
                </div>
                <div className="text-sm font-bold text-[#65676B] dark:text-white/60 mt-1">{m.label}</div>
                <div className="text-[10px] text-[#8A8D91] dark:text-white/25 mt-0.5">{m.sub}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8: FEATURE BENTO GRID
// ─────────────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: BarChart3, title: "Real-Time Analytics", span: "col-span-2",
    desc: "Live dashboards with sub-second updates tracking reach, engagement density, follower growth, and audience shifts across every platform simultaneously.",
    color: "#0866FF", accent: "from-[#0866FF]/10",
    preview: (
      <div className="mt-4 flex items-end gap-1 h-12 opacity-80">
        {[30, 55, 40, 70, 50, 88, 62, 94, 78, 86, 71, 98].map((h, i) => (
          <div key={i} className="flex-1 rounded-t-[2px]"
            style={{ height: `${h}%`, background: i > 9 ? "#0866FF" : "rgba(8,102,255,0.2)" }} />
        ))}
      </div>
    ),
  },
  {
    icon: Brain, title: "AI Content Studio", span: "col-span-1",
    desc: "Generate viral captions, hashtags, and full campaigns using advanced language models trained on 100M high-performing posts.",
    color: "#7C3AED", accent: "from-[#7C3AED]/10",
  },
  {
    icon: TrendingUp, title: "Predictive Intelligence", span: "col-span-1",
    desc: "Forecast engagement trends, detect viral signals, and identify optimal posting windows before your competitors do.",
    color: "#10B981", accent: "from-[#10B981]/10",
  },
  {
    icon: Globe2, title: "Universal Publishing", span: "col-span-1",
    desc: "Schedule and publish to all 8 platforms from one command center, with drag-and-drop calendar and auto-optimized timing.",
    color: "#1877F2", accent: "from-[#1877F2]/10",
  },
  {
    icon: Shield, title: "Enterprise Security", span: "col-span-2",
    desc: "SOC 2 Type II certified. GDPR compliant. Full SSO, OAuth 2.0, session tracking, device revocation, audit logs, and RBAC built in out of the box.",
    color: "#FA383E", accent: "from-[#FA383E]/10",
    preview: (
      <div className="mt-4 flex flex-wrap gap-1.5 opacity-80">
        {["SSO", "RBAC", "SOC 2", "GDPR", "MFA", "Audit"].map((t) => (
          <span key={t} className="px-2 py-0.5 rounded-full border border-red-500/20 bg-red-500/10 text-[9px] font-bold text-red-500">
            {t}
          </span>
        ))}
      </div>
    ),
  },
];

function FeatureBento() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0866FF]/20 bg-[#0866FF]/10 mb-6">
            <Layers className="w-3.5 h-3.5 text-[#0866FF]" />
            <span className="text-[10.5px] font-bold tracking-[0.15em] text-[#0866FF] uppercase">Platform Capabilities</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#050505] dark:text-white tracking-tight leading-tight">
            Everything you need to{" "}
            <span className="meta-gradient-text">
              dominate social.
            </span>
          </h2>
          <p className="mt-4 text-[#65676B] dark:text-white/40 text-lg max-w-xl mx-auto">
            One platform to analyze, create, schedule, and grow across every social network — powered by enterprise-grade AI.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className={`relative bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.07] rounded-2xl p-6 overflow-hidden group transition-all hover:border-[#0866FF]/30 hover:shadow-lg ${f.span}`}
              >
                {/* Gradient bg */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                {/* Top accent line */}
                <div className="absolute inset-x-0 top-0 h-[1px] opacity-0 group-hover:opacity-80 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ background: `${f.color}18`, border: `1px solid ${f.color}25` }}>
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <h3 className="font-bold text-[#050505] dark:text-white text-base mb-2">{f.title}</h3>
                  <p className="text-[12.5px] text-[#65676B] dark:text-white/40 leading-relaxed">{f.desc}</p>
                  {f.preview}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9: HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────

const HOW_STEPS = [
  { num: "01", icon: Globe2, title: "Connect Your Platforms", desc: "Link Instagram, TikTok, LinkedIn, YouTube, X, Facebook, Pinterest, and Threads in under 2 minutes via secure OAuth.", color: "#C8A14A" },
  { num: "02", icon: BrainCircuit, title: "AI Analyzes Everything", desc: "Neural models process your historical data, audience behavior, trending topics, and competitor signals in real time.", color: "#8B5CF6" },
  { num: "03", icon: TrendingUp, title: "Grow with Intelligence", desc: "Act on AI-generated recommendations: optimal post times, viral content formulas, and predictive ROI forecasts.", color: "#10B981" },
];

function HowItWorks() {
  return (
    <section id="solutions" className="py-24 px-6 border-t border-black/5 dark:border-white/[0.05]">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0866FF]/20 bg-[#0866FF]/10 mb-6">
            <RefreshCw className="w-3.5 h-3.5 text-[#0866FF]" />
            <span className="text-[10.5px] font-bold tracking-[0.15em] text-[#0866FF] uppercase">How It Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#050505] dark:text-white tracking-tight">
            From zero to growth in <span className="text-[#0866FF]">3 steps.</span>
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-[1px] bg-gradient-to-r from-[#0866FF]/30 via-[#7C3AED]/30 to-[#10B981]/30 pointer-events-none" />

          {HOW_STEPS.map((step, i) => {
            const Icon = step.icon;
            const stepColor = step.num === "01" ? "#0866FF" : step.color;
            return (
              <FadeUp key={step.num} delay={i * 0.15}>
                <div className="relative bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.07] rounded-2xl p-7 text-center hover:border-[#0866FF]/30 transition-all group shadow-sm">
                  {/* Number badge */}
                  <div
                    className="w-12 h-12 rounded-2xl mx-auto mb-5 flex items-center justify-center text-sm font-black border group-hover:scale-105 transition-transform"
                    style={{ background: `${stepColor}15`, borderColor: `${stepColor}30`, color: stepColor }}
                  >
                    {step.num}
                  </div>
                  <div className="w-8 h-8 rounded-xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: `${stepColor}10` }}>
                    <Icon className="w-4 h-4" style={{ color: stepColor }} />
                  </div>
                  <h3 className="font-bold text-[#050505] dark:text-white text-base mb-2">{step.title}</h3>
                  <p className="text-[12.5px] text-[#65676B] dark:text-white/40 leading-relaxed">{step.desc}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 10: TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: "SocialPulse AI is the only analytics platform that actually feels designed for enterprise marketing teams. The AI is genuinely useful, not just a gimmick.",
    name: "Alex Morgan", role: "Head of Growth", company: "Series C SaaS",
    initials: "AM", color: "#0866FF",
  },
  {
    quote: "Our content team went from spending 4 hours a day on captions and scheduling to 30 minutes. The predictive posting time alone pays for itself.",
    name: "Priya Shah", role: "Marketing Director", company: "Luma Inc.",
    initials: "PS", color: "#7C3AED",
  },
  {
    quote: "The dashboard is polished enough for a board presentation but fast enough for the team to use every morning. That balance is incredibly rare.",
    name: "Jordan Lee", role: "VP Marketing", company: "Studio Nine",
    initials: "JL", color: "#10B981",
  },
];

function Testimonials() {
  return (
    <section className="py-24 px-6 border-t border-black/5 dark:border-white/[0.05]">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0866FF]/20 bg-[#0866FF]/10 mb-6">
            <Star className="w-3.5 h-3.5 text-[#0866FF] fill-[#0866FF]" />
            <span className="text-[10.5px] font-bold tracking-[0.15em] text-[#0866FF] uppercase">What customers say</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#050505] dark:text-white tracking-tight">
            Loved by <span className="meta-gradient-text">marketing leaders.</span>
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.07] rounded-2xl p-7 flex flex-col justify-between hover:border-[#0866FF]/30 transition-all shadow-sm"
            >
              <div>
                <div className="flex gap-0.5 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-[#0866FF] text-[#0866FF]" />)}
                </div>
                <p className="text-[13.5px] text-[#050505] dark:text-white/60 leading-relaxed italic">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-black/5 dark:border-white/[0.06]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black"
                  style={{ background: `${t.color}20`, color: t.color, border: `1px solid ${t.color}30` }}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#050505] dark:text-white">{t.name}</div>
                  <div className="text-[11px] text-[#65676B] dark:text-white/35">{t.role} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 11: PRICING
// ─────────────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: "Starter", price_m: 29, price_y: 23,
    desc: "For creators & influencers building their brand.",
    badge: null, highlight: false,
    features: ["3 Social Accounts", "AI Caption Generator (500/mo)", "Basic Analytics", "Weekly Email Reports", "Standard Support"],
  },
  {
    name: "Growth Pro", price_m: 79, price_y: 63,
    desc: "For scaling brands and high-momentum content teams.",
    badge: "Most Popular", highlight: true,
    features: ["Unlimited Social Accounts", "Unlimited AI Studio", "Predictive Posting Engine", "Multi-Platform Scheduler", "Custom PDF & CSV Exports", "Priority 24/7 Support"],
  },
  {
    name: "Enterprise", price_m: 149, price_y: 119,
    desc: "For multi-brand agencies and enterprise organizations.",
    badge: "Enterprise", highlight: false,
    features: ["Everything in Growth Pro", "Full Audit Logs & RBAC", "SSO Authentication", "Dedicated Account Manager", "SLA Guarantee", "Custom Integrations"],
  },
];

function Pricing({ onLaunch }: { onLaunch: () => void }) {
  const [annual, setAnnual] = useState(true);
  return (
    <section id="pricing" className="py-24 px-6 border-t border-black/5 dark:border-white/[0.05]">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0866FF]/20 bg-[#0866FF]/10 mb-6">
            <Layers className="w-3.5 h-3.5 text-[#0866FF]" />
            <span className="text-[10.5px] font-bold tracking-[0.15em] text-[#0866FF] uppercase">Transparent Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#050505] dark:text-white tracking-tight">
            Invest in <span className="meta-gradient-text">predictable growth.</span>
          </h2>
          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-2 p-1.5 rounded-full bg-[#F0F2F5] dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.08]">
            {[false, true].map((isAnnual) => (
              <button
                key={String(isAnnual)}
                onClick={() => setAnnual(isAnnual)}
                className={`px-5 py-2 rounded-full text-[12px] font-bold transition-all ${
                  annual === isAnnual
                    ? "bg-[#0866FF] text-white shadow-md"
                    : "text-[#65676B] dark:text-white/40 hover:text-[#050505]"
                }`}
              >
                {isAnnual ? (
                  <span className="flex items-center gap-1.5">Annual <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-full">SAVE 20%</span></span>
                ) : "Monthly"}
              </button>
            ))}
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-2xl p-7 flex flex-col justify-between border transition-all ${
                plan.highlight
                  ? "bg-white dark:bg-[#242526] border-[#0866FF] shadow-lg shadow-blue-500/10 ring-2 ring-[#0866FF]/20"
                  : "bg-white dark:bg-white/[0.03] border-black/5 dark:border-white/[0.07] hover:border-[#0866FF]/30"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0866FF] text-white text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-white" /> {plan.badge}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-[#050505] dark:text-white mb-1">{plan.name}</h3>
                <p className="text-[11.5px] text-[#65676B] dark:text-white/35 mb-5">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-[#050505] dark:text-white">
                    ${annual ? plan.price_y : plan.price_m}
                  </span>
                  <span className="text-[#65676B] dark:text-white/30 text-sm">/ month</span>
                </div>
                <div className="space-y-2.5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-[12.5px] text-[#050505] dark:text-white/55">
                      <div className="w-4 h-4 rounded-full bg-[#0866FF]/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-[#0866FF]" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <motion.button
                onClick={onLaunch}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`mt-7 w-full py-3.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all ${
                  plan.highlight
                    ? "bg-[#0866FF] hover:bg-[#1877F2] text-white shadow-md shadow-blue-500/25"
                    : "bg-[#F0F2F5] dark:bg-white/[0.06] border border-black/5 dark:border-white/[0.1] text-[#050505] dark:text-white hover:bg-[#E4E6EB]"
                }`}
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 12: FINAL CTA
// ─────────────────────────────────────────────────────────────────────────────

function FinalCTA({ onLaunch }: { onLaunch: () => void }) {
  return (
    <section id="enterprise" className="py-28 px-6 border-t border-black/5 dark:border-white/[0.05]">
      <div className="max-w-4xl mx-auto text-center">
        <FadeUp>
          {/* Glow */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 blur-3xl bg-[#0866FF]/20 rounded-full scale-150" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0866FF] to-[#7C3AED] flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
              <Zap className="w-8 h-8 fill-white text-white" />
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#050505] dark:text-white tracking-tight leading-[1.04]">
            Ready to grow<br />
            <span className="meta-gradient-text">
              intelligently?
            </span>
          </h2>
          <p className="mt-6 text-[#65676B] dark:text-white/40 text-xl max-w-xl mx-auto leading-relaxed">
            Join thousands of marketing teams using SocialPulse AI to grow faster, smarter, and at scale.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <motion.button
              onClick={onLaunch}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2.5 bg-[#0866FF] hover:bg-[#1877F2] text-white px-9 py-4 rounded-full font-black text-sm shadow-lg shadow-blue-500/25 transition-all"
            >
              <Zap className="w-4 h-4 fill-white" />
              Launch Workspace — Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-6 text-[12px] text-[#65676B] dark:text-white/25">
            {["No credit card required", "14-day free trial", "Cancel anytime"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#31A24C]" /> {t}
              </span>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 13: FOOTER
// ─────────────────────────────────────────────────────────────────────────────

function Footer({ onLaunch }: { onLaunch: () => void }) {
  const navCols = [
    {
      title: "Product",
      links: [
        { label: "Analytics", href: "#features" },
        { label: "AI Studio", href: "#features" },
        { label: "Scheduler", href: "#features" },
        { label: "Security", href: "#features" },
        { label: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Enterprise", href: "#enterprise" },
        { label: "Status", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Security", href: "#" },
        { label: "Cookie Policy", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-black/5 dark:border-white/[0.05] py-16 px-6 bg-[#FFFFFF] dark:bg-[#18191A]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0866FF] to-[#7C3AED] flex items-center justify-center shadow-md shadow-blue-500/20">
                <Zap className="w-4 h-4 fill-white text-white" />
              </div>
              <span className="font-black text-[#050505] dark:text-white text-sm">
                SocialPulse <span className="text-[#0866FF]">AI</span>
              </span>
            </div>
            <p className="text-[12.5px] text-[#65676B] dark:text-white/30 leading-relaxed max-w-xs">
              Enterprise-grade AI platform for social media analytics, content generation, scheduling and predictive growth intelligence.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#31A24C]/25 bg-[#31A24C]/8 text-[#31A24C] text-[11px] font-semibold">
              <PulseDot color="#31A24C" />
              All systems operational
            </div>
          </div>

          {navCols.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-[#0866FF]">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[12.5px] text-[#65676B] dark:text-white/30 hover:text-[#0866FF] dark:hover:text-white/70 transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-black/5 dark:border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11.5px] text-[#8A8D91] dark:text-white/20">
          <p>© {new Date().getFullYear()} SocialPulse AI Inc. All rights reserved.</p>
          <button
            onClick={onLaunch}
            className="flex items-center gap-1.5 text-[#0866FF] hover:underline transition-colors font-semibold"
          >
            Launch Workspace <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter();
  const handleLaunch = useCallback(() => router.push("/login"), [router]);

  return (
    <div className="relative min-h-screen bg-[#FFFFFF] dark:bg-[#18191A] text-[#050505] dark:text-white overflow-x-hidden font-sans">
      {/* Persistent background */}
      <MeshBackground />
      <Particles />
      <MouseSpotlight />

      {/* Navigation */}
      <Nav onLaunch={handleLaunch} />

      {/* Sections */}
      <main className="relative z-10">
        <Hero onLaunch={handleLaunch} />
        <PlatformMarquee />
        <MetricsStrip />
        <FeatureBento />
        <HowItWorks />
        <Testimonials />
        <Pricing onLaunch={handleLaunch} />
        <FinalCTA onLaunch={handleLaunch} />
      </main>

      <Footer onLaunch={handleLaunch} />
    </div>
  );
}