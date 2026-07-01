import { useState, useEffect } from 'react';

export default function ExpiryConfig({ onChange }) {
  const [tipo, setTipo] = useState('none');
  const [fecha, setFecha] = useState('');
  const [escaneos, setEscaneos] = useState('');

  useEffect(() => {
    if (!onChange) return;

    const data = {};
    if (tipo === 'date' || tipo === 'both') {
      data.expires_at = fecha ? new Date(fecha).toISOString() : null;
    }
    if (tipo === 'scans' || tipo === 'both') {
      data.max_scans = escaneos ? parseInt(escaneos, 10) : null;
    }
    onChange(data);
  }, [tipo, fecha, escaneos, onChange]);

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Caducidad</span>

      {[
        { value: 'none', label: 'Sin caducidad' },
        { value: 'date', label: 'Por fecha' },
        { value: 'scans', label: 'Por cantidad de escaneos' },
        { value: 'both', label: 'Combinado (fecha y escaneos)' }
      ].map(op => (
        <label key={op.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="expiry"
            value={op.value}
            checked={tipo === op.value}
            onChange={e => setTipo(e.target.value)}
            className="text-black focus:ring-black"
          />
          <span className="text-sm text-gray-700">{op.label}</span>
        </label>
      ))}

      {(tipo === 'date' || tipo === 'both') && (
        <label className="block">
          <span className="text-xs text-gray-500">Fecha y hora de expiración</span>
          <input
            type="datetime-local"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </label>
      )}

      {(tipo === 'scans' || tipo === 'both') && (
        <label className="block">
          <span className="text-xs text-gray-500">Cantidad máxima de escaneos</span>
          <input
            type="number"
            min="1"
            value={escaneos}
            onChange={e => setEscaneos(e.target.value)}
            placeholder="100"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </label>
      )}
    </div>
  );
}
