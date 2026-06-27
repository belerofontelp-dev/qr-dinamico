import { useSearchParams } from 'react-router-dom';

export default function Expired() {
  const [params] = useSearchParams();
  const id = params.get('id');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold mb-3">QR Expirado</h1>
      <p className="text-gray-500 mb-2">
        Este código QR ya no está activo.
      </p>
      {id && <p className="text-sm text-gray-400">ID: {id}</p>}
    </div>
  );
}
