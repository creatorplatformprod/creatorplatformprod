const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toUrlNode = (entry) => {
  const lines = [`<url><loc>${escapeXml(entry.loc)}</loc>`];
  if (entry.lastmod) lines.push(`<lastmod>${escapeXml(new Date(entry.lastmod).toISOString())}</lastmod>`);
  if (entry.changefreq) lines.push(`<changefreq>${escapeXml(entry.changefreq)}</changefreq>`);
  if (typeof entry.priority === "number") lines.push(`<priority>${entry.priority.toFixed(1)}</priority>`);
  lines.push("</url>");
  return lines.join("");
};

export async function onRequest(context) {
  const { request, env } = context;
  const origin = new URL(request.url).origin;
  const defaultApi = "https://creator-platform-api-production.creatorplatformprod.workers.dev";
  const apiBase = (env.SITEMAP_API_URL || env.API_BASE_URL || defaultApi).replace(/\/+$/, "");

  let entries = [
    { loc: `${origin}/`, changefreq: "daily", priority: 1.0 },
    { loc: `${origin}/pricing`, changefreq: "weekly", priority: 0.7 }
  ];

  try {
    const response = await fetch(`${apiBase}/api/seo/sitemap`, {
      headers: { "Accept": "application/json" }
    });
    if (response.ok) {
      const data = await response.json();
      if (data?.success && Array.isArray(data.entries) && data.entries.length > 0) {
        entries = data.entries.map((entry) => ({
          ...entry,
          loc: String(entry.loc || "").replace(/^https?:\/\/[^/]+/i, origin)
        }));
      }
    }
  } catch {
    // Keep static fallback entries.
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    entries.map(toUrlNode).join("") +
    `</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=86400, stale-while-revalidate=86400"
    }
  });
}

