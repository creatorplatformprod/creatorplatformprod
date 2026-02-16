export async function onRequest(context) {
  const { request } = context;
  const origin = new URL(request.url).origin;

  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /dashboard",
    "Disallow: /preview/",
    "Disallow: /auth/",
    "Disallow: /fan/",
    "Disallow: /checkout",
    "Disallow: /tip-checkout",
    "Disallow: /recover-access",
    "Disallow: /index",
    `Sitemap: ${origin}/sitemap.xml`
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400"
    }
  });
}

