export async function onRequest(context) {
  const { request, next, env } = context;
  const referer = request.headers.get('Referer');
  const host = request.headers.get('Host');
  
  // Core allowed domains
  const allowedDomains = [
    'sixsevencreator.com',
    'www.sixsevencreator.com',
    'localhost',
    '127.0.0.1'
  ];
  
  // Add current host to allowed list
  if (host) {
    allowedDomains.push(host);
  }
  
  // Add env-configured hosts if present
  if (env?.ALLOWED_HOSTS) {
    const extraHosts = env.ALLOWED_HOSTS.split(',').map(h => h.trim()).filter(Boolean);
    allowedDomains.push(...extraHosts);
  }
  
  // Check if request came from an allowed domain
  const isAllowed = referer && allowedDomains.some(domain => 
    referer.includes(domain)
  );
  
  // Optional: allow requests with no referrer if env flag is set
  const allowNoReferrer = env?.ALLOW_NO_REFERRER === 'true';
  
  // Block if not from allowed site (unless no-referrer is allowed and referer is missing)
  if (!isAllowed && !(allowNoReferrer && !referer)) {
    return new Response('Access Denied: Direct access not allowed', { 
      status: 403,
      headers: { 
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store'
      }
    });
  }
  
  // Allow if from allowed site
  return await next();
}