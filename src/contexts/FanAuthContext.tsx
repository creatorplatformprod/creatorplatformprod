import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

type FanUser = {
  _id: string;
  email: string;
  displayName: string;
  bio?: string;
  avatar?: string;
};

type FanAuthContextValue = {
  fan: FanUser | null;
  loading: boolean;
  guestMode: boolean;
  setGuestMode: (value: boolean) => void;
  refreshFan: () => Promise<void>;
  loginFan: (email: string, password: string) => Promise<void>;
  registerFan: (data: { email: string; password: string; displayName?: string }) => Promise<void>;
  logoutFan: () => void;
};

const FanAuthContext = createContext<FanAuthContextValue | null>(null);

const GUEST_MODE_KEY = "fan_guest_mode";

export const FanAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [fan, setFan] = useState<FanUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestMode, setGuestModeState] = useState(localStorage.getItem(GUEST_MODE_KEY) === "true");

  const setGuestMode = useCallback((value: boolean) => {
    setGuestModeState(value);
    if (value) {
      localStorage.setItem(GUEST_MODE_KEY, "true");
    } else {
      localStorage.removeItem(GUEST_MODE_KEY);
    }
  }, []);

  const refreshFan = useCallback(async () => {
    const token = localStorage.getItem("fan_token");
    if (!token) {
      setFan(null);
      setLoading(false);
      return;
    }

    try {
      const result = await api.getCurrentFan();
      if (result?.success && result.fan) {
        setFan(result.fan);
        localStorage.setItem("fan_email", String(result.fan.email || "").toLowerCase());
      } else {
        localStorage.removeItem("fan_token");
        setFan(null);
      }
    } catch {
      localStorage.removeItem("fan_token");
      setFan(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFan();
  }, [refreshFan]);

  const loginFan = useCallback(async (email: string, password: string) => {
    const result = await api.fanLogin(email, password);
    if (!result?.success || !result.token || !result.fan) {
      throw new Error(result?.error || "Login failed");
    }
    localStorage.setItem("fan_token", result.token);
    localStorage.setItem("fan_email", String(result.fan.email || "").toLowerCase());
    setFan(result.fan);
    setGuestMode(false);
  }, [setGuestMode]);

  const registerFan = useCallback(async (data: { email: string; password: string; displayName?: string }) => {
    const result = await api.fanRegister(data);
    if (!result?.success || !result.token || !result.fan) {
      throw new Error(result?.error || "Registration failed");
    }
    localStorage.setItem("fan_token", result.token);
    localStorage.setItem("fan_email", String(result.fan.email || "").toLowerCase());
    setFan(result.fan);
    setGuestMode(false);
  }, [setGuestMode]);

  const logoutFan = useCallback(() => {
    localStorage.removeItem("fan_token");
    setFan(null);
    setGuestMode(false);
  }, [setGuestMode]);

  const value = useMemo(() => ({
    fan,
    loading,
    guestMode,
    setGuestMode,
    refreshFan,
    loginFan,
    registerFan,
    logoutFan
  }), [fan, loading, guestMode, setGuestMode, refreshFan, loginFan, registerFan, logoutFan]);

  return (
    <FanAuthContext.Provider value={value}>
      {children}
    </FanAuthContext.Provider>
  );
};

export const useFanAuth = () => {
  const context = useContext(FanAuthContext);
  if (!context) {
    throw new Error("useFanAuth must be used within FanAuthProvider");
  }
  return context;
};

