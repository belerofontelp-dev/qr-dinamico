-- Habilitar extension pg_cron y programar cron para marcar QRs caducados cada 10 minutos
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'expire-qr-codes',
  '*/10 * * * *',
  'SELECT expire_qr_codes()'
);
