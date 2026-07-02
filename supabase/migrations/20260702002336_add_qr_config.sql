ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS config JSONB DEFAULT NULL;

COMMENT ON COLUMN qr_codes.config IS 'Configuración original de la plataforma (teléfono, mensaje, usuario, etc.)';
