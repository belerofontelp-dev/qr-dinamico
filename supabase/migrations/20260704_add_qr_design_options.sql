-- ============================================================
-- Migración: opciones avanzadas de diseño de QR
-- ============================================================

ALTER TABLE qr_codes
  ADD COLUMN IF NOT EXISTS qr_corners_style      TEXT DEFAULT 'square',
  ADD COLUMN IF NOT EXISTS qr_corners_dot_style  TEXT DEFAULT 'square',
  ADD COLUMN IF NOT EXISTS qr_frame_style        TEXT DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS qr_frame_text         TEXT DEFAULT 'Scan me',
  ADD COLUMN IF NOT EXISTS qr_frame_text_color   TEXT DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS qr_frame_bg_color     TEXT DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS qr_frame_border_color TEXT DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS qr_image_size         NUMERIC DEFAULT 0.4,
  ADD COLUMN IF NOT EXISTS qr_image_margin       INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS qr_error_correction   TEXT DEFAULT 'H',
  ADD COLUMN IF NOT EXISTS qr_logo_path          TEXT;

-- Los QR existentes quedan con valores por defecto.
-- El frame 'none' mantiene el comportamiento anterior.
