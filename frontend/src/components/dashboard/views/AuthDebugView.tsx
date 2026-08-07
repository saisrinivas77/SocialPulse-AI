"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, RefreshCw, Key, User, CheckCircle2, XCircle, Clock, Server } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { socialPulseApi } from "@/lib/api";
import { toast } from "sonner";

export const AuthDebugView: React.FC = () => {
  const { user, accessToken, refreshToken, isAuthenticated, isLoading, refreshSession, logout } = useAuth();
  const [authHeader, setAuthHeader] = useState<string>("");
  const [expiryTime, setExpiryTime] = useState<string>("Unknown");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("sp_access_token");
      if (token && token !== "null" && token !== "undefined") {
        setAuthHeader(`Bearer ${token.slice(0, 15)}...${token.slice(-10)}`);
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.exp) {
              const expDate = new Date(payload.exp * 1000);
              setExpiryTime(expDate.toUTCString());
              const diff = Math.floor((payload.exp * 1000 - Date.now()) / 1000);
              setSecondsLeft(diff > 0 ? diff : 0);
            }
          }
        } catch {
          setExpiryTime("Malformed Token");
        }
      } else {
        setAuthHeader("No Bearer Header Set");
      }
    }
  }, [accessToken]);

  // Expiration timer tick
  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleTestApiCall = async () => {
    setIsTesting(true);
    try {
      const data = await socialPulseApi.getProfile();
      setTestResult(`✅ 200 OK — Authenticated User: ${data?.email || "alex_pulse"}`);
      toast.success("Protected API call succeeded with valid JWT!");
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err.message || "401 Unauthorized";
      setTestResult(`❌ Error — ${msg}`);
      toast.error(`API Test Failed: ${msg}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleManualRefresh = async () => {
    toast.info("Triggering silent JWT token refresh...");
    const success = await refreshSession();
    if (success) {
      toast.success("JWT Access Token refreshed successfully!");
    } else {
      toast.error("Failed to refresh token.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-gray-900 border border-indigo-500/30 p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Authentication Debug Center</h2>
            <p className="text-sm text-gray-400">
              Inspect active JWT tokens, expiration claims, authorization headers, and session telemetry.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh JWT
          </button>
          <button
            onClick={handleTestApiCall}
            disabled={isTesting}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition"
          >
            <Server className="w-4 h-4" />
            Test API Call
          </button>
        </div>
      </div>

      {/* Auth Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Badge */}
        <div className="p-5 bg-gray-900/80 border border-gray-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Auth Status</span>
            {isAuthenticated ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400" />
            )}
          </div>
          <div className="text-xl font-bold text-white">
            {isLoading ? "Loading..." : isAuthenticated ? "Authenticated" : "Unauthenticated"}
          </div>
          <p className="text-xs text-gray-400">
            {isAuthenticated ? "Valid session active in memory and localStorage" : "No valid JWT session active"}
          </p>
        </div>

        {/* Token Expiration Countdown */}
        <div className="p-5 bg-gray-900/80 border border-gray-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Access Token Expiry</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {secondsLeft !== null ? `${secondsLeft}s remaining` : "N/A"}
          </div>
          <p className="text-xs text-gray-400 truncate" title={expiryTime}>
            Expires: {expiryTime}
          </p>
        </div>

        {/* User Context */}
        <div className="p-5 bg-gray-900/80 border border-gray-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Active User</span>
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white truncate">{user?.display_name || user?.email || "Guest"}</div>
          <p className="text-xs text-gray-400 truncate">{user?.email || "No email stored"}</p>
        </div>
      </div>

      {/* Detailed Technical Metrics */}
      <div className="p-6 bg-gray-900/80 border border-gray-800 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-400" />
          Live Token & Header Telemetry
        </h3>

        <div className="space-y-3 text-xs font-mono">
          <div>
            <span className="text-gray-400">Authorization Header Sent:</span>
            <div className="mt-1 p-3 bg-gray-950 rounded-xl text-indigo-300 border border-gray-800 break-all">
              {authHeader}
            </div>
          </div>

          <div>
            <span className="text-gray-400">Access Token Preview (localStorage):</span>
            <div className="mt-1 p-3 bg-gray-950 rounded-xl text-emerald-400 border border-gray-800 break-all">
              {accessToken ? `${accessToken.slice(0, 40)}...${accessToken.slice(-20)}` : "None"}
            </div>
          </div>

          <div>
            <span className="text-gray-400">Refresh Token Preview (localStorage):</span>
            <div className="mt-1 p-3 bg-gray-950 rounded-xl text-purple-400 border border-gray-800 break-all">
              {refreshToken ? `${refreshToken.slice(0, 40)}...${refreshToken.slice(-20)}` : "None"}
            </div>
          </div>

          {testResult && (
            <div>
              <span className="text-gray-400">Last API Test Result:</span>
              <div className="mt-1 p-3 bg-gray-950 rounded-xl text-white border border-gray-800">
                {testResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
