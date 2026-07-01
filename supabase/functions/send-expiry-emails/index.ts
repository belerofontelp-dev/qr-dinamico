// Edge Function: send-expiry-emails
// POST — envía emails de notificación para QRs expirados en las últimas 24h.

import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const yesterday = new Date(Date.now() - 86400000).toISOString();

  const { data: expiredQRs } = await supabase
    .from('qr_codes')
    .select('id, name, expired_at, user_id')
    .eq('status', 'expired')
    .gte('expired_at', yesterday)
    .is('notified_at', null);

  let processed = 0;

  for (const qr of expiredQRs ?? []) {
    const { data: userData } = await supabase.auth.admin.getUserById(qr.user_id);
    const email = userData?.user?.email;

    if (email) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'QR Dinámico <noreply@tudominio.com>',
          to: email,
          subject: `Tu QR "${qr.name}" ha expirado`,
          html: `
            <h2>Tu código QR ha expirado</h2>
            <p>El QR <strong>${qr.name}</strong> expiró el ${new Date(qr.expired_at).toLocaleDateString('es-AR')}.</p>
            <p>Podés reactivarlo o crear uno nuevo desde tu panel.</p>
            <a href="${Deno.env.get('APP_URL')}/dashboard">Ir al panel</a>
          `
        })
      });
    }

    await supabase.from('qr_codes').update({ notified_at: new Date().toISOString() }).eq('id', qr.id);
    processed++;
  }

  return new Response(JSON.stringify({ processed }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
