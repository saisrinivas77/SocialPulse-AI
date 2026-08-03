"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Check, Sparkles, Zap, ArrowRight } from "lucide-react";

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
        "Weekly Email Performance Summaries",
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
        "Unlimited AI Studio (Captions, Hashtags, Sentiment)",
        "Best Posting Time Predictive Engine",
        "Multi-Platform Drag & Drop Scheduler",
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
        "Full Enterprise Admin & Audit Logs",
        "Custom Redis Worker Queue Priority",
        "Dedicated Account Executive",
        "Role-Based Access Control (RBAC)",
        "SLA & SSO Authentication",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 relative bg-black/40 border-y border-amber-500/10 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            Transparent Pricing
          </span>
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Invest in <span className="gold-gradient-text">predictable growth</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Choose the plan tailored for your social media operations.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-full bg-white/5 border border-amber-500/20">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                !annual ? "bg-amber-500 text-black shadow-lg" : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                annual ? "bg-amber-500 text-black shadow-lg" : "text-gray-400 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-black text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`glass-card p-8 flex flex-col justify-between relative ${
                plan.highlighted
                  ? "border-amber-400 bg-amber-500/10 shadow-[0_0_50px_rgba(255,215,0,0.25)]"
                  : "border-amber-500/20"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-black" /> {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 font-light">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">
                    ${annual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-gray-400 text-sm">/ month</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-amber-500/15">
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                    What&apos;s included
                  </span>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => setCurrentView("overview")}
                  className={`w-full btn-magnetic py-4 text-sm font-bold flex items-center justify-center gap-2 ${
                    plan.highlighted ? "btn-gold" : "btn-glass"
                  }`}
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
