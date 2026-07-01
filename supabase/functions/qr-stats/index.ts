// Edge Function: qr-stats
// GET /functions/v1/qr-stats?qr_id=<uuid> — métricas de escaneos.

import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: string, status = 200) {
  return new Response(body, { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const qrId = url.searchParams.get('qr_id');

  if (!qrId) {
    return jsonResponse(JSON.stringify({ error: 'qr_id es requerido' }), 400);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Total escaneos
  const { count: total_scans } = await supabase
    .from('qr_scans')
    .select('*', { count: 'exact', head: true })
    .eq('qr_id', qrId);

  // Hoy
  const today = new Date().toISOString().split('T')[0];
  const { count: today_scans } = await supabase
    .from('qr_scans')
    .select('*', { count: 'exact', head: true })
    .eq('qr_id', qrId)
    .gte('scanned_at', today);

  // Esta semana
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const { count: week_scans } = await supabase
    .from('qr_scans')
    .select('*', { count: 'exact', head: true })
    .eq('qr_id', qrId)
    .gte('scanned_at', weekAgo);

  // Timeline (últimos 30 días)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data: scans } = await supabase
    .from('qr_scans')
    .select('scanned_at')
    .eq('qr_id', qrId)
    .gte('scanned_at', thirtyDaysAgo)
    .order('scanned_at', { ascending: true });

  const timelineMap = new Map();
  for (const scan of scans ?? []) {
    const day = new Date(scan.scanned_at).toISOString().split('T')[0];
    timelineMap.set(day, (timelineMap.get(day) || 0) + 1);
  }
  const timeline = Array.from(timelineMap.entries()).map(([date, scans]) => ({ date, scans }));

  // Por país
  const { data: byCountryRaw } = await supabase
    .from('qr_scans')
    .select('country')
    .eq('qr_id', qrId)
    .not('country', 'is', null);

  const countryMap = new Map();
  for (const s of byCountryRaw ?? []) {
    countryMap.set(s.country, (countryMap.get(s.country) || 0) + 1);
  }
  const by_country = Array.from(countryMap.entries())
    .map(([country, scans]) => ({ country, scans }))
    .sort((a, b) => b.scans - a.scans);

  return jsonResponse(JSON.stringify({
    total_scans: total_scans || 0,
    today: today_scans || 0,
    this_week: week_scans || 0,
    by_country,
    timeline
  }));
});
