"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Zap, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast, Toaster } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Validation schemas ──────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

// ─── Aurora blobs (background) ───────────────────────────────────────────────
function AuroraBackground({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Static ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fafaf8] via-white to-[#f5f3ee]" />

      {/* Animated aurora blobs */}
      <motion.div
        className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, #C8A14A 0%, transparent 70%)",
          x: mouseX * 0.03,
          y: mouseY * 0.03,
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -left-24 w-[450px] h-[450px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
          x: mouseX * -0.02,
          y: mouseY * -0.02,
        }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-10"
        style={{ background: "radial-gradient(ellipse, #C8A14A 0%, transparent 70%)" }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #111 1px, transparent 1px),
            linear-gradient(to bottom, #111 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

// ─── Social OAuth button ─────────────────────────────────────────────────────
function OAuthButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-xl border border-[#ECECEC] bg-white text-[#333] text-[13px] font-medium shadow-sm hover:border-[#C8A14A] hover:shadow-md transition-all"
    >
      {icon}
      {label}
    </motion.button>
  );
}

// ─── Google icon SVG ─────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ─── GitHub icon ─────────────────────────────────────────────────────────────
const GitHubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

// ─── Microsoft icon ──────────────────────────────────────────────────────────
const MicrosoftIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#f25022" d="M1 1h10v10H1z"/>
    <path fill="#00a4ef" d="M13 1h10v10H13z"/>
    <path fill="#7fba00" d="M1 13h10v10H1z"/>
    <path fill="#ffb900" d="M13 13h10v10H13z"/>
  </svg>
);

// ─── LinkedIn icon ───────────────────────────────────────────────────────────
const LinkedInIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// ─── Apple icon ──────────────────────────────────────────────────────────────
const AppleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
  </svg>
);

// ─── Animated input ──────────────────────────────────────────────────────────
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
      <label htmlFor={id} className="block text-[12px] font-semibold text-[#444] uppercase tracking-wider">{label}</label>
      <div className="relative">
        <motion.input
          id={id}
          type={isPass ? (showPass ? "text" : "password") : type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          animate={{ borderColor: error ? "#EF4444" : focused ? "#C8A14A" : "#ECECEC" }}
          transition={{ duration: 0.2 }}
          className="w-full px-4 py-3 rounded-xl border bg-white text-[#111] text-[13px] placeholder:text-[#bbb] outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(200,161,74,0.12)]"
          style={{ borderColor: error ? "#EF4444" : focused ? "#C8A14A" : "#ECECEC" }}
          {...rest}
        />
        {isPass && (
          <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#444] transition-colors">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-1.5 text-[11px] text-red-500 font-medium"
          >
            <AlertCircle className="w-3 h-3" />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main auth page ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  // Mouse position for reactive background
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const fn = (e: MouseEvent) => setMouse({ x: e.clientX - window.innerWidth / 2, y: e.clientY - window.innerHeight / 2 });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema), mode: "onChange" });
  const registerForm = useForm<RegisterData>({ resolver: zodResolver(registerSchema), mode: "onChange" });

  const handleLogin = async (data: LoginData) => {
    setLoading(true);
    setApiError("");
    try {
      const formData = new URLSearchParams();
      formData.append("username", data.email);
      formData.append("password", data.password);
      const res = await axios.post(`${API_URL}/api/v1/auth/login`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      localStorage.setItem("sp_access_token", res.data.access_token);
      setSuccess(true);
      setTimeout(() => router.push("/onboarding"), 1200);
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { detail?: string } } };
      setApiError(axErr?.response?.data?.detail || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setLoading(true);
    setApiError("");
    try {
      const res = await axios.post(`${API_URL}/api/v1/auth/register`, data);
      localStorage.setItem("sp_access_token", res.data.access_token);
      setSuccess(true);
      setTimeout(() => router.push("/onboarding"), 1200);
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { detail?: string } } };
      setApiError(axErr?.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    toast.info(`${provider} sign-in coming soon`, {
      description: "Social login is being configured. Please use email and password for now.",
      duration: 4000,
    });
  };

  const OAUTH_BUTTONS = [
    { icon: <GoogleIcon />, label: "Continue with Google", onClick: () => handleOAuth("Google") },
    { icon: <GitHubIcon />, label: "Continue with GitHub", onClick: () => handleOAuth("GitHub") },
    { icon: <MicrosoftIcon />, label: "Continue with Microsoft", onClick: () => handleOAuth("Microsoft") },
    { icon: <LinkedInIcon />, label: "Continue with LinkedIn", onClick: () => handleOAuth("LinkedIn") },
    { icon: <AppleIcon />, label: "Continue with Apple", onClick: () => handleOAuth("Apple") },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative font-sans overflow-hidden">
      {/* Toaster for notifications */}
      <Toaster position="top-center" richColors />

      {/* Reactive aurora bg */}
      <AuroraBackground mouseX={mouse.x} mouseY={mouse.y} />

      {/* Back to home */}
      <motion.a
        href="/"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-[13px] text-[#666] hover:text-[#111] transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" /> Back to home
      </motion.a>

      {/* Auth card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Glass card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_32px_80px_rgba(17,17,17,0.12)] p-8 md:p-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C8A14A] to-[#9F7A2F] flex items-center justify-center shadow-md">
              <Zap className="w-4.5 h-4.5 text-white fill-white" />
            </div>
            <span className="font-bold text-[#111] text-sm tracking-tight">SocialPulse AI</span>
          </div>

          {/* Success state */}
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </motion.div>
                <div className="text-center">
                  <p className="font-bold text-[#111]">Authentication successful!</p>
                  <p className="text-[13px] text-[#666] mt-1">Setting up your workspace…</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Mode tabs */}
                <div className="flex mb-6 p-1 bg-[#F5F5F5] rounded-xl">
                  {(["login", "register"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setApiError(""); }}
                      className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all ${mode === m ? "bg-white text-[#111] shadow-sm" : "text-[#888] hover:text-[#444]"}`}
                    >
                      {m === "login" ? "Sign In" : "Create Account"}
                    </button>
                  ))}
                </div>

                {/* Heading */}
                <div className="mb-6">
                  <h1 className="text-[22px] font-black text-[#111] tracking-tight">
                    {mode === "login" ? "Welcome back" : "Create your account"}
                  </h1>
                  <p className="text-[13px] text-[#888] mt-1">
                    {mode === "login" ? "Sign in to your workspace" : "Join 4,200+ teams on SocialPulse AI"}
                  </p>
                </div>

                {/* OAuth buttons */}
                <div className="space-y-2.5 mb-5">
                  {OAUTH_BUTTONS.map((btn) => <OAuthButton key={btn.label} {...btn} />)}
                </div>

                {/* Divider */}
                <div className="relative flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-[#ECECEC]" />
                  <span className="text-[11px] text-[#bbb] font-medium uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-[#ECECEC]" />
                </div>

                {/* Login form */}
                <AnimatePresence mode="wait">
                  {mode === "login" ? (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={loginForm.handleSubmit(handleLogin)}
                      className="space-y-4"
                    >
                      <AnimatedInput
                        label="Email" id="email" placeholder="you@company.com"
                        error={loginForm.formState.errors.email?.message}
                        rest={{ ...loginForm.register("email") }}
                      />
                      <AnimatedInput
                        label="Password" id="password" type="password" placeholder="••••••••"
                        error={loginForm.formState.errors.password?.message}
                        rest={{ ...loginForm.register("password") }}
                      />

                      <div className="flex justify-end">
                        <a href="#" className="text-[12px] text-[#C8A14A] hover:text-[#9F7A2F] font-medium transition-colors">Forgot password?</a>
                      </div>

                      {apiError && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-600"
                        >
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {apiError}
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 bg-[#111] text-white py-3.5 rounded-xl font-bold text-[13px] shadow-[0_4px_20px_rgba(17,17,17,0.15)] hover:bg-[#222] transition-all disabled:opacity-60"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="register"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={registerForm.handleSubmit(handleRegister)}
                      className="space-y-4"
                    >
                      <AnimatedInput
                        label="Full Name" id="full_name" placeholder="Alex Morgan"
                        error={registerForm.formState.errors.full_name?.message}
                        rest={{ ...registerForm.register("full_name") }}
                      />
                      <AnimatedInput
                        label="Work Email" id="reg_email" placeholder="you@company.com"
                        error={registerForm.formState.errors.email?.message}
                        rest={{ ...registerForm.register("email") }}
                      />
                      <AnimatedInput
                        label="Password" id="reg_password" type="password" placeholder="Min. 8 characters"
                        error={registerForm.formState.errors.password?.message}
                        rest={{ ...registerForm.register("password") }}
                      />

                      {apiError && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-600"
                        >
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {apiError}
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#C8A14A] to-[#9F7A2F] text-white py-3.5 rounded-xl font-bold text-[13px] shadow-[0_4px_20px_rgba(200,161,74,0.3)] hover:opacity-90 transition-all disabled:opacity-60"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Free Account <ArrowRight className="w-4 h-4" /></>}
                      </motion.button>

                      <p className="text-center text-[11px] text-[#bbb]">
                        By creating an account you agree to our{" "}
                        <a href="#" className="text-[#C8A14A] hover:underline">Terms</a> and{" "}
                        <a href="#" className="text-[#C8A14A] hover:underline">Privacy Policy</a>.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom note */}
        <p className="text-center mt-5 text-[12px] text-[#aaa]">
          Enterprise SSO?{" "}
          <a href="mailto:enterprise@socialpulse.ai" className="text-[#C8A14A] hover:underline font-medium">Contact sales →</a>
        </p>
      </motion.div>
    </div>
  );
}
