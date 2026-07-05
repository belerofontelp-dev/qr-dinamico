import { useState, useEffect } from 'react';

export default function AppStoreForm({ onChange, initial }) {
  const [iosUrl, setIosUrl] = useState(initial?.ios_url || '');
  const [androidUrl, setAndroidUrl] = useState(initial?.android_url || '');
  const [iosError, setIosError] = useState('');
  const [androidError, setAndroidError] = useState('');

  useEffect(() => {
    if (onChange) {
      onChange({ ios_url: iosUrl, android_url: androidUrl });
    }
  }, [iosUrl, androidUrl, onChange]);

  const validateAppleUrl = (value) => {
    setIosUrl(value);
    if (value && !value.match(/^https:\/\/apps\.apple\.com\/.+/i)) {
      setIosError('Debe empezar con https://apps.apple.com/...');
    } else {
      setIosError('');
    }
  };

  const validateAndroidUrl = (value) => {
    setAndroidUrl(value);
    if (value && !value.match(/^https:\/\/play\.google\.com\/.+/i)) {
      setAndroidError('Debe empezar con https://play.google.com/...');
    } else {
      setAndroidError('');
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        El QR detectará automáticamente el sistema operativo y redirigirá a la tienda correcta.
      </p>

      <label className="block">
        <span className="text-sm font-medium">App Store (iOS)</span>
        <input
          type="url"
          value={iosUrl}
          onChange={e => validateAppleUrl(e.target.value)}
          placeholder="https://apps.apple.com/app/id123456789"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
        {iosError && <p className="mt-1 text-sm text-red-600">{iosError}</p>}
      </label>

      <label className="block">
        <span className="text-sm font-medium">Google Play Store (Android)</span>
        <input
          type="url"
          value={androidUrl}
          onChange={e => validateAndroidUrl(e.target.value)}
          placeholder="https://play.google.com/store/apps/details?id=com.ejemplo"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
        {androidError && <p className="mt-1 text-sm text-red-600">{androidError}</p>}
      </label>
    </div>
  );
}
