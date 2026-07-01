import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">QR Dinámico</h1>
      <p className="text-lg text-gray-600 max-w-lg mb-8">
        Crea códigos QR con contenido que podés actualizar cuando quieras.
        El QR nunca cambia — el destino sí.
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Comenzar
        </Link>
        <a
            href="https://github.com/belerofontelp-dev/qr-dinamico"
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
