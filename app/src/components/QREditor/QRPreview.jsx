import { useEffect, useRef, useState } from 'react';
import { generateQRCode, renderQRCode, downloadQRPNG, downloadQRSVG } from '../../lib/qr-generator';
import { loadFramesIndex, getFrameById } from '../../lib/qr-frames';

const FRAME_VIEWBOX = { width: 320, height: 418 };
const FRAME_SCALE = 1;

export default function QRPreview({
  shortlink,
  qrColor,
  qrBgColor,
  qrStyle,
  qrCornersStyle,
  qrCornersDotStyle,
  qrLogoUrl,
  qrImageSize,
  qrImageMargin,
  qrErrorCorrection,
  qrFrameStyle,
  qrFrameText,
  qrFrameTextColor,
  size = 220,
  showActions = true
}) {
  const containerRef = useRef(null);
  const qrContainerRef = useRef(null);
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [frameData, setFrameData] = useState(null);
  const [frames, setFrames] = useState([]);

  useEffect(() => {
    let cancelled = false;
    if (qrFrameStyle && qrFrameStyle !== 'none') {
      loadFramesIndex().then(({ frames }) => {
        if (cancelled) return;
        setFrames(frames);
        setFrameData(getFrameById(qrFrameStyle, frames));
      }).catch(() => {
        setFrameData(null);
      });
    } else {
      setFrameData(null);
    }
    return () => { cancelled = true; };
  }, [qrFrameStyle]);

  useEffect(() => {
    if (!shortlink || !containerRef.current) return;

    const isFramed = frameData && qrFrameStyle !== 'none';

    if (!isFramed) {
      // Classic QR without frame
      qrRef.current = generateQRCode(shortlink, {
        qrColor,
        qrBgColor,
        qrStyle,
        qrCornersStyle,
        qrCornersDotStyle,
        qrLogoUrl,
        qrImageSize,
        qrImageMargin,
        qrErrorCorrection,
        width: size,
        height: size
      });
      const el = containerRef.current;
      el.innerHTML = '';
      el.style.width = '';
      el.style.height = '';
      el.style.position = '';
      renderQRCode(qrRef.current, el);
      return;
    }

    // Framed QR: render frame SVG + QR overlay + text
    const scale = size / FRAME_VIEWBOX.width;
    const frameWidth = FRAME_VIEWBOX.width * scale;
    const frameHeight = FRAME_VIEWBOX.height * scale;
    const qrArea = frameData.qrArea || { x: 40, y: 30, width: 240, height: 240 };
    const textArea = frameData.textArea || { x: 40, y: 360, width: 240, height: 45 };

    // Center QR as a square inside the frame's QR area
    const qrOriginalSize = Math.min(qrArea.width, qrArea.height);
    const qrOriginalX = qrArea.x + (qrArea.width - qrOriginalSize) / 2;
    const qrOriginalY = qrArea.y + (qrArea.height - qrOriginalSize) / 2;
    const qrSize = Math.round(qrOriginalSize * scale);
    const qrX = Math.round(qrOriginalX * scale);
    const qrY = Math.round(qrOriginalY * scale);

    containerRef.current.innerHTML = '';
    containerRef.current.style.width = `${frameWidth}px`;
    containerRef.current.style.height = `${frameHeight}px`;
    containerRef.current.style.position = 'relative';

    // Frame image
    const img = document.createElement('img');
    img.src = `/qr-dinamico/frames/${frameData.file}`;
    img.style.position = 'absolute';
    img.style.inset = '0';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.alt = frameData.name;
    containerRef.current.appendChild(img);

    // White patch to hide dummy QR (covers the frame's entire QR area)
    const patch = document.createElement('div');
    patch.style.position = 'absolute';
    patch.style.left = `${Math.round(qrArea.x * scale)}px`;
    patch.style.top = `${Math.round(qrArea.y * scale)}px`;
    patch.style.width = `${Math.round(qrArea.width * scale)}px`;
    patch.style.height = `${Math.round(qrArea.height * scale)}px`;
    patch.style.backgroundColor = qrBgColor || '#FFFFFF';
    containerRef.current.appendChild(patch);

    // Real QR container
    const qrWrapper = document.createElement('div');
    qrWrapper.style.position = 'absolute';
    qrWrapper.style.left = `${qrX}px`;
    qrWrapper.style.top = `${qrY}px`;
    qrWrapper.style.width = `${qrSize}px`;
    qrWrapper.style.height = `${qrSize}px`;
    containerRef.current.appendChild(qrWrapper);

    qrRef.current = generateQRCode(shortlink, {
      qrColor,
      qrBgColor,
      qrStyle,
      qrCornersStyle,
      qrCornersDotStyle,
      qrLogoUrl,
      qrImageSize,
      qrImageMargin,
      qrErrorCorrection,
      width: qrSize,
      height: qrSize
    });
    renderQRCode(qrRef.current, qrWrapper);

    // Frame text overlay
    const textEl = document.createElement('div');
    textEl.textContent = qrFrameText || 'Scan me';
    textEl.style.position = 'absolute';
    textEl.style.left = `${textArea.x * scale}px`;
    textEl.style.top = `${textArea.y * scale}px`;
    textEl.style.width = `${textArea.width * scale}px`;
    textEl.style.height = `${textArea.height * scale}px`;
    textEl.style.display = 'flex';
    textEl.style.alignItems = 'center';
    textEl.style.justifyContent = 'center';
    textEl.style.color = qrFrameTextColor || '#000000';
    textEl.style.fontSize = `${Math.max(12, 24 * scale)}px`;
    textEl.style.fontWeight = '600';
    textEl.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    textEl.style.textAlign = 'center';
    textEl.style.overflow = 'hidden';
    textEl.style.whiteSpace = 'nowrap';
    textEl.style.pointerEvents = 'none';
    containerRef.current.appendChild(textEl);
  }, [
    shortlink, qrColor, qrBgColor, qrStyle, qrCornersStyle, qrCornersDotStyle,
    qrLogoUrl, qrImageSize, qrImageMargin, qrErrorCorrection,
    qrFrameStyle, qrFrameText, qrFrameTextColor, frameData, size
  ]);

  const handleCopy = async () => {
    if (!shortlink) return;
    try {
      await navigator.clipboard.writeText(shortlink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!shortlink) return null;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        ref={containerRef}
        className="bg-white rounded-lg border border-gray-200"
        style={{ width: frameData ? undefined : size, height: frameData ? undefined : size }}
      />

      {showActions && (
        <>
          <div className="w-full flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shortlink}
              className="flex-1 text-xs bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-600 truncate"
            />
            <button
              onClick={handleCopy}
              className={`shrink-0 px-3 py-2 text-xs font-medium rounded-lg transition ${
                copied ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <div className="flex gap-2 w-full">
            <button
              onClick={() => downloadQRPNG(qrRef.current)}
              className="flex-1 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-xs font-medium"
            >
              PNG
            </button>
            <button
              onClick={() => downloadQRSVG(qrRef.current)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-xs font-medium"
            >
              SVG
            </button>
          </div>
        </>
      )}
    </div>
  );
}
