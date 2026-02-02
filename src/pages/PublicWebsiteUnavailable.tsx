import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PublicWebsiteUnavailable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("username") || "";
  }, [location.search]);

  return (
    <div className="min-h-screen feed-bg flex items-center justify-center px-4">
      <div className="post-card rounded-xl p-8 max-w-xl w-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Public website not published</h1>
        <p className="text-muted-foreground">
          Go to the preview website to view and publish your public page.
        </p>
        <Button onClick={() => navigate(`/preview/${username}`)} className="px-6">
          Go to Preview Website
        </Button>
      </div>
    </div>
  );
};

export default PublicWebsiteUnavailable;
