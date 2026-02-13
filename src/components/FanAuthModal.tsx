import { useMemo, useState } from "react";
import { X, Mail, User, Lock, Chrome } from "lucide-react";
import { useFanAuth } from "@/contexts/FanAuthContext";
import { api } from "@/lib/api";

type FanAuthModalProps = {
  open: boolean;
  onClose: () => void;
};

const FanAuthModal = ({ open, onClose }: FanAuthModalProps) => {
  const { loginFan, registerFan, setGuestMode } = useFanAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute inset-0 w-full h-full cursor-default"
        aria-label="Close auth modal background"
      />
      <div className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-2xl rounded-t-3xl border border-white/[0.10] bg-[#0d1321] p-5 sm:p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Welcome</p>
            <p className="text-xs text-muted-foreground">
              Sign in for faster checkout and saved unlocked content.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
            aria-label="Close auth modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-3 grid grid-cols-2 rounded-xl bg-white/[0.03] p-1">
          <button
            onClick={() => setMode("login")}
            className={`rounded-lg px-3 py-2 text-xs font-medium ${mode === "login" ? "bg-white/[0.12] text-foreground" : "text-muted-foreground"}`}
          >
            Log In
          </button>
          <button
            onClick={() => setMode("register")}
            className={`rounded-lg px-3 py-2 text-xs font-medium ${mode === "register" ? "bg-white/[0.12] text-foreground" : "text-muted-foreground"}`}
          >
            Register
          </button>
        </div>

        <button
          onClick={() => api.fanGoogleAuth(returnTo)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-white/[0.08]"
        >
          <Chrome className="h-4 w-4" />
          Continue With Google
        </button>

        {mode === "register" && (
          <label className="mb-2 block text-xs text-muted-foreground">
            Display Name
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2.5">
              <User className="h-4 w-4 text-muted-foreground" />
              <input
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
          </label>
        )}

        <label className="mb-2 block text-xs text-muted-foreground">
          Email
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2.5">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </label>

        <label className="mb-3 block text-xs text-muted-foreground">
          Password
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2.5">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
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
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
          </button>
          <button
            onClick={() => {
              setGuestMode(true);
              onClose();
            }}
            className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-white/[0.08]"
          >
            Continue As Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default FanAuthModal;

