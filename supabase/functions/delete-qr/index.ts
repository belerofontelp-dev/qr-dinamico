// Edge Function: delete-qr
// DELETE /functions/v1/delete-qr?id=<uuid> — elimina un QR y su archivo de Drive.

import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: string, status = 200) {
  return new Response(body, { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'DELETE') {
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

  const url = new URL(req.url);
  const qrId = url.searchParams.get('id');
  if (!qrId) {
    return jsonResponse(JSON.stringify({ error: 'id es requerido' }), 400);
  }

  const { error: deleteError } = await supabase
    .from('qr_codes')
    .delete()
    .eq('id', qrId)
    .eq('user_id', user.id);

  if (deleteError) {
    return jsonResponse(JSON.stringify({ error: deleteError.message }), 500);
  }

  return jsonResponse(JSON.stringify({ ok: true }));
});
