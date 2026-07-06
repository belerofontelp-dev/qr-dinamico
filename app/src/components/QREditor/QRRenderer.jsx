import { useEffect, useRef } from 'react';
import { generateQRCode } from '../../lib/qr-generator';

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
  qrGradientStyle,
  qrGradientColor1,
  qrGradientColor2,
  qrBgGradientStyle,
  qrBgGradientColor1,
  qrBgGradientColor2,
  qrCornersGradientStyle,
  qrCornersGradientColor1,
  qrCornersGradientColor2,
  size = 200,
  onReady
}) {
  const containerRef = useRef(null);
  const qrRef = useRef(null);

  useEffect(() => {
    if (!shortlink || !containerRef.current) return;

    // Limpiar contenedor anterior
    const el = containerRef.current;
    el.innerHTML = '';

    // Destruir instancia anterior si existe
    if (qrRef.current) {
      qrRef.current = null;
    }

    // Crear nueva instancia
    const qr = generateQRCode(shortlink, {
      qrColor,
      qrBgColor,
      qrStyle,
      qrCornersStyle,
      qrCornersDotStyle,
      qrLogoUrl,
      qrImageSize,
      qrImageMargin,
      qrErrorCorrection,
      qrGradientStyle,
      qrGradientColor1,
      qrGradientColor2,
      qrBgGradientStyle,
      qrBgGradientColor1,
      qrBgGradientColor2,
      qrCornersGradientStyle,
      qrCornersGradientColor1,
      qrCornersGradientColor2,
      width: size,
      height: size
    });

    qrRef.current = qr;
    qr.append(el);

    // Notificar que el QR está listo
    if (onReady) onReady(qr);

    // Cleanup al desmontar
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      qrRef.current = null;
    };
  }, [shortlink, qrColor, qrBgColor, qrStyle, qrCornersStyle, qrCornersDotStyle, qrLogoUrl, qrImageSize, qrImageMargin, qrErrorCorrection, qrGradientStyle, qrGradientColor1, qrGradientColor2, qrBgGradientStyle, qrBgGradientColor1, qrBgGradientColor2, qrCornersGradientStyle, qrCornersGradientColor1, qrCornersGradientColor2, size, onReady]);

  return <div ref={containerRef} className="flex items-center justify-center" />;
}
