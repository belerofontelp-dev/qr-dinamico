// Edge Function: update-qr
// PUT /functions/v1/update-qr?id=<uuid> — actualiza un QR existente.

import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  if (req.method !== 'PUT') {
    return new Response('Method not allowed', { status: 405 });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_KEY')!
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(req.url);
  const qrId = url.searchParams.get('id');
  if (!qrId) {
    return new Response(JSON.stringify({ error: 'id es requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const body = await req.json();
  const updates: Record<string, unknown> = {};
  const allowed = ['destination_url', 'expires_at', 'max_scans', 'status', 'name',
                    'qr_color', 'qr_bg_color', 'qr_style', 'qr_logo_url'];
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return new Response(JSON.stringify({ error: 'sin campos para actualizar' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updates.updated_at = new Date().toISOString();

  const { data: qr, error: updateError } = await supabase
    .from('qr_codes')
    .update(updates)
    .eq('id', qrId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (updateError || !qr) {
    return new Response(JSON.stringify({ error: updateError?.message || 'QR no encontrado' }), {
      status: updateError ? 500 : 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(qr), {
    headers: { 'Content-Type': 'application/json' }
  });
});
