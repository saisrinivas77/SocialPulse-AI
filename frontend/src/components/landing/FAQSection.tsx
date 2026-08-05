"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does SocialPulse AI connect to my social accounts?",
    answer:
      "SocialPulse AI uses enterprise OAuth 2.0 protocols to authenticate directly with Instagram, LinkedIn, Facebook, X, TikTok, YouTube, Threads, and Pinterest. Your credentials remain encrypted.",
  },
  {
    question: "What makes the AI engines superior to generic tools?",
    answer:
      "Our AI engines are fine-tuned specifically on social media engagement telemetry, platform algorithm changes, and conversion signals, delivering hyper-relevant captions, hashtags, and timing.",
  },
  {
    question: "Can I generate PDF & Excel reports for client presentations?",
    answer:
      "Yes! You can instantly generate high-resolution PDF summaries, formatted CSV spreadsheets, or full executive Excel exports with custom date ranges.",
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
    <section id="faq" className="py-20 relative bg-[#F0F2F5] dark:bg-[#242526] border-y border-black/5 dark:border-white/10 z-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-wider text-[#0866FF] font-semibold bg-[#0866FF]/10 px-3.5 py-1 rounded-full border border-[#0866FF]/20">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#050505] dark:text-[#E4E6EB]">
            Frequently Asked <span className="meta-gradient-text">Questions</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="apple-card overflow-hidden bg-white dark:bg-[#18191A] transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-[#050505] dark:text-[#E4E6EB] hover:text-[#0866FF] transition-colors"
                >
                  <span className="text-base flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#0866FF] shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#0866FF] shrink-0 transition-transform duration-200 ${
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
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-5 text-xs sm:text-sm text-[#65676B] dark:text-[#B0B3B8] leading-relaxed border-t border-black/5 dark:border-white/10 pt-3"
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
