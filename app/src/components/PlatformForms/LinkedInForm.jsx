import { useState, useEffect } from 'react';

export default function LinkedInForm({ onChange, initial }) {
  const [mode, setMode] = useState(initial?.mode || 'profile');
  const [username, setUsername] = useState(initial?.username || '');
  const [company, setCompany] = useState(initial?.company || '');

  useEffect(() => {
    if (onChange) {
      onChange({ username, company, mode });
    }
  }, [mode, username, company, onChange]);

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
          <option value="company">Página de empresa</option>
        </select>
      </label>

      {mode === 'profile' ? (
        <label className="block">
          <span className="text-sm font-medium">Usuario de LinkedIn</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-gray-500">linkedin.com/in/</span>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
              placeholder="usuario"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </label>
      ) : (
        <label className="block">
          <span className="text-sm font-medium">Nombre de la empresa</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-gray-500">linkedin.com/company/</span>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
              placeholder="empresa"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </label>
      )}
    </div>
  );
}
