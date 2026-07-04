// Edge Function: upload-qr-logo
// POST — sube un logo a Supabase Storage y devuelve la ruta pública.

import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BUCKET = 'qr-logos';
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

function jsonResponse(body: string, status = 200) {
  return new Response(body, { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

function base64ToUint8Array(base64: string): Uint8Array {
  const normalized = base64.replace(/^data:[^;]+;base64,/, '');
  const binaryString = atob(normalized);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function detectMimeType(base64: string): string {
  const match = base64.match(/^data:([^;]+);base64,/);
  return match ? match[1] : 'image/png';
}

function extensionFromMime(mime: string): string {
  switch (mime) {
    case 'image/png': return 'png';
    case 'image/jpeg': return 'jpg';
    case 'image/svg+xml': return 'svg';
    case 'image/webp': return 'webp';
    default: return 'png';
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
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const base64 = body.image as string;

    if (!base64 || typeof base64 !== 'string') {
      return jsonResponse(JSON.stringify({ error: 'image es requerida en base64' }), 400);
    }

    const mime = detectMimeType(base64);
    if (!['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'].includes(mime)) {
      return jsonResponse(JSON.stringify({ error: 'formato de imagen no soportado' }), 400);
    }

    const bytes = base64ToUint8Array(base64);
    if (bytes.length > MAX_SIZE) {
      return jsonResponse(JSON.stringify({ error: 'la imagen no puede superar los 2MB' }), 400);
    }

    const ext = extensionFromMime(mime);
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const path = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: mime, upsert: false });

    if (uploadError) {
      return jsonResponse(JSON.stringify({ error: uploadError.message }), 500);
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return jsonResponse(JSON.stringify({ path, publicUrl }));
  } catch (err) {
    return jsonResponse(JSON.stringify({ error: err instanceof Error ? err.message : 'Error al procesar la imagen' }), 500);
  }
});
