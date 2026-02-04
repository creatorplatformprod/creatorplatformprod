import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AccountMenu from "@/components/AccountMenu";
import { api } from "@/lib/api";
import { Moon, Sun } from "lucide-react";

const PublicWebsitePreview = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [published, setPublished] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Theme state for full page (not the frames)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
      {/* Top Navbar - Matching Dashboard Style */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left - Navigation */}
            <div className="flex items-center gap-6">
              <span className="text-xl font-bold text-foreground">Preview</span>
              <div className="hidden sm:flex items-center gap-1">
                <span className="text-muted-foreground">|</span>
                <span className="text-sm text-muted-foreground ml-1">Desktop and mobile views update live</span>
              </div>
            </div>
            
            {/* Right - Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="hover:bg-sky-500 hover:text-white transition-colors"
              >
                Back to Dashboard
              </Button>
              {hasChanges ? (
                <Button onClick={handlePublish} className="px-6 bg-sky-500 hover:bg-sky-600 text-white">
                  Save Changes
                </Button>
              ) : (
                <span className="px-4 py-2 text-sm text-muted-foreground bg-secondary/50 border border-border rounded-lg">
                  {published ? "Changes published" : "No changes made"}
                </span>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full w-9 h-9 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-colors"
                title="Toggle page theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <AccountMenu currentUser={currentUser} />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {hasChanges && (
          <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              You have unsaved changes. Click "Save Changes" to publish them.
            </p>
          </div>
        )}
        {!hasChanges && published && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">
              All changes are published. Your public website is up to date.
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="flex-1 min-w-0 w-full">
            <div className="relative mx-auto max-w-[920px]">
              <div className="bg-[#0c1119] rounded-[20px] p-3 border border-white/10 shadow-[0_30px_80px_rgba(2,6,23,0.6)]">
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
            </div>
          </div>

          <div className="w-full lg:w-[380px] flex justify-center">
            <div className="bg-[#0b0f16] rounded-[40px] p-4 shadow-[0_25px_70px_rgba(2,6,23,0.55)] border border-white/10 w-[268px] sm:w-[310px] lg:w-[340px]">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicWebsitePreview;
