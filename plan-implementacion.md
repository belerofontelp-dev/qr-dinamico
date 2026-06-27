# Plan de Implementación — QR Dinámico con Caducidad

> Basado en el análisis de `qr-dinamico-plan.md` · Stack $0/mes · Junio 2026

---

## Índice

1. [Resumen del Proyecto](#1-resumen-del-proyecto)
2. [Arquitectura y Stack](#2-arquitectura-y-stack)
3. [Fase 0 — Setup Inicial](#3-fase-0--setup-inicial)
4. [Fase 1 — MVP: QR Funcional Básico](#4-fase-1--mvp-qr-funcional-básico)
5. [Fase 2 — Caducidad + Google Drive](#5-fase-2--caducidad--google-drive)
6. [Fase 3 — Redes Sociales + Analytics](#6-fase-3--redes-sociales--analytics)
7. [Fase 4 — Pulido y Producción](#7-fase-4--pulido-y-producción)
8. [Orden de Dependencias](#8-orden-de-dependencias)
9. [Inventario de Archivos](#9-inventario-de-archivos)
10. [Variables de Entorno](#10-variables-de-entorno)
11. [Comandos de Inicio Rápido](#11-comandos-de-inicio-rápido)
12. [Límites de los Tiers Gratuitos](#12-límites-de-los-tiers-gratuitos)

---

## 1. Resumen del Proyecto

App web que permite crear códigos QR con **contenido dinámico y configurable**, donde el QR físico nunca cambia pero el destino puede actualizarse o expirar automáticamente.

### Principios de Diseño

- **Costo $0**: todos los servicios usan tiers gratuitos permanentes.
- **QR estático, contenido dinámico**: el código QR impreso siempre apunta al mismo shortlink; lo que cambia es el destino.
- **Caducidad configurable**: el contenido puede expirar por fecha, cantidad de escaneos o manualmente.
- **Multi-plataforma**: soporte nativo para WhatsApp, Instagram, Telegram, X/Twitter, LinkedIn y URLs genéricas.
- **Almacenamiento en Google Drive**: imágenes, PDFs y archivos usando los 15 GB gratuitos de cada usuario.

### Flujo de un Escaneo

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

## 2. Arquitectura y Stack

### Diagrama de Arquitectura

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

### Frontend

| Tecnología | Versión | Rol | Costo |
|---|---|---|---|
| React | 18+ | UI principal | $0 |
| Vite | 5+ | Build tool | $0 |
| Tailwind CSS | 3+ | Estilos | $0 |
| qr-code-styling | 1.6+ | Motor QR (MIT) | $0 |
| Recharts | 2+ | Gráficos de analytics (MIT) | $0 |
| react-router-dom | 6+ | Routing SPA | $0 |
| GitHub Pages | — | Hosting frontend | $0 |

### Backend

| Tecnología | Versión | Rol | Costo |
|---|---|---|---|
| Supabase Edge Functions | — | API serverless (Deno) | $0 |
| Supabase Postgres | 15+ | Base de datos | $0 |
| Supabase Auth | — | Autenticación OAuth | $0 |
| Supabase Storage | — | Backup de QRs generados | $0 |

### Infraestructura

| Servicio | Rol | Límite Gratuito |
|---|---|---|
| Cloudflare Workers | Shortlinks + redirección dinámica | 100.000 req/día |
| Google Drive API v3 | Almacenamiento de archivos | 15 GB por cuenta |
| GitHub Actions | Cron job de caducidad | 2.000 min/mes |
| Resend | Emails de notificación | 3.000 emails/mes |

---

## 3. Fase 0 — Setup Inicial

**Tiempo estimado:** 2-3 días  
**Objetivo:** Tener todas las cuentas, credenciales y proyecto base configurado.

### 3.1 Cuentas y Servicios

| # | Tarea | Detalle | Verificación |
|---|-------|---------|-------------|
| 0.1 | Crear repo GitHub `qr-dinamico` | Repo público o privado. Mono-repo con estructura de directorios definida en §9. | `git clone` funciona |
| 0.2 | Crear proyecto Supabase | Ir a [supabase.com](https://supabase.com) → New Project → Región más cercana. Guardar `URL` y claves. | Dashboard accesible |
| 0.3 | Configurar Supabase Auth → Google | En Supabase Dashboard → Authentication → Providers → Google: habilitar, Client ID y Secret desde Google Cloud Console. | Login redirect funciona |
| 0.4 | Crear proyecto Google Cloud | Habilitar Google Drive API v3, crear OAuth 2.0 consent screen, credenciales OAuth. Scopes: `drive.file`, `email`, `profile`. | Token de Google obtenible |
| 0.5 | Configurar Cloudflare Workers | Crear cuenta en [cloudflare.com](https://cloudflare.com) → Workers & Pages → Crear Worker. Instalar `wrangler` CLI. | `wrangler whoami` funciona |
| 0.6 | Registrar cuenta Resend | Ir a [resend.com](https://resend.com) → Sign Up → Verificar dominio de envío. Guardar API Key. | Email de prueba enviado |
| 0.7 | Instalar herramientas CLI | Node.js 18+, npm, Supabase CLI (`npm i -g supabase`), Wrangler CLI (`npm i -g wrangler`). | `node -v`, `supabase -v`, `wrangler -v` |

### 3.2 Estructura de Directorios

```
qr-dinamico/
├── app/                          # Frontend React + Vite
│   ├── public/
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── QREditor/         # Editor visual del QR
│   │   │   │   ├── QRPreview.jsx
│   │   │   │   └── QRStyleEditor.jsx
│   │   │   ├── PlatformForms/    # Formularios por red social
│   │   │   │   ├── WhatsAppForm.jsx
│   │   │   │   ├── InstagramForm.jsx
│   │   │   │   ├── TelegramForm.jsx
│   │   │   │   ├── TwitterForm.jsx
│   │   │   │   ├── LinkedInForm.jsx
│   │   │   │   ├── UrlForm.jsx
│   │   │   │   └── DriveForm.jsx
│   │   │   ├── ExpiryConfig/     # Configuración de caducidad
│   │   │   │   └── ExpiryConfig.jsx
│   │   │   ├── Analytics/        # Dashboard de escaneos
│   │   │   │   └── AnalyticsDashboard.jsx
│   │   │   └── Layout/           # Layout compartido
│   │   │       ├── Header.jsx
│   │   │       └── Sidebar.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx       # Página de marketing
│   │   │   ├── Login.jsx         # Login con Google
│   │   │   ├── Dashboard.jsx     # Panel de QRs del usuario
│   │   │   ├── CreateQR.jsx      # Crear nuevo QR
│   │   │   ├── EditQR.jsx        # Editar QR existente
│   │   │   └── Expired.jsx       # Página de QR expirado
│   │   ├── lib/
│   │   │   ├── supabase.js       # Cliente de Supabase
│   │   │   ├── drive.js          # Helpers de Google Drive
│   │   │   └── qr-generator.js   # Wrapper de qr-code-styling
│   │   ├── hooks/
│   │   │   ├── useAuth.js        # Hook de autenticación
│   │   │   └── useQR.js          # Hook de operaciones CRUD
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── supabase/
│   ├── functions/
│   │   ├── create-qr/
│   │   │   └── index.ts
│   │   ├── update-qr/
│   │   │   └── index.ts
│   │   ├── delete-qr/
│   │   │   └── index.ts
│   │   ├── qr-stats/
│   │   │   └── index.ts
│   │   ├── upload-to-drive/
│   │   │   └── index.ts
│   │   └── send-expiry-emails/
│   │       └── index.ts
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

## 4. Fase 1 — MVP: QR Funcional Básico

**Tiempo estimado:** 3 semanas  
**Objetivo:** Usuario puede registrarse, crear un QR de WhatsApp/URL y descargarlo.

### 4.1 Setup del Frontend

| # | Tarea | Archivo(s) | Descripción |
|---|-------|-----------|-------------|
| 1.1 | Crear proyecto Vite | `app/` | `npm create vite@latest app -- --template react` |
| 1.2 | Instalar dependencias | `app/package.json` | `npm install @supabase/supabase-js qr-code-styling react-router-dom recharts`. `npm install -D tailwindcss @tailwindcss/vite` |
| 1.3 | Configurar Tailwind | `app/tailwind.config.js`, `app/postcss.config.js`, `app/src/index.css` | `@tailwind base; @tailwind components; @tailwind utilities;` |
| 1.4 | Configurar Vite | `app/vite.config.js` | `base: '/qr-dinamico/'` para GitHub Pages. Plugin `@tailwindcss/vite`. |
| 1.5 | Crear cliente Supabase | `app/src/lib/supabase.js` | `createClient(url, anonKey)` con persistencia de sesión |
| 1.6 | Configurar routing | `app/src/App.jsx` | `BrowserRouter` con rutas: `/`, `/login`, `/dashboard`, `/create`, `/edit/:id`, `/expired` |
| 1.7 | Variables de entorno | `app/.env` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_WORKER_URL`, `VITE_APP_URL` |

#### `app/package.json` — Dependencias

```json
{
  "name": "qr-dinamico",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "qr-code-styling": "^1.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "recharts": "^2.10.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^4.0.0",
    "vite": "^5.0.0"
  }
}
```

#### `app/src/lib/supabase.js`

```javascript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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

export async function logout() {
  await supabase.auth.signOut();
}

export async function getGoogleAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.provider_token;
}
```

### 4.2 Base de Datos

| # | Tarea | Archivo(s) | Descripción |
|---|-------|-----------|-------------|
| 2.1 | Crear migración inicial | `supabase/migrations/001_initial_schema.sql` | Ejecutar schema completo (ver abajo). |
| 2.2 | Aplicar migración | — | `supabase db push` o copiar SQL en Supabase SQL Editor. |
| 2.3 | Verificar RLS | Supabase Dashboard → Table Editor | Confirmar políticas `users_own_qr_codes` y `users_see_own_scans` activas. |

#### `supabase/migrations/001_initial_schema.sql`

```sql
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

-- Función SQL para cron de caducidad
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

### 4.3 Edge Function: Crear QR

| # | Tarea | Archivo | Descripción |
|---|-------|---------|-------------|
| 3.1 | Crear Edge Function | `supabase/functions/create-qr/index.ts` | POST: valida input, genera slug, inserta en DB, retorna QR data. |
| 3.2 | Desplegar | — | `supabase functions deploy create-qr` |

#### `supabase/functions/create-qr/index.ts`

```typescript
import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

function generateSlug(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function buildDestinationUrl(platform: string, config: Record<string, string>): string {
  switch (platform) {
    case 'whatsapp':
      const waBase = `https://wa.me/${config.phone}`;
      return config.message ? `${waBase}?text=${encodeURIComponent(config.message)}` : waBase;
    case 'instagram':
      return config.mode === 'post'
        ? `https://instagram.com/p/${config.post_id}`
        : `https://instagram.com/${config.username}`;
    case 'telegram':
      return config.mode === 'invite'
        ? `https://t.me/+${config.invite_hash}`
        : `https://t.me/${config.username}`;
    case 'twitter':
      return config.mode === 'tweet'
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(config.text || '')}${config.url ? `&url=${encodeURIComponent(config.url)}` : ''}`
        : `https://twitter.com/${config.username}`;
    case 'linkedin':
      return config.mode === 'company'
        ? `https://linkedin.com/company/${config.company}`
        : `https://linkedin.com/in/${config.username}`;
    case 'url':
    default:
      return config.url;
  }
}

serve(async (req) => {
  if (req.method !== 'POST') {
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

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (authError || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { name, platform, ...config } = body;

  if (!name || !platform) {
    return new Response(JSON.stringify({ error: 'name and platform are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const destination_url = buildDestinationUrl(platform, config);

  // Generar slug único
  let slug: string;
  let exists = true;
  while (exists) {
    slug = generateSlug();
    const { data } = await supabase.from('qr_codes').select('id').eq('slug', slug).single();
    exists = !!data;
  }

  const { data: qr, error: insertError } = await supabase
    .from('qr_codes')
    .insert({
      user_id: user.id,
      slug,
      name,
      platform,
      destination_url,
      expires_at: body.expires_at || null,
      max_scans: body.max_scans || null,
      qr_color: body.qr_color || '#000000',
      qr_bg_color: body.qr_bg_color || '#FFFFFF',
      qr_style: body.qr_style || 'square',
      status: 'active'
    })
    .select()
    .single();

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const workerUrl = Deno.env.get('WORKER_URL') || 'https://qr.tudominio.workers.dev';

  return new Response(JSON.stringify({
    id: qr.id,
    slug: qr.slug,
    shortlink: `${workerUrl}/q/${qr.slug}`,
    destination_url: qr.destination_url,
    platform: qr.platform,
    qr_color: qr.qr_color,
    qr_bg_color: qr.qr_bg_color,
    qr_style: qr.qr_style,
    created_at: qr.created_at
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### 4.4 Librería QR y Componentes UI

| # | Tarea | Archivo(s) | Descripción |
|---|-------|-----------|-------------|
| 4.1 | Wrapper QR | `app/src/lib/qr-generator.js` | Funciones exportadas: `generateQRCode(options)` retorna instancia de `QRCodeStyling`. `downloadQRPNG(qrCode, filename)`, `downloadQRSVG(qrCode, filename)`, `getQRDataURL(qrCode)`. |
| 4.2 | QRPreview | `app/src/components/QREditor/QRPreview.jsx` | Recibe `slug`, `shortlink`, `qrColor`, `qrBgColor`, `qrStyle`. Renderiza canvas con QR. Botones descarga PNG/SVG. |
| 4.3 | WhatsAppForm | `app/src/components/PlatformForms/WhatsAppForm.jsx` | Inputs: número (con código de país), mensaje predefinido. |
| 4.4 | UrlForm | `app/src/components/PlatformForms/UrlForm.jsx` | Input: URL destino. Validación de formato. |
| 4.5 | CreateQR page | `app/src/pages/CreateQR.jsx` | Selector de plataforma → renderiza formulario correspondiente. Botón submit → llama a Edge Function. Muestra QR generado. |
| 4.6 | Login page | `app/src/pages/Login.jsx` | Botón "Iniciar sesión con Google" llamando a `loginWithGoogle()`. |
| 4.7 | Dashboard page | `app/src/pages/Dashboard.jsx` | Carga QRs del usuario desde Supabase. Tabla/grilla con: nombre, plataforma, shortlink, status, escaneos. Acciones: copiar link, editar, eliminar. |

### 4.5 Hooks Personalizados

| # | Tarea | Archivo | Descripción |
|---|-------|---------|-------------|
| 5.1 | useAuth | `app/src/hooks/useAuth.js` | `const { user, loading } = useAuth()`. Se suscribe a `supabase.auth.onAuthStateChange`. Redirige a `/login` si no autenticado. |
| 5.2 | useQR | `app/src/hooks/useQR.js` | `const { qrCodes, loading, createQR, updateQR, deleteQR } = useQR()`. CRUD encapsulado. |

### 4.6 Deploy del Frontend

| # | Tarea | Archivo | Descripción |
|---|-------|---------|-------------|
| 6.1 | GitHub Action | `.github/workflows/deploy-frontend.yml` | Triggers: push a `main`. Build Vite → deploy a `gh-pages`. |
| 6.2 | Configurar GitHub Pages | Settings → Pages → Source: `gh-pages` branch. | Accesible en `https://{user}.github.io/qr-dinamico`. |

#### `.github/workflows/deploy-frontend.yml`

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'app/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: app
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          VITE_WORKER_URL: ${{ vars.WORKER_URL }}
          VITE_APP_URL: ${{ vars.APP_URL }}
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: app/dist
```

**Entregable Fase 1:** Usuario hace login con Google, crea QR de WhatsApp/URL, lo descarga como PNG/SVG, ve lista en dashboard. Deploy automático en GitHub Pages.

---

## 5. Fase 2 — Caducidad + Google Drive

**Tiempo estimado:** 2 semanas  
**Objetivo:** El QR es dinámico y puede expirar. Archivos en Drive.

### 5.1 Cloudflare Worker (Motor de Redirección)

| # | Tarea | Archivo | Descripción |
|---|-------|---------|-------------|
| 7.1 | Configurar wrangler | `worker/wrangler.toml` | Nombre, main, compatibility_date, vars (`APP_URL`), secrets (`SUPABASE_URL`, `SUPABASE_KEY`). |
| 7.2 | Implementar Worker | `worker/src/index.js` | Recibe `GET /q/:slug`, consulta Supabase, verifica caducidad (status, fecha, escaneos), redirige o muestra `/expired`, registra escaneo en background. |
| 7.3 | Configurar secrets | CLI | `wrangler secret put SUPABASE_URL`, `wrangler secret put SUPABASE_KEY`. |
| 7.4 | Deploy Worker | CLI | `wrangler deploy`. Verificar `https://qr.{subdomain}.workers.dev/q/test`. |

#### `worker/src/index.js`

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const slug = url.pathname.split('/q/')[1];
    if (!slug) return new Response('Not found', { status: 404 });

    const { data: qr } = await fetch(
      `${env.SUPABASE_URL}/rest/v1/qr_codes?slug=eq.${slug}&select=*`,
      {
        headers: {
          apikey: env.SUPABASE_KEY,
          Authorization: `Bearer ${env.SUPABASE_KEY}`
        }
      }
    ).then(res => res.json()).then(rows => ({ data: rows?.[0] || null }));

    if (!qr) return Response.redirect(`${env.APP_URL}/404`, 302);

    const now = new Date();
    const expired =
      qr.status === 'expired' ||
      (qr.expires_at && new Date(qr.expires_at) < now) ||
      (qr.max_scans && qr.scan_count >= qr.max_scans);

    if (expired) {
      // Marcar como expired en background
      fetch(`${env.SUPABASE_URL}/rest/v1/qr_codes?id=eq.${qr.id}`, {
        method: 'PATCH',
        headers: {
          apikey: env.SUPABASE_KEY,
          Authorization: `Bearer ${env.SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'expired', expired_at: now.toISOString() })
      });
      return Response.redirect(`${env.APP_URL}/expired?id=${qr.id}`, 302);
    }

    // Registrar escaneo en background
    fetch(`${env.SUPABASE_URL}/rest/v1/qr_scans`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_KEY,
        Authorization: `Bearer ${env.SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        qr_id: qr.id,
        user_agent: request.headers.get('user-agent'),
        country: request.cf?.country || null,
        city: request.cf?.city || null,
        scanned_at: now.toISOString()
      })
    });

    return Response.redirect(qr.destination_url, 302);
  }
};
```

#### `worker/wrangler.toml`

```toml
name = "qr-redirect"
main = "src/index.js"
compatibility_date = "2025-01-01"

[vars]
APP_URL = "https://tuusuario.github.io/qr-dinamico"
```

### 5.2 Formulario de Caducidad

| # | Tarea | Archivo | Descripción |
|---|-------|---------|-------------|
| 8.1 | ExpiryConfig | `app/src/components/ExpiryConfig/ExpiryConfig.jsx` | 4 opciones (radio): Sin caducidad, Por fecha, Por escaneos, Combinado. Inputs condicionales: datetime-local para fecha, number para max_scans. |

### 5.3 Google Drive Integration

| # | Tarea | Archivo | Descripción |
|---|-------|---------|-------------|
| 9.1 | Edge Function upload-to-drive | `supabase/functions/upload-to-drive/index.ts` | POST: recibe `access_token`, `file_base64`, `file_name`, `mime_type`. Crea carpeta `QRApp`, sube archivo, hace público, retorna `file_id`, `direct_url`. |
| 9.2 | Helpers Drive | `app/src/lib/drive.js` | `uploadToDrive(file, accessToken)`, `deleteFromDrive(fileId, accessToken)`. |
| 9.3 | DriveForm | `app/src/components/PlatformForms/DriveForm.jsx` | File picker, preview, upload progress, QR generado apunta al archivo. |

#### `supabase/functions/upload-to-drive/index.ts`

```typescript
import { serve } from 'https://deno.land/std/http/server.ts';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { file_base64, file_name, mime_type, access_token } = await req.json();

  // Encontrar o crear carpeta QRApp
  const folderRes = await fetch(
    "https://www.googleapis.com/drive/v3/files?q=name%3D'QRApp'+and+mimeType%3D'application%2Fvnd.google-apps.folder'+and+trashed%3Dfalse&fields=files(id)&pageSize=1",
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  const { files } = await folderRes.json();

  let folderId = files?.[0]?.id;
  if (!folderId) {
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'QRApp',
        mimeType: 'application/vnd.google-apps.folder'
      })
    });
    const created = await createRes.json();
    folderId = created.id;
  }

  // Subir archivo con multipart
  const boundary = '----qrboundary';
  const decoder = new TextDecoder();
  const binary = Uint8Array.from(atob(file_base64), c => c.charCodeAt(0));

  const metadata = JSON.stringify({ name: file_name, parents: [folderId] });
  const bodyParts = [
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`,
    `--${boundary}\r\nContent-Type: ${mime_type}\r\nContent-Transfer-Encoding: base64\r\n\r\n${file_base64}\r\n`,
    `--${boundary}--`
  ].join('');

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: bodyParts
    }
  );
  const driveFile = await uploadRes.json();

  // Hacer público (cualquiera con el link puede ver)
  await fetch(
    `https://www.googleapis.com/drive/v3/files/${driveFile.id}/permissions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'reader', type: 'anyone' })
    }
  );

  return new Response(JSON.stringify({
    file_id: driveFile.id,
    view_url: driveFile.webViewLink,
    direct_url: `https://drive.google.com/uc?id=${driveFile.id}&export=download`
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### 5.4 Cron de Caducidad (GitHub Actions)

| # | Tarea | Archivo | Descripción |
|---|-------|---------|-------------|
| 10.1 | Workflow expire-qr | `.github/workflows/expire-qr.yml` | Cron diario 00:00 UTC + disparo manual. Llama RPC `expire_qr_codes`, luego Edge Function `send-expiry-emails`. |

#### `.github/workflows/expire-qr.yml`

```yaml
name: Expire QR Codes

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  expire:
    runs-on: ubuntu-latest
    steps:
      - name: Mark expired QRs
        run: |
          curl -s -X POST \
            "${{ secrets.SUPABASE_URL }}/rest/v1/rpc/expire_qr_codes" \
            -H "apikey: ${{ secrets.SUPABASE_SERVICE_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_KEY }}" \
            -H "Content-Type: application/json"

      - name: Send expiry notifications
        run: |
          curl -s -X POST \
            "${{ secrets.SUPABASE_URL }}/functions/v1/send-expiry-emails" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_KEY }}"
```

### 5.5 Página de Expirado

| # | Tarea | Archivo | Descripción |
|---|-------|---------|-------------|
| 11.1 | Expired page | `app/src/pages/Expired.jsx` | Lee `?id=` de la URL. Muestra: nombre del QR, fecha de expiración, mensaje personalizado, botón de contacto alternativo (opcional, configurado al crear QR). |

### 5.6 Edge Functions Adicionales

| # | Tarea | Archivo | Descripción |
|---|-------|---------|-------------|
| 12.1 | update-qr | `supabase/functions/update-qr/index.ts` | PUT: actualiza `destination_url`, `expires_at`, `max_scans`, `status`, colores, estilo. |
| 12.2 | delete-qr | `supabase/functions/delete-qr/index.ts` | DELETE: elimina registro en DB. Si tiene `drive_file_id`, borra archivo en Drive con token del usuario. |

**Entregable Fase 2:** QR con caducidad configurable (fecha + escaneos), shortlinks funcionales vía Cloudflare Worker, archivos en Google Drive, página de expirado, cron job funcionando.

---

## 6. Fase 3 — Redes Sociales + Analytics

**Tiempo estimado:** 2 semanas  
**Objetivo:** Soporte completo multi-plataforma, métricas y notificaciones.

### 6.1 Módulos de Plataformas Faltantes

| # | Tarea | Archivo | Descripción |
|---|-------|---------|-------------|
| 13.1 | InstagramForm | `app/src/components/PlatformForms/InstagramForm.jsx` | Selector: perfil (username) / post (post_id) / reel (reel_id). |
| 13.2 | TelegramForm | `app/src/components/PlatformForms/TelegramForm.jsx` | Selector: usuario (username) / grupo (invite_hash) / canal (channel). |
| 13.3 | TwitterForm | `app/src/components/PlatformForms/TwitterForm.jsx` | Selector: perfil (username) / tweet prellenado (text + url opcional). |
| 13.4 | LinkedInForm | `app/src/components/PlatformForms/LinkedInForm.jsx` | Selector: perfil (username) / empresa (company name). |

### 6.2 Analytics Dashboard

| # | Tarea | Archivo | Descripción |
|---|-------|---------|-------------|
| 14.1 | qr-stats Edge Function | `supabase/functions/qr-stats/index.ts` | GET: agrega datos de `qr_scans`. Respuesta: `total_scans`, `today`, `this_week`, `by_country`, `by_device`, `timeline`. |
| 14.2 | AnalyticsDashboard | `app/src/components/Analytics/AnalyticsDashboard.jsx` | Componente con 4 gráficos usando Recharts: línea (escaneos por día), barras (por país), pie chart (por dispositivo), KPI cards (total, hoy, semana). |
| 14.3 | Integrar en EditQR | `app/src/pages/EditQR.jsx` | Dos pestañas: "Configuración" (formulario de edición) y "Estadísticas" (AnalyticsDashboard). |

#### `supabase/functions/qr-stats/index.ts`

```typescript
import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  const url = new URL(req.url);
  const qrId = url.searchParams.get('qr_id');

  if (!qrId) {
    return new Response(JSON.stringify({ error: 'qr_id is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_KEY')!
  );

  // Total scans
  const { count: total_scans } = await supabase
    .from('qr_scans')
    .select('*', { count: 'exact', head: true })
    .eq('qr_id', qrId);

  // Today
  const today = new Date().toISOString().split('T')[0];
  const { count: today_scans } = await supabase
    .from('qr_scans')
    .select('*', { count: 'exact', head: true })
    .eq('qr_id', qrId)
    .gte('scanned_at', today);

  // This week
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const { count: week_scans } = await supabase
    .from('qr_scans')
    .select('*', { count: 'exact', head: true })
    .eq('qr_id', qrId)
    .gte('scanned_at', weekAgo);

  // By country
  const { data: byCountry } = await supabase
    .rpc('get_scans_by_country', { qr_id_param: qrId });

  // Timeline (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data: timeline } = await supabase
    .from('qr_scans')
    .select('scanned_at')
    .eq('qr_id', qrId)
    .gte('scanned_at', thirtyDaysAgo)
    .order('scanned_at', { ascending: true });

  // Agrupar por día
  const timelineMap = new Map();
  for (const scan of timeline ?? []) {
    const day = new Date(scan.scanned_at).toISOString().split('T')[0];
    timelineMap.set(day, (timelineMap.get(day) || 0) + 1);
  }
  const timelineData = Array.from(timelineMap.entries()).map(([date, scans]) => ({ date, scans }));

  return new Response(JSON.stringify({
    total_scans: total_scans || 0,
    today: today_scans || 0,
    this_week: week_scans || 0,
    by_country: byCountry || [],
    timeline: timelineData
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### 6.3 Editor Visual de QR

| # | Tarea | Archivo | Descripción |
|---|-------|---------|-------------|
| 15.1 | QRStyleEditor | `app/src/components/QREditor/QRStyleEditor.jsx` | Color pickers (foreground/background), selector de estilo (square/dots/rounded), upload de logo central (a Supabase Storage). Preview en vivo. |
| 15.2 | Integrar en CreateQR y EditQR | `app/src/pages/CreateQR.jsx`, `app/src/pages/EditQR.jsx` | Agregar QRStyleEditor en los formularios. |

### 6.4 Notificaciones por Email

| # | Tarea | Archivo | Descripción |
|---|-------|---------|-------------|
| 16.1 | send-expiry-emails | `supabase/functions/send-expiry-emails/index.ts` | Busca QRs expirados en últimas 24h sin notificar, envía email vía Resend con detalle del QR, marca `notified_at`. |
| 16.2 | Desplegar función | CLI | `supabase functions deploy send-expiry-emails` |

#### `supabase/functions/send-expiry-emails/index.ts`

```typescript
import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_KEY')!
  );

  const yesterday = new Date(Date.now() - 86400000).toISOString();

  const { data: expiredQRs } = await supabase
    .from('qr_codes')
    .select('id, name, expired_at, user_id')
    .eq('status', 'expired')
    .gte('expired_at', yesterday)
    .is('notified_at', null);

  for (const qr of expiredQRs ?? []) {
    // Obtener email del usuario
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
  }

  return new Response(JSON.stringify({ processed: expiredQRs?.length || 0 }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

**Entregable Fase 3:** Soporte multi-plataforma completo (WhatsApp, Instagram, Telegram, X/Twitter, LinkedIn, URL, Drive), dashboard de analytics con gráficos, editor visual de QR (colores, estilo, logo), notificaciones por email al expirar.

---

## 7. Fase 4 — Pulido y Producción

**Tiempo estimado:** 1 semana  
**Objetivo:** App estable, lista para usuarios reales.

| # | Tarea | Archivo(s) | Descripción |
|---|-------|-----------|-------------|
| 17.1 | Dominio propio | Cloudflare Dashboard | Configurar DNS: CNAME del worker a subdominio propio (ej. `qr.tudominio.com`). Actualizar `APP_URL` y `WORKER_URL` en todos los entornos. |
| 17.2 | PWA | `app/public/manifest.json`, `app/public/sw.js` | Manifest con íconos (192x192, 512x512). Service worker básico para cache offline y App Shell. |
| 17.3 | Landing page | `app/src/pages/Landing.jsx` | Hero, features (QR dinámico, caducidad, analytics, multi-plataforma), CTA "Crear QR". |
| 17.4 | Rate limiting | `worker/src/index.js` (modificar) | En Cloudflare Worker: track de IPs con KV, límite 100 req/min por IP. Retornar 429 si excede. |
| 17.5 | Tests E2E | `tests/` (Playwright) | Test: login → crear QR WhatsApp → escanear shortlink → verificar redirección `wa.me` → editar destino → verificar nuevo destino → expirar por fecha → verificar página expirado. |
| 17.6 | SEO | `app/index.html`, `app/public/robots.txt` | Meta tags (title, description, og:image). `robots.txt` disallow `/dashboard`, `/create`. Sitemap básico. |
| 17.7 | README | `README.md` | Badges, descripción, features, stack, instrucciones de deploy paso a paso. Link al plan. |
| 17.8 | Manejo de errores global | `app/src/App.jsx` | Error boundary. Toast notifications (react-hot-toast o similar) para acciones exitosas/fallidas. |
| 17.9 | Responsive final | Todos los componentes | Probar en mobile (< 640px), tablet (640-1024px), desktop (> 1024px). Ajustes Tailwind. |

**Entregable Fase 4:** App en producción con dominio propio, instalable como PWA, landing page atractiva, tests E2E, README completo.

---

## 8. Orden de Dependencias

```
Fase 0 (Setup)
  │
  └──► Fase 1 (MVP)
         │
         ├── 1.1 Setup Frontend ──┐
         ├── 1.2 Base de Datos ───┼── en paralelo
         └── 4.x UI Components ───┘
               │
               └──► 1.6 Deploy Frontend

Fase 1 completa
  │
  └──► Fase 2 (Caducidad + Drive)
         │
         ├── 5.1 Cloudflare Worker ── depende de DB (Fase 1)
         ├── 5.2 ExpiryConfig ── independiente
         ├── 5.3 Google Drive ── independiente
         ├── 5.4 Cron GitHub Actions ── depende de DB + Worker
         ├── 5.5 Página Expirado ── independiente
         └── 5.6 Edge Functions adicionales ── depende de DB

Fase 2 completa
  │
  └──► Fase 3 (Redes Sociales + Analytics)
         │
         ├── 6.1 PlatformForms ───┐
         ├── 6.2 Analytics ───────┤── en paralelo
         ├── 6.3 QRStyleEditor ───┤
         └── 6.4 Notificaciones ──┘

Fase 3 completa
  │
  └──► Fase 4 (Pulido y Producción)
         │
         └── Secuencial: PWA → Landing → Tests → SEO → README
```

---

## 9. Inventario de Archivos

### Total: ~44 archivos a crear/modificar

### Frontend (`app/`) — 25 archivos

| # | Archivo | Fase | Tipo |
|---|---------|------|------|
| 1 | `package.json` | 1 | Config |
| 2 | `vite.config.js` | 1 | Config |
| 3 | `tailwind.config.js` | 1 | Config |
| 4 | `postcss.config.js` | 1 | Config |
| 5 | `index.html` | 1 | HTML |
| 6 | `.env` | 1 | Config |
| 7 | `.env.example` | 1 | Config |
| 8 | `src/main.jsx` | 1 | Entry |
| 9 | `src/App.jsx` | 1 | Root |
| 10 | `src/index.css` | 1 | Styles |
| 11 | `src/lib/supabase.js` | 1 | Lib |
| 12 | `src/lib/qr-generator.js` | 1 | Lib |
| 13 | `src/lib/drive.js` | 2 | Lib |
| 14 | `src/hooks/useAuth.js` | 1 | Hook |
| 15 | `src/hooks/useQR.js` | 1 | Hook |
| 16 | `src/pages/Login.jsx` | 1 | Page |
| 17 | `src/pages/Dashboard.jsx` | 1 | Page |
| 18 | `src/pages/CreateQR.jsx` | 1 | Page |
| 19 | `src/pages/EditQR.jsx` | 3 | Page |
| 20 | `src/pages/Expired.jsx` | 2 | Page |
| 21 | `src/pages/Landing.jsx` | 4 | Page |
| 22 | `src/components/PlatformForms/WhatsAppForm.jsx` | 1 | Component |
| 23 | `src/components/PlatformForms/UrlForm.jsx` | 1 | Component |
| 24 | `src/components/PlatformForms/InstagramForm.jsx` | 3 | Component |
| 25 | `src/components/PlatformForms/TelegramForm.jsx` | 3 | Component |
| 26 | `src/components/PlatformForms/TwitterForm.jsx` | 3 | Component |
| 27 | `src/components/PlatformForms/LinkedInForm.jsx` | 3 | Component |
| 28 | `src/components/PlatformForms/DriveForm.jsx` | 2 | Component |
| 29 | `src/components/QREditor/QRPreview.jsx` | 1 | Component |
| 30 | `src/components/QREditor/QRStyleEditor.jsx` | 3 | Component |
| 31 | `src/components/ExpiryConfig/ExpiryConfig.jsx` | 2 | Component |
| 32 | `src/components/Analytics/AnalyticsDashboard.jsx` | 3 | Component |
| 33 | `public/manifest.json` | 4 | Static |
| 34 | `public/sw.js` | 4 | Static |
| 35 | `public/robots.txt` | 4 | Static |

### Supabase (`supabase/`) — 7 archivos

| # | Archivo | Fase | Tipo |
|---|---------|------|------|
| 36 | `migrations/001_initial_schema.sql` | 1 | SQL |
| 37 | `functions/create-qr/index.ts` | 1 | Edge Fn |
| 38 | `functions/update-qr/index.ts` | 2 | Edge Fn |
| 39 | `functions/delete-qr/index.ts` | 2 | Edge Fn |
| 40 | `functions/upload-to-drive/index.ts` | 2 | Edge Fn |
| 41 | `functions/qr-stats/index.ts` | 3 | Edge Fn |
| 42 | `functions/send-expiry-emails/index.ts` | 3 | Edge Fn |

### Worker (`worker/`) — 2 archivos

| # | Archivo | Fase | Tipo |
|---|---------|------|------|
| 43 | `wrangler.toml` | 2 | Config |
| 44 | `src/index.js` | 2 | Worker |

### GitHub Actions (`.github/workflows/`) — 2 archivos

| # | Archivo | Fase | Tipo |
|---|---------|------|------|
| 45 | `deploy-frontend.yml` | 1 | CI/CD |
| 46 | `expire-qr.yml` | 2 | Cron |

### Raíz — 1 archivo

| # | Archivo | Fase | Tipo |
|---|---------|------|------|
| 47 | `README.md` | 4 | Docs |

---

## 10. Variables de Entorno

### Frontend (`app/.env`)

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_WORKER_URL=https://qr.tudominio.workers.dev
VITE_APP_URL=https://tuusuario.github.io/qr-dinamico
```

### Supabase Edge Functions

Configuradas en **Supabase Dashboard → Settings → Edge Functions → Secrets**:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
RESEND_API_KEY=re_...
WORKER_URL=https://qr.tudominio.workers.dev
APP_URL=https://tuusuario.github.io/qr-dinamico
```

### Cloudflare Worker Secrets

```bash
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_KEY
```

### GitHub Actions Secrets

**Settings → Secrets and variables → Actions:**

```
SUPABASE_URL
SUPABASE_SERVICE_KEY
```

**Settings → Secrets and variables → Actions → Variables:**

```
WORKER_URL
APP_URL
```

---

## 11. Comandos de Inicio Rápido

### Desarrollo Local

```bash
# 1. Clonar
git clone https://github.com/tuusuario/qr-dinamico
cd qr-dinamico

# 2. Frontend
cd app
cp .env.example .env      # Completar con keys reales
npm install
npm run dev                # http://localhost:5173

# 3. Supabase
supabase login
supabase link --project-ref XXXX
supabase db push
supabase functions serve   # Servidor local de Edge Functions

# 4. Cloudflare Worker (test local)
cd ../worker
wrangler dev
```

### Deploy a Producción

```bash
# 1. Supabase — aplicar migraciones y deploy funciones
supabase db push
supabase functions deploy create-qr
supabase functions deploy update-qr
supabase functions deploy delete-qr
supabase functions deploy qr-stats
supabase functions deploy upload-to-drive
supabase functions deploy send-expiry-emails

# 2. Cloudflare Worker
cd worker
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_KEY
wrangler deploy

# 3. GitHub Pages (automático al hacer push a main)
git add . && git commit -m "Release v1.0.0" && git push origin main
```

---

## 12. Límites de los Tiers Gratuitos

| Servicio | Límite Gratuito | Cuándo Escalar |
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

## Tabla de Tipos de Caducidad

| Tipo | Descripción | Campo en DB |
|---|---|---|
| Por fecha y hora | Expira en un momento exacto | `expires_at TIMESTAMP` |
| Por escaneos | Expira luego de N escaneos | `max_scans INTEGER` |
| Combinada | Lo que ocurra primero | `expires_at` + `max_scans` |
| Manual | El usuario lo desactiva | `status = 'paused'` |
| Sin caducidad | Activo indefinidamente | `expires_at = NULL` |

---

## URLs de Redes Sociales Soportadas

| Plataforma | Formato de URL Generada |
|---|---|
| WhatsApp | `https://wa.me/{phone}?text={mensaje}` |
| Instagram | `https://instagram.com/{user}` o `/p/{post_id}` |
| Telegram | `https://t.me/{user}` o `/+{invite_hash}` |
| X/Twitter | `https://twitter.com/{user}` o `/intent/tweet?text=...` |
| LinkedIn | `https://linkedin.com/in/{user}` o `/company/{name}` |
| URL / Drive | Shortlink propio → cualquier URL o archivo Drive |

---

*Plan de implementación generado a partir de `qr-dinamico-plan.md` · Junio 2026*
