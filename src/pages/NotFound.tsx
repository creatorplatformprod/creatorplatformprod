import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center feed-bg px-4">
      <div className="post-card rounded-xl p-6 sm:p-8 text-center max-w-md w-full">
        <h1 className="mb-2 text-3xl sm:text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-base sm:text-lg text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-sm sm:text-base text-primary underline hover:text-primary/80">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
