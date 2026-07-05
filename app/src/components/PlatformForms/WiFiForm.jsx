import { useState, useEffect } from 'react';

const ENCRYPTION_TYPES = [
  { value: 'WPA2', label: 'WPA2 (Recomendado)' },
  { value: 'WPA', label: 'WPA' },
  { value: 'WEP', label: 'WEP' },
  { value: 'none', label: 'Sin encriptación' }
];

export default function WiFiForm({ onChange, initial }) {
  const [ssid, setSsid] = useState(initial?.ssid || '');
  const [password, setPassword] = useState(initial?.password || '');
  const [encryption, setEncryption] = useState(initial?.encryption || 'WPA2');
  const [hidden, setHidden] = useState(initial?.hidden || false);

  useEffect(() => {
    if (onChange) {
      onChange({ ssid, password, encryption, hidden });
    }
  }, [ssid, password, encryption, hidden, onChange]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Nombre de la red (SSID)</span>
        <input
          type="text"
          value={ssid}
          onChange={e => setSsid(e.target.value)}
          placeholder="Mi WiFi"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Contraseña</span>
        <input
          type="text"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Tu contraseña del WiFi"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        {encryption === 'none' && password && (
          <p className="mt-1 text-sm text-amber-600">La contraseña no se usará porque la red no tiene encriptación.</p>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-medium">Tipo de seguridad</span>
        <select
          value={encryption}
          onChange={e => setEncryption(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          {ENCRYPTION_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={hidden}
          onChange={e => setHidden(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
        />
        <span className="text-sm">Red oculta</span>
      </label>
    </div>
  );
}
