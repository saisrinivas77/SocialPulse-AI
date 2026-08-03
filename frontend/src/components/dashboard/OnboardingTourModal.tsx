"use client";

import React, { useState } from "react";
import { Sparkles, Check, ArrowRight, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const OnboardingTourModal: React.FC = () => {
  const [show, setShow] = useState(true);
  const [step, setStep] = useState(0);
  const { setCurrentView } = useAppStore();

  if (!show) return null;

  const steps = [
    {
      title: "Welcome to SocialPulse AI OS",
      desc: "Your enterprise AI operating system for cross-network social media analytics, caption generation, scheduling, and predictive growth.",
      badge: "Step 1 of 3",
    },
    {
      title: "Meet AI Copilot (Cursor Style)",
      desc: "Use Cmd+K or click the AI Copilot tab to generate full campaigns, analyze sentiment, and run predictive engagement models in real time.",
      badge: "Step 2 of 3",
    },
    {
      title: "Multi-Platform Scheduler & Reports",
      desc: "Drag-and-drop posts into your cross-channel calendar and generate publication-ready PDF & Excel executive summaries in one click.",
      badge: "Step 3 of 3",
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setShow(false);
      setCurrentView("overview");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-card border-amber-500/40 p-6 space-y-6 animate-rise-in relative shadow-[0_0_80px_rgba(255,215,0,0.3)]">
        <button onClick={() => setShow(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {currentStep.badge}
          </span>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> {currentStep.title}
          </h2>
          <p className="text-xs text-gray-300 font-light leading-relaxed">{currentStep.desc}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-amber-500/15">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <span key={i} className={`w-2 h-2 rounded-full ${i === step ? "bg-amber-400" : "bg-white/20"}`} />
            ))}
          </div>

          <button onClick={handleNext} className="btn-magnetic btn-gold px-5 py-2 text-xs font-bold flex items-center gap-1.5">
            <span>{step === steps.length - 1 ? "Launch AI OS" : "Next Step"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
