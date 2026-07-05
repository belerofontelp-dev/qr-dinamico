import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PLATFORMS } from '../lib/platforms';
import { QR_TYPES } from '../lib/qr-types';
import { parseDestinationUrl } from '../lib/qr-utils';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';
import QRStyleEditor from '../components/QREditor/QRStyleEditor';
import QRPreview from '../components/QREditor/QRPreview';
import ExpiryConfig from '../components/ExpiryConfig/ExpiryConfig';
import WhatsAppForm from '../components/PlatformForms/WhatsAppForm';
import UrlForm from '../components/PlatformForms/UrlForm';
import DriveForm from '../components/PlatformForms/DriveForm';
import InstagramForm from '../components/PlatformForms/InstagramForm';
import TelegramForm from '../components/PlatformForms/TelegramForm';
import TwitterForm from '../components/PlatformForms/TwitterForm';
import LinkedInForm from '../components/PlatformForms/LinkedInForm';
import FacebookForm from '../components/PlatformForms/FacebookForm';
import WiFiForm from '../components/PlatformForms/WiFiForm';
import VCardForm from '../components/PlatformForms/VCardForm';
import LinkListForm from '../components/PlatformForms/LinkListForm';
import AppStoreForm from '../components/PlatformForms/AppStoreForm';
import MultiSocialForm from '../components/PlatformForms/MultiSocialForm';
import PhoneMockup from '../components/PhoneMockup';

const PLATFORM_FORMS = {
  whatsapp: WhatsAppForm,
  instagram: InstagramForm,
  telegram: TelegramForm,
  twitter: TwitterForm,
  linkedin: LinkedInForm,
  facebook: FacebookForm,
  url: UrlForm,
  drive: DriveForm,
  wifi: WiFiForm,
  vcard: VCardForm,
  linklist: LinkListForm,
  appstore: AppStoreForm,
  multisocial: MultiSocialForm
};

const TABS = [
  { value: 'config', label: 'Configuración' },
  { value: 'stats', label: 'Estadísticas' }
];

export default function EditQR() {
  const { id } = useParams();
  const [tab, setTab] = useState('config');
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [platformConfig, setPlatformConfig] = useState({});

  const [form, setForm] = useState({
    name: '',
    qr_color: '#000000',
    qr_bg_color: '#FFFFFF',
    qr_style: 'square',
    qr_corners_style: 'square',
    qr_corners_dot_style: 'square',
    qr_frame_style: 'none',
    qr_frame_text: 'Scan me',
    qr_frame_text_color: '#000000',
    qr_image_size: 0.4,
    qr_image_margin: 0,
    qr_error_correction: 'H',
    qr_logo_path: null,
    expires_at: null,
    max_scans: null,
    status: 'active'
  });

  useEffect(() => {
    if (!id) return;
    supabase
      .from('qr_codes')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setQr(data);
          setForm({
            name: data.name || '',
            qr_color: data.qr_color || '#000000',
            qr_bg_color: data.qr_bg_color || '#FFFFFF',
            qr_style: data.qr_style || 'square',
            qr_corners_style: data.qr_corners_style || 'square',
            qr_corners_dot_style: data.qr_corners_dot_style || 'square',
            qr_frame_style: data.qr_frame_style || 'none',
            qr_frame_text: data.qr_frame_text || 'Scan me',
            qr_frame_text_color: data.qr_frame_text_color || '#000000',
            qr_image_size: data.qr_image_size ?? 0.4,
            qr_image_margin: data.qr_image_margin ?? 0,
            qr_error_correction: data.qr_error_correction || 'H',
            qr_logo_path: data.qr_logo_path || null,
            expires_at: data.expires_at || null,
            max_scans: data.max_scans || null,
            status: data.status || 'active'
          });
          const cfg = data.config || parseDestinationUrl(data.platform, data.destination_url);
          setPlatformConfig(cfg);
        }
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-qr?id=${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            name: form.name,
            config: platformConfig,
            qr_color: form.qr_color,
            qr_bg_color: form.qr_bg_color,
            qr_style: form.qr_style,
            qr_corners_style: form.qr_corners_style,
            qr_corners_dot_style: form.qr_corners_dot_style,
            qr_frame_style: form.qr_frame_style,
            qr_frame_text: form.qr_frame_text,
            qr_frame_text_color: form.qr_frame_text_color,
            qr_image_size: form.qr_image_size,
            qr_image_margin: form.qr_image_margin,
            qr_error_correction: form.qr_error_correction,
            qr_logo_path: form.qr_logo_path,
            expires_at: form.expires_at,
            max_scans: form.max_scans,
            status: form.status
          })
        }
      );

      if (!res.ok) {
        const { error: errMsg } = await res.json();
        throw new Error(errMsg || 'Error al actualizar QR');
      }

      const updated = await res.json();
      setQr(prev => ({ ...prev, ...updated }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateForm = (updates) => {
    setForm(prev => ({ ...prev, ...updates }));
    setSaved(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
      </div>
    );
  }

  if (!qr) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500 mb-4">QR no encontrado.</p>
        <Link to="/dashboard" className="text-blue-600 hover:underline">Volver al panel</Link>
      </div>
    );
  }

  const platform = PLATFORMS[qr.platform] || QR_TYPES[qr.platform] || PLATFORMS.url;
  const shortlink = `${import.meta.env.VITE_WORKER_URL}/q/${qr.slug}`;
  const PlatformForm = PLATFORM_FORMS[qr.platform] || UrlForm;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">{qr.name}</h1>
            <p className="text-xs text-gray-500">
              {platform.label} · slug: {qr.slug} · {qr.scan_count ?? 0} escaneos
            </p>
          </div>
          <Link to="/dashboard" className="text-sm text-gray-500 hover:underline">Volver</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <div className="flex border-b border-gray-200 mb-6">
          {TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                tab === t.value ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'config' ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Configuración</h2>
                <p className="text-sm text-gray-500">Modificá el QR y guardá los cambios.</p>
              </div>

              <label className="block">
                <span className="text-sm font-medium">Nombre del QR</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => updateForm({ name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </label>

              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <h3 className="text-sm font-semibold">Contenido ({platform.label})</h3>
                <PlatformForm
                  onChange={(cfg) => {
                    setPlatformConfig(cfg);
                    setSaved(false);
                  }}
                  initial={platformConfig}
                  key={qr.platform}
                />
              </div>

              <QRStyleEditor
                onChange={(data) => updateForm(data)}
                initial={{
                  qr_color: form.qr_color,
                  qr_bg_color: form.qr_bg_color,
                  qr_style: form.qr_style,
                  qr_corners_style: form.qr_corners_style,
                  qr_corners_dot_style: form.qr_corners_dot_style,
                  qr_frame_style: form.qr_frame_style,
                  qr_frame_text: form.qr_frame_text,
                  qr_frame_text_color: form.qr_frame_text_color,
                  qr_image_size: form.qr_image_size,
                  qr_image_margin: form.qr_image_margin,
                  qr_error_correction: form.qr_error_correction,
                  qr_logo_path: form.qr_logo_path
                }}
              />

              <ExpiryConfig
                onChange={(data) => updateForm(data)}
                initial={{ expires_at: form.expires_at, max_scans: form.max_scans }}
              />

              <label className="block">
                <span className="text-sm font-medium">Estado</span>
                <select
                  value={form.status}
                  onChange={e => updateForm({ status: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="active">Activo</option>
                  <option value="paused">Pausado</option>
                  <option value="expired">Expirado</option>
                </select>
              </label>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
                {saved && <p className="mt-3 text-sm text-green-600">Cambios guardados correctamente.</p>}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Vista previa</h2>
              <div className="max-w-sm mx-auto">
                <PhoneMockup>
                  <QRPreview
                  shortlink={shortlink}
                  qrColor={form.qr_color}
                  qrBgColor={form.qr_bg_color}
                  qrStyle={form.qr_style}
                  qrCornersStyle={form.qr_corners_style}
                  qrCornersDotStyle={form.qr_corners_dot_style}
                  qrLogoUrl={form.qr_logo_path}
                  qrImageSize={form.qr_image_size}
                  qrImageMargin={form.qr_image_margin}
                  qrErrorCorrection={form.qr_error_correction}
                  qrFrameStyle={form.qr_frame_style}
                  qrFrameText={form.qr_frame_text}
                  qrFrameTextColor={form.qr_frame_text_color}
                  size={200}
                />
                </PhoneMockup>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <AnalyticsDashboard qrId={id} />
          </div>
        )}
      </main>
    </div>
  );
}
