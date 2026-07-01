import { useState, useEffect } from 'react';

const PAISES = [
  { code: '54', name: 'Argentina', flag: '🇦🇷' },
  { code: '55', name: 'Brasil', flag: '🇧🇷' },
  { code: '56', name: 'Chile', flag: '🇨🇱' },
  { code: '57', name: 'Colombia', flag: '🇨🇴' },
  { code: '52', name: 'México', flag: '🇲🇽' },
  { code: '51', name: 'Perú', flag: '🇵🇪' },
  { code: '598', name: 'Uruguay', flag: '🇺🇾' },
  { code: '58', name: 'Venezuela', flag: '🇻🇪' },
  { code: '1', name: 'EE.UU.', flag: '🇺🇸' },
  { code: '34', name: 'España', flag: '🇪🇸' }
];

export default function WhatsAppForm({ onChange }) {
  const [pais, setPais] = useState('54');
  const [numero, setNumero] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (onChange) {
      const phone = `${pais}${numero}`;
      onChange({ phone, message: mensaje });
    }
  }, [pais, numero, mensaje, onChange]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">País</span>
        <select
          value={pais}
          onChange={e => setPais(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          {PAISES.map(p => (
            <option key={p.code} value={p.code}>{p.flag} {p.name} (+{p.code})</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Número de teléfono</span>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm text-gray-500">+{pais}</span>
          <input
            type="tel"
            value={numero}
            onChange={e => setNumero(e.target.value.replace(/\D/g, ''))}
            placeholder="1123456789"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Mensaje predefinido (opcional)</span>
        <textarea
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          placeholder="Hola, me contacto desde tu QR"
          rows={3}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </label>
    </div>
  );
}
