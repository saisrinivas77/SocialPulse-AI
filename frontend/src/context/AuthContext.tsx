"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setAuthTokens, clearAuthTokens, socialPulseApi, isJwtNearExpiry } from "@/lib/api";

interface UserProfile {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  role?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (access: string, refresh?: string, userData?: Partial<UserProfile>) => void;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hydrate auth session from localStorage & cookies on mount / refresh
  useEffect(() => {
    const hydrateAuth = async () => {
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      const storedAccess = localStorage.getItem("sp_access_token");
      const storedRefresh = localStorage.getItem("sp_refresh_token");
      const storedEmail = localStorage.getItem("sp_user_email");
      const storedName = localStorage.getItem("sp_user_name");

      if (storedAccess && storedAccess !== "null" && storedAccess !== "undefined") {
        setAccessTokenState(storedAccess);
        setRefreshTokenState(storedRefresh);

        if (storedEmail) {
          setUser({
            id: 1,
            email: storedEmail,
            display_name: storedName || storedEmail.split("@")[0],
          });
        }

        // Validate or refresh token
        if (isJwtNearExpiry(storedAccess) && storedRefresh) {
          try {
            const res = await socialPulseApi.refreshToken(storedRefresh);
            if (res?.access_token) {
              setAuthTokens(res.access_token, res.refresh_token);
              setAccessTokenState(res.access_token);
              if (res.refresh_token) setRefreshTokenState(res.refresh_token);
            }
          } catch {
            // Silently fallback
          }
        }

        // Attempt fetching profile metadata
        try {
          const profile = await socialPulseApi.getProfile();
          if (profile) {
            setUser({
              id: profile.id || 1,
              email: profile.email || storedEmail || "user@socialpulse.ai",
              display_name: profile.display_name || profile.first_name || storedName || "Alex Morgan",
              avatar_url: profile.profile_image || profile.avatar_url,
            });
          }
        } catch {
          // Keep hydrated state
        }
      }
      setIsLoading(false);
    };

    hydrateAuth();
  }, []);

  const login = (access: string, refresh?: string, userData?: Partial<UserProfile>) => {
    setAuthTokens(access, refresh);
    setAccessTokenState(access);
    if (refresh) setRefreshTokenState(refresh);

    if (userData?.email) {
      localStorage.setItem("sp_user_email", userData.email);
      if (userData.display_name) {
        localStorage.setItem("sp_user_name", userData.display_name);
      }
    }

    setUser({
      id: userData?.id || 1,
      email: userData?.email || localStorage.getItem("sp_user_email") || "user@socialpulse.ai",
      display_name: userData?.display_name || localStorage.getItem("sp_user_name") || "Alex Morgan",
      avatar_url: userData?.avatar_url,
    });
  };

  const logout = () => {
    clearAuthTokens();
    setAccessTokenState(null);
    setRefreshTokenState(null);
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    const refresh = refreshToken || (typeof window !== "undefined" ? localStorage.getItem("sp_refresh_token") : null);
    if (!refresh) return false;

    try {
      const res = await socialPulseApi.refreshToken(refresh);
      if (res?.access_token) {
        setAuthTokens(res.access_token, res.refresh_token);
        setAccessTokenState(res.access_token);
        if (res.refresh_token) setRefreshTokenState(res.refresh_token);
        return true;
      }
    } catch {
      logout();
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken && accessToken !== "null" && accessToken !== "undefined",
        isLoading,
        login,
        logout,
        refreshSession,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
