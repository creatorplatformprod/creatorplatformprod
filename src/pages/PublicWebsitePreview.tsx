import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PublicWebsitePreview = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [published, setPublished] = useState(false);

  const previewUrl = useMemo(() => {
    if (!username) return "#";
    return `/${username}?mode=preview`;
  }, [username]);

  const handlePublish = () => {
    if (!username) return;
    localStorage.setItem(`publicWebsitePublished:${username}`, "true");
    setPublished(true);
  };

  return (
    <div className="min-h-screen feed-bg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Public Website Preview
              </h1>
              <p className="text-sm text-muted-foreground">
                Desktop and mobile views update live as you edit your profile.
              </p>
            </div>
          </div>
          <Button onClick={handlePublish} className="px-6">
            Publish
          </Button>
        </div>

        {published && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">
              Published. Your public website is now available.
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="flex-1 min-w-0 w-full">
            <div className="relative mx-auto max-w-[880px]">
              <div className="bg-[#0c1119] rounded-[20px] p-3 border border-white/10 shadow-[0_30px_80px_rgba(2,6,23,0.6)]">
                <div className="bg-black rounded-[14px] overflow-hidden border border-white/5">
                  <div className="relative mx-auto [--viewport-w:1440px] [--viewport-h:900px] [--scale:0.42] lg:[--scale:0.58] w-[calc(var(--viewport-w)*var(--scale))] h-[calc(var(--viewport-h)*var(--scale))]">
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

          <div className="w-full lg:w-[370px] flex justify-center">
            <div className="bg-[#0b0f16] rounded-[40px] p-4 shadow-[0_25px_70px_rgba(2,6,23,0.55)] border border-white/10 w-[330px]">
              <div className="bg-black rounded-[32px] overflow-hidden border border-white/5 relative">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#0f1219] rounded-full border border-white/5 z-10" />
                <div className="relative mx-auto [--viewport-w:430px] [--viewport-h:932px] [--scale:0.58] lg:[--scale:0.7] w-[calc(var(--viewport-w)*var(--scale))] h-[calc(var(--viewport-h)*var(--scale))]">
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
