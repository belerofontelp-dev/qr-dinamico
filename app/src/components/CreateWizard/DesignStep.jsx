import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { QR_PATTERNS, CORNER_STYLES, INNER_CORNER_STYLES, GRADIENT_STYLES } from '../../lib/qr-generator';
import { loadFramesIndex } from '../../lib/qr-frames';
import AccordionCard from '../ui/AccordionCard';
import ExpiryConfig from '../ExpiryConfig/ExpiryConfig';
import { cn } from '../../lib/cn';
import { Upload, Trash2, Clock } from 'lucide-react';

function PatternThumbnail({ type, selected, onClick }) {
  const renderDots = () => {
    const size = 4;
    const gap = 6;
    const dots = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        dots.push(
          <rect
            key={`${row}-${col}`}
            x={col * gap + 2}
            y={row * gap + 2}
            width={type === 'dots' ? 3.5 : size}
            height={type === 'dots' ? 3.5 : size}
            rx={
              type === 'extra-rounded' ? 3 :
              type === 'rounded' ? 1.5 :
              type === 'classy' || type === 'classy-rounded' ? (type === 'classy-rounded' ? 2 : 0) : 0
            }
            fill="#131d29"
          />
        );
      }
    }
    if (type === 'classy' || type === 'classy-rounded') {
      return (
        <g transform="rotate(45, 12, 12)">
          {dots}
        </g>
      );
    }
    return <>{dots}</>;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-150 w-full',
        selected
          ? 'border-[#8364ff] bg-[#f3f0ff]'
          : 'border-[#eeeeee] bg-white hover:border-[#d5d5d5]'
      )}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="4" fill="#f7f7f7" />
        <g transform="translate(2, 2)">
          {renderDots()}
        </g>
      </svg>
      <span className="text-[10px] font-semibold text-[#6e6e6e] leading-tight text-center">
        {type === 'square' ? 'Cuadrados' :
         type === 'dots' ? 'Puntos' :
         type === 'rounded' ? 'Redond.' :
         type === 'extra-rounded' ? 'Muy red.' :
         type === 'classy' ? 'Elegante' :
         type === 'classy-rounded' ? 'Eleg. red.' : type}
      </span>
    </button>
  );
}

function CornerThumbnail({ type, selected, onClick, cornersStyle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-150 w-full',
        selected
          ? 'border-[#8364ff] bg-[#f3f0ff]'
          : 'border-[#eeeeee] bg-white hover:border-[#d5d5d5]'
      )}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="4" fill="#f7f7f7" />
        <rect
          x="2" y="2" width="9" height="9"
          rx={type === 'extra-rounded' ? 4 : type === 'dot' ? 1 : 0}
          fill="#131d29"
        />
        <rect
          x="17" y="2" width="9" height="9"
          rx={type === 'extra-rounded' ? 4 : type === 'dot' ? 1 : 0}
          fill="#131d29"
        />
        <rect
          x="2" y="17" width="9" height="9"
          rx={type === 'extra-rounded' ? 4 : type === 'dot' ? 1 : 0}
          fill="#131d29"
        />
      </svg>
      <span className="text-[10px] font-semibold text-[#6e6e6e] leading-tight text-center">
        {type === 'square' ? 'Cuadrado' :
         type === 'dot' ? 'Punto' :
         type === 'extra-rounded' ? 'Redond.' : type}
      </span>
    </button>
  );
}

function ColorInput({ value, onChange, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative">
        <div
          className="w-10 h-10 rounded-lg border-2 border-[#e0e0e0] shadow-sm cursor-pointer"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>
      <div className="flex-1">
        {label && <span className="text-[10px] text-[#a0a0a0] block mb-0.5">{label}</span>}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
          }}
          className="w-full h-9 rounded-lg border border-[#e0e0e0] bg-white px-3 text-xs text-[#131d29] font-mono uppercase focus:outline-none focus:border-[#8364ff] focus:ring-2 focus:ring-[#8364ff]/15"
          maxLength={7}
        />
      </div>
    </div>
  );
}

function GradientSelector({ label, value, onChange, color1, onChangeColor1, color2, onChangeColor2 }) {
  return (
    <div>
      <span className="text-xs font-semibold text-[#6e6e6e] mb-2 block">{label}</span>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {GRADIENT_STYLES.map((g) => (
          <button
            key={g.value}
            type="button"
            onClick={() => onChange(g.value)}
            className={cn(
              'px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold transition-all',
              value === g.value
                ? 'border-[#8364ff] bg-[#f3f0ff] text-[#8364ff]'
                : 'border-[#eeeeee] text-[#6e6e6e] hover:border-[#d5d5d5]'
            )}
          >
            {g.label}
          </button>
        ))}
      </div>
      {value !== 'none' && (
        <div className="flex gap-3 mt-2">
          <div className="flex-1">
            <span className="text-[10px] text-[#a0a0a0] block mb-1">Color 1</span>
            <ColorInput value={color1} onChange={onChangeColor1} />
          </div>
          <div className="flex-1">
            <span className="text-[10px] text-[#a0a0a0] block mb-1">Color 2</span>
            <ColorInput value={color2} onChange={onChangeColor2} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function DesignStep({ styleData, onChange }) {
  const [color, setColor] = useState(styleData.qr_color ?? '#000000');
  const [bgColor, setBgColor] = useState(styleData.qr_bg_color ?? '#FFFFFF');
  const [pattern, setPattern] = useState(styleData.qr_style ?? 'square');
  const [cornersStyle, setCornersStyle] = useState(styleData.qr_corners_style ?? 'square');
  const [cornersDotStyle, setCornersDotStyle] = useState(styleData.qr_corners_dot_style ?? 'square');
  const [frameStyle, setFrameStyle] = useState(styleData.qr_frame_style ?? 'none');
  const [frameText, setFrameText] = useState(styleData.qr_frame_text ?? 'Escanear');
  const [frameTextColor, setFrameTextColor] = useState(styleData.qr_frame_text_color ?? '#000000');
  const [logoUrl, setLogoUrl] = useState(styleData.qr_logo_path ?? '');
  const [imageSize, setImageSize] = useState(styleData.qr_image_size ?? 0.4);
  const [imageMargin, setImageMargin] = useState(styleData.qr_image_margin ?? 0);
  const [errorCorrection, setErrorCorrection] = useState(styleData.qr_error_correction ?? 'H');
  const [frames, setFrames] = useState([]);
  const [gradientStyle, setGradientStyle] = useState(styleData.qr_gradient_style ?? 'none');
  const [gradientColor1, setGradientColor1] = useState(styleData.qr_gradient_color1 ?? '#8364ff');
  const [gradientColor2, setGradientColor2] = useState(styleData.qr_gradient_color2 ?? '#c4b0ff');
  const [bgGradientStyle, setBgGradientStyle] = useState(styleData.qr_bg_gradient_style ?? 'none');
  const [bgGradientColor1, setBgGradientColor1] = useState(styleData.qr_bg_gradient_color1 ?? bgColor);
  const [bgGradientColor2, setBgGradientColor2] = useState(styleData.qr_bg_gradient_color2 ?? '#f8f9fc');
  const [cornersGradientStyle, setCornersGradientStyle] = useState(styleData.qr_corners_gradient_style ?? 'none');
  const [cornersGradientColor1, setCornersGradientColor1] = useState(styleData.qr_corners_gradient_color1 ?? color);
  const [cornersGradientColor2, setCornersGradientColor2] = useState(styleData.qr_corners_gradient_color2 ?? '#c4b0ff');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [expiryData, setExpiryData] = useState({
    expires_at: styleData.expires_at ?? null,
    max_scans: styleData.max_scans ?? null
  });

  useEffect(() => {
    loadFramesIndex().then((result) => {
      setFrames(result.frames || []);
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
      qr_error_correction: errorCorrection,
      qr_gradient_style: gradientStyle,
      qr_gradient_color1: gradientColor1,
      qr_gradient_color2: gradientColor2,
      qr_bg_gradient_style: bgGradientStyle,
      qr_bg_gradient_color1: bgGradientColor1,
      qr_bg_gradient_color2: bgGradientColor2,
      qr_corners_gradient_style: cornersGradientStyle,
      qr_corners_gradient_color1: cornersGradientColor1,
      qr_corners_gradient_color2: cornersGradientColor2,
      expires_at: expiryData.expires_at,
      max_scans: expiryData.max_scans,
    });
  }, [color, bgColor, pattern, cornersStyle, cornersDotStyle, frameStyle, frameText, frameTextColor, logoUrl, imageSize, imageMargin, errorCorrection, gradientStyle, gradientColor1, gradientColor2, bgGradientStyle, bgGradientColor1, bgGradientColor2, cornersGradientStyle, cornersGradientColor1, cornersGradientColor2, expiryData]);

  const handleLogoUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('El archivo no puede superar 2 MB.');
      return;
    }
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
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ image: base64 }),
          }
        );
        if (!res.ok) throw new Error((await res.json()).error ?? 'Error al subir');
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
      <h3 className="text-sm font-bold text-[#131d29]">3. Diseñá tu código QR</h3>

      <AccordionCard
        icon={() => (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
        )}
        title="Marco"
        subtitle="Los marcos hacen que tu código QR se destaque, inspirando más escaneos."
      >
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setFrameStyle('none')}
            className={cn(
              'py-2.5 rounded-lg border-2 text-xs font-semibold transition-all',
              frameStyle === 'none'
                ? 'border-[#8364ff] bg-[#f3f0ff] text-[#8364ff]'
                : 'border-[#eeeeee] text-[#6e6e6e] hover:border-[#d5d5d5]'
            )}
          >
            Sin marco
          </button>
          {frames.slice(0, 15).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFrameStyle(f.id)}
              className={cn(
                'py-2.5 rounded-lg border-2 text-xs font-semibold transition-all truncate flex flex-col items-center gap-1',
                frameStyle === f.id
                  ? 'border-[#8364ff] bg-[#f3f0ff] text-[#8364ff]'
                  : 'border-[#eeeeee] text-[#6e6e6e] hover:border-[#d5d5d5]'
              )}
            >
              <div className="w-8 h-8 rounded bg-[#f7f7f7] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="2" width="28" height="28" rx="3" stroke="#d0d0d0" strokeWidth="1.5" fill="none" />
                  <rect x="5" y="5" width="22" height="22" rx="1" stroke="#d0d0d0" strokeWidth="1" fill="none" />
                </svg>
              </div>
              <span className="text-[9px]">{f.name}</span>
            </button>
          ))}
        </div>
        {frameStyle !== 'none' && (
          <div className="mt-4 pt-4 border-t border-[#f0f0f0] space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#6e6e6e] mb-1.5">Texto del marco</label>
              <input
                type="text"
                value={frameText}
                onChange={(e) => setFrameText(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#e0e0e0] bg-white px-3.5 text-sm focus:outline-none focus:border-[#8364ff] focus:ring-2 focus:ring-[#8364ff]/15"
              />
            </div>
            <div>
              <span className="block text-xs font-semibold text-[#6e6e6e] mb-1.5">Color del texto</span>
              <ColorInput value={frameTextColor} onChange={setFrameTextColor} />
            </div>
          </div>
        )}
      </AccordionCard>

      <AccordionCard
        icon={() => (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        )}
        title="Patrón del código QR"
        subtitle="Elegí un patrón para tu código QR y seleccioná los colores."
      >
        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold text-[#6e6e6e] mb-2 block">Estilo del patrón</span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {QR_PATTERNS.map((p) => (
                <PatternThumbnail
                  key={p.value}
                  type={p.value}
                  selected={pattern === p.value}
                  onClick={() => setPattern(p.value)}
                />
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#6e6e6e] mb-2 block">Color del patrón</span>
            <div className="mt-2 mb-3">
              <ColorInput value={color} onChange={setColor} />
            </div>
            <GradientSelector
              label="Estilo de gradiente del patrón"
              value={gradientStyle}
              onChange={setGradientStyle}
              color1={gradientColor1}
              onChangeColor1={setGradientColor1}
              color2={gradientColor2}
              onChangeColor2={setGradientColor2}
            />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#6e6e6e] mb-2 block">Color de fondo</span>
            <p className="text-[10px] text-[#a0a0a0] mb-2">Para una lectura óptima del código QR, recomendamos usar colores de alto contraste.</p>
            <div className="mt-2 mb-3">
              <ColorInput value={bgColor} onChange={setBgColor} />
            </div>
            <GradientSelector
              label="Estilo de gradiente del fondo"
              value={bgGradientStyle}
              onChange={setBgGradientStyle}
              color1={bgGradientColor1}
              onChangeColor1={setBgGradientColor1}
              color2={bgGradientColor2}
              onChangeColor2={setBgGradientColor2}
            />
          </div>
        </div>
      </AccordionCard>

      <AccordionCard
        icon={() => (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 2h6v6H2z" />
            <path d="M16 2h6v6h-6z" />
            <path d="M2 16h6v6H2z" />
            <circle cx="19" cy="19" r="3" fill="currentColor" />
          </svg>
        )}
        title="Esquinas del código QR"
        subtitle="Seleccioná el estilo de las esquinas de tu código QR."
      >
        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold text-[#6e6e6e] mb-2 block">Estilo de esquinas exteriores</span>
            <div className="grid grid-cols-3 gap-2">
              {CORNER_STYLES.map((c) => (
                <CornerThumbnail
                  key={c.value}
                  type={c.value}
                  selected={cornersStyle === c.value}
                  onClick={() => setCornersStyle(c.value)}
                />
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#6e6e6e] mb-2 block">Estilo de esquinas interiores</span>
            <div className="grid grid-cols-2 gap-2">
              {INNER_CORNER_STYLES.map((c) => (
                <CornerThumbnail
                  key={c.value}
                  type={c.value}
                  selected={cornersDotStyle === c.value}
                  onClick={() => setCornersDotStyle(c.value)}
                />
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#6e6e6e] mb-2 block">Color de esquinas</span>
            <div className="mt-2 mb-3">
              <ColorInput value={color} onChange={setColor} label="" />
            </div>
            <GradientSelector
              label="Estilo de gradiente de esquinas"
              value={cornersGradientStyle}
              onChange={setCornersGradientStyle}
              color1={cornersGradientColor1}
              onChangeColor1={setCornersGradientColor1}
              color2={cornersGradientColor2}
              onChangeColor2={setCornersGradientColor2}
            />
          </div>
        </div>
      </AccordionCard>

      <AccordionCard
        icon={() => (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        )}
        title="Agregar logo"
        subtitle="Hacé único tu código QR agregando tu logo o una imagen."
      >
        <div className="space-y-3">
          {!logoUrl ? (
            <label className="flex flex-col items-center gap-3 py-8 px-3 border-2 border-dashed border-[#d5d5d5] rounded-xl cursor-pointer hover:border-[#8364ff] hover:bg-[#f3f0ff]/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#f3f0ff] flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#8364ff]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#131d29]">Subir tu logo</p>
                <p className="text-xs text-[#a0a0a0] mt-0.5">Tamaño máximo: 2 MB</p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleLogoUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center gap-4 p-3 bg-[#f7f7f7] rounded-xl">
              <img
                src={logoUrl}
                alt="Logo"
                className="w-14 h-14 object-contain rounded-lg border border-[#e0e0e0] bg-white"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#131d29]">Logo cargado</p>
                <div className="flex gap-3 mt-2">
                  <label className="text-xs text-[#8364ff] cursor-pointer hover:underline font-semibold">
                    Cambiar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="text-xs text-red-400 hover:underline font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <Trash2
                className="w-5 h-5 text-[#a0a0a0] cursor-pointer hover:text-red-400 transition-colors"
                onClick={() => setLogoUrl('')}
              />
            </div>
          )}
          {uploading && <p className="text-xs text-[#6e6e6e]">Subiendo...</p>}
          {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
          {logoUrl && (
            <div className="space-y-3 pt-2">
              <div>
                <span className="text-xs font-semibold text-[#6e6e6e] mb-1.5 block">
                  Tamaño del logo ({Math.round(imageSize * 100)}%)
                </span>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={imageSize}
                  onChange={(e) => setImageSize(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#e0e0e0] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8364ff]"
                />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#6e6e6e] mb-1.5 block">
                  Margen del logo ({imageMargin}px)
                </span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={imageMargin}
                  onChange={(e) => setImageMargin(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#e0e0e0] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8364ff]"
                />
              </div>
            </div>
          )}
        </div>
      </AccordionCard>

      <AccordionCard
        icon={Clock}
        title="Caducidad"
        subtitle="Configurá cuándo expira tu código QR. Podés definir una fecha, un límite de escaneos o ambos."
      >
        <ExpiryConfig
          initial={expiryData}
          onChange={setExpiryData}
        />
      </AccordionCard>
    </div>
  );
}
