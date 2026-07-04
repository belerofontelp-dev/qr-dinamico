import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQR } from '../hooks/useQR';
import { logout } from '../lib/supabase';
import { PLATFORMS } from '../lib/platforms';
import QRPreview from '../components/QREditor/QRPreview';
import { generateQRCode, downloadQRPNG, downloadQRSVG } from '../lib/qr-generator';

const FILTROS = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'paused', label: 'Pausados' },
  { value: 'expired', label: 'Expirados' }
];

const POR_PAGINA = 9;

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { qrCodes, loading, deleteQR } = useQR(user);
  const navigate = useNavigate();

  const [filtro, setFiltro] = useState('all');
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  const filtrados = useMemo(() => {
    let lista = qrCodes;

    if (filtro !== 'all') {
      lista = lista.filter(qr => qr.status === filtro);
    }

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      lista = lista.filter(qr =>
        qr.name.toLowerCase().includes(q) ||
        qr.slug.toLowerCase().includes(q)
      );
    }

    return lista;
  }, [qrCodes, filtro, busqueda]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  useEffect(() => {
    setPagina(1);
  }, [filtro, busqueda]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold">QR Dinámico</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">{user?.email}</span>
            <button onClick={logout} className="text-sm text-red-600 hover:underline">Salir</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">Mis QRs</h2>
            <p className="text-sm text-gray-500">
              {filtrados.length} {filtrados.length === 1 ? 'QR' : 'QRs'} en total
            </p>
          </div>
          <Link
            to="/create"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm text-center"
          >
            + Nuevo QR
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o slug..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTROS.map(f => (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filtro === f.value
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
          </div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 mb-4 text-lg">No encontramos QRs</p>
            <p className="text-sm text-gray-400 mb-6">{busqueda ? 'Probá con otra búsqueda' : 'Creá tu primer QR para empezar'}</p>
            {!busqueda && (
              <Link to="/create" className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm">
                Crear QR
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginados.map(qr => (
                <QRCard key={qr.id} qr={qr} onDelete={deleteQR} />
              ))}
            </div>

            {totalPaginas > 1 && (
              <div className="flex items-center justify-between mt-8">
                <p className="text-sm text-gray-500">
                  Mostrando {(pagina - 1) * POR_PAGINA + 1} - {Math.min(pagina * POR_PAGINA, filtrados.length)} de {filtrados.length}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                    disabled={pagina === totalPaginas}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function QRCard({ qr, onDelete }) {
  const shortlink = `${import.meta.env.VITE_WORKER_URL}/q/${qr.slug}`;
  const platform = PLATFORMS[qr.platform] || PLATFORMS.url;
  const Icon = platform.Icon;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortlink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = (extension) => {
    const code = generateQRCode(shortlink, {
      qrColor: qr.qr_color ?? '#000000',
      qrBgColor: qr.qr_bg_color ?? '#FFFFFF',
      qrStyle: qr.qr_style ?? 'square',
      qrCornersStyle: qr.qr_corners_style ?? 'square',
      qrCornersDotStyle: qr.qr_corners_dot_style ?? 'square',
      qrLogoUrl: qr.qr_logo_path,
      qrImageSize: qr.qr_image_size ?? 0.4,
      qrImageMargin: qr.qr_image_margin ?? 0,
      qrErrorCorrection: qr.qr_error_correction ?? 'H',
      width: 1024,
      height: 1024
    });
    if (extension === 'png') downloadQRPNG(code, `qr-${qr.slug}`);
    else downloadQRSVG(code, `qr-${qr.slug}`);
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    active: 'Activo',
    paused: 'Pausado',
    expired: 'Expirado'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">
      <div className="p-4 flex gap-4">
        <div className="shrink-0">
          <QRPreview
            shortlink={shortlink}
            qrColor={qr.qr_color ?? '#000000'}
            qrBgColor={qr.qr_bg_color ?? '#FFFFFF'}
            qrStyle={qr.qr_style ?? 'square'}
            qrCornersStyle={qr.qr_corners_style ?? 'square'}
            qrCornersDotStyle={qr.qr_corners_dot_style ?? 'square'}
            qrLogoUrl={qr.qr_logo_path}
            qrImageSize={qr.qr_image_size ?? 0.4}
            qrImageMargin={qr.qr_image_margin ?? 0}
            qrErrorCorrection={qr.qr_error_correction ?? 'H'}
            qrFrameStyle={qr.qr_frame_style ?? 'none'}
            qrFrameText={qr.qr_frame_text ?? 'Scan me'}
            qrFrameTextColor={qr.qr_frame_text_color ?? '#000000'}
            size={100}
            showActions={false}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-900 truncate">{qr.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[qr.status] || 'bg-gray-100'}`}>
              {statusLabels[qr.status] || qr.status}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
            <Icon className="w-4 h-4" />
            <span>{platform.label}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1 truncate">{qr.slug}</p>
          <p className="text-xs text-gray-400">{qr.scan_count ?? 0} escaneos</p>
        </div>
      </div>

      <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-2">
        <button
          onClick={handleCopy}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
            copied ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {copied ? 'Copiado' : 'Copiar link'}
        </button>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleDownload('png')}
            className="text-xs font-medium px-2 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            PNG
          </button>
          <button
            onClick={() => handleDownload('svg')}
            className="text-xs font-medium px-2 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            SVG
          </button>
          <Link
            to={`/edit/${qr.id}`}
            className="text-xs font-medium text-blue-600 hover:underline px-2 py-1.5"
          >
            Editar
          </Link>
          <button
            onClick={() => onDelete(qr.id)}
            className="text-xs font-medium text-red-600 hover:underline px-2 py-1.5"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
