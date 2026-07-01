# QR Dinámico

Generador de códigos QR con contenido dinámico y caducidad configurable. El QR físico nunca cambia, pero el destino puede actualizarse o expirar automáticamente.

## Características

- **Multi-plataforma**: WhatsApp, Instagram, Telegram, X/Twitter, LinkedIn, URL genérica y Google Drive
- **Caducidad configurable**: por fecha, por cantidad de escaneos, combinada o manual
- **Shortlinks dinámicos** con Cloudflare Workers
- **Analytics**: gráficos de escaneos por día, país y dispositivo
- **Personalización visual**: colores, estilos y logo del QR
- **Google Drive**: almacenamiento de archivos con los 15 GB gratuitos por usuario
- **PWA**: instalable en dispositivos móviles
- **Notificaciones por email** al expirar un QR
- **Costo total: $0/mes** — todos los servicios usan tiers gratuitos

## Stack

| Capa | Tecnologías |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 4, qr-code-styling, Recharts |
| Backend | Supabase (Postgres, Auth, Edge Functions, Storage) |
| Infraestructura | Cloudflare Workers, GitHub Pages, GitHub Actions |
| APIs externas | Google Drive API v3, Resend (emails) |

## Inicio rápido

```bash
git clone https://github.com/belerofontelp-dev/qr-dinamico
cd qr-dinamico/app
cp .env.example .env
npm install
npm run dev
```

## Deploy

El deploy a GitHub Pages es automático al hacer push a `master`. Las Edge Functions de Supabase y el Cloudflare Worker requieren deploy manual:

```bash
# Supabase Edge Functions
supabase functions deploy create-qr
supabase functions deploy update-qr
supabase functions deploy delete-qr
supabase functions deploy qr-stats
supabase functions deploy upload-to-drive
supabase functions deploy send-expiry-emails

# Cloudflare Worker
cd worker
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_KEY
wrangler deploy
```

## Variables de entorno

```env
# app/.env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_WORKER_URL=https://qr.xxxx.workers.dev
VITE_APP_URL=https://usuario.github.io/qr-dinamico
```

## Límites gratuitos

| Servicio | Límite |
|---|---|
| Supabase | 500 MB, 500k Edge Functions/mes |
| Cloudflare Workers | 100k req/día |
| GitHub Pages | 1 GB, 100 GB bandwidth/mes |
| GitHub Actions | 2.000 min/mes |
| Google Drive | 15 GB por cuenta |
| Resend | 3.000 emails/mes |

## Documentación

- [Plan técnico](docs/qr-dinamico-plan.md)
- [Plan de implementación](docs/plan-implementacion.md)
