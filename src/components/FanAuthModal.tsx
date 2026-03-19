import { useMemo, useState } from "react";
import { X, Mail, User, Lock, Chrome } from "lucide-react";
import { useFanAuth } from "@/contexts/FanAuthContext";
import { api } from "@/lib/api";
import { useFeedbackToasts } from "@/hooks/useFeedbackToasts";

type FanAuthModalProps = {
  open: boolean;
  onClose: () => void;
  darkTheme?: boolean;
};

const FanAuthModal = ({ open, onClose, darkTheme = false }: FanAuthModalProps) => {
  const { loginFan, registerFan, setGuestMode } = useFanAuth();
  const skyUserColor = "#6366f1";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useFeedbackToasts({ error });

  const returnTo = useMemo(
    () => `${window.location.pathname}${window.location.search}`,
    []
  );

  if (!open) return null;

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await loginFan(email, password);
      } else {
        await registerFan({ email, password, displayName });
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/35 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute inset-0 w-full h-full cursor-default"
        aria-label="Close auth modal background"
      />
      <div
        className={`absolute bottom-3 left-0 right-0 mx-auto w-full max-w-[20.5rem] sm:bottom-6 sm:max-w-md rounded-2xl p-4 sm:p-5 shadow-2xl ${
          darkTheme
            ? "border border-[#1e2b45] bg-[#0b1220] text-slate-100"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Welcome</p>
            <p className="text-xs text-muted-foreground">
              Sign in for faster checkout and saved unlocked content.
            </p>
          </div>
          <button
            onClick={onClose}
            className={`rounded-full p-1.5 text-muted-foreground hover:text-foreground ${
              darkTheme ? "hover:bg-[#152238]" : "hover:bg-gray-100"
            }`}
            aria-label="Close auth modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className={`mb-3 grid grid-cols-2 rounded-xl p-1 ${darkTheme ? "bg-[#0f1a2e] border border-[#22314f]" : "bg-gray-50"}`}>
          <button
            onClick={() => setMode("login")}
            className={`rounded-lg px-3 py-2 text-xs font-medium ${mode === "login" ? (darkTheme ? "bg-[#1f2f4a] text-slate-100" : "bg-gray-100 text-foreground") : "text-muted-foreground"}`}
          >
            Log In
          </button>
          <button
            onClick={() => setMode("register")}
            className={`rounded-lg px-3 py-2 text-xs font-medium ${mode === "register" ? (darkTheme ? "bg-[#1f2f4a] text-slate-100" : "bg-gray-100 text-foreground") : "text-muted-foreground"}`}
          >
            Register
          </button>
        </div>

        <button
          onClick={() => api.fanGoogleAuth(returnTo)}
          className={`mb-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground ${
            darkTheme
              ? "border border-[#2a3a58] bg-[#0f1a2e] hover:bg-[#152238]"
              : "border border-gray-200 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <Chrome className="h-4 w-4" />
          Continue With Google
        </button>

        {mode === "register" && (
          <label className="mb-2 block text-xs text-muted-foreground">
            Display Name
            <div className={`mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 ${darkTheme ? "border border-[#2a3a58] bg-[#0f1a2e]" : "border border-gray-200 bg-gray-50"}`}>
              <User className="h-4 w-4" style={{ color: skyUserColor }} />
              <input
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
          </label>
        )}

        <label className="mb-2 block text-xs text-muted-foreground">
          Email
          <div className={`mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 ${darkTheme ? "border border-[#2a3a58] bg-[#0f1a2e]" : "border border-gray-200 bg-gray-50"}`}>
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </label>

        <label className="mb-3 block text-xs text-muted-foreground">
          Password
          <div className={`mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 ${darkTheme ? "border border-[#2a3a58] bg-[#0f1a2e]" : "border border-gray-200 bg-gray-50"}`}>
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="At least 8 chars"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </label>

        {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

        <div className="grid gap-2 sm:grid-cols-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60 ${
              darkTheme
                ? "bg-violet-500/85 text-white hover:bg-violet-500"
                : "bg-violet-600 text-white hover:bg-violet-700"
            }`}
          >
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
          </button>
          <button
            onClick={() => {
              setGuestMode(true);
              onClose();
            }}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground ${
              darkTheme
                ? "border border-[#2a3a58] bg-[#0f1a2e] hover:bg-[#152238]"
                : "border border-gray-200 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            Continue As Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default FanAuthModal;
