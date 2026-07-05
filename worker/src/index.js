// Cloudflare Worker — Motor de redirección de QRs dinámicos
// Recibe GET /q/:slug, consulta Supabase, verifica caducidad, redirige.

const RATE_LIMIT = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const window = now - 60_000;

  if (!RATE_LIMIT.has(ip)) {
    RATE_LIMIT.set(ip, [now]);
    return false;
  }

  const timestamps = RATE_LIMIT.get(ip).filter(t => t > window);
  timestamps.push(now);
  RATE_LIMIT.set(ip, timestamps);

  if (timestamps.length > 100) {
    return true;
  }

  if (RATE_LIMIT.size > 5000) {
    for (const [key, ts] of RATE_LIMIT) {
      if (ts.every(t => t <= window)) RATE_LIMIT.delete(key);
    }
  }

  return false;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const slug = url.pathname.split('/q/')[1];
    if (!slug) return new Response('Not found', { status: 404 });

    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response('Demasiadas solicitudes', { status: 429 });
    }

    const { data: qr } = await fetch(
      `${env.SUPABASE_URL}/rest/v1/qr_codes?slug=eq.${slug}&select=*`,
      {
        headers: {
          apikey: env.SUPABASE_KEY,
          Authorization: `Bearer ${env.SUPABASE_KEY}`
        }
      }
    ).then(res => res.json()).then(rows => ({ data: rows?.[0] || null }));

    if (!qr) return Response.redirect(`${env.APP_URL}/404`, 302);

    const now = new Date();
    const expired =
      qr.status === 'expired' ||
      (qr.expires_at && new Date(qr.expires_at) < now) ||
      (qr.max_scans && qr.scan_count >= qr.max_scans);

    if (expired) {
      try {
        await fetch(`${env.SUPABASE_URL}/rest/v1/qr_codes?id=eq.${qr.id}`, {
          method: 'PATCH',
          headers: {
            apikey: env.SUPABASE_KEY,
            Authorization: `Bearer ${env.SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'expired', expired_at: now.toISOString() })
        });
      } catch {}
      return Response.redirect(`${env.APP_URL}/expired?id=${qr.id}`, 302);
    }

    try {
      await fetch(`${env.SUPABASE_URL}/rest/v1/qr_scans`, {
        method: 'POST',
        headers: {
          apikey: env.SUPABASE_KEY,
          Authorization: `Bearer ${env.SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          qr_id: qr.id,
          user_agent: request.headers.get('user-agent'),
          country: request.cf?.country || null,
          city: request.cf?.city || null,
          scanned_at: now.toISOString()
        })
      });
    } catch {}

    if (['linklist', 'appstore', 'multisocial', 'wifi', 'vcard'].includes(qr.platform)) {
      return Response.redirect(`${env.APP_URL}/landing/${qr.slug}`, 302);
    }

    return Response.redirect(qr.destination_url, 302);
  }
};
