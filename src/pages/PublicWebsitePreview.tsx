import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AccountMenu from "@/components/AccountMenu";
import { api } from "@/lib/api";

const PublicWebsitePreview = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [published, setPublished] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
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

      <div className="max-w-7xl mx-auto px-4 py-6">
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

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="flex-1 min-w-0 w-full">
            <p className="device-label text-center lg:text-left">Desktop</p>
            <div className="relative mx-auto max-w-[920px]">
              <div className="bg-[#0c1119] rounded-[20px] p-3 border border-white/10 frame-inner-shadow">
                <div className="bg-black rounded-[14px] overflow-hidden border border-white/5">
                  <div className="relative mx-auto [--viewport-w:1440px] [--viewport-h:900px] [--scale:0.26] sm:[--scale:0.3] lg:[--scale:0.56] w-[calc(var(--viewport-w)*var(--scale))] h-[calc(var(--viewport-h)*var(--scale))]">
                    <iframe
                      title="Desktop preview"
                      src={previewUrl}
                      className="absolute inset-0 origin-top-left [transform:scale(var(--scale))] w-[var(--viewport-w)] h-[var(--viewport-h)]"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <div className="w-[92%] h-[22px] bg-gradient-to-b from-[#1b2331] to-[#0f131b] rounded-[999px] shadow-[0_20px_45px_rgba(2,6,23,0.55)]" />
              </div>
              <div className="mt-1 flex justify-center">
                <div className="w-[78%] h-[12px] bg-gradient-to-b from-[#2f3746] to-[#171c27] rounded-[999px] [transform:perspective(1200px)_rotateX(10deg)] shadow-[0_12px_28px_rgba(2,6,23,0.5)]" />
              </div>
              {/* Ambient glow */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-indigo-500/[0.06] rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>

          <div className="w-full lg:w-[380px] flex flex-col items-center">
            <p className="device-label text-center">Mobile</p>
            <div className="relative bg-[#0b0f16] rounded-[40px] p-4 shadow-[0_25px_70px_rgba(2,6,23,0.55)] border border-white/10 w-[268px] sm:w-[310px] lg:w-[340px]">
              <div className="bg-black rounded-[32px] overflow-hidden border border-white/5 relative">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#0f1219] rounded-full border border-white/5 z-10" />
                <div className="relative mx-auto [--viewport-w:430px] [--viewport-h:932px] [--scale:0.54] sm:[--scale:0.58] lg:[--scale:0.7] w-[calc(var(--viewport-w)*var(--scale))] h-[calc(var(--viewport-h)*var(--scale))]">
                  <iframe
                    title="Mobile preview"
                    src={previewUrl}
                    className="absolute inset-0 origin-top-left [transform:scale(var(--scale))] w-[var(--viewport-w)] h-[var(--viewport-h)]"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                <div className="w-20 h-1.5 bg-white/20 rounded-full" />
              </div>
              {/* Ambient glow */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-violet-500/[0.06] rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicWebsitePreview;
