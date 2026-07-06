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

export const GRADIENT_STYLES = [
  { value: 'none', label: 'Sólido' },
  { value: 'linear', label: 'Lineal' },
  { value: 'radial', label: 'Radial' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'diagonal', label: 'Diagonal' },
  { value: 'inverse_diagonal', label: 'Diagonal invertida' }
];

const GRADIENT_ROTATIONS = {
  linear: 0,
  vertical: Math.PI / 2,
  horizontal: Math.PI,
  diagonal: Math.PI / 4,
  inverse_diagonal: 3 * Math.PI / 4
};

function buildGradient(style, color1, color2) {
  if (!style || style === 'none' || !color1 || !color2) return undefined;
  if (style === 'radial') {
    return {
      type: 'radial',
      colorStops: [
        { offset: 0, color: color1 },
        { offset: 1, color: color2 }
      ]
    };
  }
  return {
    type: 'linear',
    rotation: GRADIENT_ROTATIONS[style] ?? 0,
    colorStops: [
      { offset: 0, color: color1 },
      { offset: 1, color: color2 }
    ]
  };
}

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

  const dotsGradient = buildGradient(options.qrGradientStyle, options.qrGradientColor1 || color, options.qrGradientColor2);
  const bgGradient = buildGradient(options.qrBgGradientStyle, options.qrBgGradientColor1 || bgColor, options.qrBgGradientColor2);
  const cornersGradient = buildGradient(options.qrCornersGradientStyle, options.qrCornersGradientColor1 || color, options.qrCornersGradientColor2);

  const dotsOptions = { color, type: pattern };
  if (dotsGradient) dotsOptions.gradient = dotsGradient;

  const cornersSquareOptions = { color, type: corners };
  if (cornersGradient) cornersSquareOptions.gradient = cornersGradient;

  const cornersDotOptions = { color, type: innerCorners };
  if (cornersGradient) cornersDotOptions.gradient = cornersGradient;

  const backgroundOptions = { color: bgColor };
  if (bgGradient) backgroundOptions.gradient = bgGradient;

  return new QRCodeStyling({
    ...DEFAULT_OPTIONS,
    width: options.width ?? DEFAULT_OPTIONS.width,
    height: options.height ?? DEFAULT_OPTIONS.height,
    data,
    dotsOptions,
    cornersSquareOptions,
    cornersDotOptions,
    backgroundOptions,
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

export function downloadQRJPG(qrCode, filename = 'qr-code') {
  if (qrCode && qrCode._canvas && qrCode._canvas.getContext) {
    const canvas = qrCode._canvas;
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.95);
  }
}
