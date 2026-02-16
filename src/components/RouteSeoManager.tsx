import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSeo } from "@/hooks/use-seo";

const isNoIndexPath = (pathname: string) => {
  if (pathname.startsWith("/dashboard")) return true;
  if (pathname.startsWith("/preview/")) return true;
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/fan/")) return true;
  if (pathname.startsWith("/checkout")) return true;
  if (pathname.startsWith("/tip-checkout")) return true;
  if (pathname.startsWith("/recover-access")) return true;
  if (pathname === "/index") return true;
  return false;
};

const RouteSeoManager = () => {
  const location = useLocation();

  const seo = useMemo(() => {
    const path = location.pathname;
    const params = new URLSearchParams(location.search);
    const isPreviewMode = params.get("mode") === "preview";
    const noindex = isNoIndexPath(path) || isPreviewMode;

    if (path === "/") {
      return {
        title: "SixSevenCreator | Creator Platform",
        description:
          "Build your premium creator storefront with exclusive posts, collections, and seamless checkout.",
        canonicalPath: "/",
        noindex: false,
      };
    }

    if (path === "/pricing") {
      return {
        title: "Pricing | SixSevenCreator",
        description: "Simple plans for creators. Launch your premium storefront and grow with transparent pricing.",
        canonicalPath: "/pricing",
        noindex: false,
      };
    }

    return {
      title: "SixSevenCreator",
      description:
        "Premium creator storefronts with exclusive collections, posts, and secure fan access.",
      noindex,
    };
  }, [location.pathname, location.search]);

  useSeo(seo, [seo]);
  return null;
};

export default RouteSeoManager;

