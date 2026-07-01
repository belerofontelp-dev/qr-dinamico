import { useState, useEffect } from 'react';

export default function UrlForm({ onChange }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (onChange) {
      onChange({ url });
    }
  }, [url, onChange]);

  const handleChange = (e) => {
    const value = e.target.value;
    setUrl(value);

    if (value && !value.match(/^https?:\/\/.+/i)) {
      setError('Ingresá una URL válida (debe empezar con http:// o https://)');
    } else {
      setError('');
    }
  };

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">URL de destino</span>
        <input
          type="url"
          value={url}
          onChange={handleChange}
          placeholder="https://ejemplo.com"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </label>
    </div>
  );
}
