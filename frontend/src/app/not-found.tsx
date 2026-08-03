"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0C0C0B] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-extrabold text-white mb-2">404</h1>
      <h2 className="text-2xl font-bold text-[#C8A14A] mb-4">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mb-8">
        The requested path does not exist in SocialPulse AI.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#C8A14A] text-black font-extrabold rounded-2xl text-sm hover:opacity-90 transition-opacity"
      >
        Return to Home
      </Link>
    </div>
  );
}
