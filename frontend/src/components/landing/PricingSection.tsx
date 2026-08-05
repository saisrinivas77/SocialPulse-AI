"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Check, Sparkles, ArrowRight } from "lucide-react";

export const PricingSection: React.FC = () => {
  const { setCurrentView } = useAppStore();
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      desc: "For creators & influencers launching their brand.",
      priceMonthly: 29,
      priceAnnual: 23,
      highlighted: false,
      badge: "Standard",
      features: [
        "Up to 3 Social Accounts",
        "AI Caption Generator (500/mo)",
        "Basic Analytics Dashboard",
        "Weekly Email Summaries",
        "Standard Support",
      ],
    },
    {
      name: "Growth Pro",
      desc: "For scaling brands and high-momentum content teams.",
      priceMonthly: 79,
      priceAnnual: 63,
      highlighted: true,
      badge: "Most Popular",
      features: [
        "Unlimited Social Accounts",
        "Unlimited AI Studio",
        "Best Posting Time Predictive Engine",
        "Multi-Platform Scheduler",
        "Custom PDF & CSV Export Reports",
        "Priority 24/7 Support",
      ],
    },
    {
      name: "Enterprise Scale",
      desc: "For multi-brand agencies and enterprise organizations.",
      priceMonthly: 149,
      priceAnnual: 119,
      highlighted: false,
      badge: "Enterprise",
      features: [
        "Everything in Growth Pro",
        "Full Admin & Audit Logs",
        "Redis Worker Queue Priority",
        "Dedicated Account Executive",
        "Role-Based Access Control (RBAC)",
        "SLA & SSO Authentication",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 relative bg-white dark:bg-[#18191A] z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-wider text-[#0866FF] font-semibold bg-[#0866FF]/10 px-3.5 py-1 rounded-full border border-[#0866FF]/20">
            Transparent Plans
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#050505] dark:text-[#E4E6EB]">
            Invest in <span className="meta-gradient-text">predictable growth</span>
          </h2>
          <p className="text-[#65676B] dark:text-[#B0B3B8] text-base">
            Simple, predictable pricing tailored to your scale.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-full bg-[#F0F2F5] dark:bg-[#242526] border border-black/5 dark:border-white/10 mt-2">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                !annual ? "bg-[#0866FF] text-white shadow-md" : "text-[#65676B] dark:text-[#B0B3B8] hover:text-[#050505]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
                annual ? "bg-[#0866FF] text-white shadow-md" : "text-[#65676B] dark:text-[#B0B3B8] hover:text-[#050505]"
              }`}
            >
              <span>Annual</span>
              <span className="bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`apple-card p-8 flex flex-col justify-between relative bg-white dark:bg-[#242526] ${
                plan.highlighted
                  ? "border-[#0866FF] shadow-lg shadow-blue-500/10 ring-2 ring-[#0866FF]/20"
                  : "border-black/5 dark:border-white/10"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0866FF] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-white" /> {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#050505] dark:text-[#E4E6EB]">{plan.name}</h3>
                  <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#050505] dark:text-[#E4E6EB]">
                    ${annual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-[#65676B] dark:text-[#B0B3B8] text-xs">/ month</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-black/5 dark:border-white/10">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#0866FF]">
                    What&apos;s included
                  </span>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs text-[#050505] dark:text-[#E4E6EB]">
                      <div className="w-4 h-4 rounded-full bg-[#0866FF]/10 flex items-center justify-center text-[#0866FF] shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setCurrentView("overview")}
                  className={`w-full py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    plan.highlighted
                      ? "bg-[#0866FF] hover:bg-[#1877F2] text-white shadow-md shadow-blue-500/25"
                      : "bg-[#F0F2F5] dark:bg-[#3A3B3C] hover:bg-[#E4E6EB] text-[#050505] dark:text-[#E4E6EB]"
                  }`}
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
