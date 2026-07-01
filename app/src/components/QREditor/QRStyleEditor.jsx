import { useState, useEffect } from 'react';

const ESTILOS = [
  { value: 'square', label: 'Cuadrados' },
  { value: 'dots', label: 'Puntos' },
  { value: 'rounded', label: 'Redondeados' }
];

export default function QRStyleEditor({ onChange, initial = {} }) {
  const [color, setColor] = useState(initial.qr_color ?? '#000000');
  const [bgColor, setBgColor] = useState(initial.qr_bg_color ?? '#FFFFFF');
  const [style, setStyle] = useState(initial.qr_style ?? 'square');

  useEffect(() => {
    if (onChange) {
      onChange({ qr_color: color, qr_bg_color: bgColor, qr_style: style });
    }
  }, [color, bgColor, style, onChange]);

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Personalización del QR</span>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs text-gray-500">Color principal</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-gray-300"
            />
            <span className="text-xs text-gray-500">{color}</span>
          </div>
        </label>

        <label className="block">
          <span className="text-xs text-gray-500">Color de fondo</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={e => setBgColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-gray-300"
            />
            <span className="text-xs text-gray-500">{bgColor}</span>
          </div>
        </label>
      </div>

      <label className="block">
        <span className="text-xs text-gray-500">Estilo</span>
        <select
          value={style}
          onChange={e => setStyle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          {ESTILOS.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
