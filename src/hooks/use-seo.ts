import { useEffect } from "react";

type SeoConfig = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  canonicalPath?: string;
  noindex?: boolean;
  image?: string;
  type?: "website" | "article" | "profile";
  jsonLd?: Record<string, unknown> | null;
};

const DEFAULT_TITLE = "SixSevenCreator";
const DEFAULT_DESCRIPTION =
  "Build your premium creator storefront with exclusive posts, collections, and seamless checkout.";
const DEFAULT_IMAGE = "/favicon-67.svg";
const JSON_LD_ID = "ssc-seo-jsonld";

const ensureMetaTag = (selector: string, attrs: Record<string, string>, content: string) => {
  if (typeof document === "undefined") return;
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    Object.entries(attrs).forEach(([key, value]) => tag?.setAttribute(key, value));
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const ensureLinkTag = (rel: string, href: string) => {
  if (typeof document === "undefined") return;
  let tag = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
};

const absoluteUrl = (value?: string | null): string => {
  if (!value) {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (typeof window === "undefined") return value;
  return new URL(value, window.location.origin).toString();
};

const setJsonLd = (jsonLd?: Record<string, unknown> | null) => {
  if (typeof document === "undefined") return;
  const existing = document.getElementById(JSON_LD_ID);
  if (!jsonLd) {
    if (existing?.parentNode) existing.parentNode.removeChild(existing);
    return;
  }
  const script = existing || document.createElement("script");
  script.id = JSON_LD_ID;
  script.setAttribute("type", "application/ld+json");
  script.textContent = JSON.stringify(jsonLd);
  if (!existing) document.head.appendChild(script);
};

const resolveCanonical = (config: SeoConfig): string => {
  if (config.canonicalUrl) return absoluteUrl(config.canonicalUrl);
  if (config.canonicalPath) return absoluteUrl(config.canonicalPath);
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  url.searchParams.delete("mode");
  url.searchParams.delete("access");
  url.searchParams.delete("token");
  url.searchParams.delete("notice");
  url.searchParams.delete("tab");
  return url.toString();
};

export const applySeo = (config: SeoConfig = {}) => {
  if (typeof document === "undefined") return;
  const title = config.title || DEFAULT_TITLE;
  const description = config.description || DEFAULT_DESCRIPTION;
  const canonical = resolveCanonical(config);
  const image = absoluteUrl(config.image || DEFAULT_IMAGE);
  const type = config.type || "website";
  const robots = config.noindex ? "noindex, nofollow, noarchive" : "index, follow";

  document.title = title;
  ensureMetaTag('meta[name="description"]', { name: "description" }, description);
  ensureMetaTag('meta[name="robots"]', { name: "robots" }, robots);
  ensureMetaTag('meta[property="og:title"]', { property: "og:title" }, title);
  ensureMetaTag('meta[property="og:description"]', { property: "og:description" }, description);
  ensureMetaTag('meta[property="og:type"]', { property: "og:type" }, type);
  ensureMetaTag('meta[property="og:image"]', { property: "og:image" }, image);
  ensureMetaTag('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
  ensureMetaTag('meta[name="twitter:title"]', { name: "twitter:title" }, title);
  ensureMetaTag('meta[name="twitter:description"]', { name: "twitter:description" }, description);
  ensureMetaTag('meta[name="twitter:image"]', { name: "twitter:image" }, image);
  if (canonical) {
    ensureMetaTag('meta[property="og:url"]', { property: "og:url" }, canonical);
    ensureLinkTag("canonical", canonical);
  }
  setJsonLd(config.jsonLd ?? null);
};

export const useSeo = (config: SeoConfig, deps: unknown[] = []) => {
  useEffect(() => {
    applySeo(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

