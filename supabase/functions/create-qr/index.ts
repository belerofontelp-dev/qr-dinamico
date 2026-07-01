// Edge Function: create-qr
// POST — crea un nuevo código QR con shortlink.

import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: string, status = 200) {
  return new Response(body, { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

function generateSlug(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function buildDestinationUrl(platform: string, config: Record<string, string>): string {
  switch (platform) {
    case 'whatsapp': {
      const wa = `https://wa.me/${config.phone}`;
      return config.message ? `${wa}?text=${encodeURIComponent(config.message)}` : wa;
    }
    case 'instagram':
      return config.mode === 'post'
        ? `https://instagram.com/p/${config.post_id}`
        : `https://instagram.com/${config.username}`;
    case 'telegram':
      return config.mode === 'invite'
        ? `https://t.me/+${config.invite_hash}`
        : `https://t.me/${config.username}`;
    case 'twitter':
      return config.mode === 'tweet'
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(config.text || '')}${config.url ? `&url=${encodeURIComponent(config.url)}` : ''}`
        : `https://twitter.com/${config.username}`;
    case 'linkedin':
      return config.mode === 'company'
        ? `https://linkedin.com/company/${config.company}`
        : `https://linkedin.com/in/${config.username}`;
    case 'url':
    default:
      return config.url || 'https://ejemplo.com';
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_KEY')!
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  const body = await req.json();
  const { name, platform, ...config } = body;

  if (!name || !platform) {
    return jsonResponse(JSON.stringify({ error: 'name y platform son requeridos' }), 400);
  }

  const destination_url = buildDestinationUrl(platform, config);

  let slug = generateSlug();
  let exists = true;
  while (exists) {
    slug = generateSlug();
    const { data } = await supabase.from('qr_codes').select('id').eq('slug', slug).single();
    exists = !!data;
  }

  const { data: qr, error: insertError } = await supabase
    .from('qr_codes')
    .insert({
      user_id: user.id,
      slug,
      name,
      platform,
      destination_url,
      expires_at: body.expires_at || null,
      max_scans: body.max_scans || null,
      qr_color: body.qr_color || '#000000',
      qr_bg_color: body.qr_bg_color || '#FFFFFF',
      qr_style: body.qr_style || 'square',
      status: 'active'
    })
    .select()
    .single();

  if (insertError) {
    return jsonResponse(JSON.stringify({ error: insertError.message }), 500);
  }

  const workerUrl = Deno.env.get('WORKER_URL') || 'https://qr.tudominio.workers.dev';

  return jsonResponse(JSON.stringify({
    id: qr.id,
    slug: qr.slug,
    shortlink: `${workerUrl}/q/${qr.slug}`,
    destination_url: qr.destination_url,
    platform: qr.platform,
    qr_color: qr.qr_color,
    qr_bg_color: qr.qr_bg_color,
    qr_style: qr.qr_style,
    created_at: qr.created_at
  }));
});
