import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

const RecoverAccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const creatorUsername = useMemo(() => (searchParams.get("creator") || "").trim(), [searchParams]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    const safeEmail = email.trim().toLowerCase();
    if (!safeEmail || !safeEmail.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await api.recoverAccessLinks({
        email: safeEmail,
        ...(creatorUsername ? { creatorUsername } : {})
      });
      if (result?.success) {
        setSuccess(result?.message || "If matching purchases exist, access links were emailed.");
      } else {
        setError(result?.error || "Could not send recovery email.");
      }
    } catch (err: any) {
      setError(err.message || "Could not send recovery email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen feed-bg flex items-center justify-center p-4">
      <div className="post-card rounded-2xl p-6 sm:p-8 max-w-md w-full">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="space-y-2 mb-5">
          <h1 className="text-xl font-bold text-foreground">Recover Access Links</h1>
          <p className="text-sm text-muted-foreground">
            Enter the email you used at checkout. We will resend your paid access links.
          </p>
          {creatorUsername && (
            <p className="text-xs text-muted-foreground">
              Creator filter: <span className="text-foreground font-medium">{creatorUsername}</span>
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="you@example.com"
                className="pl-9"
              />
            </div>
          </div>

          {error && (
            <div className="alert-error">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          {success && (
            <div className="alert-success">
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          <Button onClick={handleSubmit} disabled={loading} className="w-full dash-btn-primary">
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Sending..." : "Email My Access Links"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecoverAccess;
