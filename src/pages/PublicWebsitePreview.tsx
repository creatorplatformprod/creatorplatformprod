import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Monitor, Smartphone, Copy, Check, Link2 } from "lucide-react";
import AccountMenu from "@/components/AccountMenu";
import { api } from "@/lib/api";

const PublicWebsitePreview = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [published, setPublished] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  
  const previewUrl = useMemo(() => {
    if (!username) return "#";
    return `/${username}?mode=preview`;
  }, [username]);

  const refreshPublishState = () => {
    if (!username) return;
    const isPublished =
      localStorage.getItem(`publicWebsitePublished:${username}`) === "true";
    const isDirty =
      localStorage.getItem(`publicWebsiteDirty:${username}`) === "true";
    setPublished(isPublished);
    setHasChanges(isDirty);
  };

  useEffect(() => {
    refreshPublishState();
  }, [username]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCurrentUser(null);
        return;
      }
      try {
        const result = await api.getCurrentUser();
        if (result?.success && result.user) {
          setCurrentUser(result.user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        setCurrentUser(null);
      }
    };

    loadCurrentUser();
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (!username) return;
      if (
        event.key === `publicWebsitePublished:${username}` ||
        event.key === `publicWebsiteDirty:${username}`
      ) {
        refreshPublishState();
      }
    };

    const intervalId = window.setInterval(refreshPublishState, 2000);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("storage", handleStorage);
    };
  }, [username]);

  const handlePublish = () => {
    if (!username) return;
    localStorage.setItem(`publicWebsitePublished:${username}`, "true");
    localStorage.setItem(`publicWebsiteDirty:${username}`, "false");
    setPublished(true);
    setHasChanges(false);
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen feed-bg">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 nav-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left */}
            <div className="flex items-center gap-3">
              <div className="brand-wordmark"><span className="brand-accent">Six</span><span className="text-white">Seven</span><span className="brand-accent">Creator</span></div>
              <div className="w-px h-6 bg-white/[0.10]" />
              <span className="text-sm font-semibold text-foreground tracking-tight">Preview</span>
              <div className="dot-live" title="Live" />
            </div>
            
            {/* Right */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="text-muted-foreground hover:text-foreground text-xs h-8"
              >
                Back to Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`/${username}`, '_blank')}
                className="text-muted-foreground hover:text-foreground text-xs h-8 gap-1.5"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="hidden sm:inline">Open</span>
              </Button>
              {hasChanges ? (
                <Button onClick={handlePublish} className="btn-67 shadow-sm h-8 text-xs px-4">
                  Save Changes
                </Button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 border border-border/60 rounded-lg">
                  {published && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                  {published ? "Published" : "No changes"}
                </span>
              )}
              <AccountMenu currentUser={currentUser} />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Status Banners */}
        {hasChanges && (
          <div className="mb-4 alert-warning">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              You have unsaved changes. Click "Save Changes" to publish them.
            </p>
          </div>
        )}
        {!hasChanges && published && (
          <div className="mb-4 alert-success">
            <p className="text-sm text-green-600 dark:text-green-400">
              All changes are published. Your public website is up to date.
            </p>
          </div>
        )}

        {/* Controls Bar: Device Switcher + URL + Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          {/* Device Switcher */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setActiveDevice('desktop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                activeDevice === 'desktop'
                  ? 'bg-white/[0.10] text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setActiveDevice('mobile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                activeDevice === 'mobile'
                  ? 'bg-white/[0.10] text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile
            </button>
          </div>

          {/* URL Bar + Copy */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] rounded-lg border border-white/[0.06]">
              <Link2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span className="text-[11px] text-muted-foreground font-mono">sixsevencreator.com/{username}</span>
            </div>
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] rounded-lg border border-white/[0.06] hover:bg-white/[0.06] transition-colors text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Device Preview Frame */}
        <div className="flex justify-center">
          {/* Desktop Frame */}
          {activeDevice === 'desktop' && (
            <div className="w-full max-w-[1060px]">
              <div className="relative">
                <div className="bg-[#0c1119] rounded-[20px] p-3 border border-white/10 frame-inner-shadow">
                  <div className="bg-black rounded-[14px] overflow-hidden border border-white/5">
                    {/* Browser Chrome */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-[#12161f] border-b border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="flex items-center gap-2 px-4 py-1 bg-white/[0.05] rounded-md border border-white/[0.08] max-w-sm w-full">
                          <svg className="w-3 h-3 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          <span className="text-[10px] text-muted-foreground truncate">sixsevencreator.com/{username}</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative mx-auto [--viewport-w:1440px] [--viewport-h:900px] [--scale:0.30] sm:[--scale:0.40] md:[--scale:0.55] lg:[--scale:0.68] w-[calc(var(--viewport-w)*var(--scale))] h-[calc(var(--viewport-h)*var(--scale))]">
                      <iframe
                        title="Desktop preview"
                        src={previewUrl}
                        className="absolute inset-0 origin-top-left [transform:scale(var(--scale))] w-[var(--viewport-w)] h-[var(--viewport-h)]"
                      />
                    </div>
                  </div>
                </div>
                {/* Laptop base */}
                <div className="mt-4 flex justify-center">
                  <div className="w-[88%] h-[18px] bg-gradient-to-b from-[#1b2331] to-[#0f131b] rounded-[999px] shadow-[0_16px_40px_rgba(2,6,23,0.5)]" />
                </div>
                <div className="mt-1 flex justify-center">
                  <div className="w-[72%] h-[10px] bg-gradient-to-b from-[#2f3746] to-[#171c27] rounded-[999px] [transform:perspective(1200px)_rotateX(10deg)] shadow-[0_10px_24px_rgba(2,6,23,0.45)]" />
                </div>
                {/* Ambient glow */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-indigo-500/[0.06] rounded-full blur-2xl pointer-events-none" />
              </div>
            </div>
          )}

          {/* Mobile Frame */}
          {activeDevice === 'mobile' && (
            <div className="relative bg-[#0b0f16] rounded-[44px] p-5 shadow-[0_30px_80px_rgba(2,6,23,0.6)] border border-white/10 w-[300px] sm:w-[350px] md:w-[380px]">
              <div className="bg-black rounded-[36px] overflow-hidden border border-white/5 relative">
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#0f1219] rounded-full border border-white/5 z-10" />
                <div className="relative mx-auto [--viewport-w:430px] [--viewport-h:932px] [--scale:0.60] sm:[--scale:0.72] md:[--scale:0.80] w-[calc(var(--viewport-w)*var(--scale))] h-[calc(var(--viewport-h)*var(--scale))]">
                  <iframe
                    title="Mobile preview"
                    src={previewUrl}
                    className="absolute inset-0 origin-top-left [transform:scale(var(--scale))] w-[var(--viewport-w)] h-[var(--viewport-h)]"
                  />
                </div>
              </div>
              {/* Home bar */}
              <div className="mt-3 flex justify-center">
                <div className="w-24 h-1.5 bg-white/20 rounded-full" />
              </div>
              {/* Ambient glow */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-14 bg-violet-500/[0.08] rounded-full blur-2xl pointer-events-none" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicWebsitePreview;
