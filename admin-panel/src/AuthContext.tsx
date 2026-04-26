import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import * as apiClient from "./api";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ user: AdminUser; token: string }>;
  setAuth: (token: string, user: AdminUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    const u = localStorage.getItem("admin_user");
    if (t && u) {
      try {
        setToken(t);
        setUser(JSON.parse(u));
      } catch {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiClient.login(email, password);
    localStorage.setItem("admin_token", data.token);
    localStorage.setItem("admin_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const setAuth = (t: string, u: AdminUser) => {
    localStorage.setItem("admin_token", t);
    localStorage.setItem("admin_user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, setAuth, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
