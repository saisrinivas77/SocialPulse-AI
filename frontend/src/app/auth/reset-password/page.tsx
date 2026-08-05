"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { KeyRound, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { socialPulseApi } from "@/lib/api";
import { toast } from "sonner";

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

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await socialPulseApi.resetPassword({ token, new_password: newPassword });
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to reset password. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative font-sans overflow-hidden">
      <ReferenceGridBackground />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white dark:bg-[#18181B] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-8 sm:p-10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.07)] relative z-10"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0866FF] to-[#7C3AED] flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-500/20">
          <KeyRound className="w-7 h-7 text-white" />
        </div>

        {!success ? (
          <>
            <h2 className="text-2xl font-black text-[#111111] dark:text-white tracking-tight text-center">Reset Your Password</h2>
            <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A0A0A0] text-center mt-1.5 mb-6">
              Enter your new secure password below to regain access to your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider mb-1.5">
                  NEW PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-[14px] text-[#111111] dark:text-white outline-none focus:border-[#0866FF]"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider mb-1.5">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-[14px] text-[#111111] dark:text-white outline-none focus:border-[#0866FF]"
                  placeholder="Repeat new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#0866FF] hover:bg-[#1877F2] text-white font-extrabold rounded-full transition flex items-center justify-center gap-2 text-[14px] shadow-md"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Set New Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E7F8ED] border border-[#31A24C]/30 text-[#31A24C] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-black text-[#111111] dark:text-white tracking-tight">Password Reset Complete!</h2>
            <p className="text-xs text-[#777777] dark:text-[#A0A0A0]">Your password has been updated. You may now log in with your new credentials.</p>
            <button
              onClick={() => router.push("/login")}
              className="w-full mt-4 py-3.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-bold rounded-full hover:bg-[#222222] transition flex items-center justify-center gap-2 text-[14px]"
            >
              Sign In to SocialPulse AI <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0866FF] animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
