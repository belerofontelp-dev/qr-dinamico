import { useState, useEffect, useCallback } from 'react';
import { QR_PATTERNS, CORNER_STYLES, INNER_CORNER_STYLES } from '../../lib/qr-generator';
import { loadFramesIndex } from '../../lib/qr-frames';
import { supabase } from '../../lib/supabase';

export default function QRStyleEditor({ onChange, initial = {} }) {
  const [color, setColor] = useState(initial.qr_color ?? '#000000');
  const [bgColor, setBgColor] = useState(initial.qr_bg_color ?? '#FFFFFF');
  const [style, setStyle] = useState(initial.qr_style ?? 'square');
  const [cornersStyle, setCornersStyle] = useState(initial.qr_corners_style ?? 'square');
  const [cornersDotStyle, setCornersDotStyle] = useState(initial.qr_corners_dot_style ?? 'square');
  const [frameStyle, setFrameStyle] = useState(initial.qr_frame_style ?? 'none');
  const [frameText, setFrameText] = useState(initial.qr_frame_text ?? 'Scan me');
  const [frameTextColor, setFrameTextColor] = useState(initial.qr_frame_text_color ?? '#000000');
  const [logoUrl, setLogoUrl] = useState(initial.qr_logo_path ?? '');
  const [imageSize, setImageSize] = useState(initial.qr_image_size ?? 0.4);
  const [imageMargin, setImageMargin] = useState(initial.qr_image_margin ?? 0);
  const [errorCorrection, setErrorCorrection] = useState(initial.qr_error_correction ?? 'H');

  const [frames, setFrames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    loadFramesIndex().then(({ frames, categories }) => {
      setFrames(frames);
      setCategories(categories);
    }).catch(() => {
      setFrames([]);
      setCategories([]);
    });
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange({
        qr_color: color,
        qr_bg_color: bgColor,
        qr_style: style,
        qr_corners_style: cornersStyle,
        qr_corners_dot_style: cornersDotStyle,
        qr_frame_style: frameStyle,
        qr_frame_text: frameText,
        qr_frame_text_color: frameTextColor,
        qr_logo_path: logoUrl || null,
        qr_image_size: imageSize,
        qr_image_margin: imageMargin,
        qr_error_correction: errorCorrection
      });
    }
  }, [
    color, bgColor, style, cornersStyle, cornersDotStyle,
    frameStyle, frameText, frameTextColor, logoUrl,
    imageSize, imageMargin, errorCorrection, onChange
  ]);

  const handleLogoUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-qr-logo`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ image: base64 })
          }
        );
        if (!res.ok) throw new Error((await res.json()).error ?? 'Error al subir logo');
        const { publicUrl } = await res.json();
        setLogoUrl(publicUrl);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadError(err.message);
      setUploading(false);
    }
  }, []);

  const removeLogo = () => setLogoUrl('');

  const renderOptionButton = (value, label, selected, onClick) => (
    <button
      key={value}
      type="button"
      onClick={() => onClick(value)}
      className={`px-3 py-2 rounded-lg border text-xs font-medium transition ${
        selected
          ? 'border-black bg-black text-white'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Colores */}
      <div className="space-y-3">
        <span className="text-sm font-medium">Colores del QR</span>
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
      </div>

      {/* Pattern */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Patrón del QR</span>
        <div className="flex flex-wrap gap-2">
          {QR_PATTERNS.map(p => renderOptionButton(p.value, p.label, style === p.value, setStyle))}
        </div>
      </div>

      {/* Corners */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Esquinas del QR</span>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-gray-500">Exteriores</span>
            <select
              value={cornersStyle}
              onChange={e => setCornersStyle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {CORNER_STYLES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-gray-500">Interiores</span>
            <select
              value={cornersDotStyle}
              onChange={e => setCornersDotStyle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {INNER_CORNER_STYLES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      {/* Frame */}
      <div className="space-y-3">
        <span className="text-sm font-medium">Frame</span>
        <select
          value={frameStyle}
          onChange={e => setFrameStyle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="none">Sin frame</option>
          {categories.map(cat => (
            <optgroup key={cat.id} label={cat.name}>
              {frames.filter(f => f.category === cat.id).map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </optgroup>
          ))}
        </select>

        {frameStyle !== 'none' && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="block">
              <span className="text-xs text-gray-500">Texto del frame</span>
              <input
                type="text"
                value={frameText}
                onChange={e => setFrameText(e.target.value)}
                placeholder="Scan me"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">Color del texto</span>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  value={frameTextColor}
                  onChange={e => setFrameTextColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                />
                <span className="text-xs text-gray-500">{frameTextColor}</span>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Logo */}
      <div className="space-y-3">
        <span className="text-sm font-medium">Logo</span>
        {!logoUrl ? (
          <label className="block">
            <span className="sr-only">Subir logo</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={handleLogoUpload}
              disabled={uploading}
              className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-black file:text-white file:text-xs file:font-medium hover:file:bg-gray-800 disabled:opacity-50"
            />
          </label>
        ) : (
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <img src={logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded border border-gray-200" />
            <button
              type="button"
              onClick={removeLogo}
              className="text-xs text-red-600 hover:underline"
            >
              Quitar logo
            </button>
          </div>
        )}
        {uploading && <p className="text-xs text-gray-500">Subiendo...</p>}
        {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}

        {logoUrl && (
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs text-gray-500">Tamaño del logo ({Math.round(imageSize * 100)}%)</span>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={imageSize}
                onChange={e => setImageSize(parseFloat(e.target.value))}
                className="mt-1 w-full"
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">Margen del logo ({imageMargin}px)</span>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={imageMargin}
                onChange={e => setImageMargin(parseInt(e.target.value))}
                className="mt-1 w-full"
              />
            </label>
          </div>
        )}
      </div>

      {/* Error correction */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Corrección de errores</span>
        <select
          value={errorCorrection}
          onChange={e => setErrorCorrection(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="L">Baja (L)</option>
          <option value="M">Media (M)</option>
          <option value="Q">Alta (Q)</option>
          <option value="H">Máxima (H) — recomendada con logo</option>
        </select>
      </div>
    </div>
  );
}
