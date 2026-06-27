# App Web — Generador de QR Dinámico con Caducidad de Contenido

> Documentación técnica completa · Costo total: $0/mes · Stack 100% gratuito

---

## Índice

1. [Visión general](#1-visión-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Arquitectura del sistema](#3-arquitectura-del-sistema)
4. [Módulos por red social](#4-módulos-por-red-social)
5. [Sistema de caducidad de contenido](#5-sistema-de-caducidad-de-contenido)
6. [Integración con Google Drive](#6-integración-con-google-drive)
7. [Base de datos — esquema completo](#7-base-de-datos--esquema-completo)
8. [API — endpoints principales](#8-api--endpoints-principales)
9. [Shortlink y motor de redirección](#9-shortlink-y-motor-de-redirección)
10. [Autenticación](#10-autenticación)
11. [Notificaciones de caducidad](#11-notificaciones-de-caducidad)
12. [Plan de fases](#12-plan-de-fases)
13. [Límites de los tiers gratuitos](#13-límites-de-los-tiers-gratuitos)
14. [Estructura del repositorio](#14-estructura-del-repositorio)
15. [Variables de entorno](#15-variables-de-entorno)

---

## 1. Visión general

Una aplicación web que permite a usuarios crear códigos QR con **contenido dinámico y configurable**, donde el QR físico nunca cambia pero el destino puede actualizarse o expirar automáticamente.

### Principios de diseño

- **Costo $0**: todos los servicios usan tiers gratuitos permanentes.
- **QR estático, contenido dinámico**: el código QR impreso siempre apunta al mismo shortlink; lo que cambia es el destino.
- **Caducidad configurable**: el contenido puede expirar por fecha, cantidad de escaneos o manualmente.
- **Multi-plataforma**: soporte nativo para WhatsApp, Instagram, Telegram, X/Twitter, LinkedIn y URLs genéricas.
- **Almacenamiento en Google Drive**: imágenes, PDFs y archivos usando los 15 GB gratuitos de cada usuario.

---

## 2. Stack tecnológico

### Frontend

| Tecnología | Versión | Rol | Costo |
|---|---|---|---|
| React | 18+ | UI principal | $0 |
| Vite | 5+ | Build tool | $0 |
| Tailwind CSS | 3+ | Estilos | $0 |
| qr-code-styling | 1.6+ | Motor QR (MIT) | $0 |
| GitHub Pages | — | Hosting frontend | $0 |

### Backend

| Tecnología | Versión | Rol | Costo |
|---|---|---|---|
| Supabase Edge Functions | — | API serverless (Deno) | $0 |
| Supabase Postgres | 15+ | Base de datos | $0 |
| Supabase Auth | — | Autenticación OAuth | $0 |
| Supabase Storage | — | Backup de QRs generados | $0 |

### Infraestructura

| Servicio | Rol | Límite gratuito |
|---|---|---|
| Cloudflare Workers | Shortlinks + redirección dinámica | 100.000 req/día |
| Google Drive API v3 | Almacenamiento de archivos | 15 GB por cuenta |
| GitHub Actions | Cron job de caducidad | 2.000 min/mes |
| Resend | Emails de notificación | 3.000 emails/mes |

### Librería QR — `qr-code-styling`

Elegida por ser la más completa del ecosistema open source:

- Generación en PNG, SVG y Canvas
- Soporte para logo/imagen al centro
- Personalización de colores, formas de módulos y esquinas
- Licencia MIT — sin restricciones comerciales

```bash
npm install qr-code-styling
```

---

## 3. Arquitectura del sistema

```
Usuario
  │
  ▼
React + Vite (GitHub Pages)
  │
  ├── Google OAuth (Supabase Auth)
  │
  ├── Supabase Edge Functions (API REST)
  │     ├── POST /qr          → crea QR + shortlink
  │     ├── GET  /qr/:id      → datos del QR
  │     ├── PUT  /qr/:id      → actualiza destino
  │     └── DELETE /qr/:id   → elimina QR
  │
  ├── Supabase Postgres
  │     ├── tabla: qr_codes
  │     ├── tabla: qr_scans
  │     └── tabla: users
  │
  ├── Google Drive API
  │     └── Carpeta: /QRApp/{user_id}/
  │
  └── Cloudflare Worker
        └── qr.tudominio.workers.dev/q/:slug
              ├── Consulta Supabase
              ├── Verifica caducidad
              └── Redirige o muestra página de expirado
              
GitHub Actions (cron diario 00:00 UTC)
  └── Marca QRs vencidos → status = 'expired'
  └── Envía email de notificación vía Resend
```

### Flujo de un escaneo

```
Escaneo del QR físico
  │
  ▼
Cloudflare Worker recibe GET /q/abc123
  │
  ▼
Consulta Supabase: SELECT * FROM qr_codes WHERE slug = 'abc123'
  │
  ├── status = 'expired'   → HTTP 302 → /expired?id=abc123
  ├── expires_at < now()   → marca expired → HTTP 302 → /expired
  ├── scan_count >= max_scans → marca expired → HTTP 302 → /expired
  └── activo               → registra escaneo → HTTP 302 → destino
```

---

## 4. Módulos por red social

### WhatsApp

Genera un enlace `wa.me` con mensaje prellenado opcional.

```
URL generada: https://wa.me/549XXXXXXXXXX?text=Hola%2C%20me%20contacto%20desde%20el%20QR

Campos configurables:
  - Número de teléfono (con código de país)
  - Mensaje predefinido (opcional)
  - Nombre de contacto (solo informativo)
```

### Instagram

```
URL generada: https://instagram.com/{usuario}
              https://instagram.com/p/{post_id}

Modos:
  - Perfil de usuario
  - Post específico
  - Reel específico
```

### Telegram

```
URL generada: https://t.me/{usuario}
              https://t.me/+{invite_hash}

Modos:
  - Usuario o bot
  - Grupo (por invite link)
  - Canal público
```

### X / Twitter

```
URL generada: https://twitter.com/{usuario}
              https://twitter.com/intent/tweet?text={texto}&url={url}

Modos:
  - Perfil de usuario
  - Tweet con texto prellenado
  - Tweet con URL adjunta
```

### LinkedIn

```
URL generada: https://linkedin.com/in/{usuario}
              https://linkedin.com/company/{empresa}

Modos:
  - Perfil personal
  - Página de empresa
```

### URL genérica / Google Drive

```
URL generada: shortlink propio → cualquier URL

Casos de uso:
  - PDF en Google Drive (link público)
  - Imagen en Google Drive
  - Formulario de Google
  - Cualquier sitio web
```

---

## 5. Sistema de caducidad de contenido

### Tipos de caducidad

| Tipo | Descripción | Campo en DB |
|---|---|---|
| Por fecha y hora | Expira en un momento exacto | `expires_at TIMESTAMP` |
| Por escaneos | Expira luego de N escaneos | `max_scans INTEGER` |
| Combinada | Lo que ocurra primero | `expires_at` + `max_scans` |
| Manual | El usuario lo desactiva | `status = 'paused'` |
| Sin caducidad | Activo indefinidamente | `expires_at = NULL` |

### Lógica de verificación (Cloudflare Worker)

```javascript
export default {
  async fetch(request, env) {
    const slug = new URL(request.url).pathname.split('/q/')[1];
    if (!slug) return new Response('Not found', { status: 404 });

    const { data: qr } = await fetch(
      `${env.SUPABASE_URL}/rest/v1/qr_codes?slug=eq.${slug}&select=*`,
      { headers: { apikey: env.SUPABASE_KEY, Authorization: `Bearer ${env.SUPABASE_KEY}` } }
    ).then(r => r.json()).then(rows => ({ data: rows[0] }));

    if (!qr) return Response.redirect(`${env.APP_URL}/404`, 302);

    const now = new Date();
    const expired =
      qr.status === 'expired' ||
      (qr.expires_at && new Date(qr.expires_at) < now) ||
      (qr.max_scans && qr.scan_count >= qr.max_scans);

    if (expired) {
      // Actualiza estado en background
      fetch(`${env.SUPABASE_URL}/rest/v1/qr_codes?id=eq.${qr.id}`, {
        method: 'PATCH',
        headers: { apikey: env.SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'expired' })
      });
      return Response.redirect(`${env.APP_URL}/expired?id=${qr.id}`, 302);
    }

    // Registra escaneo en background
    fetch(`${env.SUPABASE_URL}/rest/v1/qr_scans`, {
      method: 'POST',
      headers: { apikey: env.SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qr_id: qr.id,
        user_agent: request.headers.get('user-agent'),
        country: request.cf?.country || null,
        scanned_at: now.toISOString()
      })
    });

    return Response.redirect(qr.destination_url, 302);
  }
};
```

### Cron job de caducidad (GitHub Actions)

```yaml
# .github/workflows/expire-qr.yml
name: Expire QR codes

on:
  schedule:
    - cron: '0 0 * * *'   # diario a las 00:00 UTC
  workflow_dispatch:        # disparo manual también

jobs:
  expire:
    runs-on: ubuntu-latest
    steps:
      - name: Mark expired QRs
        run: |
          curl -X POST \
            "${{ secrets.SUPABASE_URL }}/rest/v1/rpc/expire_qr_codes" \
            -H "apikey: ${{ secrets.SUPABASE_SERVICE_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_KEY }}" \
            -H "Content-Type: application/json"

      - name: Send expiry notifications
        run: |
          curl -X POST \
            "${{ secrets.SUPABASE_URL }}/functions/v1/send-expiry-emails" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_KEY }}"
```

### Función SQL que ejecuta el cron

```sql
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
```

---

## 6. Integración con Google Drive

### Flujo de autenticación

```
Usuario hace login con Google (Supabase Auth)
  │
  └── Scope solicitado: https://www.googleapis.com/auth/drive.file
        (solo acceso a archivos creados por la app — no acceso completo al Drive)
```

### Subir archivo al Drive del usuario

```javascript
// supabase/functions/upload-to-drive/index.ts
import { serve } from 'https://deno.land/std/http/server.ts';

serve(async (req) => {
  const { file_base64, file_name, mime_type, access_token } = await req.json();

  // Crear carpeta QRApp si no existe
  const folderRes = await fetch(
    'https://www.googleapis.com/drive/v3/files?q=name%3D%22QRApp%22+and+mimeType%3D%22application%2Fvnd.google-apps.folder%22',
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  const { files } = await folderRes.json();
  
  let folderId = files[0]?.id;
  if (!folderId) {
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'QRApp', mimeType: 'application/vnd.google-apps.folder' })
    });
    folderId = (await createRes.json()).id;
  }

  // Subir archivo
  const metadata = { name: file_name, parents: [folderId] };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([Uint8Array.from(atob(file_base64), c => c.charCodeAt(0))], { type: mime_type }));

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink',
    { method: 'POST', headers: { Authorization: `Bearer ${access_token}` }, body: form }
  );
  const driveFile = await uploadRes.json();

  // Hacer público (cualquiera con el link puede ver)
  await fetch(`https://www.googleapis.com/drive/v3/files/${driveFile.id}/permissions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'reader', type: 'anyone' })
  });

  return new Response(JSON.stringify({
    file_id: driveFile.id,
    view_url: driveFile.webViewLink,
    direct_url: `https://drive.google.com/uc?id=${driveFile.id}`
  }), { headers: { 'Content-Type': 'application/json' } });
});
```

---

## 7. Base de datos — esquema completo

```sql
-- Tabla principal de QR codes
CREATE TABLE qr_codes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug            TEXT UNIQUE NOT NULL,          -- abc123 (6 chars aleatorios)
  name            TEXT NOT NULL,                 -- nombre del QR (para el panel)
  platform        TEXT NOT NULL,                 -- 'whatsapp' | 'instagram' | 'telegram' | 'twitter' | 'linkedin' | 'url'
  destination_url TEXT NOT NULL,                 -- URL de destino actual
  
  -- Caducidad
  status          TEXT DEFAULT 'active',         -- 'active' | 'expired' | 'paused'
  expires_at      TIMESTAMPTZ,                   -- NULL = sin caducidad por fecha
  max_scans       INTEGER,                       -- NULL = sin límite de escaneos
  scan_count      INTEGER DEFAULT 0,
  expired_at      TIMESTAMPTZ,                   -- cuando expiró efectivamente
  
  -- Personalización del QR
  qr_color        TEXT DEFAULT '#000000',
  qr_bg_color     TEXT DEFAULT '#FFFFFF',
  qr_style        TEXT DEFAULT 'square',         -- 'square' | 'dots' | 'rounded'
  qr_logo_url     TEXT,                          -- URL del logo central
  qr_image_url    TEXT,                          -- URL de la imagen PNG del QR generado
  
  -- Google Drive
  drive_file_id   TEXT,                          -- ID del archivo en Drive (si aplica)
  drive_url       TEXT,                          -- URL del archivo en Drive
  
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
  device_type TEXT                               -- 'mobile' | 'desktop' | 'tablet'
);

-- Índices para performance
CREATE INDEX idx_qr_codes_slug    ON qr_codes(slug);
CREATE INDEX idx_qr_codes_user    ON qr_codes(user_id);
CREATE INDEX idx_qr_codes_status  ON qr_codes(status);
CREATE INDEX idx_qr_scans_qr_id   ON qr_scans(qr_id);
CREATE INDEX idx_qr_scans_date    ON qr_scans(scanned_at DESC);

-- Row Level Security
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_qr_codes" ON qr_codes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_see_own_scans" ON qr_scans
  FOR SELECT USING (
    qr_id IN (SELECT id FROM qr_codes WHERE user_id = auth.uid())
  );

-- Trigger: actualiza scan_count automáticamente
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
```

---

## 8. API — endpoints principales

Todos implementados como Supabase Edge Functions (Deno).

### `POST /functions/v1/create-qr`

Crea un nuevo QR code con shortlink.

**Request:**
```json
{
  "name": "Mi QR de WhatsApp",
  "platform": "whatsapp",
  "phone": "5491123456789",
  "message": "Hola, me contacto desde tu QR",
  "expires_at": "2025-12-31T23:59:00Z",
  "max_scans": 500,
  "qr_color": "#25D366",
  "qr_style": "rounded"
}
```

**Response:**
```json
{
  "id": "uuid",
  "slug": "abc123",
  "shortlink": "https://qr.tudominio.workers.dev/q/abc123",
  "destination_url": "https://wa.me/5491123456789?text=...",
  "qr_image_base64": "data:image/png;base64,..."
}
```

### `PUT /functions/v1/update-qr/:id`

Actualiza el destino o la configuración sin cambiar el QR físico.

**Request:**
```json
{
  "destination_url": "https://instagram.com/nuevo_usuario",
  "expires_at": "2026-03-01T00:00:00Z"
}
```

### `GET /functions/v1/qr-stats/:id`

Devuelve métricas de escaneos.

**Response:**
```json
{
  "total_scans": 342,
  "today": 12,
  "this_week": 89,
  "by_country": { "AR": 210, "US": 80, "MX": 52 },
  "by_device": { "mobile": 290, "desktop": 52 },
  "timeline": [
    { "date": "2025-01-15", "scans": 34 }
  ]
}
```

### `DELETE /functions/v1/delete-qr/:id`

Elimina el QR y sus archivos asociados en Drive.

---

## 9. Shortlink y motor de redirección

El shortlink usa el formato `https://{slug}.workers.dev/q/{code}` o un dominio propio configurado en Cloudflare.

### Generación del slug

```javascript
// Genera un slug único de 6 caracteres
function generateSlug() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
```

### Página de contenido expirado

Al expirar, el Worker redirige a `/expired?id={qr_id}`. La app React muestra:

- Nombre del QR (si el propietario lo permite mostrar)
- Mensaje personalizable configurado al crear el QR
- Fecha en que expiró
- Botón de contacto alternativo (opcional)

---

## 10. Autenticación

### Configuración de Supabase Auth con Google OAuth

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Login con Google — solicita acceso a Drive
export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: 'https://www.googleapis.com/auth/drive.file',
      redirectTo: `${window.location.origin}/dashboard`
    }
  });
  if (error) throw error;
}

// Obtener el access token de Google (para Drive API)
export async function getGoogleAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.provider_token;  // token de Google Drive
}
```

### Scopes de Google solicitados

| Scope | Por qué es necesario |
|---|---|
| `drive.file` | Crear/leer archivos que la app creó — no acceso total al Drive |
| `email` | Identificar al usuario |
| `profile` | Nombre y foto de perfil |

---

## 11. Notificaciones de caducidad

### Email automático cuando un QR expira (Resend)

```typescript
// supabase/functions/send-expiry-emails/index.ts
import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async () => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_KEY')!);

  // QRs que expiraron en las últimas 24h y aún no notificados
  const { data: expiredQRs } = await supabase
    .from('qr_codes')
    .select('*, auth.users!inner(email)')
    .eq('status', 'expired')
    .gte('expired_at', new Date(Date.now() - 86400000).toISOString())
    .is('notified_at', null);

  for (const qr of expiredQRs ?? []) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'noreply@tudominio.com',
        to: qr.users.email,
        subject: `Tu QR "${qr.name}" ha expirado`,
        html: `
          <h2>Tu código QR ha expirado</h2>
          <p>El QR <strong>${qr.name}</strong> expiró el ${new Date(qr.expired_at).toLocaleDateString('es-AR')}.</p>
          <p>Podés reactivarlo o crear uno nuevo desde tu panel.</p>
          <a href="${Deno.env.get('APP_URL')}/dashboard">Ir al panel</a>
        `
      })
    });

    await supabase.from('qr_codes').update({ notified_at: new Date() }).eq('id', qr.id);
  }

  return new Response('OK');
});
```

---

## 12. Plan de fases

### Fase 1 — MVP (semanas 1–3)

**Objetivo:** QR funcional básico.

- [ ] Setup del repo en GitHub (monorepo: `/app` + `/functions` + `/worker`)
- [ ] Proyecto Supabase: tablas, RLS, Auth con Google
- [ ] Frontend React + Vite + Tailwind en GitHub Pages
- [ ] Integración `qr-code-styling`: generar QR, descargar PNG/SVG
- [ ] Módulo WhatsApp: formulario → URL `wa.me` → QR
- [ ] Módulo URL genérica
- [ ] Panel básico: lista de QRs del usuario

**Entregable:** usuario puede crear un QR de WhatsApp y descargarlo.

---

### Fase 2 — Caducidad + Drive (semanas 4–5)

**Objetivo:** el QR es dinámico y puede expirar.

- [ ] Cloudflare Worker deployado con lógica de redirección
- [ ] Shortlinks `qr.workers.dev/q/:slug`
- [ ] Formulario de caducidad: fecha, escaneos máximos, sin límite
- [ ] GitHub Actions cron con función SQL `expire_qr_codes()`
- [ ] Integración Google Drive API: subir archivos, obtener URL pública
- [ ] Módulo "Archivo Drive": sube PDF/imagen → QR apunta al archivo
- [ ] Página `/expired` personalizable

**Entregable:** QR con caducidad configurable y archivos en Drive.

---

### Fase 3 — Redes sociales + Analytics (semanas 6–7)

**Objetivo:** soporte completo de plataformas y métricas.

- [ ] Módulos Instagram, Telegram, X/Twitter, LinkedIn
- [ ] Registro de escaneos en tabla `qr_scans`
- [ ] Dashboard de analytics: escaneos por día, país, dispositivo
- [ ] Gráficos con Recharts (open source)
- [ ] Notificaciones por email con Resend al expirar
- [ ] Editor de QR: cambiar color, estilo, logo sin regenerar shortlink

**Entregable:** soporte completo multi-plataforma con métricas.

---

### Fase 4 — Pulido y producción (semana 8)

**Objetivo:** app estable y presentable.

- [ ] Dominio propio en Cloudflare (gratuito con el plan básico)
- [ ] PWA: instalable en móvil (manifest + service worker básico)
- [ ] Página de landing/marketing en GitHub Pages
- [ ] Tests E2E con Playwright (gratuito)
- [ ] README completo con instrucciones de deploy
- [ ] Rate limiting básico en el Worker (anti-abuse)

**Entregable:** app en producción, lista para usuarios reales.

---

## 13. Límites de los tiers gratuitos

| Servicio | Límite gratuito | Cuándo escalar |
|---|---|---|
| Supabase Postgres | 500 MB · 2 proyectos | ~100.000 QRs con analytics |
| Supabase Edge Functions | 500.000 invocaciones/mes | ~16.000 req/día |
| Supabase Auth | 50.000 usuarios activos | App con muchos usuarios |
| Google Drive | 15 GB por cuenta de usuario | Depende del usuario, no de la app |
| Cloudflare Workers | 100.000 req/día | ~3M escaneos/mes |
| GitHub Actions | 2.000 min/mes | Cron diario = ~30 min/mes (muy holgado) |
| Resend | 3.000 emails/mes | App con mucha actividad |
| GitHub Pages | 1 GB · 100 GB bandwidth/mes | Tráfico muy alto |

> Para una app con hasta 1.000 usuarios y 50.000 escaneos/mes, todos los límites son suficientes sin costo.

---

## 14. Estructura del repositorio

```
qr-dinamico/
├── app/                          # Frontend React + Vite
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QREditor/         # Editor visual del QR
│   │   │   ├── PlatformForms/    # WhatsApp, Instagram, etc.
│   │   │   ├── ExpiryConfig/     # Configuración de caducidad
│   │   │   └── Analytics/        # Dashboard de escaneos
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateQR.jsx
│   │   │   ├── EditQR.jsx
│   │   │   └── Expired.jsx       # Página de QR expirado
│   │   ├── lib/
│   │   │   ├── supabase.js
│   │   │   ├── drive.js
│   │   │   └── qr-generator.js
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── supabase/
│   ├── functions/
│   │   ├── create-qr/            # Edge Function: crear QR
│   │   ├── update-qr/            # Edge Function: actualizar QR
│   │   ├── qr-stats/             # Edge Function: analytics
│   │   ├── upload-to-drive/      # Edge Function: subir a Drive
│   │   └── send-expiry-emails/   # Edge Function: notificaciones
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── worker/                       # Cloudflare Worker
│   ├── src/
│   │   └── index.js              # Lógica de redirección
│   └── wrangler.toml             # Configuración Cloudflare
│
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml   # Deploy a GitHub Pages
│       └── expire-qr.yml         # Cron de caducidad
│
└── README.md
```

---

## 15. Variables de entorno

### Frontend (`app/.env`)

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_WORKER_URL=https://qr.tudominio.workers.dev
VITE_APP_URL=https://tuusuario.github.io/qr-dinamico
```

### Supabase Edge Functions

Configuradas en el dashboard de Supabase → Settings → Edge Functions:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...   # service_role key (solo en funciones, nunca en frontend)
RESEND_API_KEY=re_...
APP_URL=https://tuusuario.github.io/qr-dinamico
```

### Cloudflare Worker (`worker/wrangler.toml`)

```toml
name = "qr-redirect"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
APP_URL = "https://tuusuario.github.io/qr-dinamico"

# Secrets (se agregan con: wrangler secret put NOMBRE)
# SUPABASE_URL
# SUPABASE_KEY
```

### GitHub Actions Secrets

Configurados en el repositorio → Settings → Secrets:

```
SUPABASE_URL
SUPABASE_SERVICE_KEY
APP_URL
```

---

## Comandos de inicio rápido

```bash
# 1. Clonar y configurar
git clone https://github.com/tuusuario/qr-dinamico
cd qr-dinamico

# 2. Frontend
cd app
npm install
cp .env.example .env   # completar con tus keys de Supabase
npm run dev

# 3. Supabase (requiere Supabase CLI)
supabase login
supabase link --project-ref XXXX
supabase db push
supabase functions deploy

# 4. Cloudflare Worker (requiere wrangler CLI)
cd ../worker
npm install -g wrangler
wrangler login
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_KEY
wrangler deploy

# 5. GitHub Pages (automático al hacer push a main)
git push origin main
```

---

*Documentación generada para el proyecto QR Dinámico · Stack $0 · Última revisión: junio 2025*
