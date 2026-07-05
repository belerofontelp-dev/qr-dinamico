import { useState, useEffect } from 'react';

export default function FacebookForm({ onChange, initial }) {
  const [mode, setMode] = useState(initial?.mode || 'profile');
  const [username, setUsername] = useState(initial?.username || '');
  const [pageId, setPageId] = useState(initial?.page_id || '');

  useEffect(() => {
    if (onChange) {
      onChange({ username, page_id: pageId, mode });
    }
  }, [mode, username, pageId, onChange]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Tipo</span>
        <select
          value={mode}
          onChange={e => setMode(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="profile">Perfil personal</option>
          <option value="page">Página</option>
        </select>
      </label>

      {mode === 'profile' ? (
        <label className="block">
          <span className="text-sm font-medium">Usuario de Facebook</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-gray-500">facebook.com/</span>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9.]/g, ''))}
              placeholder="usuario"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </label>
      ) : (
        <label className="block">
          <span className="text-sm font-medium">ID o nombre de la página</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-gray-500">facebook.com/</span>
            <input
              type="text"
              value={pageId}
              onChange={e => setPageId(e.target.value.replace(/\s/g, ''))}
              placeholder="MiPagina"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </label>
      )}
    </div>
  );
}
