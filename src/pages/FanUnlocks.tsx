import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Unlock } from "lucide-react";
import { api } from "@/lib/api";

const FanUnlocks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unlocks, setUnlocks] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!localStorage.getItem("fan_token")) {
        window.location.href = "/";
        return;
      }
      setLoading(true);
      try {
        const result = await api.getFanUnlocks();
        if (result?.success) {
          setUnlocks(result.unlocks || []);
        } else {
          setError(result?.error || "Failed to load unlocks");
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load unlocks");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen feed-bg px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => window.history.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="post-card rounded-xl p-5">
          <div className="flex items-center gap-2 text-foreground font-semibold mb-3">
            <Unlock className="h-4 w-4" />
            Your Unlocked Content
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : unlocks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No unlocked content yet.</p>
          ) : (
            <div className="space-y-2">
              {unlocks.map((item, index) => (
                <a
                  key={`${item.accessToken}-${index}`}
                  href={item.url}
                  className="block rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 hover:bg-white/[0.05]"
                >
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.creatorUsername || "creator"}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FanUnlocks;

