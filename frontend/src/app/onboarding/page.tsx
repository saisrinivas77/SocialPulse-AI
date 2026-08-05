"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Building2, Users, Target, CheckCircle2, Upload, Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Step 1: Workspace schema ─────────────────────────────────────────────────
const workspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters").max(50),
  industry: z.string().min(1, "Select an industry"),
  company_size: z.string().min(1, "Select company size"),
});

type WorkspaceData = z.infer<typeof workspaceSchema>;

// ─── Reference Grid Background ─────────────────────────────────────────────
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

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-[11px] font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider">
        <span>Step {step} of {total}</span>
        <span>{Math.round((step / total) * 100)}% Complete</span>
      </div>
      <div className="h-1.5 w-full bg-[#E5E5EA] dark:bg-[#27272A] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#0866FF] to-[#7C3AED] rounded-full"
          initial={{ width: `${((step - 1) / total) * 100}%` }}
          animate={{ width: `${(step / total) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

// ─── Step indicator dots ──────────────────────────────────────────────────────
function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
        <motion.div
          key={s}
          animate={{
            width: s === step ? 24 : 8,
            backgroundColor: s < step ? "#31A24C" : s === step ? "#0866FF" : "#E5E5EA",
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}

const INDUSTRIES = ["Technology", "E-Commerce", "Media & Entertainment", "Finance", "Healthcare", "Education", "Retail", "Agency", "Other"];
const COMPANY_SIZES = ["Just me", "2–10", "11–50", "51–200", "201–1000", "1000+"];

const GOALS = [
  { id: "engagement", label: "Increase Engagement", icon: "📈", desc: "Boost likes, comments and shares" },
  { id: "schedule", label: "Schedule Content", icon: "🗓️", desc: "Plan and automate posts" },
  { id: "ai_content", label: "AI Content Creation", icon: "🤖", desc: "Generate captions with AI" },
  { id: "analytics", label: "Deep Analytics", icon: "📊", desc: "Understand what's working" },
  { id: "advertising", label: "Advertising ROI", icon: "💰", desc: "Track paid campaign performance" },
  { id: "brand", label: "Brand Monitoring", icon: "🛡️", desc: "Monitor mentions and sentiment" },
];

const ROLES = ["Admin", "Content Lead", "Analyst", "Reviewer", "Viewer"];

// ─── Step 1: Workspace creation ───────────────────────────────────────────────
function Step1Workspace({ onNext }: { onNext: (data: WorkspaceData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<WorkspaceData>({
    resolver: zodResolver(workspaceSchema),
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#0866FF]/10 text-[#0866FF] flex items-center justify-center mb-4">
          <Building2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-[#111111] dark:text-white tracking-tight">Set up your workspace</h2>
        <p className="text-sm text-[#777777] dark:text-[#A0A0A0] mt-1">This takes less than 60 seconds. You can change this anytime.</p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider">Workspace Name</label>
          <input
            {...register("name")}
            placeholder="Acme Corp"
            className="w-full px-4 py-3 rounded-2xl border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-[#111111] dark:text-white text-sm outline-none focus:border-[#0866FF] transition-all"
          />
          {errors.name && <p className="text-[11px] text-[#FA383E] font-medium">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider">Workspace Logo <span className="text-[#A0A0A0] normal-case font-normal">— optional</span></label>
          <div className="border-2 border-dashed border-[#E5E5EA] dark:border-[#333336] rounded-2xl p-5 text-center cursor-pointer hover:border-[#0866FF] hover:bg-[#0866FF]/5 transition-all group">
            <Upload className="w-6 h-6 text-[#A0A0A0] group-hover:text-[#0866FF] mx-auto mb-1.5 transition-colors" />
            <p className="text-xs text-[#777777] group-hover:text-[#111111] dark:group-hover:text-white transition-colors">Click to upload or drag & drop</p>
            <p className="text-[10px] text-[#A0A0A0] mt-0.5">PNG, JPG up to 2MB</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider">Industry</label>
          <select
            {...register("industry")}
            className="w-full px-4 py-3 rounded-2xl border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-[#111111] dark:text-white text-sm outline-none focus:border-[#0866FF] transition-all appearance-none"
          >
            <option value="">Select your industry</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          {errors.industry && <p className="text-[11px] text-[#FA383E] font-medium">{errors.industry.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider">Team Size</label>
          <div className="grid grid-cols-3 gap-2">
            {COMPANY_SIZES.map(size => (
              <label key={size} className="relative cursor-pointer">
                <input {...register("company_size")} type="radio" value={size} className="peer sr-only" />
                <div className="p-2.5 rounded-xl border border-[#E5E5EA] dark:border-[#333336] text-center text-xs font-semibold text-[#666666] dark:text-[#A0A0A0] peer-checked:border-[#0866FF] peer-checked:bg-[#0866FF]/10 peer-checked:text-[#0866FF] hover:border-[#0866FF]/50 transition-all">
                  {size}
                </div>
              </label>
            ))}
          </div>
          {errors.company_size && <p className="text-[11px] text-[#FA383E] font-medium">{errors.company_size.message}</p>}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-center gap-2 bg-[#0866FF] text-white py-3.5 rounded-full font-extrabold text-sm shadow-md hover:bg-[#1877F2] transition-colors mt-2"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </motion.button>
      </form>
    </motion.div>
  );
}

// ─── Step 2: Invite team ──────────────────────────────────────────────────────
function Step2Invite({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const [invites, setInvites] = useState([{ email: "", role: "Analyst" }]);

  const addRow = () => setInvites(p => [...p, { email: "", role: "Analyst" }]);
  const updateRow = (i: number, field: "email" | "role", val: string) => {
    setInvites(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0866FF] flex items-center justify-center mb-4">
          <Users className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-[#111111] dark:text-white tracking-tight">Invite your team</h2>
        <p className="text-sm text-[#777777] dark:text-[#A0A0A0] mt-1">Collaborate with colleagues. You can always do this later.</p>
      </div>

      <div className="space-y-3 mb-5">
        {invites.map((inv, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <input
              type="email"
              value={inv.email}
              onChange={e => updateRow(i, "email", e.target.value)}
              placeholder="colleague@company.com"
              className="flex-1 px-4 py-3 rounded-2xl border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-[#111111] dark:text-white text-xs outline-none focus:border-[#0866FF] transition-all"
            />
            <select
              value={inv.role}
              onChange={e => updateRow(i, "role", e.target.value)}
              className="w-32 px-3 py-3 rounded-2xl border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-[#111111] dark:text-white text-xs outline-none focus:border-[#0866FF] transition-all"
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </motion.div>
        ))}
      </div>

      <button onClick={addRow} className="text-xs text-[#0866FF] font-bold hover:underline mb-6 block">
        + Add another teammate
      </button>

      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 py-3.5 rounded-full border border-[#E5E5EA] dark:border-[#333336] text-xs font-bold text-[#666666] dark:text-[#A0A0A0] hover:bg-[#F2F2F7] transition-all"
        >
          Skip for now
        </button>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex-1 flex items-center justify-center gap-2 bg-[#0866FF] text-white py-3.5 rounded-full font-extrabold text-xs shadow-md hover:bg-[#1877F2] transition-colors"
        >
          Send Invites <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Step 3: Select goals ─────────────────────────────────────────────────────
function Step3Goals({ onNext, loading }: { onNext: (goals: string[]) => void; loading: boolean }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#31A24C] flex items-center justify-center mb-4">
          <Target className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-[#111111] dark:text-white tracking-tight">What are your primary goals?</h2>
        <p className="text-sm text-[#777777] dark:text-[#A0A0A0] mt-1">Select all that apply. We will customize your workspace.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {GOALS.map(goal => {
          const isSelected = selected.includes(goal.id);
          return (
            <motion.button
              key={goal.id}
              onClick={() => toggle(goal.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`relative text-left p-4 rounded-2xl border transition-all ${
                isSelected
                  ? "border-[#0866FF] bg-[#0866FF]/10 shadow-xs"
                  : "border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] hover:border-[#0866FF]/50"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-4 h-4 text-[#0866FF]" />
                </div>
              )}
              <div className="text-xl mb-2">{goal.icon}</div>
              <div className="text-xs font-bold text-[#111111] dark:text-white">{goal.label}</div>
              <div className="text-[11px] text-[#777777] dark:text-[#A0A0A0] mt-0.5">{goal.desc}</div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={() => onNext(selected)}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-center gap-2 bg-[#0866FF] text-white py-3.5 rounded-full font-extrabold text-sm shadow-md hover:bg-[#1877F2] transition-all disabled:opacity-60"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Creating workspace…</>
        ) : (
          <>Launch Workspace Telemetry <Zap className="w-4 h-4 fill-white" /></>
        )}
      </motion.button>
    </motion.div>
  );
}

// ─── Main onboarding page ─────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(null);

  const handleStep1 = (data: WorkspaceData) => {
    setWorkspaceData(data);
    setStep(2);
  };

  const handleStep2 = () => setStep(3);

  const handleStep3 = async (goals: string[]) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("sp_access_token");
      await axios.post(`${API_URL}/api/v1/workspaces`, {
        name: workspaceData?.name,
        industry: workspaceData?.industry,
        company_size: workspaceData?.company_size,
        goals,
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch {
      // Fallback to init
    } finally {
      router.push("/init");
    }
  };

  const TOTAL_STEPS = 3;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative font-sans overflow-hidden">
      <ReferenceGridBackground />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[500px] z-10"
      >
        {/* Brand */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shadow-xs">
            <Zap className="w-4.5 h-4.5 fill-white" />
          </div>
          <span className="font-extrabold text-[#111111] dark:text-white text-base tracking-tight">SocialPulse AI</span>
        </div>

        {/* Progress bar */}
        <div className="mb-6 space-y-3">
          <ProgressBar step={step} total={TOTAL_STEPS} />
          <StepDots step={step} total={TOTAL_STEPS} />
        </div>

        {/* Floating rounded white card */}
        <div className="bg-white dark:bg-[#18181B] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.07)] p-8 sm:p-10 transition-all">
          <AnimatePresence mode="wait">
            {step === 1 && <Step1Workspace key="step1" onNext={handleStep1} />}
            {step === 2 && <Step2Invite key="step2" onNext={handleStep2} onSkip={handleStep2} />}
            {step === 3 && <Step3Goals key="step3" onNext={handleStep3} loading={loading} />}
          </AnimatePresence>
        </div>

        {step > 1 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="mt-4 flex items-center gap-1.5 text-xs text-[#777777] dark:text-[#A0A0A0] hover:text-[#111111] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go back
          </button>
        )}
      </motion.div>
    </div>
  );
}
