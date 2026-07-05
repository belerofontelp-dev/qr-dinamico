import { useState, useEffect } from 'react';

const SOCIAL_PLATFORMS = [
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/5491112345678' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/usuario' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/usuario' },
  { key: 'twitter', label: 'X / Twitter', placeholder: 'https://twitter.com/usuario' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/usuario' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@usuario' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@canal' },
  { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/usuario' },
  { key: 'spotify', label: 'Spotify', placeholder: 'https://open.spotify.com/artist/id' },
  { key: 'website', label: 'Sitio Web', placeholder: 'https://tusitio.com' }
];

export default function MultiSocialForm({ onChange, initial }) {
  const [socials, setSocials] = useState(() => {
    const initialSocials = {};
    SOCIAL_PLATFORMS.forEach(p => {
      initialSocials[p.key] = initial?.[p.key] || '';
    });
    return initialSocials;
  });

  useEffect(() => {
    if (onChange) {
      onChange(socials);
    }
  }, [socials, onChange]);

  const handleChange = (key, value) => {
    setSocials(prev => ({ ...prev, [key]: value }));
  };

  const filledCount = Object.values(socials).filter(v => v.trim()).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Agregá las URLs de las redes que quieras mostrar. Solo las completadas aparecerán en la página de destino.
        <span className="block mt-1 text-xs">({filledCount} de {SOCIAL_PLATFORMS.length} completadas)</span>
      </p>

      <div className="space-y-3">
        {SOCIAL_PLATFORMS.map(p => (
          <label key={p.key} className="block">
            <span className="text-sm font-medium">{p.label}</span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="url"
                value={socials[p.key]}
                onChange={e => handleChange(p.key, e.target.value)}
                placeholder={p.placeholder}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              {socials[p.key] && (
                <button
                  type="button"
                  onClick={() => handleChange(p.key, '')}
                  className="text-xs text-red-500 hover:text-red-700 px-1"
                  title="Limpiar"
                >
                  ✕
                </button>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
