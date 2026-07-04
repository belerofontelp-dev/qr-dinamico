import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQR } from '../hooks/useQR';
import { PLATFORMS } from '../lib/platforms';
import WhatsAppForm from '../components/PlatformForms/WhatsAppForm';
import UrlForm from '../components/PlatformForms/UrlForm';
import DriveForm from '../components/PlatformForms/DriveForm';
import InstagramForm from '../components/PlatformForms/InstagramForm';
import TelegramForm from '../components/PlatformForms/TelegramForm';
import TwitterForm from '../components/PlatformForms/TwitterForm';
import LinkedInForm from '../components/PlatformForms/LinkedInForm';
import ExpiryConfig from '../components/ExpiryConfig/ExpiryConfig';
import QRStyleEditor from '../components/QREditor/QRStyleEditor';
import QRPreview from '../components/QREditor/QRPreview';

const PLATFORM_FORMS = {
  whatsapp: { component: WhatsAppForm },
  instagram: { component: InstagramForm },
  telegram: { component: TelegramForm },
  twitter: { component: TwitterForm },
  linkedin: { component: LinkedInForm },
  url: { component: UrlForm },
  drive: { component: DriveForm }
};

const PASOS = [
  { num: 1, label: 'Plataforma' },
  { num: 2, label: 'Contenido' },
  { num: 3, label: 'Apariencia' },
  { num: 4, label: 'Caducidad' },
  { num: 5, label: 'Listo' }
];

export default function CreateQR() {
  const { user } = useAuth();
  const { createQR } = useQR(user);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState('whatsapp');
  const [name, setName] = useState('');
  const [formData, setFormData] = useState({});
  const [styleData, setStyleData] = useState({
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
    qr_logo_path: null
  });
  const [expiryData, setExpiryData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null);

  const handleFormChange = useCallback((data) => {
    setFormData(data);
  }, []);

  const validateStep = () => {
    if (step === 2 && !name.trim()) {
      return 'El nombre del QR es obligatorio';
    }
    return '';
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    if (step < 5) setStep(s => s + 1);
  };

  const prevStep = () => {
    setError('');
    if (step > 1) setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('El nombre del QR es obligatorio');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const payload = { name, platform, ...formData, ...expiryData, ...styleData };
      const qr = await createQR(payload);
      setCreated(qr);
      setStep(5);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setStep(1);
    setPlatform('whatsapp');
    setName('');
    setFormData({});
    setStyleData({
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
      qr_logo_path: null
    });
    setExpiryData({});
    setCreated(null);
    setError('');
  };

  const FormComponent = PLATFORM_FORMS[platform]?.component;
  const previewUrl = `${import.meta.env.VITE_WORKER_URL}/q/preview`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold">Crear QR</h1>
          <Link to="/dashboard" className="text-sm text-gray-500 hover:underline">Volver</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
          {PASOS.map((p, idx) => (
            <div key={p.num} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= p.num ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {p.num}
              </div>
              <span className={`ml-2 text-xs hidden sm:inline ${step >= p.num ? 'text-black font-medium' : 'text-gray-400'}`}>
                {p.label}
              </span>
              {idx < PASOS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > p.num ? 'bg-black' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">¿Dónde querés que llegue el QR?</h2>
              <p className="text-sm text-gray-500">Seleccioná la plataforma del contenido.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(PLATFORMS).map(([key, { label, Icon }]) => (
                  <button
                    key={key}
                    onClick={() => { setPlatform(key); setStep(2); }}
                    className={`p-4 rounded-xl border transition flex flex-col items-center gap-2 ${
                      platform === key
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-8 h-8" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && FormComponent && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold">Configurá el contenido</h2>
                <p className="text-sm text-gray-500">Completá los datos del enlace.</p>
              </div>

              <label className="block">
                <span className="text-sm font-medium">Nombre del QR</span>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej: Mi QR de WhatsApp"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </label>

              <FormComponent onChange={handleFormChange} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold">Personalizá la apariencia</h2>
                <p className="text-sm text-gray-500">Elegí colores y estilo del QR.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <QRStyleEditor onChange={setStyleData} />
                <div className="flex items-center justify-center">
                  <QRPreview
                    shortlink={previewUrl}
                    qrColor={styleData.qr_color ?? '#000000'}
                    qrBgColor={styleData.qr_bg_color ?? '#FFFFFF'}
                    qrStyle={styleData.qr_style ?? 'square'}
                    qrCornersStyle={styleData.qr_corners_style ?? 'square'}
                    qrCornersDotStyle={styleData.qr_corners_dot_style ?? 'square'}
                    qrLogoUrl={styleData.qr_logo_path}
                    qrImageSize={styleData.qr_image_size ?? 0.4}
                    qrImageMargin={styleData.qr_image_margin ?? 0}
                    qrErrorCorrection={styleData.qr_error_correction ?? 'H'}
                    qrFrameStyle={styleData.qr_frame_style ?? 'none'}
                    qrFrameText={styleData.qr_frame_text ?? 'Scan me'}
                    qrFrameTextColor={styleData.qr_frame_text_color ?? '#000000'}
                    size={200}
                    showActions={false}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold">Caducidad</h2>
                <p className="text-sm text-gray-500">Opcional: definí cuándo dejará de funcionar.</p>
              </div>
              <ExpiryConfig onChange={setExpiryData} />
            </div>
          )}

          {step === 5 && created && (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-lg font-semibold">¡QR creado!</h2>
                <p className="text-sm text-gray-500">Descargalo o copiá el link para compartir.</p>
              </div>

              <div className="max-w-xs mx-auto">
                <QRPreview
                  shortlink={created.shortlink}
                  qrColor={created.qr_color ?? '#000000'}
                  qrBgColor={created.qr_bg_color ?? '#FFFFFF'}
                  qrStyle={created.qr_style ?? 'square'}
                  qrCornersStyle={created.qr_corners_style ?? 'square'}
                  qrCornersDotStyle={created.qr_corners_dot_style ?? 'square'}
                  qrLogoUrl={created.qr_logo_path}
                  qrImageSize={created.qr_image_size ?? 0.4}
                  qrImageMargin={created.qr_image_margin ?? 0}
                  qrErrorCorrection={created.qr_error_correction ?? 'H'}
                  qrFrameStyle={created.qr_frame_style ?? 'none'}
                  qrFrameText={created.qr_frame_text ?? 'Scan me'}
                  qrFrameTextColor={created.qr_frame_text_color ?? '#000000'}
                  size={240}
                />
              </div>

              <p className="text-sm text-gray-500">
                Plataforma: <span className="font-medium text-gray-700">{PLATFORMS[platform]?.label}</span>
                &nbsp;·&nbsp;
                Slug: <span className="font-medium text-gray-700">{created.slug}</span>
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handleCreateAnother}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm"
                >
                  Crear otro
                </button>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
                >
                  Ir al panel
                </Link>
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          {step < 5 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              {step === 4 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear QR'}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
                >
                  Siguiente
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
