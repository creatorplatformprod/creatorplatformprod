import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import { useFeedbackToasts } from "@/hooks/useFeedbackToasts";

type UnlockItem = {
  accessToken?: string;
  url?: string;
  title?: string;
  creatorUsername?: string;
  unlockedAt?: string | number;
};

const FanUnlocks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unlocks, setUnlocks] = useState<UnlockItem[]>([]);
  useFeedbackToasts({ error });

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
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load unlocks";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="lp-canvas vault-ui">
      <div className="lp-shell" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '680px' }}>
        <button
          onClick={() => window.history.back()}
          className="lp-btn lp-btn-ghost lp-btn-sm"
          style={{ marginBottom: '2rem' }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <header style={{ marginBottom: '2rem' }}>
          <p className="lp-section-label lp-mono">— Your library</p>
          <h1 className="lp-h1" style={{ marginTop: '0.6rem' }}>Your unlocks</h1>
          <p className="lp-body" style={{ marginTop: '0.75rem' }}>
            Paid with a card. Each row opens that creator&apos;s content.
          </p>
        </header>

        <div
          style={{
            background: '#fff',
            border: '1px solid var(--lp-line)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div
              style={{
                padding: '2.5rem 1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem',
                color: 'var(--lp-fg-muted)',
                fontSize: '0.875rem',
              }}
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading
            </div>
          ) : error ? (
            <p style={{ padding: '1.5rem', fontSize: '0.875rem', color: '#991b1b' }}>{error}</p>
          ) : unlocks.length === 0 ? (
            <div style={{ padding: '2.5rem 1.5rem' }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--lp-fg)', fontWeight: 500 }}>
                Nothing here yet.
              </p>
              <p style={{ marginTop: '0.3rem', fontSize: '0.8125rem', color: 'var(--lp-fg-muted)' }}>
                When you unlock content from a creator it shows up here.
              </p>
            </div>
          ) : (
            unlocks.map((item, index) => (
              <a
                key={`${item.accessToken}-${index}`}
                href={item.url}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderTop: index === 0 ? 'none' : '1px solid var(--lp-line-soft)',
                  textDecoration: 'none',
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--lp-tint)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div>
                  <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--lp-fg)' }}>
                    {item.title || 'Unlocked content'}
                  </p>
                  <p
                    className="lp-mono"
                    style={{
                      marginTop: '0.15rem',
                      fontSize: '0.75rem',
                      color: 'var(--lp-fg-faint)',
                    }}
                  >
                    @{item.creatorUsername || 'creator'}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--lp-fg-muted)', flexShrink: 0 }} />
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FanUnlocks;
