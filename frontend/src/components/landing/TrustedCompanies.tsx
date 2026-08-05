"use client";

import React from "react";
import { motion } from "framer-motion";

const companies = [
  { name: "Google", logo: "Google" },
  { name: "Meta", logo: "∞ Meta" },
  { name: "Spotify", logo: "Spotify" },
  { name: "Netflix", logo: "NETFLIX" },
  { name: "Airbnb", logo: "airbnb" },
  { name: "TikTok", logo: "TikTok" },
  { name: "Stripe", logo: "stripe" },
  { name: "Apple", logo: " Apple" },
];

export const TrustedCompanies: React.FC = () => {
  return (
    <section id="trusted-companies" className="py-10 border-y border-black/5 dark:border-white/10 bg-[#F0F2F5] dark:bg-[#242526] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <p className="text-xs uppercase tracking-wider text-[#65676B] dark:text-[#B0B3B8] font-semibold">
          Trusted by high-growth marketing teams worldwide
        </p>

        {/* Marquee Container */}
        <div className="overflow-hidden relative w-full flex items-center">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F0F2F5] dark:from-[#242526] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F0F2F5] dark:from-[#242526] to-transparent z-10 pointer-events-none" />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-16 whitespace-nowrap min-w-full"
          >
            {[...companies, ...companies].map((item, idx) => (
              <div
                key={idx}
                className="text-xl font-bold tracking-tight text-[#8A8D91] hover:text-[#0866FF] transition-colors duration-300 cursor-pointer"
              >
                {item.logo}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
