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
            <div className="relative mx-auto max-w-[980px]">
              <div className="bg-[#0c1119] rounded-[26px] p-4 border border-white/10 shadow-[0_30px_80px_rgba(2,6,23,0.6)]">
                <div className="bg-black rounded-[18px] overflow-hidden border border-white/5">
                  <div className="relative w-full pb-[60%]">
                    <iframe
                      title="Desktop preview"
                      src={previewUrl}
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="w-[92%] h-[18px] bg-gradient-to-b from-[#1a2230] to-[#0c0f16] rounded-[999px] shadow-[0_18px_40px_rgba(2,6,23,0.5)]" />
              </div>
              <div className="mt-1 flex justify-center">
                <div className="w-[70%] h-[10px] bg-gradient-to-b from-[#2b3342] to-[#141822] rounded-[999px] [transform:perspective(1200px)_rotateX(12deg)] shadow-[0_10px_24px_rgba(2,6,23,0.45)]" />
              </div>
              <div className="mt-3 flex justify-center">
                <div className="w-40 h-3 bg-white/10 rounded-full" />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[360px] flex justify-center">
            <div className="bg-[#0b0f16] rounded-[40px] p-4 shadow-[0_25px_70px_rgba(2,6,23,0.55)] border border-white/10 w-[320px]">
              <div className="bg-black rounded-[32px] overflow-hidden border border-white/5 relative">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#0f1219] rounded-full border border-white/5" />
                <div className="relative w-full pb-[210%]">
                  <iframe
                    title="Mobile preview"
                    src={previewUrl}
                    className="absolute inset-0 w-full h-full"
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
