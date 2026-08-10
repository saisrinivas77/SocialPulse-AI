"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, X, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";

export const UpgradePlanModal: React.FC = () => {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen } = useAppStore();

  if (!isUpgradeModalOpen) return null;

  const plans = [
    {
      name: "Growth Pro",
      price: "$199",
      period: "/month",
      desc: "For scaling growth teams managing up to 5 social channels.",
      features: ["50,000 AI Credits/mo", "5 Connected Channels", "Predictive Virality Score", "Standard PDF Reports"],
      isCurrent: false,
    },
    {
      name: "Enterprise Pro",
      price: "$499",
      period: "/month",
      desc: "Full autonomous social OS for enterprises & agencies.",
      features: ["Unlimited AI Credits", "All 8 Social Networks", "Custom Fine-tuned LLMs", "White-labeled Reports & API"],
      isCurrent: true,
      popular: true,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-3xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
        >
          <button
            onClick={() => setIsUpgradeModalOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-2xl border transition-colors"
            style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center space-y-2 max-w-md mx-auto">
            <div className="w-10 h-10 rounded-2xl text-white flex items-center justify-center mx-auto shadow-md" style={{ background: 'linear-gradient(135deg, #C8A14A, #E8D5A3)' }}>
              <Crown className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
              Upgrade SocialPulse AI
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Unlock unlimited generative models, predictive reach scoring, and dedicated API access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-[24px] p-6 flex flex-col justify-between space-y-4 shadow-xs"
                style={{
                  background: plan.popular ? 'var(--accent-light)' : 'var(--card-bg)',
                  border: plan.popular ? '1px solid #C8A14A' : '1px solid var(--card-border)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{plan.name}</span>
                    {plan.popular && (
                      <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)' }}>
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{plan.price}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{plan.desc}</p>
                </div>

                <div className="space-y-2 pt-3 text-xs" style={{ borderTop: '1px solid var(--card-border)' }}>
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                      <Check className="w-3.5 h-3.5" style={{ color: '#C8A14A' }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    toast.success(`Upgraded to ${plan.name}!`);
                    setIsUpgradeModalOpen(false);
                  }}
                  className="w-full py-2.5 rounded-full font-bold text-xs transition-all shadow-md text-white"
                  style={{
                    background: plan.isCurrent ? 'var(--bg-secondary)' : 'linear-gradient(135deg, #C8A14A, #B8922E)',
                    color: plan.isCurrent ? 'var(--text-primary)' : '#FFFFFF',
                    border: plan.isCurrent ? '1px solid var(--card-border)' : 'none',
                  }}
                >
                  {plan.isCurrent ? "Active Plan" : "Upgrade Now"}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
