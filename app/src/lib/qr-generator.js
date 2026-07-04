import QRCodeStyling from 'qr-code-styling';

const DEFAULT_OPTIONS = {
  width: 300,
  height: 300,
  type: 'png',
  data: 'https://ejemplo.com',
  dotsOptions: { color: '#000000', type: 'square' },
  cornersSquareOptions: { color: '#000000', type: 'square' },
  cornersDotOptions: { color: '#000000', type: 'square' },
  backgroundOptions: { color: '#FFFFFF' },
  imageOptions: { crossOrigin: 'anonymous', hideBackgroundDots: true, imageSize: 0.4, margin: 0 },
  qrOptions: { errorCorrectionLevel: 'H' }
};

export const QR_PATTERNS = [
  { value: 'square', label: 'Cuadrados' },
  { value: 'dots', label: 'Puntos' },
  { value: 'rounded', label: 'Redondeados' },
  { value: 'extra-rounded', label: 'Muy redondeados' },
  { value: 'classy', label: 'Elegante' },
  { value: 'classy-rounded', label: 'Elegante redondeado' }
];

export const CORNER_STYLES = [
  { value: 'square', label: 'Cuadrado' },
  { value: 'dot', label: 'Punto' },
  { value: 'extra-rounded', label: 'Redondeado' }
];

export const INNER_CORNER_STYLES = [
  { value: 'square', label: 'Cuadrado' },
  { value: 'dot', label: 'Punto' }
];

export function generateQRCode(data, options = {}) {
  const color = options.qrColor ?? DEFAULT_OPTIONS.dotsOptions.color;
  const bgColor = options.qrBgColor ?? DEFAULT_OPTIONS.backgroundOptions.color;
  const pattern = options.qrStyle ?? DEFAULT_OPTIONS.dotsOptions.type;
  const corners = options.qrCornersStyle ?? DEFAULT_OPTIONS.cornersSquareOptions.type;
  const innerCorners = options.qrCornersDotStyle ?? DEFAULT_OPTIONS.cornersDotOptions.type;
  const image = options.qrLogoUrl || undefined;
  const imageSize = options.qrImageSize ?? DEFAULT_OPTIONS.imageOptions.imageSize;
  const imageMargin = options.qrImageMargin ?? DEFAULT_OPTIONS.imageOptions.margin;
  const errorCorrection = options.qrErrorCorrection ?? DEFAULT_OPTIONS.qrOptions.errorCorrectionLevel;

  return new QRCodeStyling({
    ...DEFAULT_OPTIONS,
    width: options.width ?? DEFAULT_OPTIONS.width,
    height: options.height ?? DEFAULT_OPTIONS.height,
    data,
    dotsOptions: { color, type: pattern },
    cornersSquareOptions: { color, type: corners },
    cornersDotOptions: { color, type: innerCorners },
    backgroundOptions: { color: bgColor },
    imageOptions: {
      ...DEFAULT_OPTIONS.imageOptions,
      imageSize,
      margin: imageMargin
    },
    image,
    qrOptions: { errorCorrectionLevel: errorCorrection }
  });
}

export function renderQRCode(qrCode, element) {
  if (!element) return;
  element.innerHTML = '';
  qrCode.append(element);
}

export async function getQRDataURL(qrCode) {
  const raw = await qrCode.getRawData();
  if (raw instanceof Blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(raw);
    });
  }
  return raw;
}

export function downloadQRPNG(qrCode, filename = 'qr-code') {
  qrCode.download({ name: filename, extension: 'png' });
}

export function downloadQRSVG(qrCode, filename = 'qr-code') {
  qrCode.download({ name: filename, extension: 'svg' });
}
