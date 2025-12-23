export async function onRequest(context) {
  const { request, next } = context;
  const referer = request.headers.get('Referer');
  
  // Your allowed domains
  const allowedDomains = [
    'lannaof.pages.dev',
    'lannadelulu.com',
    'lannah.lannadelulu.workers.dev',
    'localhost'
  ];
  
  // Check if request came from your website
  const isAllowed = referer && allowedDomains.some(domain => 
    referer.includes(domain)
  );
  
  // Block if not from your site
  if (!isAllowed) {
    return new Response('Access Denied: Direct access not allowed', { 
      status: 403,
      headers: { 
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store'
      }
    });
  }
  
  // Allow if from your site
  return await next();
}