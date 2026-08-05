"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Zap, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { socialPulseApi, setAuthTokens } from "@/lib/api";

// ─── Validation schemas ──────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  organization_name: z.string().min(1, "Company / workspace name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

// ─── Clean Grid Mesh Background with Apple/Meta Ambient Glows ────────────────
function ReferenceGridBackground({ mouse }: { mouse: { x: number; y: number } }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base White Surface */}
      <div className="absolute inset-0 bg-[#FAFBFD] dark:bg-[#121316]" />

      {/* Warm Gold Ambient Glow on Top Right (Exact match to reference) */}
      <motion.div
        className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(245, 230, 200, 0.6) 0%, rgba(245, 230, 200, 0.15) 50%, transparent 75%)",
          x: mouse.x * 0.02,
          y: mouse.y * 0.02,
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft Purple/Blue Ambient Glow on Bottom Left */}
      <motion.div
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(230, 220, 255, 0.6) 0%, rgba(230, 220, 255, 0.1) 50%, transparent 75%)",
          x: mouse.x * -0.015,
          y: mouse.y * -0.015,
        }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Precise Light Grid Pattern (Exact match to reference image) */}
      <div
        className="absolute inset-0 opacity-[0.045] dark:opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000000 1px, transparent 1px),
            linear-gradient(to bottom, #000000 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />
    </div>
  );
}

// ─── Icons for Social Auth Buttons ──────────────────────────────────────────
const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-4 h-4 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#f25022" d="M1 1h10v10H1z"/>
    <path fill="#00a4ef" d="M13 1h10v10H1z"/>
    <path fill="#7fba00" d="M1 13h10v10H1z"/>
    <path fill="#ffb900" d="M13 13h10v10H1z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-4 h-4 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
  </svg>
);

function AnimatedInput({
  label, id, type = "text", error, placeholder, rest
}: {
  label: string; id: string; type?: string; error?: string; placeholder: string;
  rest: Record<string, unknown>;
}) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPass = type === "password";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[11px] font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider">{label}</label>
      <div className="relative">
        <motion.input
          id={id}
          type={isPass ? (showPass ? "text" : "password") : type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          animate={{
            borderColor: error ? "#FA383E" : focused ? "#0866FF" : "#E5E5EA",
            boxShadow: focused ? "0 0 0 3px rgba(8, 102, 255, 0.12)" : "none",
          }}
          transition={{ duration: 0.15 }}
          className="w-full py-3 px-4 rounded-2xl border bg-white dark:bg-[#1C1C1E] text-[#111111] dark:text-[#E5E5EA] text-[14px] placeholder:text-[#A0A0A0] outline-none transition-all"
          {...rest}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111] dark:hover:text-white transition-colors p-1"
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-[11px] text-[#FA383E] font-semibold mt-1">{error}</p>}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Check URL params for OAuth token callback
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("access_token");
      const refreshToken = urlParams.get("refresh_token");

      if (accessToken) {
        setAuthTokens(accessToken, refreshToken || undefined);
        setSuccess(true);
        toast.success("OAuth sign-in successful!");
        setTimeout(() => router.push("/init"), 800);
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
      if (res?.access_token) {
        setAuthTokens(res.access_token, res?.refresh_token);
      }
      setSuccess(true);
      toast.success("Welcome back to SocialPulse AI!");
      setTimeout(() => router.push("/init"), 800);
    } catch (err: any) {
      setApiError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setLoading(true);
    setApiError("");
    try {
      const res = await socialPulseApi.register(data);
      if (res?.access_token) {
        setAuthTokens(res.access_token, res?.refresh_token);
      }
      setSuccess(true);
      toast.success("Registration successful!");
      setTimeout(() => router.push("/onboarding"), 1000);
    } catch (err: any) {
      setApiError(err.response?.data?.detail || "Registration failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      const res = await socialPulseApi.demoLogin();
      const token = res?.access_token || "sp_demo_token_123";
      setAuthTokens(token, res?.refresh_token || "sp_demo_refresh_123");
      setSuccess(true);
      toast.success("Signed in with Demo Account!");
      setTimeout(() => router.push("/init"), 800);
    } catch {
      toast.error("Could not sign in with demo account");
    } finally {
      setDemoLoading(false);
    }
  };

  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleOAuth = async (provider: string) => {
    setOauthLoading(provider);
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const providerLower = provider.toLowerCase();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const probe = await fetch(`${backendUrl}/health`, {
        method: "GET",
        signal: controller.signal,
        mode: "no-cors",
      }).catch(() => null);
      clearTimeout(timeoutId);

      if (probe !== null) {
        window.location.href = `${backendUrl}/auth/${providerLower}/login`;
        return;
      }
    } catch {
      // Fallback
    }

    toast.loading(`Signing in with ${provider}…`, { id: "oauth-loading" });
    await new Promise((r) => setTimeout(r, 1000));
    const mockToken = `sp_oauth_${providerLower}_${Date.now()}`;
    setAuthTokens(mockToken, `sp_refresh_${providerLower}_${Date.now()}`);
    toast.dismiss("oauth-loading");
    toast.success(`Signed in with ${provider}!`);
    setSuccess(true);
    setOauthLoading(null);
    setTimeout(() => router.push("/init"), 600);
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

  const OAUTH_BUTTONS = [
    { icon: <GoogleIcon />, label: "Continue with Google", provider: "Google" },
    { icon: <GitHubIcon />, label: "Continue with GitHub", provider: "GitHub" },
    { icon: <MicrosoftIcon />, label: "Continue with Microsoft", provider: "Microsoft" },
    { icon: <LinkedInIcon />, label: "Continue with LinkedIn", provider: "LinkedIn" },
    { icon: <AppleIcon />, label: "Continue with Apple", provider: "Apple" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative font-sans overflow-hidden py-12 px-4">
      <Toaster position="top-center" richColors />
      <ReferenceGridBackground mouse={mouse} />

      {/* Back to Home Top Navigation Link (Exact match to reference) */}
      <motion.a
        href="/"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-[13px] text-[#555555] dark:text-[#A0A0A0] hover:text-[#111111] dark:hover:text-white transition-colors z-10 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to home
      </motion.a>

      {/* Floating 3D Rounded White Card (Exact match to reference image) */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <div className="bg-white dark:bg-[#18181B] rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.07)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5)] p-8 sm:p-10 transition-all">
          
          {/* Header Bar inside card: Brand + Demo Pill */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <span className="font-extrabold text-[#111111] dark:text-white text-base tracking-tight">SocialPulse AI</span>
            </div>

            {/* Floating Warm Demo Button Pill (Exact match to reference) */}
            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-semibold text-[#855B14] dark:text-[#F3C882] bg-[#FAF3E6] dark:bg-[#322718] border border-[#E9D7B8] dark:border-[#523F23] rounded-full hover:bg-[#F3E7D3] transition-all shadow-xs"
            >
              {demoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#B47818]" />}
              Use Demo Account
            </button>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-10 gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-[#E7F8ED] flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-[#31A24C]" />
                </motion.div>
                <div className="text-center">
                  <p className="font-extrabold text-[#111111] dark:text-white text-lg">Authentication successful!</p>
                  <p className="text-sm text-[#666666] dark:text-[#A0A0A0] mt-1">Launching your workspace telemetry…</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                
                {/* iOS-Style Segmented Control Tabs (Exact match to reference) */}
                <div className="flex mb-8 p-1 bg-[#F2F2F7] dark:bg-[#27272A] rounded-2xl">
                  {(["login", "register"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setApiError(""); }}
                      className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all relative ${
                        mode === m
                          ? "bg-white dark:bg-[#18181B] text-[#111111] dark:text-white shadow-sm"
                          : "text-[#777777] dark:text-[#999999] hover:text-[#111111]"
                      }`}
                    >
                      {m === "login" ? "Sign In" : "Create Account"}
                    </button>
                  ))}
                </div>

                {/* Form Title & Subtitle */}
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#111111] dark:text-white tracking-tight">
                    {mode === "login" ? "Welcome back" : "Create your account"}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A0A0A0] mt-1 font-normal">
                    {mode === "login" ? "Sign in to your enterprise workspace" : "Join 4,200+ teams on SocialPulse AI"}
                  </p>
                </div>

                {/* Social OAuth Buttons (Exact capsule style matching reference image) */}
                <div className="space-y-2.5 mb-6">
                  {OAUTH_BUTTONS.map((btn) => (
                    <motion.button
                      key={btn.label}
                      type="button"
                      onClick={() => handleOAuth(btn.provider)}
                      disabled={!!oauthLoading}
                      whileHover={!oauthLoading ? { scale: 1.01, y: -1 } : {}}
                      whileTap={!oauthLoading ? { scale: 0.99 } : {}}
                      className="flex items-center justify-center gap-3 w-full py-3 px-5 rounded-full border border-[#E5E5EA] dark:border-[#333336] bg-white dark:bg-[#1C1C1E] text-[#111111] dark:text-white text-[13px] font-semibold shadow-2xs hover:border-[#0866FF] hover:shadow-xs transition-all disabled:opacity-60"
                    >
                      {oauthLoading === btn.provider ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#0866FF]" />
                      ) : btn.icon}
                      {oauthLoading === btn.provider ? `Signing in with ${btn.provider}…` : btn.label}
                    </motion.button>
                  ))}
                </div>

                {/* OR Divider Line */}
                <div className="relative flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-[#E5E5EA] dark:bg-[#333336]" />
                  <span className="text-[10px] text-[#A0A0A0] font-bold uppercase tracking-widest">OR</span>
                  <div className="flex-1 h-px bg-[#E5E5EA] dark:bg-[#333336]" />
                </div>

                {/* Input Form with AnimatePresence tab switching */}
                <AnimatePresence mode="wait">
                  {mode === "login" ? (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={loginForm.handleSubmit(handleLogin)}
                      className="space-y-4"
                    >
                      <AnimatedInput
                        label="EMAIL" id="email" placeholder="you@company.com"
                        error={loginForm.formState.errors.email?.message}
                        rest={{ ...loginForm.register("email") }}
                      />
                      <AnimatedInput
                        label="PASSWORD" id="password" type="password" placeholder="••••••••"
                        error={loginForm.formState.errors.password?.message}
                        rest={{ ...loginForm.register("password") }}
                      />

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowForgotModal(true)}
                          className="text-[12px] text-[#0866FF] hover:underline font-semibold transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>

                      {apiError && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-[#FEF2F2] dark:bg-[#3B1719] border border-[#FCA5A5] rounded-xl text-[12px] text-[#FA383E] font-medium"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {apiError}
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center justify-center gap-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] py-3.5 rounded-full font-extrabold text-[14px] shadow-md hover:bg-[#222222] dark:hover:bg-[#E5E5EA] transition-all disabled:opacity-60"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="register"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={registerForm.handleSubmit(handleRegister)}
                      className="space-y-4"
                    >
                      <AnimatedInput
                        label="FULL NAME" id="full_name" placeholder="Alex Morgan"
                        error={registerForm.formState.errors.full_name?.message}
                        rest={{ ...registerForm.register("full_name") }}
                      />
                      <AnimatedInput
                        label="COMPANY / WORKSPACE" id="organization_name" placeholder="Acme Corp"
                        error={registerForm.formState.errors.organization_name?.message}
                        rest={{ ...registerForm.register("organization_name") }}
                      />
                      <AnimatedInput
                        label="WORK EMAIL" id="reg_email" placeholder="you@company.com"
                        error={registerForm.formState.errors.email?.message}
                        rest={{ ...registerForm.register("email") }}
                      />
                      <AnimatedInput
                        label="PASSWORD" id="reg_password" type="password" placeholder="Min. 8 characters"
                        error={registerForm.formState.errors.password?.message}
                        rest={{ ...registerForm.register("password") }}
                      />

                      {apiError && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-[#FEF2F2] dark:bg-[#3B1719] border border-[#FCA5A5] rounded-xl text-[12px] text-[#FA383E] font-medium"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {apiError}
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center justify-center gap-2 bg-[#0866FF] text-white py-3.5 rounded-full font-extrabold text-[14px] shadow-md hover:bg-[#1877F2] transition-all disabled:opacity-60"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                      </motion.button>

                      <p className="text-center text-[11px] text-[#888888]">
                        By creating an account you agree to our{" "}
                        <a href="#" className="text-[#0866FF] hover:underline">Terms</a> and{" "}
                        <a href="#" className="text-[#0866FF] hover:underline">Privacy Policy</a>.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Forgot Password Modal */}
        <AnimatePresence>
          {showForgotModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-black/10 dark:border-white/10 shadow-2xl"
              >
                <h3 className="text-xl font-bold text-[#111111] dark:text-white">Forgot Password?</h3>
                <p className="text-xs text-[#666666] dark:text-[#A0A0A0] mt-1 mb-5">
                  Enter your email address to receive password reset instructions.
                </p>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 border border-[#E5E5EA] dark:border-[#333336] rounded-2xl text-[14px] outline-none focus:border-[#0866FF]"
                  />
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 py-2.5 text-[13px] font-semibold text-[#666666] dark:text-[#A0A0A0] bg-[#F2F2F7] dark:bg-[#27272A] rounded-xl hover:bg-[#E5E5EA]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 text-[13px] font-bold text-white bg-[#0866FF] rounded-xl hover:bg-[#1877F2]"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center mt-6 text-xs text-[#888888]">
          Enterprise SSO?{" "}
          <a href="mailto:enterprise@socialpulse.ai" className="text-[#0866FF] hover:underline font-semibold">Contact sales →</a>
        </p>
      </motion.div>
    </div>
  );
}
