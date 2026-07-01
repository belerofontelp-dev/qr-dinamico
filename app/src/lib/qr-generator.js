import QRCodeStyling from 'qr-code-styling';

const DEFAULT_OPTIONS = {
  width: 300,
  height: 300,
  type: 'png',
  data: 'https://ejemplo.com',
  dotsOptions: { color: '#000000', type: 'square' },
  backgroundOptions: { color: '#FFFFFF' },
  imageOptions: { crossOrigin: 'anonymous' }
};

export function generateQRCode(data, options = {}) {
  return new QRCodeStyling({
    ...DEFAULT_OPTIONS,
    data,
    dotsOptions: {
      color: options.qrColor ?? DEFAULT_OPTIONS.dotsOptions.color,
      type: options.qrStyle ?? DEFAULT_OPTIONS.dotsOptions.type
    },
    backgroundOptions: {
      color: options.qrBgColor ?? DEFAULT_OPTIONS.backgroundOptions.color
    }
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
