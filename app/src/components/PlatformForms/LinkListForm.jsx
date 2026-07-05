import { useState, useEffect } from 'react';

export default function LinkListForm({ onChange, initial }) {
  const [links, setLinks] = useState(initial?.links || [
    { title: '', url: '', icon: 'link' }
  ]);

  useEffect(() => {
    if (onChange) {
      onChange({ links });
    }
  }, [links, onChange]);

  const addLink = () => {
    setLinks([...links, { title: '', url: '', icon: 'link' }]);
  };

  const removeLink = (idx) => {
    if (links.length <= 1) return;
    setLinks(links.filter((_, i) => i !== idx));
  };

  const updateLink = (idx, field, value) => {
    const updated = links.map((l, i) => i === idx ? { ...l, [field]: value } : l);
    setLinks(updated);
  };

  const moveLink = (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= links.length) return;
    const updated = [...links];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    setLinks(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Links ({links.length})</span>
        <button
          type="button"
          onClick={addLink}
          className="text-sm text-blue-600 hover:underline"
        >
          + Agregar link
        </button>
      </div>

      <div className="space-y-3">
        {links.map((link, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Link {idx + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveLink(idx, -1)}
                  disabled={idx === 0}
                  className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30 px-1"
                  title="Subir"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveLink(idx, 1)}
                  disabled={idx === links.length - 1}
                  className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30 px-1"
                  title="Bajar"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => removeLink(idx)}
                  disabled={links.length <= 1}
                  className="text-xs text-red-500 hover:text-red-700 disabled:opacity-30 px-1"
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
            </div>

            <input
              type="text"
              value={link.title}
              onChange={e => updateLink(idx, 'title', e.target.value)}
              placeholder="Título del link"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="url"
              value={link.url}
              onChange={e => updateLink(idx, 'url', e.target.value)}
              placeholder="https://ejemplo.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <label className="block">
              <span className="text-xs text-gray-500 mb-1 block">Ícono</span>
              <select
                value={link.icon}
                onChange={e => updateLink(idx, 'icon', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="link">Link</option>
                <option value="shopping">Tienda</option>
                <option value="youtube">YouTube</option>
                <option value="spotify">Spotify</option>
                <option value="discord">Discord</option>
                <option value="email">Email</option>
                <option value="phone">Teléfono</option>
                <option value="map">Ubicación</option>
                <option value="calendar">Agendar</option>
                <option value="document">Documento</option>
              </select>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
