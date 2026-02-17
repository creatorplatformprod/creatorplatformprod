import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Monitor, Smartphone, Copy, Check, Link2 } from "lucide-react";
import AccountMenu from "@/components/AccountMenu";
import { api } from "@/lib/api";

const ONBOARDING_STEPS = [
  {
    title: "Welcome to your Preview",
    description: "This is where you see how your public page looks to visitors. Let's walk through the key areas.",
    icon: "👋"
  },
  {
    title: "Publish Your Page",
    description: "Click 'Publish' in the top-right to push your latest saved dashboard changes to your public website.",
    icon: "🚀"
  },
  {
    title: "Switch Devices",
    description: "Use the Desktop/Mobile toggle to see how your page looks on different screen sizes. Most of your audience will view on mobile.",
    icon: "📱"
  },
  {
    title: "Share Your Link",
    description: "Copy your unique URL and share it on social media, in your bio, or anywhere you want to drive traffic.",
    icon: "🔗"
  },
  {
    title: "Customize in Dashboard",
    description: "Head back to the Dashboard to add collections, status posts, update your profile photo, bio, social links, and pricing.",
    icon: "✨"
  }
];

const PublicWebsitePreview = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [published, setPublished] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(-1);
  const [showOnboarding, setShowOnboarding] = useState(false);
  

  const previewUrl = useMemo(() => {
    if (!username) return "/public-unavailable";
    return `/public/${username}?mode=preview`;
  }, [username]);

  const publicUrl = useMemo(() => {
    if (!username) return "/public-unavailable";
    return `/${username}`;
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

  // Template switching is intentionally disabled for now.
  // Keep preview locked to the general public design.

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

  const publishCollectionsForOwner = async () => {
    if (!username) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const me = await api.getCurrentUser();
    const isOwner =
      me?.success && me?.user?.username?.toLowerCase() === username.toLowerCase();
    if (!isOwner) return;

    const myCollectionsResult = await api.getMyCollections();
    if (!myCollectionsResult?.success) return;

    const unpublishedCollections = (myCollectionsResult.collections || []).filter(
      (collection: any) => !collection?.isPublished
    );
    if (unpublishedCollections.length === 0) return;

    await Promise.all(
      unpublishedCollections.map((collection: any) =>
        api.updateCollection(collection._id, { isPublished: true })
      )
    );
  };

  const publishProfileDraftForOwner = async () => {
    if (!username) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const me = await api.getCurrentUser();
    const isOwner =
      me?.success && me?.user?.username?.toLowerCase() === username.toLowerCase();
    if (!isOwner) return;

    const draftKey = `publicWebsiteProfileDraft:${username}`;
    let draft: any = null;
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        draft = JSON.parse(raw);
      }
    } catch {
      draft = null;
    }
    if (!draft || typeof draft !== "object") return;
    // Template system disabled: ignore legacy template draft field.
    delete draft.websiteTemplate;

    const result = await api.updateProfile(draft);
    if (result?.success) {
      localStorage.removeItem(draftKey);
    }
  };

  const handlePublish = async () => {
    if (!username) return;
    setPublishError("");
    setIsPublishing(true);
    try {
      await publishCollectionsForOwner();
      await publishProfileDraftForOwner();
      localStorage.setItem(`publicWebsitePublished:${username}`, "true");
      localStorage.setItem(`publicWebsiteDirty:${username}`, "false");
      setPublished(true);
      setHasChanges(false);
    } catch (error: any) {
      setPublishError(error?.message || "Failed to publish changes.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Onboarding -- show on first preview visit
  useEffect(() => {
    if (!username) return;
    const seen = localStorage.getItem(`onboarding_complete:${username}`);
    if (!seen) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
        setOnboardingStep(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [username]);

  const handleOnboardingNext = () => {
    if (onboardingStep < ONBOARDING_STEPS.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      handleOnboardingDismiss();
    }
  };

  const handleOnboardingDismiss = () => {
    setShowOnboarding(false);
    setOnboardingStep(-1);
    if (username) {
      localStorage.setItem(`onboarding_complete:${username}`, 'true');
    }
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}${publicUrl}`;
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
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="brand-wordmark"><span className="brand-accent">Six</span><span className="text-gray-900">Seven</span><span className="brand-accent">Creator</span></div>
              <div className="hidden sm:block w-px h-6 bg-gray-200" />
              <span className="hidden sm:inline text-sm font-semibold text-foreground tracking-tight">Preview</span>
              <div className="dot-live" title="Live" />
            </div>
            
            {/* Right */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="text-muted-foreground hover:text-foreground text-xs h-9 sm:h-8 px-2 sm:px-3"
              >
                <span className="hidden md:inline">Back to Dashboard</span>
                <span className="md:hidden">Back</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(publicUrl, '_blank')}
                className="text-muted-foreground hover:text-foreground text-xs h-9 w-9 sm:h-8 sm:w-auto sm:px-3 gap-1.5 px-0"
                aria-label="Open public website"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="hidden sm:inline">Open</span>
              </Button>
              {hasChanges ? (
                <Button onClick={handlePublish} disabled={isPublishing} className="btn-67 shadow-sm h-8 text-xs px-4">
                  <span className="hidden sm:inline">Save Changes</span>
                  <span className="sm:hidden">Save</span>
                </Button>
              ) : !published ? (
                <Button onClick={handlePublish} disabled={isPublishing} className="btn-67 shadow-sm h-8 text-xs px-4">
                  Publish
                </Button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 border border-border/60 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Published
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
          <div className="mb-4 alert-warning w-full max-w-[1060px] mx-auto">
            <p className="text-sm text-amber-600">
              You have unsaved changes. Click "Save Changes" to publish them.
            </p>
          </div>
        )}
        {publishError && (
          <div className="mb-4 alert-danger w-full max-w-[1060px] mx-auto">
            <p className="text-sm text-red-600">{publishError}</p>
          </div>
        )}
        {!hasChanges && published && (
          <div className="mb-4 alert-success w-full max-w-[1060px] mx-auto">
            <p className="text-sm text-green-600">
              All changes are published. Your public website is up to date.
            </p>
          </div>
        )}

        {/* Controls Bar: Device Switcher + URL + Actions */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-3 mb-5 w-full max-w-[1060px] mx-auto">
          {/* Device Switcher */}
          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-200">
            <button
              onClick={() => setActiveDevice('desktop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                activeDevice === 'desktop'
                  ? 'bg-gray-100 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setActiveDevice('mobile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                activeDevice === 'mobile'
                  ? 'bg-gray-100 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile
            </button>
          </div>

          {/* URL Bar + Copy */}
          <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
              <Link2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span className="text-[11px] text-muted-foreground font-mono">sixsevencreator.com/{username}</span>
            </div>
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Template picker intentionally disabled for now. */}
        {/* Device Preview Frame */}
        <div className="flex justify-center">
          {/* Desktop Frame */}
          {activeDevice === 'desktop' && (
            <div className="w-full max-w-[1060px]">
              <div className="relative">
                <div className="bg-gradient-to-b from-[#2d2d2d] to-[#1a1a1a] rounded-[20px] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <div className="bg-white rounded-[14px] overflow-hidden border border-black/10">
                    {/* Browser Chrome */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#3a3a3a] to-[#2e2e2e] border-b border-black/20">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="flex items-center gap-2 px-4 py-1 bg-white/10 rounded-md border border-white/10 max-w-sm w-full">
                          <svg className="w-3 h-3 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          <span className="text-[10px] text-white/50 truncate">sixsevencreator.com/{username}</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative mx-auto [--viewport-w:1440px] [--viewport-h:900px] [--scale:0.26] sm:[--scale:0.36] md:[--scale:0.55] lg:[--scale:0.68] w-[calc(var(--viewport-w)*var(--scale))] h-[calc(var(--viewport-h)*var(--scale))]">
                      <iframe
                        title="Desktop preview"
                        src={previewUrl}
                        className="absolute inset-0 origin-top-left [transform:scale(var(--scale))] w-[var(--viewport-w)] h-[var(--viewport-h)]"
                      />
                    </div>
                  </div>
                </div>
                {/* Laptop base — metallic */}
                <div className="mt-4 hidden sm:flex justify-center">
                  <div className="w-[88%] h-[18px] bg-gradient-to-b from-[#3a3a3a] via-[#4a4a4a] to-[#2a2a2a] rounded-[999px] shadow-[0_12px_32px_rgba(0,0,0,0.3)]" style={{boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 12px 32px rgba(0,0,0,0.3)'}} />
                </div>
                <div className="mt-1 hidden sm:flex justify-center">
                  <div className="w-[72%] h-[10px] bg-gradient-to-b from-[#333] to-[#222] rounded-[999px] [transform:perspective(1200px)_rotateX(10deg)] shadow-[0_8px_20px_rgba(0,0,0,0.25)]" />
                </div>
                {/* Ambient glow */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-indigo-500/[0.06] rounded-full blur-2xl pointer-events-none hidden sm:block" />
              </div>
            </div>
          )}

          {/* Mobile Frame */}
          {activeDevice === 'mobile' && (
            <div className="relative bg-gradient-to-b from-[#2d2d2d] to-[#1a1a1a] rounded-[44px] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] w-[300px] sm:w-[350px] md:w-[380px]">
              <div className="bg-white rounded-[36px] overflow-hidden border border-black/10 relative">
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10" />
                <div className="relative mx-auto overflow-hidden [--viewport-w:430px] [--viewport-h:932px] [--scale:0.60] sm:[--scale:0.72] md:[--scale:0.80] w-[calc(var(--viewport-w)*var(--scale))] h-[calc(var(--viewport-h)*var(--scale))]">
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
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-14 bg-indigo-500/[0.06] rounded-full blur-2xl pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Onboarding Tutorial Overlay */}
      {showOnboarding && onboardingStep >= 0 && (
        <>
          {/* Dimmed backdrop */}
          <div 
            className="fixed inset-0 z-[60] bg-black/30 transition-opacity duration-300"
            onClick={handleOnboardingDismiss}
          />
          {/* Tutorial Card */}
          <div className="fixed z-[70] bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md animate-fade-in">
            <div className="unlock-modal-card" style={{ padding: '1.25rem 1.5rem' }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{ONBOARDING_STEPS[onboardingStep].icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {ONBOARDING_STEPS[onboardingStep].title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {ONBOARDING_STEPS[onboardingStep].description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                {/* Progress dots */}
                <div className="flex items-center gap-1.5">
                  {ONBOARDING_STEPS.map((_, i) => (
                    <div 
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        i === onboardingStep ? 'bg-primary w-4' : i < onboardingStep ? 'bg-primary/40' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOnboardingDismiss}
                    className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleOnboardingNext}
                    className="px-4 py-1.5 text-xs font-medium rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                  >
                    {onboardingStep < ONBOARDING_STEPS.length - 1 ? 'Next' : 'Get Started'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PublicWebsitePreview;
