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
    <footer className="bg-black border-t border-amber-500/15 pt-16 pb-12 relative z-10 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                <Sparkles className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                SocialPulse<span className="text-amber-400 font-light">AI</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed font-light">
              Enterprise-grade AI platform for social media analytics, caption generation, scheduling, and predictive growth intelligence.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              All Systems Operational (111 REST APIs active)
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setCurrentView("overview")} className="hover:text-white transition-colors">
                  Overview Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("analytics")} className="hover:text-white transition-colors">
                  Analytics Suite
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("ai-studio")} className="hover:text-white transition-colors">
                  AI Content Studio
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("scheduler")} className="hover:text-white transition-colors">
                  Post Scheduler
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("reports")} className="hover:text-white transition-colors">
                  Reports & Exports
                </button>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">REST API Docs</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Help Center</a></li>
              <li><button onClick={() => setCurrentView("admin")} className="hover:text-white transition-colors">Admin Console</button></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Stay Updated</h4>
            <p className="text-xs text-gray-400 font-light">
              Get weekly AI social marketing insights delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full btn-magnetic btn-gold py-2 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                <span>{subscribed ? "Subscribed!" : "Subscribe"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} SocialPulse AI Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
