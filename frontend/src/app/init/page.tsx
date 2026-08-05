"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";

// ─── Neural network canvas ────────────────────────────────────────────────────
function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    const nodes = Array.from({ length: 36 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1.5 + Math.random() * 2,
      pulse: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;

      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.25;
            const pulse = Math.sin(frame * 0.03 + i * 0.5) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(8, 102, 255, ${alpha * (0.4 + pulse * 0.6)})`;
            ctx.lineWidth = alpha * 1.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            if (Math.random() < 0.001) {
              const t = (frame * 0.05) % 1;
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * t;
              ctx.beginPath();
              ctx.arc(px, py, 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(8, 102, 255, 0.9)`;
              ctx.fill();
            }
          }
        }
      }

      nodes.forEach(n => {
        const pulse = Math.sin(n.pulse) * 0.4 + 0.8;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        grad.addColorStop(0, `rgba(8, 102, 255, ${0.3 * pulse})`);
        grad.addColorStop(1, "rgba(8, 102, 255, 0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(8, 102, 255, ${0.7 + 0.3 * pulse})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

// ─── Loading steps ─────────────────────────────────────────────────────────────
const STEPS = [
  "Initializing AI neural network…",
  "Synchronizing workspace data…",
  "Loading platform analytics…",
  "Calibrating engagement models…",
  "Preparing content intelligence…",
  "Configuring team permissions…",
  "Building your personalized dashboard…",
  "Almost there — final touches…",
];

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = display;
    const diff = value - start;
    const steps = 20;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplay(Math.round(start + diff * (i / steps)));
      if (i >= steps) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [value]);
  return <>{display}</>;
}

export default function InitPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const totalDuration = 3000;
    const interval = 60;
    const increment = (interval / totalDuration) * 100;
    const stepInterval = totalDuration / STEPS.length;

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setDone(true), 300);
          return 100;
        }
        return next;
      });
    }, interval);

    const stepTimer = setInterval(() => {
      setStepIdx(prev => Math.min(prev + 1, STEPS.length - 1));
    }, stepInterval);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, []);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => router.push("/dashboard"), 800);
      return () => clearTimeout(t);
    }
  }, [done, router]);

  return (
    <div className="min-h-screen bg-[#FAFBFD] dark:bg-[#121316] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Light grid matching reference */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Ambient blob */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 800px 600px at 50% 50%, rgba(8,102,255,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Neural network canvas */}
      <div className="absolute inset-0">
        <NeuralNetwork />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Floating rounded icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#0866FF] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-blue-500/25 mb-8"
        >
          <motion.div
            animate={{ rotate: done ? 0 : 360 }}
            transition={{ duration: 3, repeat: done ? 0 : Infinity, ease: "linear" }}
          >
            <Zap className="w-10 h-10 text-white fill-white" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-black text-[#111111] dark:text-white tracking-tight"
        >
          {done ? "Your workspace is ready!" : "Launching SocialPulse AI…"}
        </motion.h1>

        <AnimatePresence mode="wait">
          <motion.p
            key={stepIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mt-3 text-sm text-[#666666] dark:text-[#A0A0A0] font-medium"
          >
            {done ? "Redirecting to your dashboard…" : STEPS[stepIdx]}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="mt-8 w-full space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider">Progress</span>
            <span className="font-black text-[#111111] dark:text-white">
              <AnimatedCounter value={Math.round(progress)} />%
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#E5E5EA] dark:bg-[#27272A] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#0866FF] to-[#7C3AED]"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 12px rgba(8, 102, 255, 0.4)",
              }}
              transition={{ type: "spring", stiffness: 60, damping: 12 }}
            />
          </div>
        </div>

        {/* Step dots */}
        <div className="mt-6 flex items-center gap-2">
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                backgroundColor: i < stepIdx ? "#31A24C" : i === stepIdx ? "#0866FF" : "#E5E5EA",
                scale: i === stepIdx ? 1.3 : 1,
              }}
              transition={{ duration: 0.25 }}
              className="w-1.5 h-1.5 rounded-full"
            />
          ))}
        </div>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mt-8 w-12 h-12 rounded-full bg-[#E7F8ED] border border-[#31A24C]/30 flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-[#31A24C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
