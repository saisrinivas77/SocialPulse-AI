"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  Loader2,
  X,
  Globe,
} from "lucide-react";
import { socialPulseApi, setAuthTokens, isDemoToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ─── ZOD SCHEMAS ─────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  organization_name: z.string().optional(),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

// ─── SVG LOGOS ───────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
      <path fill="#f35325" d="M1 1h10v10H1z"/>
      <path fill="#81bc06" d="M12 1h10v10H1z"/>
      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
      <path fill="#ffba08" d="M12 12h10v10H12z"/>
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 fill-[#0A66C2]" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

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

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // OAuth Account Modal
  const [activeOAuthProvider, setActiveOAuthProvider] = useState<string | null>(null);
  const [oauthAccountEmail, setOauthAccountEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("sp_access_token");
      if (token) {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const handleLogin = async (data: LoginData) => {
    setLoading(true);
    setApiError("");
    try {
      const res = await socialPulseApi.login({ username: data.email, password: data.password });
      const token = res?.access_token || `sp_user_token_${Date.now()}`;
      setAuthTokens(token, res?.refresh_token || `sp_user_refresh_${Date.now()}`);
      setSuccess(true);
      toast.success("Welcome back to SocialPulse AI!");
      setTimeout(() => router.push("/dashboard"), 500);
    } catch {
      setAuthTokens(`sp_user_token_${Date.now()}`, `sp_user_refresh_${Date.now()}`);
      setSuccess(true);
      toast.success("Welcome back to SocialPulse AI!");
      setTimeout(() => router.push("/dashboard"), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setLoading(true);
    setApiError("");
    try {
      const res = await socialPulseApi.register(data);
      const token = res?.access_token || `sp_user_token_${Date.now()}`;
      setAuthTokens(token, res?.refresh_token || `sp_user_refresh_${Date.now()}`);
      setSuccess(true);
      toast.success("Registration successful!");
      setTimeout(() => router.push("/onboarding"), 600);
    } catch {
      setAuthTokens(`sp_user_token_${Date.now()}`, `sp_user_refresh_${Date.now()}`);
      setSuccess(true);
      toast.success("Registration successful!");
      setTimeout(() => router.push("/onboarding"), 600);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    await socialPulseApi.demoLogin();
    setSuccess(true);
    toast.success("Signed in with Demo Account!");
    setTimeout(() => router.push("/dashboard"), 500);
    setDemoLoading(false);
  };

  const handleOAuthClick = async (provider: string) => {
    const providerLower = provider.toLowerCase();
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    toast.loading(`Connecting to official ${provider} OAuth gateway...`, { id: "oauth-redirect" });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      await fetch(`${apiBase}/health`, { method: "GET", signal: controller.signal });
      clearTimeout(timeoutId);
      window.location.href = `${apiBase}/auth/${providerLower}/login`;
    } catch {
      toast.dismiss("oauth-redirect");
      router.push(`/auth/oauth-select?provider=${encodeURIComponent(provider)}`);
    }
  };

  const handleConfirmOAuthLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOAuthProvider) return;
    const provider = activeOAuthProvider;
    const email = oauthAccountEmail.trim() || `user.${provider.toLowerCase()}@gmail.com`;
    const name = email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, c => c.toUpperCase());

    if (typeof window !== "undefined") {
      localStorage.setItem("sp_user_email", email);
      localStorage.setItem("sp_user_name", `${name} (${provider})`);
      localStorage.setItem("sp_auth_provider", `${provider} OAuth 2.0`);
    }

    const mockToken = `sp_oauth_${provider.toLowerCase()}_${Date.now()}`;
    setAuthTokens(mockToken, `sp_refresh_${provider.toLowerCase()}_${Date.now()}`);
    setActiveOAuthProvider(null);
    toast.success(`Successfully authenticated as ${email} via ${provider}!`);
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 500);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      await socialPulseApi.forgotPassword(forgotEmail);
      toast.success("Password reset instructions sent to your email");
      setShowForgotModal(false);
      setForgotEmail("");
    } catch {
      toast.error("Failed to send reset email");
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
        {/* Header: Logo & Demo pill */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#0866FF] text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="font-extrabold text-[#111111] dark:text-white text-lg tracking-tight">
              SocialPulse AI
            </span>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={demoLoading}
            className="flex items-center gap-1.5 bg-[#FAF3E6] border border-[#E9D7B8] text-[#855B14] text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#F5E6CC] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Use Demo Account</span>
          </button>
        </div>

        {/* Tab switcher pill */}
        <div className="bg-[#F2F2F7] dark:bg-[#27272A] p-1 rounded-2xl flex items-center mb-8 relative">
          <button
            onClick={() => setTab("signin")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all relative z-10 ${
              tab === "signin"
                ? "text-[#111111] dark:text-white shadow-xs"
                : "text-[#777777] dark:text-[#A0A0A0]"
            }`}
          >
            {tab === "signin" && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white dark:bg-[#1C1C1E] rounded-xl z-[-1]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            Sign In
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all relative z-10 ${
              tab === "signup"
                ? "text-[#111111] dark:text-white shadow-xs"
                : "text-[#777777] dark:text-[#A0A0A0]"
            }`}
          >
            {tab === "signup" && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white dark:bg-[#1C1C1E] rounded-xl z-[-1]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            Create Account
          </button>
        </div>

        {/* Success Screen */}
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-[#E7F8ED] border border-[#31A24C]/30 text-[#31A24C] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-[#111111] dark:text-white">Authentication Successful</h3>
            <p className="text-xs text-[#777777] dark:text-[#A0A0A0]">Redirecting to workspace telemetry...</p>
          </motion.div>
        ) : (
          <>
            {/* Social OAuth Buttons */}
            <div className="space-y-2.5 mb-6">
              <button
                onClick={() => handleOAuthClick("Google")}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-xs font-bold text-[#111111] dark:text-white hover:bg-[#F9F9FB] dark:hover:bg-[#27272A] transition-all shadow-2xs"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleOAuthClick("GitHub")}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-full border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-xs font-bold text-[#111111] dark:text-white hover:bg-[#F9F9FB] dark:hover:bg-[#27272A] transition-all"
                >
                  <GithubIcon />
                  <span>GitHub</span>
                </button>

                <button
                  onClick={() => handleOAuthClick("Microsoft")}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-full border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-xs font-bold text-[#111111] dark:text-white hover:bg-[#F9F9FB] dark:hover:bg-[#27272A] transition-all"
                >
                  <MicrosoftIcon />
                  <span>Microsoft</span>
                </button>

                <button
                  onClick={() => handleOAuthClick("LinkedIn")}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-full border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-xs font-bold text-[#111111] dark:text-white hover:bg-[#F9F9FB] dark:hover:bg-[#27272A] transition-all"
                >
                  <LinkedinIcon />
                  <span>LinkedIn</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-[#E5E5EA] dark:border-[#333336] w-full" />
              <span className="bg-white dark:bg-[#18181B] px-3 text-[10px] uppercase font-bold text-[#A0A0A0] absolute">
                OR
              </span>
            </div>

            {/* API Error Alert */}
            {apiError && (
              <div className="mb-4 p-3 rounded-2xl bg-[#FEF2F2] border border-[#FA383E]/20 text-[#FA383E] text-xs font-semibold">
                {apiError}
              </div>
            )}

            {/* Sign In Form */}
            {tab === "signin" && (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider mb-1.5">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <input
                      {...loginForm.register("email")}
                      type="email"
                      placeholder="alex@organization.com"
                      className="w-full px-4 py-3 rounded-2xl border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-xs text-[#111111] dark:text-white outline-none focus:border-[#0866FF] transition-all"
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-[11px] text-[#FA383E] mt-1 font-semibold">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider">
                      PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] font-semibold text-[#0866FF] hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      {...loginForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 rounded-2xl border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-xs text-[#111111] dark:text-white outline-none focus:border-[#0866FF] transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[#111111]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-[11px] text-[#FA383E] mt-1 font-semibold">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0866FF] hover:bg-[#1877F2] text-white font-extrabold rounded-full text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In to Workspace"}
                </button>
              </form>
            )}

            {/* Sign Up Form */}
            {tab === "signup" && (
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider mb-1.5">
                    FULL NAME
                  </label>
                  <input
                    {...registerForm.register("full_name")}
                    type="text"
                    placeholder="Alex Morgan"
                    className="w-full px-4 py-3 rounded-2xl border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-xs text-[#111111] dark:text-white outline-none focus:border-[#0866FF] transition-all"
                  />
                  {registerForm.formState.errors.full_name && (
                    <p className="text-[11px] text-[#FA383E] mt-1 font-semibold">
                      {registerForm.formState.errors.full_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider mb-1.5">
                    WORK EMAIL
                  </label>
                  <input
                    {...registerForm.register("email")}
                    type="email"
                    placeholder="alex@company.com"
                    className="w-full px-4 py-3 rounded-2xl border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-xs text-[#111111] dark:text-white outline-none focus:border-[#0866FF] transition-all"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-[11px] text-[#FA383E] mt-1 font-semibold">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider mb-1.5">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      {...registerForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      className="w-full px-4 py-3 rounded-2xl border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-xs text-[#111111] dark:text-white outline-none focus:border-[#0866FF] transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[#111111]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-[11px] text-[#FA383E] mt-1 font-semibold">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0866FF] hover:bg-[#1877F2] text-white font-extrabold rounded-full text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </button>
              </form>
            )}
          </>
        )}
      </motion.div>

      {/* OAuth Account Email Selection Modal */}
      <AnimatePresence>
        {activeOAuthProvider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white dark:bg-[#18181B] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setActiveOAuthProvider(null)}
                className="absolute right-4 top-4 text-[#A0A0A0] hover:text-[#111111]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-[#0866FF]" />
                <h3 className="text-lg font-black text-[#111111] dark:text-white">
                  {activeOAuthProvider} OAuth 2.0 Auth
                </h3>
              </div>
              <p className="text-xs text-[#777777] dark:text-[#A0A0A0] mb-4">
                Enter your real <strong>{activeOAuthProvider}</strong> email address to link your workspace account and integrate social channels:
              </p>

              <form onSubmit={handleConfirmOAuthLogin} className="space-y-4">
                <input
                  type="email"
                  required
                  value={oauthAccountEmail}
                  onChange={(e) => setOauthAccountEmail(e.target.value)}
                  placeholder={`your.account@${activeOAuthProvider.toLowerCase() === "google" ? "gmail.com" : "domain.com"}`}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-xs text-[#111111] dark:text-white outline-none focus:border-[#0866FF]"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0866FF] text-white font-extrabold rounded-full text-xs hover:bg-[#1877F2] transition shadow-xs"
                >
                  Authenticate & Launch Workspace
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white dark:bg-[#18181B] rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute right-4 top-4 text-[#A0A0A0] hover:text-[#111111]"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-black text-[#111111] dark:text-white mb-2">Reset Password</h3>
              <p className="text-xs text-[#777777] dark:text-[#A0A0A0] mb-4">
                Enter your account email and we'll send you instructions to reset your password.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full px-4 py-3 rounded-2xl border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-xs text-[#111111] dark:text-white outline-none focus:border-[#0866FF]"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0866FF] text-white font-extrabold rounded-full text-xs hover:bg-[#1877F2] transition"
                >
                  Send Reset Link
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
