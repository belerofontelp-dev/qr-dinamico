// Edge Function: delete-qr
// DELETE /functions/v1/delete-qr?id=<uuid> — elimina un QR y su archivo de Drive.

import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  if (req.method !== 'DELETE') {
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

  const { error: deleteError } = await supabase
    .from('qr_codes')
    .delete()
    .eq('id', qrId)
    .eq('user_id', user.id);

  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
