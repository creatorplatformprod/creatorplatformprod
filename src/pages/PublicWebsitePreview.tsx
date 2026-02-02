import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PublicWebsitePreview = () => {
  const { username } = useParams();
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
          <div>
            <h1 className="text-2xl font-bold text-foreground">Public Website Preview</h1>
            <p className="text-sm text-muted-foreground">
              Desktop and mobile views update live as you edit your profile.
            </p>
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

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0 w-full">
            <div className="bg-[#141821] rounded-[28px] p-4 shadow-2xl border border-white/5">
              <div className="flex items-center gap-2 px-2 pb-3">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="rounded-2xl overflow-hidden bg-black">
                <div className="relative w-full pb-[62%]">
                  <iframe
                    title="Desktop preview"
                    src={previewUrl}
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
              <div className="mt-4 mx-auto w-40 h-3 bg-white/10 rounded-full" />
            </div>
          </div>

          <div className="w-full lg:w-[320px] flex justify-center">
            <div className="bg-[#10131a] rounded-[40px] p-3 shadow-2xl border border-white/10 w-[280px]">
              <div className="bg-black rounded-[32px] overflow-hidden">
                <div className="relative w-full pb-[206%]">
                  <iframe
                    title="Mobile preview"
                    src={previewUrl}
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                <div className="w-24 h-1.5 bg-white/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicWebsitePreview;
