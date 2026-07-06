import {
  MessageCircle, Globe, Contact, Wifi, FileText,
  Image, Video, Music, Ticket, Building2,
  Smartphone, Link2, Menu
} from 'lucide-react';

function WhatsAppPreview({ data }) {
  const phone = data.phone || '123 456 789';
  const message = data.message || '';
  return (
    <div className="h-full flex flex-col bg-[#efeae2] relative overflow-hidden">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Header */}
      <div className="bg-[#075e54] px-3 py-2 flex items-center gap-2.5 shrink-0 relative z-10">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#dfe5e7] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#8a9a9e">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-white text-[13px] font-semibold leading-tight truncate">+{phone}</p>
            <p className="text-white/60 text-[10px]">en línea</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 p-3 flex flex-col justify-end gap-2 relative z-10">
        <div className="flex justify-end">
          <div className="bg-[#d9fdd3] rounded-lg rounded-tr-sm px-3 py-2 max-w-[85%] shadow-sm">
            <p className="text-[13px] text-[#111b21] leading-snug">
              {message || 'Escriba un mensaje.'}
            </p>
            <div className="flex items-center justify-end gap-1 mt-0.5">
              <p className="text-[10px] text-[#667781]">12:34</p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#53bdeb">
                <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="bg-[#f0f2f5] px-3 py-2 flex items-center gap-2 shrink-0 relative z-10">
        <div className="flex-1 bg-white rounded-full h-10 flex items-center px-4 gap-2">
          <span className="text-xl">😊</span>
          <p className="text-sm text-[#667781] flex-1">Mensaje</p>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#667781">
            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#667781">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
          </svg>
        </div>
        <div className="w-11 h-11 rounded-full bg-[#00a884] flex items-center justify-center shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function WebsitePreview({ data }) {
  const url = data.url || 'ejemplo.com';
  const displayUrl = url.replace(/^https?:\/\//, '');
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-[#f2f2f7] px-3 py-2 flex items-center gap-2 shrink-0 border-b border-[#d5d5d5]">
        <div className="w-5 h-5 rounded-full bg-[#e0e0e0] flex items-center justify-center text-[10px]">🔒</div>
        <p className="text-[11px] text-[#3c3c43] truncate">{displayUrl}</p>
      </div>
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#f8f8fc] to-white p-6">
        <div className="text-center">
          <Globe className="w-16 h-16 text-[#8364ff] mb-4 mx-auto" />
          <h2 className="text-lg font-bold text-[#131d29] mb-1">{url}</h2>
          <p className="text-xs text-[#6e6e6e]">Sitio web</p>
        </div>
      </div>
    </div>
  );
}

function VCardPreview({ data }) {
  const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || 'Contacto';
  return (
    <div className="h-full flex flex-col bg-[#f8f8fc]">
      <div className="p-6 flex flex-col items-center flex-1 justify-center">
        <div className="w-20 h-20 rounded-full bg-[#f3f0ff] flex items-center justify-center mb-4 border-2 border-white shadow-sm">
          <span className="text-2xl font-bold text-[#8364ff]">
            {data.first_name?.[0] || ''}{data.last_name?.[0] || ''}
          </span>
        </div>
        <h2 className="text-base font-bold text-[#131d29] mb-1">{name}</h2>
        {data.company && <p className="text-xs text-[#6e6e6e] mb-4">{data.position ? `${data.position} · ` : ''}{data.company}</p>}
        <div className="w-full space-y-2.5">
          {data.phone && (
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-[#f0f0f0]">
              <MessageCircle className="w-4 h-4 text-[#8364ff]" />
              <span className="text-xs text-[#131d29]">{data.phone}</span>
            </div>
          )}
          {data.email && (
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-[#f0f0f0]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8364ff" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
              <span className="text-xs text-[#131d29] truncate">{data.email}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-[#f0f0f0]">
              <Globe className="w-4 h-4 text-[#8364ff]" />
              <span className="text-xs text-[#131d29] truncate">{data.website}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WiFiPreview({ data }) {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-[#f3f0ff] to-white p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#f0f0f0] p-8 w-full text-center">
        <Wifi className="w-12 h-12 text-[#8364ff] mx-auto mb-4" />
        <h2 className="text-base font-bold text-[#131d29] mb-1">{data.ssid || 'Mi WiFi'}</h2>
        <p className="text-xs text-[#6e6e6e] mb-4">{data.encryption || 'WPA2'}</p>
        {data.password && (
          <div className="bg-[#f7f7f7] rounded-xl px-4 py-2 inline-block">
            <p className="text-sm font-mono font-bold text-[#131d29]">{data.password}</p>
          </div>
        )}
        <button className="mt-5 w-full py-2.5 bg-[#8364ff] text-white text-xs font-semibold rounded-xl">
          Conectar
        </button>
      </div>
    </div>
  );
}

function MediaPreview({ data, type }) {
  const iconMap = {
    pdf: FileText,
    images: Image,
    video: Video,
    mp3: Music,
  };
  const Icon = iconMap[type] || FileText;
  const labelMap = {
    pdf: 'Documento PDF',
    images: 'Imagen',
    video: 'Video',
    mp3: 'Audio',
  };
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-[#f8f8fc] to-white p-6">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#f3f0ff] flex items-center justify-center mb-4 mx-auto">
          <Icon className="w-10 h-10 text-[#8364ff]" />
        </div>
        <h2 className="text-sm font-bold text-[#131d29] mb-1">{labelMap[type] || 'Archivo'}</h2>
        <p className="text-[10px] text-[#6e6e6e] break-all">{data.url || 'https://...'}</p>
      </div>
    </div>
  );
}

function MenuPreview({ data }) {
  return (
    <div className="h-full flex flex-col bg-[#f8f8fc]">
      <div className="bg-[#8364ff] px-4 py-5 text-center shrink-0">
        <Menu className="w-8 h-8 text-white mx-auto mb-1" />
        <h2 className="text-sm font-bold text-white">Menú</h2>
      </div>
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-3 border border-[#f0f0f0] flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-[#131d29]">Item del menú #{i}</p>
              <p className="text-[10px] text-[#6e6e6e]">Descripción</p>
            </div>
            <p className="text-xs font-bold text-[#8364ff]">$99</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BusinessPreview({ data }) {
  return (
    <div className="h-full flex items-center justify-center bg-[#f8f8fc] p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#f0f0f0] p-6 w-full text-center">
        <Building2 className="w-10 h-10 text-[#8364ff] mx-auto mb-3" />
        <h2 className="text-sm font-bold text-[#131d29]">{data.business_name || 'Negocio'}</h2>
        <div className="mt-6 space-y-2 text-left">
          {data.phone && (
            <div className="text-xs text-[#6e6e6e] flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-[#8364ff]" /> {data.phone}
            </div>
          )}
          {data.email && (
            <div className="text-xs text-[#6e6e6e] flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#8364ff]" /> {data.email}
            </div>
          )}
          {data.website && (
            <div className="text-xs text-[#6e6e6e] truncate flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8364ff" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10"/></svg>
              {data.website}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CouponPreview({ data }) {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-[#f3f0ff] to-white p-6">
      <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-[#8364ff] p-6 w-full text-center">
        <Ticket className="w-10 h-10 text-[#8364ff] mx-auto mb-3" />
        <p className="text-xs text-[#6e6e6e] mb-2">Código de cupón</p>
        <h2 className="text-xl font-bold text-[#8364ff] tracking-wider mb-2">{data.code || 'CÓDIGO'}</h2>
        {data.description && <p className="text-xs text-[#6e6e6e]">{data.description}</p>}
      </div>
    </div>
  );
}

function SocialPreview({ data }) {
  const socials = [];
  ['whatsapp', 'instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok'].forEach((key) => {
    if (data[key]) socials.push({ key, url: data[key] });
  });
  return (
    <div className="h-full flex flex-col items-center bg-gradient-to-b from-[#f8f8fc] to-white p-4">
      <div className="w-16 h-16 rounded-full bg-[#f3f0ff] flex items-center justify-center mb-3">
        <span className="text-2xl font-bold text-[#8364ff]">@</span>
      </div>
      <h2 className="text-sm font-bold text-[#131d29] mb-4">Mis redes</h2>
      <div className="w-full space-y-2">
        {socials.map((s) => (
          <a key={s.key} className="block w-full bg-white rounded-xl border border-[#f0f0f0] px-4 py-3 text-xs font-semibold text-[#131d29] text-center shadow-sm capitalize">
            {s.key}
          </a>
        ))}
      </div>
    </div>
  );
}

function AppStorePreview({ data }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#f8f8fc] to-white p-6 text-center">
      <Smartphone className="w-12 h-12 text-[#8364ff] mb-4" />
      <h2 className="text-sm font-bold text-[#131d29] mb-3">Descargar app</h2>
      <div className="space-y-2 w-full">
        {data.ios_url && (
          <div className="bg-black text-white rounded-xl py-3 px-4 text-xs font-semibold">App Store</div>
        )}
        {data.android_url && (
          <div className="bg-[#01875f] text-white rounded-xl py-3 px-4 text-xs font-semibold">Google Play</div>
        )}
      </div>
    </div>
  );
}

function LinkListPreview({ data }) {
  const links = data.links || [{ title: 'Link 1', url: '#' }, { title: 'Link 2', url: '#' }];
  return (
    <div className="h-full flex flex-col items-center bg-gradient-to-b from-[#f8f8fc] to-white p-4">
      <div className="w-14 h-14 rounded-full bg-[#f3f0ff] flex items-center justify-center mb-3">
        <Link2 className="w-6 h-6 text-[#8364ff]" />
      </div>
      <h2 className="text-sm font-bold text-[#131d29] mb-4">{data.title || 'Links'}</h2>
      <div className="w-full space-y-2">
        {links.filter(l => l.title || l.url).slice(0, 4).map((link, i) => (
          <div key={i} className="block w-full bg-white rounded-xl border border-[#f0f0f0] px-4 py-3 text-xs font-semibold text-[#131d29] text-center shadow-sm">
            {link.title || `Link ${i + 1}`}
          </div>
        ))}
      </div>
    </div>
  );
}

function FacebookPreview({ data }) {
  const title = data.title || 'Fashion Inspiration';
  const description = data.description || '¿Quiere buenas ideas para su próximo outfit? ¡El grupo de Facebook Fashion Inspiration tiene muchos consejos y trucos para ayudar a encontrar looks atractivos para cada ocasión!';
  const url = data.url || 'facebook.com/yourpage';

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header decorativo */}
      <div className="relative h-32 shrink-0 overflow-hidden" style={{
        background: 'linear-gradient(135deg, #e91e63 0%, #9c27b0 50%, #3f51b5 100%)'
      }}>
        {/* Iconos flotantes decorativos */}
        <div className="absolute inset-0">
          <svg className="absolute top-2 left-4 w-6 h-6 text-white/20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <svg className="absolute top-6 right-8 w-5 h-5 text-white/20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
          <svg className="absolute bottom-4 left-12 w-7 h-7 text-white/15" viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
          </svg>
          <svg className="absolute top-10 left-20 w-5 h-5 text-white/20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <svg className="absolute bottom-8 right-6 w-6 h-6 text-white/20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
          </svg>
        </div>

        {/* Logo grande */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="w-20 h-20 rounded-full bg-[#1877f2] flex items-center justify-center shadow-lg border-4 border-white">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto pt-12 px-4 pb-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-[#111b21] mb-1">{title}</h2>
          <p className="text-xs text-[#667781] leading-relaxed px-2">{description}</p>
        </div>

        {/* Botón */}
        <button className="w-full bg-[#1877f2] text-white text-sm font-semibold py-3 rounded-lg mb-6 hover:bg-[#166fe5] transition-colors">
          Vaya a nuestra página de Facebook
        </button>

        {/* Feed repetido */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-[#e0e0e0] pb-4">
              <h3 className="text-sm font-bold text-[#111b21] mb-1">{title}</h3>
              <p className="text-xs text-[#667781] leading-relaxed mb-2">{description}</p>
              <button className="bg-[#1877f2] text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-[#166fe5] transition-colors">
                Vaya a nuestra página de Facebook
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InstagramPreview({ data }) {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-[#f8f8fc] to-white p-6">
      <div className="bg-white rounded-2xl shadow-sm p-6 w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#dc2743] flex items-center justify-center text-2xl text-white font-bold mx-auto mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="white" strokeWidth="1.5"/><circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/></svg>
        </div>
        <h2 className="text-sm font-bold text-[#131d29]">Instagram</h2>
        <p className="text-[10px] text-[#6e6e6e] mt-1 break-all">{data.url || 'instagram.com/...'}</p>
      </div>
    </div>
  );
}

export function renderPreviewForType(type, data) {
  switch (type) {
    case 'whatsapp':
      return <WhatsAppPreview data={data} />;
    case 'website':
    case 'url':
      return <WebsitePreview data={data} />;
    case 'vcard':
      return <VCardPreview data={data} />;
    case 'wifi':
      return <WiFiPreview data={data} />;
    case 'pdf':
    case 'images':
    case 'video':
    case 'mp3':
      return <MediaPreview data={data} type={type} />;
    case 'menu':
      return <MenuPreview data={data} />;
    case 'business':
      return <BusinessPreview data={data} />;
    case 'coupon':
      return <CouponPreview data={data} />;
    case 'social':
      return <SocialPreview data={data} />;
    case 'apps':
    case 'appstore':
      return <AppStorePreview data={data} />;
    case 'links':
    case 'linklist':
      return <LinkListPreview data={data} />;
    case 'facebook':
      return <FacebookPreview data={data} />;
    case 'instagram':
      return <InstagramPreview data={data} />;
    default:
      return <WebsitePreview data={{ url: data.url || '...' }} />;
  }
}
