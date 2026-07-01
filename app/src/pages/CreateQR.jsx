import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQR } from '../hooks/useQR';
import WhatsAppForm from '../components/PlatformForms/WhatsAppForm';
import UrlForm from '../components/PlatformForms/UrlForm';
import QRPreview from '../components/QREditor/QRPreview';

const PLATFORM_FORMS = {
  whatsapp: { component: WhatsAppForm, label: 'WhatsApp' },
  url: { component: UrlForm, label: 'URL genérica' }
};

export default function CreateQR() {
  const { user } = useAuth();
  const { createQR } = useQR(user);
  const navigate = useNavigate();

  const [platform, setPlatform] = useState('whatsapp');
  const [name, setName] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null);

  const handleFormChange = useCallback((data) => {
    setFormData(data);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');

    try {
      const payload = { name, platform, ...formData };
      const qr = await createQR(payload);
      setCreated(qr);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setCreated(null);
    setName('');
    setFormData({});
  };

  const FormComponent = PLATFORM_FORMS[platform]?.component;

  if (created) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <h1 className="text-lg font-semibold">QR creado</h1>
        </header>
        <main className="max-w-lg mx-auto p-4 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <QRPreview
              shortlink={created.shortlink}
              qrColor={created.qr_color ?? '#000000'}
              qrBgColor={created.qr_bg_color ?? '#FFFFFF'}
              qrStyle={created.qr_style ?? 'square'}
            />
          </div>
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-500">
              Plataforma: <span className="font-medium text-gray-700">{platform}</span>
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
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Crear QR</h1>
        <Link to="/dashboard" className="text-sm text-gray-500 hover:underline">
          Volver
        </Link>
      </header>

      <main className="max-w-lg mx-auto p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
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

          <label className="block">
            <span className="text-sm font-medium">Plataforma</span>
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {Object.entries(PLATFORM_FORMS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>

          {FormComponent && <FormComponent onChange={handleFormChange} />}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear QR'}
          </button>
        </form>
      </main>
    </div>
  );
}
