import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const FanAuthCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fanToken = params.get("fanToken");
    const returnTo = params.get("returnTo") || "/";
    if (fanToken) {
      localStorage.setItem("fan_token", fanToken);
      localStorage.removeItem("fan_guest_mode");
    }
    window.location.href = returnTo.startsWith("/") ? returnTo : "/";
  }, []);

  return (
    <div className="min-h-screen feed-bg flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Finishing sign-in...</p>
      </div>
    </div>
  );
};

export default FanAuthCallback;

