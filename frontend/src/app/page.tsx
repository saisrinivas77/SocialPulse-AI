"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, ChevronDown, Zap, Sparkles, BarChart3, Brain, Shield, Globe2, TrendingUp, Users, Star, CheckCircle2, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Mouse-reactive light cursor ───────────────────────────────────────────
function MouseLight() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: useTransform(
          [smoothX, smoothY],
          ([mx, my]: number[]) =>
            `radial-gradient(600px circle at ${mx}px ${my}px, rgba(200,161,74,0.07) 0%, transparent 70%)`
        ),
      }}
    />
  );
}

// ─── Animated grid ──────────────────────────────────────────────────────────
function AnimatedGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #C8A14A 1px, transparent 1px),
            linear-gradient(to bottom, #C8A14A 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}

// ─── Floating particles ─────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    delay: Math.random() * 5,
    dur: 8 + Math.random() * 12,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#C8A14A]"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: 0.18 }}
          animate={{ y: [0, -40, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Ambient blobs ──────────────────────────────────────────────────────────
function AmbientBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(200,161,74,0.09) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(200,161,74,0.06) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], x: [0, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
}

// ─── Nav ────────────────────────────────────────────────────────────────────
function Nav({ onLaunch }: { onLaunch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Features", "Pricing", "Solutions", "Enterprise", "Resources"];

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(200,161,74,0.12)]" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#C8A14A] to-[#9F7A2F] flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-[#111111] tracking-tight text-sm">SocialPulse AI</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l} href="#" className="text-[13px] font-medium text-[#666] hover:text-[#111] transition-colors">{l}</a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a href="/login" className="text-[13px] font-medium text-[#666] hover:text-[#111] transition-colors">Login</a>
          <button
            onClick={onLaunch}
            className="flex items-center gap-1.5 bg-[#111111] text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-[#222] transition-all hover:scale-105 active:scale-100"
          >
            Launch Workspace <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-[#111]" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-[#ECECEC] px-6 py-4 space-y-4"
          >
            {links.map((l) => <a key={l} href="#" className="block text-sm font-medium text-[#444]">{l}</a>)}
            <button onClick={onLaunch} className="w-full bg-[#111] text-white text-sm font-semibold py-3 rounded-full">Launch Workspace</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── Feature cards ──────────────────────────────────────────────────────────
const FEATURES = [
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Live dashboards tracking every metric across all platforms simultaneously with sub-second updates.", color: "#C8A14A" },
  { icon: Brain, title: "AI Content Studio", desc: "Generate viral captions, hashtags, and full campaigns optimized for each platform using GPT-4.", color: "#8B5CF6" },
  { icon: TrendingUp, title: "Predictive Intelligence", desc: "Forecast engagement trends and identify optimal posting windows before your competitors do.", color: "#10B981" },
  { icon: Globe2, title: "Universal Publishing", desc: "Schedule and publish to Instagram, TikTok, LinkedIn, X, YouTube and more from one command center.", color: "#3B82F6" },
  { icon: Shield, title: "Enterprise Security", desc: "SOC 2 Type II certified. GDPR compliant. SSO, audit logs, and role-based access built in.", color: "#EF4444" },
  { icon: Users, title: "Team Collaboration", desc: "Invite your entire team, assign roles, and collaborate on content with real-time co-editing.", color: "#F59E0B" },
];

// ─── Scroll section ──────────────────────────────────────────────────────────
function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-black text-[#111] tracking-tight">{value}</div>
      <div className="text-sm text-[#888] mt-1 font-medium">{label}</div>
    </motion.div>
  );
}

// ─── Platform pill ───────────────────────────────────────────────────────────
const PLATFORMS = ["Instagram", "TikTok", "LinkedIn", "YouTube", "X", "Facebook", "Pinterest", "Threads"];

// ─── Main landing page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();

  const handleLaunch = () => router.push("/login");

  return (
    <div className="relative min-h-screen bg-white text-[#111] overflow-x-hidden font-sans">
      {/* Global ambient */}
      <MouseLight />
      <AmbientBlobs />
      <AnimatedGrid />
      <Particles />

      {/* Navigation */}
      <Nav onLaunch={handleLaunch} />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#ECE8E1] bg-[#FAFAF8] mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C8A14A]" />
          <span className="text-[11px] font-semibold tracking-widest text-[#666] uppercase">Enterprise AI Analytics Platform</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-black text-[#111] leading-[1.04] tracking-[-0.04em]"
        >
          The Operating System{" "}
          <span className="relative inline-block">
            <span
              style={{
                background: "linear-gradient(135deg, #C8A14A 0%, #D7B45D 50%, #9F7A2F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              for Social Media
            </span>
          </span>{" "}
          Intelligence.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-6 max-w-xl text-lg text-[#666] leading-relaxed font-normal"
        >
          Create, analyze, schedule and optimize every social platform using enterprise AI. Built for teams that move at the speed of culture.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.48 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.button
            onClick={handleLaunch}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-[#111] text-white px-7 py-3.5 rounded-full font-semibold text-sm shadow-[0_8px_30px_rgba(17,17,17,0.18)] hover:bg-[#222] transition-colors"
          >
            <Zap className="w-4 h-4 fill-white text-white" />
            Launch Workspace
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.a
            href="#demo"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-white text-[#111] border border-[#ECECEC] px-7 py-3.5 rounded-full font-semibold text-sm hover:border-[#C8A14A] hover:text-[#C8A14A] transition-all"
          >
            <div className="w-5 h-5 rounded-full bg-[#F0F0F0] flex items-center justify-center">
              <Play className="w-2.5 h-2.5 fill-[#111] ml-0.5" />
            </div>
            Watch Demo
          </motion.a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-10 flex items-center gap-2 text-[13px] text-[#888]"
        >
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ECE8E1] to-[#d4c4aa] border-2 border-white" />
            ))}
          </div>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[#C8A14A] text-[#C8A14A]" />)}
          </div>
          <span>Trusted by <strong className="text-[#111]">4,200+</strong> marketing teams</span>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 w-full max-w-5xl"
        >
          <div className="relative rounded-2xl border border-[#ECECEC] bg-white shadow-[0_24px_80px_rgba(17,17,17,0.10)] overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#F0F0F0] bg-[#FAFAFA]">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <div className="flex-1 mx-4 bg-[#F0F0F0] rounded-full px-3 py-1 text-[11px] text-[#999] font-mono">app.socialpulse.ai/dashboard</div>
            </div>
            {/* Dashboard illustration */}
            <div className="h-[340px] md:h-[440px] bg-gradient-to-b from-[#FAFAF8] to-white p-6 flex gap-5">
              {/* Sidebar */}
              <div className="hidden md:flex flex-col gap-2 w-44 flex-shrink-0">
                <div className="h-8 w-8 rounded-xl bg-[#C8A14A]/10 mb-2" />
                {["Overview","Analytics","AI Studio","Scheduler","Posts","Campaigns","Reports"].map(item => (
                  <div key={item} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium ${item === "Overview" ? "bg-[#C8A14A]/10 text-[#C8A14A]" : "text-[#888]"}`}>
                    <div className={`w-3.5 h-3.5 rounded-full ${item === "Overview" ? "bg-[#C8A14A]" : "bg-[#E5E5E5]"}`} />
                    {item}
                  </div>
                ))}
              </div>
              {/* Main content */}
              <div className="flex-1 space-y-4">
                {/* Stat row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Total Reach", val: "4.2M" },
                    { label: "Engagement", val: "8.4%" },
                    { label: "AI Posts", val: "142" },
                    { label: "Revenue", val: "$84K" },
                  ].map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="bg-white border border-[#ECECEC] rounded-xl p-3 shadow-sm"
                    >
                      <div className="text-[10px] text-[#888] font-medium">{s.label}</div>
                      <div className="text-lg font-black text-[#111] mt-0.5">{s.val}</div>
                      <div className="text-[9px] text-emerald-500 font-semibold mt-0.5">↑ 12.4%</div>
                    </motion.div>
                  ))}
                </div>
                {/* Chart area */}
                <div className="bg-white border border-[#ECECEC] rounded-xl p-4 h-36 flex items-end gap-1.5 overflow-hidden">
                  {[40,65,48,72,55,88,62,94,78,85,70,96].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 1 + i * 0.05, duration: 0.5, ease: [0.16,1,0.3,1] }}
                      style={{ height: `${h}%`, originY: 1 }}
                      className={`flex-1 rounded-t-sm ${i === 11 ? "bg-[#C8A14A]" : "bg-[#F0EDE6]"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="mt-10 flex flex-col items-center gap-1 text-[#ccc]"
        >
          <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll to explore</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ── PLATFORMS ── */}
      <section className="py-16 px-6 border-t border-[#F0F0F0]">
        <FadeSection>
          <p className="text-center text-[12px] font-semibold uppercase tracking-widest text-[#bbb] mb-8">Connect every platform in one workspace</p>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {PLATFORMS.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.06, y: -2 }}
                className="px-4 py-2 rounded-full border border-[#ECECEC] bg-white text-[13px] font-medium text-[#444] shadow-sm hover:border-[#C8A14A] hover:text-[#C8A14A] transition-all cursor-default"
              >
                {p}
              </motion.div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 px-6 bg-[#FAFAF8] border-y border-[#F0F0F0]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <StatCard value="4,200+" label="Active Teams" />
          <StatCard value="142M+" label="Posts Analyzed" />
          <StatCard value="98.9%" label="Uptime SLA" />
          <StatCard value="8.4x" label="Avg. ROI" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ECE8E1] bg-[#FAFAF8] mb-5">
                <span className="text-[11px] font-semibold tracking-widest text-[#666] uppercase">Platform Capabilities</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#111] tracking-tight leading-tight">
                Everything you need to<br />
                <span style={{ background: "linear-gradient(135deg,#C8A14A,#9F7A2F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  dominate social media.
                </span>
              </h2>
              <p className="mt-4 text-[#666] max-w-xl mx-auto">One platform to analyze, create, schedule, and grow across every social network, powered by enterprise-grade AI.</p>
            </div>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16,1,0.3,1] }}
                  whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(17,17,17,0.08)" }}
                  className="bg-white rounded-2xl border border-[#ECECEC] p-6 shadow-sm transition-all cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <h3 className="font-bold text-[#111] text-base mb-2">{f.title}</h3>
                  <p className="text-[13px] text-[#666] leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="py-20 px-6 bg-[#FAFAF8] border-t border-[#F0F0F0]">
        <div className="max-w-3xl mx-auto text-center">
          <FadeSection>
            <div className="flex justify-center mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#C8A14A] text-[#C8A14A]" />)}
            </div>
            <blockquote className="text-2xl md:text-3xl font-semibold text-[#111] tracking-tight leading-snug">
              "SocialPulse AI is the only platform that actually feels like it was designed for enterprise marketing teams. The AI is genuinely useful."
            </blockquote>
            <p className="mt-6 text-[#888] text-sm">— Head of Growth, Series C SaaS Company</p>
          </FadeSection>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeSection>
            <h2 className="text-4xl md:text-5xl font-black text-[#111] tracking-tight">
              Ready to transform your<br />social media strategy?
            </h2>
            <p className="mt-4 text-[#666] text-lg max-w-lg mx-auto">Join 4,200+ marketing teams already using SocialPulse AI to grow faster, smarter, and at scale.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <motion.button
                onClick={handleLaunch}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-[#111] text-white px-8 py-4 rounded-full font-bold shadow-[0_8px_30px_rgba(17,17,17,0.18)] hover:bg-[#222] transition-colors text-sm"
              >
                <Zap className="w-4 h-4 fill-white" />
                Launch Workspace — Free
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="mt-5 flex items-center justify-center gap-5 text-[12px] text-[#999]">
              {["No credit card required","14-day free trial","Cancel anytime"].map(t => (
                <span key={t} className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{t}</span>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#F0F0F0] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#C8A14A] to-[#9F7A2F] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="font-bold text-[#111] text-sm">SocialPulse AI</span>
          </div>
          <div className="flex gap-8 text-[12px] text-[#888]">
            {["Privacy","Terms","Security","Status","Docs"].map(l => (
              <a key={l} href="#" className="hover:text-[#111] transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-[12px] text-[#bbb]">© 2026 SocialPulse AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}