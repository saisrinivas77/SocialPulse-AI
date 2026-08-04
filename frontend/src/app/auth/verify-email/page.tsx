"use client";

import React, { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { socialPulseApi } from "@/lib/api";

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
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-6 relative font-sans overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_400px_at_50%_40%,rgba(200,161,74,0.08),transparent)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-[#ECECEC] rounded-3xl p-8 shadow-xl text-center relative z-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C8A14A] to-[#9F7A2F] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#C8A14A]/20">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>

        {status === "verifying" && (
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 text-[#C8A14A] animate-spin mx-auto" />
            <h2 className="text-2xl font-black text-[#111] tracking-tight">Verifying Your Email…</h2>
            <p className="text-[14px] text-[#777]">Validating your signed security token and initializing your account.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-9 h-9" />
            </motion.div>

            <h2 className="text-2xl font-black text-[#111] tracking-tight">Account Verified!</h2>
            <p className="text-[14px] text-[#666] leading-relaxed">
              Your email address has been successfully verified. You can now access your enterprise AI workspace.
            </p>

            <button
              onClick={() => router.push("/onboarding")}
              className="w-full mt-4 py-3 bg-[#111] text-white font-bold rounded-xl hover:bg-[#333] transition flex items-center justify-center gap-2 text-[14px]"
            >
              Launch Workspace Setup <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-black text-[#111] tracking-tight">Verification Failed</h2>
            <p className="text-[14px] text-red-600 font-medium">{errorMessage}</p>

            <button
              onClick={() => router.push("/login")}
              className="w-full mt-4 py-3 bg-[#FAFAF8] border border-[#ECECEC] text-[#111] font-bold rounded-xl hover:bg-white transition text-[14px]"
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
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C8A14A] animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
