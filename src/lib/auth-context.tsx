"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AuthUser {
  username: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  register: async () => ({ success: false, message: "" }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetch("/api/auth/me", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.authenticated) {
            setUser({
              username: data.username,
              email: data.email,
              role: data.role,
            });
          } else {
            localStorage.removeItem("auth_token");
          }
        })
        .catch(() => localStorage.removeItem("auth_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("auth_token", data.token);
        setUser({
          username: data.username,
          role: data.role,
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("auth_token", data.token);
        setUser({
          username: data.username,
          role: "author",
        });
        return { success: true, message: "" };
      }
      return { success: false, message: data.message || "注册失败" };
    } catch (error) {
      return { success: false, message: "网络错误，请稍后重试" };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}