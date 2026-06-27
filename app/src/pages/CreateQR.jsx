import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQR } from '../hooks/useQR';

export default function CreateQR() {
  const { user } = useAuth();
  const { createQR } = useQR(user);
  const navigate = useNavigate();
  const [platform, setPlatform] = useState('whatsapp');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      await createQR({
        name,
        platform,
        url: 'https://ejemplo.com'
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-semibold">Crear QR</h1>
      </header>
      <main className="max-w-lg mx-auto p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
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
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="telegram">Telegram</option>
              <option value="twitter">X / Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="url">URL genérica</option>
            </select>
          </label>

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
