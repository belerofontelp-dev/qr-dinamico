import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { QR_PATTERNS, CORNER_STYLES, INNER_CORNER_STYLES } from '../../lib/qr-generator';
import { loadFramesIndex } from '../../lib/qr-frames';
import { cn } from '../../lib/cn';
import { ChevronDown, Upload, Trash2 } from 'lucide-react';

function CollapseSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#eeeeee] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#fafafa] hover:bg-[#f5f5f5] transition-colors"
      >
        <span className="text-sm font-bold text-[#131d29]">{title}</span>
        <ChevronDown className={cn('w-4 h-4 text-[#6e6e6e] transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

function ColorPicker({ value, onChange }) {
  return (
    <label className="relative inline-flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
          id={`color-${value}`}
        />
        <div
          className="w-9 h-9 rounded-lg border-2 border-[#eeeeee] shadow-sm"
          style={{ backgroundColor: value }}
          onClick={() => document.getElementById(`color-${value}`)?.click()}
        />
      </div>
      <span className="text-xs font-medium text-[#6e6e6e] uppercase">{value}</span>
    </label>
  );
}

export default function DesignStep({ styleData, onChange }) {
  const [color, setColor] = useState(styleData.qr_color ?? '#000000');
  const [bgColor, setBgColor] = useState(styleData.qr_bg_color ?? '#FFFFFF');
  const [pattern, setPattern] = useState(styleData.qr_style ?? 'square');
  const [cornersStyle, setCornersStyle] = useState(styleData.qr_corners_style ?? 'square');
  const [cornersDotStyle, setCornersDotStyle] = useState(styleData.qr_corners_dot_style ?? 'square');
  const [frameStyle, setFrameStyle] = useState(styleData.qr_frame_style ?? 'none');
  const [frameText, setFrameText] = useState(styleData.qr_frame_text ?? 'Scan me');
  const [frameTextColor, setFrameTextColor] = useState(styleData.qr_frame_text_color ?? '#000000');
  const [logoUrl, setLogoUrl] = useState(styleData.qr_logo_path ?? '');
  const [imageSize, setImageSize] = useState(styleData.qr_image_size ?? 0.4);
  const [imageMargin, setImageMargin] = useState(styleData.qr_image_margin ?? 0);
  const [errorCorrection, setErrorCorrection] = useState(styleData.qr_error_correction ?? 'H');
  const [frames, setFrames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    loadFramesIndex().then((result) => {
      setFrames(result.frames || []);
      setCategories(result.categories || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    onChange({
      qr_color: color,
      qr_bg_color: bgColor,
      qr_style: pattern,
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
  }, [color, bgColor, pattern, cornersStyle, cornersDotStyle, frameStyle, frameText, frameTextColor, logoUrl, imageSize, imageMargin, errorCorrection]);

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
        if (!res.ok) throw new Error((await res.json()).error ?? 'Upload error');
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

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-[#131d29]">3. Design your QR code</h3>

      <CollapseSection title="Color">
        <div className="flex gap-4">
          <div>
            <span className="text-xs text-[#6e6e6e] mb-1.5 block">Foreground</span>
            <ColorPicker value={color} onChange={setColor} />
          </div>
          <div>
            <span className="text-xs text-[#6e6e6e] mb-1.5 block">Background</span>
            <ColorPicker value={bgColor} onChange={setBgColor} />
          </div>
        </div>
      </CollapseSection>

      <CollapseSection title="QR Code Pattern">
        <div className="grid grid-cols-3 gap-2">
          {QR_PATTERNS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPattern(p.value)}
              className={cn(
                'py-2 px-2 rounded-lg border text-xs font-semibold transition-colors',
                pattern === p.value
                  ? 'border-[#8364ff] bg-[#f3f0ff] text-[#8364ff]'
                  : 'border-[#eeeeee] text-[#6e6e6e] hover:text-[#131d29] hover:border-[#d5d5d5]'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection title="Corner Style">
        <div className="space-y-3">
          <div>
            <span className="text-xs text-[#6e6e6e] mb-1.5 block">Outer Corners</span>
            <div className="flex gap-2">
              {CORNER_STYLES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCornersStyle(c.value)}
                  className={cn(
                    'flex-1 py-2 rounded-lg border text-xs font-semibold transition-colors',
                    cornersStyle === c.value
                      ? 'border-[#8364ff] bg-[#f3f0ff] text-[#8364ff]'
                      : 'border-[#eeeeee] text-[#6e6e6e] hover:text-[#131d29] hover:border-[#d5d5d5]'
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs text-[#6e6e6e] mb-1.5 block">Inner Corners</span>
            <div className="flex gap-2">
              {INNER_CORNER_STYLES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCornersDotStyle(c.value)}
                  className={cn(
                    'flex-1 py-2 rounded-lg border text-xs font-semibold transition-colors',
                    cornersDotStyle === c.value
                      ? 'border-[#8364ff] bg-[#f3f0ff] text-[#8364ff]'
                      : 'border-[#eeeeee] text-[#6e6e6e] hover:text-[#131d29] hover:border-[#d5d5d5]'
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CollapseSection>

      <CollapseSection title="Frame" defaultOpen={false}>
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setFrameStyle('none')}
              className={cn(
                'py-2 rounded-lg border text-xs font-semibold transition-colors',
                frameStyle === 'none'
                  ? 'border-[#8364ff] bg-[#f3f0ff] text-[#8364ff]'
                  : 'border-[#eeeeee] text-[#6e6e6e] hover:text-[#131d29] hover:border-[#d5d5d5]'
              )}
            >
              None
            </button>
            {frames.slice(0, 7).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFrameStyle(f.id)}
                className={cn(
                  'py-2 rounded-lg border text-xs font-semibold transition-colors truncate',
                  frameStyle === f.id
                    ? 'border-[#8364ff] bg-[#f3f0ff] text-[#8364ff]'
                    : 'border-[#eeeeee] text-[#6e6e6e] hover:text-[#131d29] hover:border-[#d5d5d5]'
                )}
              >
                {f.name}
              </button>
            ))}
          </div>
          {frameStyle !== 'none' && (
            <div className="space-y-3 pt-3 border-t border-[#eeeeee]">
              <label className="block">
                <span className="text-xs text-[#6e6e6e]">Frame Text</span>
                <input
                  type="text"
                  value={frameText}
                  onChange={(e) => setFrameText(e.target.value)}
                  className="mt-1 w-full h-9 rounded-lg border border-[#eeeeee] px-3 text-sm focus:outline-none focus:border-[#8364ff] focus:ring-2 focus:ring-[#8364ff]/15"
                />
              </label>
              <div>
                <span className="text-xs text-[#6e6e6e] mb-1 block">Text Color</span>
                <ColorPicker value={frameTextColor} onChange={setFrameTextColor} />
              </div>
            </div>
          )}
        </div>
      </CollapseSection>

      <CollapseSection title="Logo" defaultOpen={false}>
        <div className="space-y-3">
          {!logoUrl ? (
            <label className="flex flex-col items-center gap-2 py-4 px-3 border-2 border-dashed border-[#d5d5d5] rounded-xl cursor-pointer hover:border-[#8364ff] hover:bg-[#f3f0ff]/30 transition-colors">
              <Upload className="w-5 h-5 text-[#6e6e6e]" />
              <span className="text-xs font-semibold text-[#6e6e6e]">Upload Logo</span>
              <span className="text-[10px] text-[#a0a0a0]">PNG, JPG, SVG, WEBP (max 2MB)</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleLogoUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-[#f7f7f7] rounded-xl">
              <img src={logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-lg border border-[#eeeeee]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#131d29] truncate">Logo uploaded</p>
                <div className="flex gap-3 mt-1">
                  <label className="text-xs text-[#8364ff] cursor-pointer hover:underline">
                    Change
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  <button type="button" onClick={() => setLogoUrl('')} className="text-xs text-red-400 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
              <Trash2 className="w-4 h-4 text-[#a0a0a0] cursor-pointer hover:text-red-400" onClick={() => setLogoUrl('')} />
            </div>
          )}
          {uploading && <p className="text-xs text-[#6e6e6e]">Uploading...</p>}
          {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
          {logoUrl && (
            <div className="space-y-2">
              <label className="block">
                <span className="text-xs text-[#6e6e6e]">Logo Size ({Math.round(imageSize * 100)}%)</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={imageSize}
                  onChange={(e) => setImageSize(parseFloat(e.target.value))}
                  className="mt-1 w-full h-1.5 bg-[#eeeeee] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8364ff]"
                />
              </label>
              <label className="block">
                <span className="text-xs text-[#6e6e6e]">Logo Margin ({imageMargin}px)</span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={imageMargin}
                  onChange={(e) => setImageMargin(parseInt(e.target.value))}
                  className="mt-1 w-full h-1.5 bg-[#eeeeee] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8364ff]"
                />
              </label>
            </div>
          )}
        </div>
      </CollapseSection>

      <CollapseSection title="Error Correction" defaultOpen={false}>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: 'L', label: 'Low (7%)' },
            { value: 'M', label: 'Medium (15%)' },
            { value: 'Q', label: 'High (25%)' },
            { value: 'H', label: 'Max (30%)' }
          ].map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => setErrorCorrection(l.value)}
              className={cn(
                'py-2 rounded-lg border text-xs font-semibold transition-colors',
                errorCorrection === l.value
                  ? 'border-[#8364ff] bg-[#f3f0ff] text-[#8364ff]'
                  : 'border-[#eeeeee] text-[#6e6e6e] hover:text-[#131d29] hover:border-[#d5d5d5]'
              )}
            >
              <div>{l.label.split(' ')[0]}</div>
              <div className="text-[10px] opacity-70">{l.label.split(' ').slice(1).join(' ')}</div>
            </button>
          ))}
        </div>
      </CollapseSection>
    </div>
  );
}
