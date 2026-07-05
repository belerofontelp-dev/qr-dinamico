import { useEffect, useRef } from 'react';
import { generateQRCode, renderQRCode, downloadQRPNG, downloadQRSVG } from '../../lib/qr-generator';

export default function QRRenderer({
  shortlink,
  qrColor = '#000000',
  qrBgColor = '#FFFFFF',
  qrStyle = 'square',
  qrCornersStyle = 'square',
  qrCornersDotStyle = 'square',
  qrLogoUrl,
  qrImageSize = 0.4,
  qrImageMargin = 0,
  qrErrorCorrection = 'H',
  size = 180
}) {
  const containerRef = useRef(null);
  const qrRef = useRef(null);

  useEffect(() => {
    if (!shortlink || !containerRef.current) return;

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
    renderQRCode(qrRef.current, el);

    return () => {
      if (qrRef.current) qrRef.current = null;
    };
  }, [shortlink, qrColor, qrBgColor, qrStyle, qrCornersStyle, qrCornersDotStyle, qrLogoUrl, qrImageSize, qrImageMargin, qrErrorCorrection, size]);

  return (
    <div ref={containerRef} className="flex items-center justify-center" />
  );
}

export { downloadQRPNG, downloadQRSVG };
