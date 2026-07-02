// Edge Function: create-qr
// POST — crea un nuevo código QR con shortlink.

import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import { buildDestinationUrl } from '../_shared/qr-utils.ts';

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

function generateSlug(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
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
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  const body = await req.json();
  const name = body.name as string;
  const platform = body.platform as string;

  if (!name || !platform) {
    return jsonResponse(JSON.stringify({ error: 'name y platform son requeridos' }), 400);
  }

  const config: Record<string, string> = {};
  for (const [k, v] of Object.entries(body)) {
    if (!['name', 'platform', 'expires_at', 'max_scans', 'qr_color', 'qr_bg_color', 'qr_style'].includes(k) && v !== undefined) {
      config[k] = String(v);
    }
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
      config,
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
    config: qr.config,
    platform: qr.platform,
    qr_color: qr.qr_color,
    qr_bg_color: qr.qr_bg_color,
    qr_style: qr.qr_style,
    created_at: qr.created_at
  }));
});
