import { useState, useEffect } from 'react';

export default function TelegramForm({ onChange, initial }) {
  const [mode, setMode] = useState(initial?.mode || 'user');
  const [username, setUsername] = useState(initial?.username || '');
  const [inviteHash, setInviteHash] = useState(initial?.invite_hash || '');

  useEffect(() => {
    if (onChange) {
      onChange({ username, invite_hash: inviteHash, mode });
    }
  }, [mode, username, inviteHash, onChange]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Tipo</span>
        <select
          value={mode}
          onChange={e => setMode(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="user">Usuario o bot</option>
          <option value="invite">Grupo (invite link)</option>
        </select>
      </label>

      {mode === 'user' ? (
        <label className="block">
          <span className="text-sm font-medium">Usuario de Telegram</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-gray-500">t.me/</span>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              placeholder="usuario"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </label>
      ) : (
        <label className="block">
          <span className="text-sm font-medium">Hash de invitación</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-gray-500">t.me/+</span>
            <input
              type="text"
              value={inviteHash}
              onChange={e => setInviteHash(e.target.value)}
              placeholder="ABC123xyz"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </label>
      )}
    </div>
  );
}
