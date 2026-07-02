import { useState, useEffect } from 'react';

export default function InstagramForm({ onChange, initial }) {
  const [mode, setMode] = useState(initial?.mode || 'profile');
  const [username, setUsername] = useState(initial?.username || '');
  const [postId, setPostId] = useState(initial?.post_id || '');

  useEffect(() => {
    if (onChange) {
      onChange({ username, post_id: postId, mode });
    }
  }, [mode, username, postId, onChange]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Tipo</span>
        <select
          value={mode}
          onChange={e => setMode(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="profile">Perfil</option>
          <option value="post">Post específico</option>
        </select>
      </label>

      {mode === 'profile' ? (
        <label className="block">
          <span className="text-sm font-medium">Usuario de Instagram</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-gray-500">instagram.com/</span>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9._]/g, ''))}
              placeholder="usuario"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </label>
      ) : (
        <label className="block">
          <span className="text-sm font-medium">ID del post</span>
          <input
            type="text"
            value={postId}
            onChange={e => setPostId(e.target.value)}
            placeholder="CwZ9abc123"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </label>
      )}
    </div>
  );
}
