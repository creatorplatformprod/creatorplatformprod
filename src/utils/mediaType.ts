export type MediaType = "image" | "video";

const VIDEO_EXTENSION_PATTERN = /\.(mp4|webm|ogg|mov|avi|m3u8|m4v)$/i;

export const isVideoUrl = (url: string): boolean => {
  if (!url || typeof url !== "string") return false;

  try {
    const parsed = new URL(url, "https://example.com");
    return VIDEO_EXTENSION_PATTERN.test(parsed.pathname);
  } catch {
    const cleanUrl = url.split("#")[0].split("?")[0];
    return VIDEO_EXTENSION_PATTERN.test(cleanUrl);
  }
};

export const normalizeMediaType = (value: unknown): MediaType | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  if (normalized === "video" || normalized.startsWith("video/") || normalized.includes("video")) {
    return "video";
  }
  if (normalized === "image" || normalized.startsWith("image/") || normalized.includes("image")) {
    return "image";
  }
  return null;
};

export const resolveMediaType = (input: {
  mediaType?: unknown;
  mimeType?: unknown;
  contentType?: unknown;
  type?: unknown;
  url?: unknown;
  hlsUrl?: unknown;
  hlsSrc?: unknown;
}): MediaType => {
  const explicitType =
    normalizeMediaType(input.mediaType) ??
    normalizeMediaType(input.mimeType) ??
    normalizeMediaType(input.contentType) ??
    normalizeMediaType(input.type);

  if (explicitType) return explicitType;

  const hlsCandidate =
    (typeof input.hlsUrl === "string" && input.hlsUrl.trim()) ||
    (typeof input.hlsSrc === "string" && input.hlsSrc.trim());
  if (hlsCandidate) return "video";

  return isVideoUrl(typeof input.url === "string" ? input.url : "") ? "video" : "image";
};
