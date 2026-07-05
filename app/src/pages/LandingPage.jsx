import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const LINK_ICONS = {
  link: '🔗',
  shopping: '🛒',
  youtube: '▶️',
  spotify: '🎵',
  discord: '💬',
  email: '📧',
  phone: '📞',
  map: '📍',
  calendar: '📅',
  document: '📄'
};

const SOCIAL_ICONS = {
  whatsapp: { emoji: '💬', label: 'WhatsApp', color: '#25D366' },
  instagram: { emoji: '📷', label: 'Instagram', color: '#E4405F' },
  facebook: { emoji: '👤', label: 'Facebook', color: '#1877F2' },
  twitter: { emoji: '𝕏', label: 'X / Twitter', color: '#000000' },
  linkedin: { emoji: '💼', label: 'LinkedIn', color: '#0A66C2' },
  tiktok: { emoji: '🎵', label: 'TikTok', color: '#000000' },
  youtube: { emoji: '▶️', label: 'YouTube', color: '#FF0000' },
  telegram: { emoji: '✈️', label: 'Telegram', color: '#26A5E4' },
  spotify: { emoji: '🎧', label: 'Spotify', color: '#1DB954' },
  website: { emoji: '🌐', label: 'Sitio Web', color: '#6B7280' }
};

export default function LandingPage() {
  const { slug } = useParams();
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('qr_codes')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()
      .then(({ data }) => {
        if (data) setQr(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
      </div>
    );
  }

  if (!qr) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">QR no encontrado</h1>
        <p className="text-gray-500">Este QR no está disponible o ha expirado.</p>
      </div>
    );
  }

  const config = typeof qr.config === 'string' ? JSON.parse(qr.config) : (qr.config || {});
  const destUrl = qr.destination_url;

  switch (qr.platform) {
    case 'linklist':
      return <LinkListLanding links={config.links || []} qrName={qr.name} />;
    case 'appstore':
      return <AppStoreLanding iosUrl={config.ios_url} androidUrl={config.android_url} qrName={qr.name} />;
    case 'multisocial':
      return <MultiSocialLanding config={config} qrName={qr.name} />;
    case 'wifi':
      return <WiFiLanding config={config} qrName={qr.name} />;
    case 'vcard':
      return <VCardLanding config={config} qrName={qr.name} />;
    default:
      window.location.href = destUrl;
      return null;
  }
}

function LinkListLanding({ links, qrName }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">{qrName}</h1>
        </div>
        <div className="space-y-3">
          {links.filter(l => l.title || l.url).map((link, idx) => (
            <a
              key={idx}
              href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition text-left"
            >
              <span className="flex items-center gap-3">
                <span className="text-xl">{LINK_ICONS[link.icon] || '🔗'}</span>
                <span className="font-medium text-gray-900">{link.title || 'Ver más'}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppStoreLanding({ iosUrl, androidUrl, qrName }) {
  const [platform, setPlatform] = useState('unknown');

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) {
      setPlatform('ios');
      if (iosUrl) window.location.href = iosUrl;
    } else if (/Android/i.test(ua)) {
      setPlatform('android');
      if (androidUrl) window.location.href = androidUrl;
    }
  }, [iosUrl, androidUrl]);

  if (iosUrl && platform === 'ios') return null;
  if (androidUrl && platform === 'android') return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="text-xl font-bold text-gray-900 mb-4">{qrName}</h1>
      <p className="text-gray-500 mb-8">Descargá nuestra app</p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {iosUrl && (
          <a href={iosUrl} target="_blank" rel="noopener noreferrer"
            className="w-full px-5 py-3.5 bg-black text-white rounded-xl hover:bg-gray-800 transition text-center font-medium text-sm">
            Descargar en App Store
          </a>
        )}
        {androidUrl && (
          <a href={androidUrl} target="_blank" rel="noopener noreferrer"
            className="w-full px-5 py-3.5 bg-black text-white rounded-xl hover:bg-gray-800 transition text-center font-medium text-sm">
            Descargar en Google Play
          </a>
        )}
      </div>
    </div>
  );
}

function MultiSocialLanding({ config, qrName }) {
  const socials = [];
  for (const [key, url] of Object.entries(config)) {
    if (typeof url === 'string' && url.trim() && SOCIAL_ICONS[key]) {
      socials.push({ key, url, ...SOCIAL_ICONS[key] });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">{qrName}</h1>
          <p className="text-sm text-gray-500 mt-1">Seguinos en nuestras redes</p>
        </div>
        <div className="space-y-3">
          {socials.map((s, idx) => (
            <a
              key={idx}
              href={s.url.startsWith('http') ? s.url : `https://${s.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition text-left"
            >
              <span className="text-xl">{s.emoji}</span>
              <span className="font-medium text-gray-900 text-sm">{s.label}</span>
              <span className="ml-auto text-gray-400 text-xs truncate max-w-[140px]">{s.url}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function WiFiLanding({ config, qrName }) {
  const ssid = config.ssid || '';
  const password = config.password || '';

  const handleConnect = () => {
    window.location.href = `WIFI:S:${ssid};T:${config.encryption || 'WPA2'};P:${password};;`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-sm w-full shadow-sm">
        <div className="text-4xl mb-4">📶</div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">{qrName}</h1>
        <p className="text-3xl font-bold text-gray-700 mt-4">{ssid}</p>
        {password && (
          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Contraseña</p>
            <p className="text-lg font-mono font-bold select-all">{password}</p>
          </div>
        )}
        <button
          onClick={handleConnect}
          className="mt-6 w-full px-5 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition text-sm font-medium"
        >
          Conectar a esta red
        </button>
      </div>
    </div>
  );
}

function VCardLanding({ config, qrName }) {
  const vcardData = [
    config.first_name || config.last_name ? `N:${config.last_name || ''};${config.first_name || ''}` : null,
    config.first_name || config.last_name ? `FN:${config.first_name || ''} ${config.last_name || ''}`.trim() : null,
  ].filter(Boolean);

  const handleAddContact = () => {
    let vcf = 'BEGIN:VCARD\nVERSION:3.0\n';
    const fn = `${config.first_name || ''} ${config.last_name || ''}`.trim();
    if (fn) vcf += `FN:${fn}\n`;
    vcf += `N:${config.last_name || ''};${config.first_name || ''}\n`;
    if (config.phone) vcf += `TEL:${config.phone}\n`;
    if (config.email) vcf += `EMAIL:${config.email}\n`;
    if (config.company) vcf += `ORG:${config.company}\n`;
    if (config.position) vcf += `TITLE:${config.position}\n`;
    if (config.website) vcf += `URL:${config.website}\n`;
    vcf += 'END:VCARD';
    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fn || 'contacto'}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-sm w-full shadow-sm">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-gray-600">
          {(config.first_name?.[0] || '') + (config.last_name?.[0] || '') || '?'}
        </div>
        <h1 className="text-xl font-bold text-gray-900 mt-4">
          {config.first_name} {config.last_name}
        </h1>
        {config.company && <p className="text-sm text-gray-500 mt-1">{config.position ? `${config.position} en ` : ''}{config.company}</p>}
        <div className="mt-6 space-y-3 text-left">
          {config.phone && (
            <a href={`tel:${config.phone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-black">
              <span className="text-lg">📞</span> {config.phone}
            </a>
          )}
          {config.email && (
            <a href={`mailto:${config.email}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-black break-all">
              <span className="text-lg">📧</span> {config.email}
            </a>
          )}
          {config.website && (
            <a href={config.website.startsWith('http') ? config.website : `https://${config.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-black break-all">
              <span className="text-lg">🌐</span> {config.website}
            </a>
          )}
          {config.address && (
            <p className="flex items-center gap-3 text-sm text-gray-700">
              <span className="text-lg">📍</span> {config.address}
            </p>
          )}
          {config.note && (
            <p className="flex items-start gap-3 text-sm text-gray-500">
              <span className="text-lg">📝</span> {config.note}
            </p>
          )}
        </div>
        <button
          onClick={handleAddContact}
          className="mt-6 w-full px-5 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition text-sm font-medium"
        >
          Agregar a contactos
        </button>
      </div>
    </div>
  );
}
