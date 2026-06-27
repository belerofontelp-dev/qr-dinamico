-- ============================================================
-- Migración inicial: esquema completo de QR Dinámico
-- ============================================================

-- Tabla principal de QR codes
CREATE TABLE qr_codes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  platform        TEXT NOT NULL,
  destination_url TEXT NOT NULL,

  -- Caducidad
  status          TEXT DEFAULT 'active',
  expires_at      TIMESTAMPTZ,
  max_scans       INTEGER,
  scan_count      INTEGER DEFAULT 0,
  expired_at      TIMESTAMPTZ,

  -- Personalización del QR
  qr_color        TEXT DEFAULT '#000000',
  qr_bg_color     TEXT DEFAULT '#FFFFFF',
  qr_style        TEXT DEFAULT 'square',
  qr_logo_url     TEXT,
  qr_image_url    TEXT,

  -- Google Drive
  drive_file_id   TEXT,
  drive_url       TEXT,

  -- Notificaciones
  notified_at     TIMESTAMPTZ,

  -- Metadatos
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de escaneos (analytics)
CREATE TABLE qr_scans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_id       UUID REFERENCES qr_codes(id) ON DELETE CASCADE,
  scanned_at  TIMESTAMPTZ DEFAULT NOW(),
  user_agent  TEXT,
  country     TEXT,
  city        TEXT,
  device_type TEXT
);

-- Índices
CREATE INDEX idx_qr_codes_slug   ON qr_codes(slug);
CREATE INDEX idx_qr_codes_user   ON qr_codes(user_id);
CREATE INDEX idx_qr_codes_status ON qr_codes(status);
CREATE INDEX idx_qr_scans_qr_id  ON qr_scans(qr_id);
CREATE INDEX idx_qr_scans_date   ON qr_scans(scanned_at DESC);

-- Row Level Security
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_qr_codes" ON qr_codes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_see_own_scans" ON qr_scans
  FOR SELECT USING (
    qr_id IN (SELECT id FROM qr_codes WHERE user_id = auth.uid())
  );

-- Trigger: incrementa scan_count al insertar un escaneo
CREATE OR REPLACE FUNCTION increment_scan_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE qr_codes SET scan_count = scan_count + 1, updated_at = NOW()
  WHERE id = NEW.qr_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_scan
  AFTER INSERT ON qr_scans
  FOR EACH ROW EXECUTE FUNCTION increment_scan_count();

-- Función para cron de caducidad
CREATE OR REPLACE FUNCTION expire_qr_codes()
RETURNS void AS $$
BEGIN
  UPDATE qr_codes
  SET status = 'expired', expired_at = NOW()
  WHERE status = 'active'
    AND (
      (expires_at IS NOT NULL AND expires_at < NOW())
      OR
      (max_scans IS NOT NULL AND scan_count >= max_scans)
    );
END;
$$ LANGUAGE plpgsql;
