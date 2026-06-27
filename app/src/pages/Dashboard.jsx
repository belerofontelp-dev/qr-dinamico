import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQR } from '../hooks/useQR';
import { logout } from '../lib/supabase';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { qrCodes, loading, deleteQR } = useQR(user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">QR Dinámico</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">Salir</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Mis QRs</h2>
          <Link
            to="/create"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
          >
            + Nuevo QR
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
          </div>
        ) : qrCodes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">Todavía no creaste ningún QR.</p>
            <Link to="/create" className="text-blue-600 hover:underline">Crear el primero</Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {qrCodes.map(qr => (
              <div key={qr.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{qr.name}</p>
                  <p className="text-sm text-gray-500">
                    {qr.platform} · {qr.slug} · {qr.scan_count ?? 0} escaneos
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    qr.status === 'active' ? 'bg-green-100 text-green-800' : 
                    qr.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {qr.status === 'active' ? 'Activo' : qr.status === 'paused' ? 'Pausado' : 'Expirado'}
                  </span>
                  <Link to={`/edit/${qr.id}`} className="text-sm text-blue-600 hover:underline ml-2">Editar</Link>
                  <button onClick={() => deleteQR(qr.id)} className="text-sm text-red-600 hover:underline ml-2">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
