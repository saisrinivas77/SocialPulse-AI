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

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-[11px] font-semibold text-[#888] uppercase tracking-wider">
        <span>Step {step} of {total}</span>
        <span>{Math.round((step / total) * 100)}% Complete</span>
      </div>
      <div className="h-1 w-full bg-[#F0F0F0] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#C8A14A] to-[#D7B45D] rounded-full"
          initial={{ width: `${((step - 1) / total) * 100}%` }}
          animate={{ width: `${(step / total) * 100}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
            backgroundColor: s < step ? "#22C55E" : s === step ? "#C8A14A" : "#E5E5E5",
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}

// ─── Industry options ─────────────────────────────────────────────────────────
const INDUSTRIES = ["Technology", "E-Commerce", "Media & Entertainment", "Finance", "Healthcare", "Education", "Retail", "Agency", "Other"];
const COMPANY_SIZES = ["Just me", "2–10", "11–50", "51–200", "201–1000", "1000+"];

// ─── Goals ───────────────────────────────────────────────────────────────────
const GOALS = [
  { id: "engagement", label: "Increase Engagement", icon: "📈", desc: "Boost likes, comments and shares" },
  { id: "schedule", label: "Schedule Content", icon: "🗓️", desc: "Plan and automate posts" },
  { id: "ai_content", label: "AI Content Creation", icon: "🤖", desc: "Generate captions with AI" },
  { id: "analytics", label: "Deep Analytics", icon: "📊", desc: "Understand what's working" },
  { id: "advertising", label: "Advertising ROI", icon: "💰", desc: "Track paid campaign performance" },
  { id: "brand", label: "Brand Monitoring", icon: "🛡️", desc: "Monitor mentions and sentiment" },
];

// ─── Role options ─────────────────────────────────────────────────────────────
const ROLES = ["Admin", "Content Lead", "Analyst", "Reviewer", "Viewer"];

// ─── Step 1: Workspace creation ───────────────────────────────────────────────
function Step1Workspace({ onNext }: { onNext: (data: WorkspaceData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<WorkspaceData>({
    resolver: zodResolver(workspaceSchema),
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#C8A14A]/10 flex items-center justify-center mb-4">
          <Building2 className="w-6 h-6 text-[#C8A14A]" />
        </div>
        <h2 className="text-2xl font-black text-[#111] tracking-tight">Set up your workspace</h2>
        <p className="text-[14px] text-[#888] mt-1.5">This takes less than 60 seconds. You can always change this later.</p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-5">
        {/* Workspace name */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#444] uppercase tracking-wider">Workspace Name</label>
          <input
            {...register("name")}
            placeholder="Acme Corp"
            className="w-full px-4 py-3 rounded-xl border border-[#ECECEC] bg-white text-[#111] text-[13px] outline-none focus:border-[#C8A14A] focus:shadow-[0_0_0_3px_rgba(200,161,74,0.12)] transition-all placeholder:text-[#ccc]"
          />
          {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
        </div>

        {/* Logo upload placeholder */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#444] uppercase tracking-wider">Workspace Logo <span className="text-[#ccc] normal-case font-normal">— optional</span></label>
          <div className="border-2 border-dashed border-[#ECECEC] rounded-xl p-6 text-center cursor-pointer hover:border-[#C8A14A] hover:bg-[#FAFAF8] transition-all group">
            <Upload className="w-6 h-6 text-[#ccc] group-hover:text-[#C8A14A] mx-auto mb-2 transition-colors" />
            <p className="text-[12px] text-[#bbb] group-hover:text-[#888] transition-colors">Click to upload or drag & drop</p>
            <p className="text-[10px] text-[#ddd] mt-0.5">PNG, JPG up to 2MB</p>
          </div>
        </div>

        {/* Industry */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#444] uppercase tracking-wider">Industry</label>
          <select
            {...register("industry")}
            className="w-full px-4 py-3 rounded-xl border border-[#ECECEC] bg-white text-[#111] text-[13px] outline-none focus:border-[#C8A14A] transition-all appearance-none"
          >
            <option value="">Select your industry</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          {errors.industry && <p className="text-[11px] text-red-500">{errors.industry.message}</p>}
        </div>

        {/* Company size */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#444] uppercase tracking-wider">Team Size</label>
          <div className="grid grid-cols-3 gap-2">
            {COMPANY_SIZES.map(size => (
              <label key={size} className="relative cursor-pointer">
                <input {...register("company_size")} type="radio" value={size} className="peer sr-only" />
                <div className="p-2.5 rounded-xl border border-[#ECECEC] text-center text-[12px] font-medium text-[#666] peer-checked:border-[#C8A14A] peer-checked:bg-[#C8A14A]/5 peer-checked:text-[#C8A14A] hover:border-[#C8A14A]/50 transition-all">
                  {size}
                </div>
              </label>
            ))}
          </div>
          {errors.company_size && <p className="text-[11px] text-red-500">{errors.company_size.message}</p>}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-[#111] text-white py-3.5 rounded-xl font-bold text-[13px] shadow-md hover:bg-[#222] transition-colors mt-2"
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
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-blue-500" />
        </div>
        <h2 className="text-2xl font-black text-[#111] tracking-tight">Invite your team</h2>
        <p className="text-[14px] text-[#888] mt-1.5">Collaborate with colleagues. You can always do this later.</p>
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
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#ECECEC] bg-white text-[#111] text-[13px] outline-none focus:border-[#C8A14A] transition-all placeholder:text-[#ccc]"
            />
            <select
              value={inv.role}
              onChange={e => updateRow(i, "role", e.target.value)}
              className="w-32 px-3 py-2.5 rounded-xl border border-[#ECECEC] bg-white text-[#111] text-[12px] outline-none focus:border-[#C8A14A] transition-all"
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </motion.div>
        ))}
      </div>

      <button onClick={addRow} className="text-[12px] text-[#C8A14A] font-semibold hover:text-[#9F7A2F] transition-colors mb-6">
        + Add another
      </button>

      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 py-3.5 rounded-xl border border-[#ECECEC] text-[13px] font-semibold text-[#666] hover:border-[#ccc] hover:text-[#333] transition-all"
        >
          Skip for now
        </button>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 bg-[#111] text-white py-3.5 rounded-xl font-bold text-[13px] shadow-md hover:bg-[#222] transition-colors"
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
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
          <Target className="w-6 h-6 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-[#111] tracking-tight">What are your goals?</h2>
        <p className="text-[14px] text-[#888] mt-1.5">Select all that apply. We'll personalize your workspace.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {GOALS.map(goal => {
          const isSelected = selected.includes(goal.id);
          return (
            <motion.button
              key={goal.id}
              onClick={() => toggle(goal.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`relative text-left p-4 rounded-2xl border transition-all ${
                isSelected
                  ? "border-[#C8A14A] bg-[#C8A14A]/5 shadow-[0_0_0_1px_rgba(200,161,74,0.2)]"
                  : "border-[#ECECEC] bg-white hover:border-[#ddd]"
              }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C8A14A]" />
                </motion.div>
              )}
              <div className="text-2xl mb-2">{goal.icon}</div>
              <div className="text-[13px] font-bold text-[#111]">{goal.label}</div>
              <div className="text-[11px] text-[#888] mt-0.5">{goal.desc}</div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={() => onNext(selected)}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#C8A14A] to-[#9F7A2F] text-white py-3.5 rounded-xl font-bold text-[13px] shadow-[0_4px_20px_rgba(200,161,74,0.3)] hover:opacity-90 transition-all disabled:opacity-60"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Creating workspace…</>
        ) : (
          <>Launch SocialPulse AI <Zap className="w-4 h-4 fill-white" /></>
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
      // Try to create workspace via API; fall through gracefully if endpoint doesn't exist
      await axios.post(`${API_URL}/api/v1/workspaces`, {
        name: workspaceData?.name,
        industry: workspaceData?.industry,
        company_size: workspaceData?.company_size,
        goals,
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch {
      // workspace API may not exist yet — proceed to init anyway
    } finally {
      router.push("/init");
    }
  };

  const TOTAL_STEPS = 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafaf8] via-white to-[#f5f3ee] flex items-center justify-center px-4 font-sans">
      {/* Background texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #C8A14A 1px, transparent 1px), linear-gradient(to bottom, #C8A14A 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C8A14A] to-[#9F7A2F] flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-[#111] text-sm">SocialPulse AI</span>
        </div>

        {/* Progress */}
        <div className="mb-6 space-y-3">
          <ProgressBar step={step} total={TOTAL_STEPS} />
          <StepDots step={step} total={TOTAL_STEPS} />
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-[#ECECEC] shadow-[0_24px_80px_rgba(17,17,17,0.08)] p-8">
          <AnimatePresence mode="wait">
            {step === 1 && <Step1Workspace key="step1" onNext={handleStep1} />}
            {step === 2 && <Step2Invite key="step2" onNext={handleStep2} onSkip={handleStep2} />}
            {step === 3 && <Step3Goals key="step3" onNext={handleStep3} loading={loading} />}
          </AnimatePresence>
        </div>

        {/* Back button */}
        {step > 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setStep(s => s - 1)}
            className="mt-4 flex items-center gap-1.5 text-[12px] text-[#aaa] hover:text-[#666] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go back
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
