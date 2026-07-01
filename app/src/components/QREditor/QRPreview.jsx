import { useEffect, useRef, useState } from 'react';
import { generateQRCode, renderQRCode, downloadQRPNG, downloadQRSVG } from '../../lib/qr-generator';

export default function QRPreview({ shortlink, qrColor, qrBgColor, qrStyle, size = 220, showActions = true }) {
  const containerRef = useRef(null);
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!shortlink || !containerRef.current) return;
    qrRef.current = generateQRCode(shortlink, { qrColor, qrBgColor, qrStyle, width: size, height: size });
    renderQRCode(qrRef.current, containerRef.current);
  }, [shortlink, qrColor, qrBgColor, qrStyle, size]);

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
        style={{ width: size, height: size }}
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
