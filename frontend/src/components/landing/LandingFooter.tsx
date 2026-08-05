"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";

export const LandingFooter: React.FC = () => {
  const { setCurrentView } = useAppStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success("Subscribed to SocialPulse AI updates!");
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="bg-[#18191A] text-[#B0B3B8] border-t border-white/10 pt-16 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0866FF] to-[#7C3AED] flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                SocialPulse<span className="text-[#0866FF] font-light ml-0.5">AI</span>
              </span>
            </div>
            <p className="text-xs text-[#B0B3B8] max-w-sm leading-relaxed">
              Enterprise-grade AI platform for social media analytics, caption generation, scheduling, and predictive growth intelligence.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#31A24C]/10 border border-[#31A24C]/30 text-[#31A24C] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#31A24C] animate-pulse" />
              All Systems Operational
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E4E6EB]">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView("overview")} className="hover:text-[#0866FF] transition-colors">
                  Overview Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("analytics")} className="hover:text-[#0866FF] transition-colors">
                  Analytics Suite
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("ai-studio")} className="hover:text-[#0866FF] transition-colors">
                  AI Content Studio
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("scheduler")} className="hover:text-[#0866FF] transition-colors">
                  Post Scheduler
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("reports")} className="hover:text-[#0866FF] transition-colors">
                  Reports & Exports
                </button>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E4E6EB]">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-[#0866FF] transition-colors">Documentation</a></li>
              <li><a href="#how-it-works" className="hover:text-[#0866FF] transition-colors">REST API Docs</a></li>
              <li><a href="#pricing" className="hover:text-[#0866FF] transition-colors">Pricing Plans</a></li>
              <li><a href="#faq" className="hover:text-[#0866FF] transition-colors">Help Center</a></li>
              <li><button onClick={() => setCurrentView("admin")} className="hover:text-[#0866FF] transition-colors">Admin Console</button></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E4E6EB]">Stay Updated</h4>
            <p className="text-xs text-[#B0B3B8]">
              Get weekly AI social marketing insights delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#242526] border border-white/10 text-white text-xs focus:border-[#0866FF] focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#0866FF] hover:bg-[#1877F2] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 transition-all"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                <span>{subscribed ? "Subscribed!" : "Subscribe"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A8D91] gap-4">
          <p>© {new Date().getFullYear()} SocialPulse AI Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#0866FF] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#0866FF] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#0866FF] transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
