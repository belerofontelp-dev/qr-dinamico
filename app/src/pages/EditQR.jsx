import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';
import QRStyleEditor from '../components/QREditor/QRStyleEditor';
import ExpiryConfig from '../components/ExpiryConfig/ExpiryConfig';

export default function EditQR() {
  const { id } = useParams();
  const [tab, setTab] = useState('config');
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('qr_codes')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (!error) setQr(data);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async (updates) => {
    setSaving(true);
    setError('');
    setSaved(false);
    const { error: updateError } = await supabase
      .from('qr_codes')
      .update(updates)
      .eq('id', id);
    if (updateError) {
      setError(updateError.message);
    } else {
      setQr(prev => ({ ...prev, ...updates }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">{qr.name}</h1>
          <p className="text-xs text-gray-500">
            {qr.platform} · slug: {qr.slug} · {qr.scan_count ?? 0} escaneos
          </p>
        </div>
        <Link to="/dashboard" className="text-sm text-gray-500 hover:underline">Volver</Link>
      </header>

      <div className="max-w-lg mx-auto p-4">
        <div className="flex border-b border-gray-200 mb-4">
          {['config', 'stats'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                tab === t ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'config' ? 'Configuración' : 'Estadísticas'}
            </button>
          ))}
        </div>

        {tab === 'config' ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
            <QRStyleEditor
              onChange={(data) => handleSave(data)}
              initial={{ qr_color: qr.qr_color, qr_bg_color: qr.qr_bg_color, qr_style: qr.qr_style }}
            />

            <hr className="border-gray-200" />

            <ExpiryConfig
              onChange={(data) => handleSave(data)}
              initial={qr}
            />

            <div className="space-y-2">
              <label className="block">
                <span className="text-sm font-medium">Estado</span>
                <select
                  value={qr.status}
                  onChange={e => handleSave({ status: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="active">Activo</option>
                  <option value="paused">Pausado</option>
                  <option value="expired">Expirado</option>
                </select>
              </label>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {saved && <p className="text-sm text-green-600">Cambios guardados.</p>}
          </div>
        ) : (
          <AnalyticsDashboard qrId={id} />
        )}
      </div>
    </div>
  );
}
