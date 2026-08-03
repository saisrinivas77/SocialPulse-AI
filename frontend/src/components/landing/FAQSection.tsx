"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does SocialPulse AI connect to my social accounts?",
    answer:
      "SocialPulse AI uses enterprise-grade OAuth 2.0 protocols to authenticate directly with Instagram, LinkedIn, Facebook, X, TikTok, YouTube, Threads, and Pinterest. Your credentials remain 100% encrypted and safe.",
  },
  {
    question: "What makes the AI engines superior to generic tools?",
    answer:
      "Our AI engines are fine-tuned specifically on social media engagement telemetry, platform algorithm changes, and conversion signals, delivering hyper-relevant captions, hashtags, and timing recommendations.",
  },
  {
    question: "Can I generate PDF & Excel reports for client presentations?",
    answer:
      "Yes! You can instantly generate high-resolution PDF summaries, formatted CSV spreadsheets, or full executive Excel exports with custom date ranges and brand logos.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Absolutely. You can start a 14-day full access trial of SocialPulse AI Growth Pro with no credit card required.",
  },
  {
    question: "Does SocialPulse AI support team roles and permission controls?",
    answer:
      "Yes, our enterprise plan includes multi-brand workspace management, custom roles (Owner, Admin, Editor, Viewer), and full audit logging.",
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative bg-black/40 border-y border-amber-500/10 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            Got Questions?
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Frequently Asked <span className="gold-gradient-text">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-card overflow-hidden border-amber-500/20 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-amber-300 transition-colors"
                >
                  <span className="text-base sm:text-lg flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-sm text-gray-300 leading-relaxed font-light border-t border-amber-500/10 pt-4"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
