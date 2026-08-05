"use client";

import React, { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { socialPulseApi } from "@/lib/api";

function ReferenceGridBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#FAFBFD] dark:bg-[#121316]" />
      <div
        className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-20"
        style={{ background: "radial-gradient(circle, rgba(245, 230, 200, 0.6) 0%, rgba(245, 230, 200, 0.15) 50%, transparent 75%)" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-15"
        style={{ background: "radial-gradient(circle, rgba(230, 220, 255, 0.6) 0%, rgba(230, 220, 255, 0.1) 50%, transparent 75%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.045] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />
    </div>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token provided in URL.");
      return;
    }

    socialPulseApi
      .verifyEmail(token)
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        setErrorMessage(err.response?.data?.detail || "Invalid or expired email verification link.");
      });
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative font-sans overflow-hidden">
      <ReferenceGridBackground />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white dark:bg-[#18181B] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-8 sm:p-10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.07)] text-center relative z-10"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0866FF] to-[#7C3AED] flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-500/20">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>

        {status === "verifying" && (
          <div className="space-y-4">
            <Loader2 className="w-9 h-9 text-[#0866FF] animate-spin mx-auto" />
            <h2 className="text-2xl font-black text-[#111111] dark:text-white tracking-tight">Verifying Your Email…</h2>
            <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A0A0A0]">Validating your security token and initializing your workspace.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-[#E7F8ED] border border-[#31A24C]/30 text-[#31A24C] flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-9 h-9" />
            </motion.div>

            <h2 className="text-2xl font-black text-[#111111] dark:text-white tracking-tight">Account Verified!</h2>
            <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A0A0A0] leading-relaxed">
              Your email address has been successfully verified. You can now access your enterprise AI workspace.
            </p>

            <button
              onClick={() => router.push("/onboarding")}
              className="w-full mt-4 py-3.5 bg-[#0866FF] hover:bg-[#1877F2] text-white font-extrabold rounded-full transition flex items-center justify-center gap-2 text-[14px] shadow-md"
            >
              Launch Workspace Setup <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FEF2F2] border border-[#FA383E]/30 text-[#FA383E] flex items-center justify-center mx-auto">
              <AlertCircle className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-black text-[#111111] dark:text-white tracking-tight">Verification Failed</h2>
            <p className="text-xs sm:text-sm text-[#FA383E] font-semibold">{errorMessage}</p>

            <button
              onClick={() => router.push("/login")}
              className="w-full mt-4 py-3.5 bg-[#F2F2F7] dark:bg-[#27272A] border border-black/5 text-[#111111] dark:text-white font-bold rounded-full hover:bg-white transition text-[14px]"
            >
              Return to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0866FF] animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
