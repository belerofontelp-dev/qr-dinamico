import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PLATFORMS } from '../lib/platforms';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';
import QRStyleEditor from '../components/QREditor/QRStyleEditor';
import QRPreview from '../components/QREditor/QRPreview';
import ExpiryConfig from '../components/ExpiryConfig/ExpiryConfig';

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

  const [form, setForm] = useState({
    name: '',
    qr_color: '#000000',
    qr_bg_color: '#FFFFFF',
    qr_style: 'square',
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
            expires_at: data.expires_at || null,
            max_scans: data.max_scans || null,
            status: data.status || 'active'
          });
        }
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);

    const updates = {
      name: form.name,
      qr_color: form.qr_color,
      qr_bg_color: form.qr_bg_color,
      qr_style: form.qr_style,
      expires_at: form.expires_at,
      max_scans: form.max_scans,
      status: form.status,
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('qr_codes')
      .update(updates)
      .eq('id', id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setQr(prev => ({ ...prev, ...updates }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
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

  const platform = PLATFORMS[qr.platform] || PLATFORMS.url;
  const shortlink = `${import.meta.env.VITE_WORKER_URL}/q/${qr.slug}`;

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

              <QRStyleEditor
                onChange={(data) => updateForm(data)}
                initial={{
                  qr_color: form.qr_color,
                  qr_bg_color: form.qr_bg_color,
                  qr_style: form.qr_style
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
                <QRPreview
                  shortlink={shortlink}
                  qrColor={form.qr_color}
                  qrBgColor={form.qr_bg_color}
                  qrStyle={form.qr_style}
                  size={240}
                />
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
