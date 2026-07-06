import { useState, useEffect } from 'react';
import { toISOLocal, formatDateTimeLocal } from '../../lib/date';
import { cn } from '../../lib/cn';

const OPCIONES = [
  { value: 'none', label: 'Sin caducidad' },
  { value: 'date', label: 'Por fecha' },
  { value: 'scans', label: 'Por escaneos' },
  { value: 'both', label: 'Combinado' }
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
      <div className="grid grid-cols-2 gap-2">
        {OPCIONES.map(op => (
          <button
            key={op.value}
            type="button"
            onClick={() => setTipo(op.value)}
            className={cn(
              'py-2.5 rounded-lg border-2 text-xs font-semibold transition-all',
              tipo === op.value
                ? 'border-[#8364ff] bg-[#f3f0ff] text-[#8364ff]'
                : 'border-[#eeeeee] text-[#6e6e6e] hover:border-[#d5d5d5]'
            )}
          >
            {op.label}
          </button>
        ))}
      </div>

      {(tipo === 'date' || tipo === 'both') && (
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#6e6e6e]">
            Fecha y hora de expiración
          </label>
          <input
            type="datetime-local"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            className="w-full min-h-[2.5rem] rounded-lg border border-[#e0e0e0] bg-white px-3.5 py-2.5 text-sm text-[#131d29] focus:outline-none focus:border-[#8364ff] focus:ring-2 focus:ring-[#8364ff]/15 transition-colors"
          />
        </div>
      )}

      {(tipo === 'scans' || tipo === 'both') && (
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#6e6e6e]">
            Cantidad máxima de escaneos
          </label>
          <input
            type="number"
            min="1"
            value={escaneos}
            onChange={e => setEscaneos(e.target.value)}
            placeholder="100"
            className="w-full min-h-[2.5rem] rounded-lg border border-[#e0e0e0] bg-white px-3.5 py-2.5 text-sm text-[#131d29] placeholder:text-[#a0a0a0] focus:outline-none focus:border-[#8364ff] focus:ring-2 focus:ring-[#8364ff]/15 transition-colors"
          />
        </div>
      )}
    </div>
  );
}
