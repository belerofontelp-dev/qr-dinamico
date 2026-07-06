import { useState, useEffect } from 'react';
import {
  MessageCircle, Globe, FileText, Image, Video, Music,
  Wifi, UtensilsCrossed, Building2, Contact, Smartphone,
  Link2, Ticket, Share2
} from 'lucide-react';
import AccordionCard from '../ui/AccordionCard';

const PAISES = [
  { code: '54', name: 'Argentina', flag: '🇦🇷' },
  { code: '55', name: 'Brasil', flag: '🇧🇷' },
  { code: '56', name: 'Chile', flag: '🇨🇱' },
  { code: '57', name: 'Colombia', flag: '🇨🇴' },
  { code: '52', name: 'México', flag: '🇲🇽' },
  { code: '51', name: 'Perú', flag: '🇵🇪' },
  { code: '598', name: 'Uruguay', flag: '🇺🇾' },
  { code: '58', name: 'Venezuela', flag: '🇻🇪' },
  { code: '1', name: 'EE.UU.', flag: '🇺🇸' },
  { code: '34', name: 'España', flag: '🇪🇸' },
  { code: '44', name: 'Reino Unido', flag: '🇬🇧' },
  { code: '33', name: 'Francia', flag: '🇫🇷' },
  { code: '49', name: 'Alemania', flag: '🇩🇪' },
  { code: '39', name: 'Italia', flag: '🇮🇹' }
];

function detectCountry(phone) {
  const sorted = [...PAISES].sort((a, b) => b.code.length - a.code.length);
  for (const p of sorted) {
    if (phone && phone.startsWith(p.code)) return p.code;
  }
  return '54';
}

function stripCountry(phone) {
  if (!phone) return '';
  const code = detectCountry(phone);
  return phone.slice(code.length);
}

function PhoneInput({ value, onChange }) {
  const [pais, setPais] = useState(value ? detectCountry(value) : '54');
  const [numero, setNumero] = useState(value ? stripCountry(value) : '');

  useEffect(() => {
    if (onChange) onChange(`${pais}${numero}`);
  }, [pais, numero]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-end">
        <div className="w-[140px]">
          <label className="block text-xs font-semibold text-[#6e6e6e] mb-1">País</label>
          <select
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            className="w-full h-10 rounded-lg border border-[#e0e0e0] bg-white px-3 text-sm text-[#131d29] focus:outline-none focus:border-[#8364ff] focus:ring-2 focus:ring-[#8364ff]/15"
          >
            {PAISES.map((p) => (
              <option key={p.code} value={p.code}>
                {p.flag} {p.name} (+{p.code})
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-[#6e6e6e] mb-1">
            Número de teléfono <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-0">
            <span className="h-10 flex items-center px-2 bg-[#f7f7f7] border border-r-0 border-[#e0e0e0] rounded-l-lg text-sm text-[#6e6e6e]">
              +{pais}
            </span>
            <input
              type="tel"
              value={numero}
              onChange={(e) => setNumero(e.target.value.replace(/\D/g, ''))}
              placeholder="1123456789"
              className="flex-1 h-10 rounded-r-lg border border-[#e0e0e0] bg-white px-3 text-sm text-[#131d29] placeholder:text-[#a0a0a0] focus:outline-none focus:border-[#8364ff] focus:ring-2 focus:ring-[#8364ff]/15"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, required, type = 'text', multiline }) {
  const Comp = multiline ? 'textarea' : 'input';
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#6e6e6e]">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <Comp
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? 3 : undefined}
        className="w-full min-h-[2.5rem] rounded-lg border border-[#e0e0e0] bg-white px-3.5 py-2.5 text-sm text-[#131d29] placeholder:text-[#a0a0a0] focus:outline-none focus:border-[#8364ff] focus:ring-2 focus:ring-[#8364ff]/15 transition-colors resize-none"
      />
    </div>
  );
}

const TYPE_INFO = {
  whatsapp: {
    icon: MessageCircle,
    title: 'Información de WhatsApp',
    desc: 'Al escanear este código QR se abrirá WhatsApp listo para enviar un mensaje al número indicado. Podés agregar un mensaje predefinido opcionalmente.',
  },
  website: {
    icon: Globe,
    title: 'Información del sitio web',
    desc: 'Este código QR redirige a cualquier página web. Ingresá la URL completa incluyendo https://.',
  },
  pdf: {
    icon: FileText,
    title: 'Información del PDF',
    desc: 'Compartí un documento PDF. Al escanear, el usuario podrá ver o descargar el archivo.',
  },
  images: {
    icon: Image,
    title: 'Información de imágenes',
    desc: 'Compartí una o varias imágenes. Al escanear, se mostrará una galería.',
  },
  video: {
    icon: Video,
    title: 'Información del video',
    desc: 'Compartí un video de YouTube, Vimeo o cualquier URL de video. Al escanear, se reproducirá.',
  },
  wifi: {
    icon: Wifi,
    title: 'Información de WiFi',
    desc: 'Al escanear este código QR, el dispositivo se conectará automáticamente a la red WiFi configurada.',
  },
  menu: {
    icon: UtensilsCrossed,
    title: 'Información del menú',
    desc: 'Creá un menú digital para tu restaurante. Podés elegir entre crear un menú digital, subir un PDF o linkear a un menú existente.',
  },
  business: {
    icon: Building2,
    title: 'Información del negocio',
    desc: 'Compartí los datos de tu negocio: nombre, teléfono, email, sitio web y dirección.',
  },
  vcard: {
    icon: Contact,
    title: 'Información de contacto',
    desc: 'Al escanear este código QR, el usuario podrá guardar tu contacto en la agenda de su teléfono.',
  },
  mp3: {
    icon: Music,
    title: 'Información del audio',
    desc: 'Compartí un archivo de audio. Al escanear, el usuario podrá reproducirlo.',
  },
  apps: {
    icon: Smartphone,
    title: 'Información de la app',
    desc: 'Redirigí a los usuarios a la App Store o Google Play para que descarguen tu aplicación.',
  },
  links: {
    icon: Link2,
    title: 'Información de lista de links',
    desc: 'Compartí múltiples enlaces en una sola página. Ideal para tus redes sociales, sitio web, tienda, y más.',
  },
  coupon: {
    icon: Ticket,
    title: 'Información del cupón',
    desc: 'Creá un cupón de descuento que los usuarios podrán revelar al escanear el código QR.',
  },
  facebook: {
    icon: Share2,
    title: 'Información de Facebook',
    desc: 'Compartí tu página o perfil de Facebook. Al escanear, se abrirá la app de Facebook.',
  },
  instagram: {
    icon: Share2,
    title: 'Información de Instagram',
    desc: 'Compartí tu perfil de Instagram. Al escanear, se abrirá la app de Instagram.',
  },
  social: {
    icon: Share2,
    title: 'Información de redes sociales',
    desc: 'Compartí todos tus canales sociales en un solo lugar. Agregá los links a tus redes.',
  },
};

export default function ContentStep({ type, formData, onFormChange, name, onNameChange }) {
  const info = TYPE_INFO[type] || { icon: Globe, title: 'Información', desc: 'Completá los datos del contenido.' };

  const updateField = (field, value) => {
    onFormChange({ ...formData, [field]: value });
  };

  const renderForm = () => {
    switch (type) {
      case 'whatsapp':
        return (
          <>
            <PhoneInput
              value={formData.phone || ''}
              onChange={(v) => updateField('phone', v)}
            />
            <TextInput
              label="Mensaje predefinido"
              value={formData.message || ''}
              onChange={(v) => updateField('message', v)}
              placeholder="Ej: Hola, me contacto desde tu QR..."
              multiline
            />
          </>
        );
      case 'website':
      case 'pdf':
      case 'images':
      case 'video':
      case 'mp3':
      case 'menu':
        return (
          <TextInput
            label="URL"
            value={formData.url || ''}
            onChange={(v) => updateField('url', v)}
            placeholder="https://ejemplo.com"
            required
          />
        );
      case 'wifi':
        return (
          <>
            <TextInput
              label="Nombre de la red (SSID)"
              value={formData.ssid || ''}
              onChange={(v) => updateField('ssid', v)}
              placeholder="Mi WiFi"
              required
            />
            <TextInput
              label="Contraseña"
              value={formData.password || ''}
              onChange={(v) => updateField('password', v)}
              placeholder="Contraseña de la red"
            />
            <div>
              <label className="block text-xs font-semibold text-[#6e6e6e] mb-2">Tipo de encriptación</label>
              <div className="flex gap-2">
                {['WPA2', 'WPA', 'WEP', 'Ninguna'].map((enc) => (
                  <button
                    key={enc}
                    type="button"
                    onClick={() => updateField('encryption', enc === 'Ninguna' ? 'None' : enc)}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                      (formData.encryption || 'WPA2') === (enc === 'Ninguna' ? 'None' : enc)
                        ? 'border-[#8364ff] bg-[#f3f0ff] text-[#8364ff]'
                        : 'border-[#e0e0e0] text-[#6e6e6e] hover:text-[#131d29]'
                    }`}
                  >
                    {enc}
                  </button>
                ))}
              </div>
            </div>
          </>
        );
      case 'vcard':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Nombre"
                value={formData.first_name || ''}
                onChange={(v) => updateField('first_name', v)}
                placeholder="Juan"
                required
              />
              <TextInput
                label="Apellido"
                value={formData.last_name || ''}
                onChange={(v) => updateField('last_name', v)}
                placeholder="Pérez"
              />
            </div>
            <PhoneInput
              value={formData.phone || ''}
              onChange={(v) => updateField('phone', v)}
            />
            <TextInput
              label="Email"
              value={formData.email || ''}
              onChange={(v) => updateField('email', v)}
              placeholder="juan@ejemplo.com"
            />
            <TextInput
              label="Empresa"
              value={formData.company || ''}
              onChange={(v) => updateField('company', v)}
              placeholder="Mi Empresa S.A."
            />
            <TextInput
              label="Cargo"
              value={formData.position || ''}
              onChange={(v) => updateField('position', v)}
              placeholder="CEO"
            />
            <TextInput
              label="Sitio web"
              value={formData.website || ''}
              onChange={(v) => updateField('website', v)}
              placeholder="https://..."
            />
            <TextInput
              label="Dirección"
              value={formData.address || ''}
              onChange={(v) => updateField('address', v)}
              placeholder="Calle 123, Ciudad"
            />
            <TextInput
              label="Nota"
              value={formData.note || ''}
              onChange={(v) => updateField('note', v)}
              placeholder="Nota adicional..."
              multiline
            />
          </>
        );
      case 'business':
        return (
          <>
            <TextInput
              label="Nombre del negocio"
              value={formData.business_name || ''}
              onChange={(v) => updateField('business_name', v)}
              placeholder="Mi Negocio"
              required
            />
            <PhoneInput
              value={formData.phone || ''}
              onChange={(v) => updateField('phone', v)}
            />
            <TextInput
              label="Email"
              value={formData.email || ''}
              onChange={(v) => updateField('email', v)}
              placeholder="contacto@negocio.com"
            />
            <TextInput
              label="Sitio web"
              value={formData.website || ''}
              onChange={(v) => updateField('website', v)}
              placeholder="https://..."
            />
            <TextInput
              label="Dirección"
              value={formData.address || ''}
              onChange={(v) => updateField('address', v)}
              placeholder="Calle 123, Ciudad"
            />
          </>
        );
      case 'coupon':
        return (
          <>
            <TextInput
              label="Código del cupón"
              value={formData.code || ''}
              onChange={(v) => updateField('code', v)}
              placeholder="DESCUENTO20"
              required
            />
            <TextInput
              label="Descripción"
              value={formData.description || ''}
              onChange={(v) => updateField('description', v)}
              placeholder="20% de descuento en tu próxima compra"
              multiline
            />
          </>
        );
      case 'apps':
        return (
          <>
            <TextInput
              label="App Store (iOS)"
              value={formData.ios_url || ''}
              onChange={(v) => updateField('ios_url', v)}
              placeholder="https://apps.apple.com/..."
            />
            <TextInput
              label="Google Play (Android)"
              value={formData.android_url || ''}
              onChange={(v) => updateField('android_url', v)}
              placeholder="https://play.google.com/..."
            />
          </>
        );
      case 'links':
        return (
          <>
            <TextInput
              label="Título"
              value={formData.title || ''}
              onChange={(v) => updateField('title', v)}
              placeholder="Mis Links"
            />
            {(formData.links || [{ title: '', url: '' }]).map((link, idx) => (
              <div key={idx} className="flex gap-2">
                <TextInput
                  label={idx === 0 ? 'Título del link' : undefined}
                  value={link.title || ''}
                  onChange={(v) => {
                    const links = [...(formData.links || [{ title: '', url: '' }])];
                    links[idx] = { ...links[idx], title: v };
                    updateField('links', links);
                  }}
                  placeholder="Link"
                />
                <TextInput
                  label={idx === 0 ? 'URL' : undefined}
                  value={link.url || ''}
                  onChange={(v) => {
                    const links = [...(formData.links || [{ title: '', url: '' }])];
                    links[idx] = { ...links[idx], url: v };
                    updateField('links', links);
                  }}
                  placeholder="https://..."
                />
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const links = [...(formData.links || [{ title: '', url: '' }]), { title: '', url: '' }];
                  updateField('links', links);
                }}
                className="h-10 px-3 rounded-lg border border-[#8364ff] bg-[#f3f0ff] text-xs font-semibold text-[#8364ff] hover:bg-[#ebe4ff] transition-colors shrink-0"
              >
                + Agregar link
              </button>
              {(formData.links || []).length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const links = [...(formData.links || [{ title: '', url: '' }])];
                    links.pop();
                    updateField('links', links.length ? links : [{ title: '', url: '' }]);
                  }}
                  className="h-10 px-3 rounded-lg border border-[#e0e0e0] text-xs font-semibold text-[#6e6e6e] hover:text-red-400 transition-colors shrink-0"
                >
                  Eliminar último
                </button>
              )}
            </div>
          </>
        );
      case 'facebook':
        return (
          <>
            <TextInput
              label="URL de Facebook"
              value={formData.url || ''}
              onChange={(v) => updateField('url', v)}
              placeholder="https://facebook.com/tupagina"
              required
            />
            <TextInput
              label="Título"
              value={formData.title || ''}
              onChange={(v) => updateField('title', v)}
              placeholder="Fashion Inspiration"
            />
            <TextInput
              label="Descripción"
              value={formData.description || ''}
              onChange={(v) => updateField('description', v)}
              placeholder="Descripción de tu página"
              multiline
            />
          </>
        );
      case 'instagram':
        return (
          <TextInput
            label="URL de Instagram"
            value={formData.url || ''}
            onChange={(v) => updateField('url', v)}
            placeholder="https://instagram.com/tuperfil"
            required
          />
        );
      case 'social':
        return (
          <>
            <p className="text-xs text-[#6e6e6e] mb-3">Agregá los links a tus redes sociales.</p>
            {['whatsapp', 'instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok', 'website'].map(
              (platform) => (
                <TextInput
                  key={platform}
                  label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  value={formData[platform] || ''}
                  onChange={(v) => updateField(platform, v)}
                  placeholder={`https://${platform}.com/...`}
                />
              )
            )}
          </>
        );
      default:
        return (
          <TextInput
            label="URL"
            value={formData.url || ''}
            onChange={(v) => updateField('url', v)}
            placeholder="https://..."
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-[#131d29]">2. Agregá contenido a tu código QR</h3>

      <AccordionCard
        icon={info.icon}
        title={info.title}
        subtitle={info.desc}
        defaultOpen
      >
        <div className="space-y-4">
          {renderForm()}
        </div>
      </AccordionCard>

      <AccordionCard
        icon={() => (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <rect x="7" y="7" width="10" height="10" rx="1" />
            <rect x="10" y="10" width="4" height="4" rx="0.5" fill="currentColor" />
          </svg>
        )}
        title="Nombre del código QR"
        subtitle="Asignale un nombre a tu código QR para identificarlo fácilmente."
        defaultOpen
      >
        <TextInput
          label="Nombre"
          value={name}
          onChange={onNameChange}
          placeholder="Mi código QR"
          required
        />
      </AccordionCard>
    </div>
  );
}
