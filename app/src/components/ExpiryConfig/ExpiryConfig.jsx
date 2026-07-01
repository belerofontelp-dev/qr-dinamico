import { useState, useEffect } from 'react';
import { toISOLocal, formatDateTimeLocal } from '../../lib/date';

const OPCIONES = [
  { value: 'none', label: 'Sin caducidad' },
  { value: 'date', label: 'Por fecha' },
  { value: 'scans', label: 'Por cantidad de escaneos' },
  { value: 'both', label: 'Combinado (fecha y escaneos)' }
];

function detectTipo(initial) {
  const hasDate = !!initial?.expires_at;
  const hasScans = !!initial?.max_scans;
  if (hasDate && hasScans) return 'both';
  if (hasDate) return 'date';
  if (hasScans) return 'scans';
  return 'none';
}

export default function ExpiryConfig({ onChange, initial }) {
  const [tipo, setTipo] = useState(() => detectTipo(initial));
  const [fecha, setFecha] = useState(() => formatDateTimeLocal(initial?.expires_at) || '');
  const [escaneos, setEscaneos] = useState(() => initial?.max_scans?.toString() || '');

  useEffect(() => {
    if (!onChange) return;

    const data = {};
    if (tipo === 'date' || tipo === 'both') {
      data.expires_at = fecha ? toISOLocal(fecha) : null;
    } else {
      data.expires_at = null;
    }

    if (tipo === 'scans' || tipo === 'both') {
      data.max_scans = escaneos ? parseInt(escaneos, 10) : null;
    } else {
      data.max_scans = null;
    }

    onChange(data);
  }, [tipo, fecha, escaneos, onChange]);

  return (
    <div className="space-y-4">
      <span className="text-sm font-medium">Caducidad</span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {OPCIONES.map(op => (
          <label
            key={op.value}
            className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border transition ${
              tipo === op.value
                ? 'border-black bg-gray-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
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
      </div>

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
