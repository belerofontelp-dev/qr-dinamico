import {
  MessageCircle, Globe, Contact, Wifi, FileText,
  Image, Video, Music, Ticket, Building2,
  Smartphone, Link2, Menu
} from 'lucide-react';

function WhatsAppPreview({ data }) {
  const phone = data.phone || '1122334455';
  const message = data.message || '';
  return (
    <div className="h-full flex flex-col bg-[#efeae2]">
      <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-[#25d366] flex items-center justify-center text-white text-xs font-bold">WA</div>
        <div>
          <p className="text-white text-[13px] font-semibold leading-tight">+{phone}</p>
          <p className="text-white/60 text-[10px]">en línea</p>
        </div>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-end gap-2">
        <div className="flex justify-end">
          <div className="bg-[#d9fdd3] rounded-lg rounded-tr-sm px-3 py-2 max-w-[85%] shadow-sm">
            <p className="text-[13px] text-[#111b21] leading-snug">
              {message || 'Escribí tu mensaje...'}
            </p>
            <p className="text-[10px] text-[#667781] text-right mt-0.5">12:34</p>
          </div>
        </div>
      </div>
      <div className="bg-[#f0f2f5] px-3 py-2 flex items-center gap-2 shrink-0 border-t border-[#e0e0e0]">
        <div className="flex-1 bg-white rounded-full h-9 flex items-center px-4">
          <p className="text-xs text-[#667781]">Mensaje</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#075e54] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
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
          {data.first_name?.[0] || 'C'}
          {data.last_name?.[0] || ''}
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
  return (
    <div className="h-full flex items-center justify-center bg-[#f0f2f5] p-6">
      <div className="bg-white rounded-2xl shadow-sm p-6 w-full text-center">
        <div className="w-16 h-16 rounded-full bg-[#1877f2] flex items-center justify-center text-2xl text-white font-bold mx-auto mb-3">f</div>
        <h2 className="text-sm font-bold text-[#131d29]">Facebook</h2>
        <p className="text-[10px] text-[#6e6e6e] mt-1 break-all">{data.url || 'facebook.com/...'}</p>
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
