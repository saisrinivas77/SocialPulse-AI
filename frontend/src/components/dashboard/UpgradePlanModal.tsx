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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-3xl bg-white dark:bg-[#18191A] border border-black/5 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
        >
          <button
            onClick={() => setIsUpgradeModalOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-2xl border border-black/5 dark:border-white/10 text-[#8A8D91] hover:text-[#050505]"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center space-y-2 max-w-md mx-auto">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0866FF] to-[#7C3AED] flex items-center justify-center text-white mx-auto shadow-md">
              <Crown className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#050505] dark:text-[#E4E6EB]">
              Upgrade SocialPulse AI
            </h2>
            <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
              Unlock unlimited generative models, predictive reach scoring, and dedicated API access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`apple-card p-6 flex flex-col justify-between space-y-4 ${
                  plan.popular ? "border-[#0866FF] bg-[#0866FF]/5 dark:bg-[#0866FF]/10" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#050505] dark:text-[#E4E6EB]">{plan.name}</span>
                    {plan.popular && (
                      <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#0866FF] text-white">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-3xl font-extrabold text-[#050505] dark:text-[#E4E6EB]">{plan.price}</span>
                    <span className="text-xs text-[#8A8D91]">{plan.period}</span>
                  </div>
                  <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">{plan.desc}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-black/5 dark:border-white/10 text-xs">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 font-medium text-[#050505] dark:text-[#E4E6EB]">
                      <Check className="w-3.5 h-3.5 text-[#0866FF]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    toast.success(`Upgraded to ${plan.name}!`);
                    setIsUpgradeModalOpen(false);
                  }}
                  className={`w-full py-2.5 rounded-full font-bold text-xs transition-all ${
                    plan.isCurrent
                      ? "bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10 text-[#050505] dark:text-[#E4E6EB]"
                      : "bg-[#0866FF] hover:bg-[#1877F2] text-white shadow-md"
                  }`}
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
