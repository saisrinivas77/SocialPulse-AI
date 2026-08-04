"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { KeyRound, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { socialPulseApi } from "@/lib/api";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-6 relative font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_400px_at_50%_40%,rgba(200,161,74,0.08),transparent)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-[#ECECEC] rounded-3xl p-8 shadow-xl relative z-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C8A14A] to-[#9F7A2F] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#C8A14A]/20">
          <KeyRound className="w-8 h-8 text-white" />
        </div>

        {!success ? (
          <>
            <h2 className="text-2xl font-black text-[#111] tracking-tight text-center">Reset Your Password</h2>
            <p className="text-[14px] text-[#777] text-center mt-1.5 mb-6">
              Enter your new secure password below to regain access to your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#444] uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#ECECEC] bg-[#FAFAF8] text-[14px] focus:outline-none focus:border-[#C8A14A]"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#444] uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#ECECEC] bg-[#FAFAF8] text-[14px] focus:outline-none focus:border-[#C8A14A]"
                  placeholder="Repeat new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#111] text-white font-bold rounded-xl hover:bg-[#333] transition flex items-center justify-center gap-2 text-[14px]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Set New Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-black text-[#111] tracking-tight">Password Reset Complete!</h2>
            <p className="text-[14px] text-[#666]">Your password has been updated. You may now log in with your new credentials.</p>
            <button
              onClick={() => router.push("/login")}
              className="w-full mt-4 py-3 bg-[#111] text-white font-bold rounded-xl hover:bg-[#333] transition flex items-center justify-center gap-2 text-[14px]"
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
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C8A14A] animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
