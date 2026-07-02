import { useState, useEffect } from 'react';

export default function TwitterForm({ onChange, initial }) {
  const [mode, setMode] = useState(initial?.mode || 'profile');
  const [username, setUsername] = useState(initial?.username || '');
  const [text, setText] = useState(initial?.text || '');
  const [tweetUrl, setTweetUrl] = useState(initial?.url || '');

  useEffect(() => {
    if (onChange) {
      onChange({ username, text, url: tweetUrl, mode });
    }
  }, [mode, username, text, tweetUrl, onChange]);

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
          <option value="tweet">Tweet prellenado</option>
        </select>
      </label>

      {mode === 'profile' ? (
        <label className="block">
          <span className="text-sm font-medium">Usuario de X/Twitter</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-gray-500">twitter.com/</span>
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
        <>
          <label className="block">
            <span className="text-sm font-medium">Texto del tweet</span>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Escribí el texto..."
              rows={3}
              maxLength={280}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{text.length}/280</p>
          </label>

          <label className="block">
            <span className="text-sm font-medium">URL adjunta (opcional)</span>
            <input
              type="url"
              value={tweetUrl}
              onChange={e => setTweetUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </label>
        </>
      )}
    </div>
  );
}
