import { QR_TYPES } from '../../lib/qr-types';

export default function DownloadStep({ qrCode, shortlink, platform, onDownloadComplete }) {
  const typeLabel = QR_TYPES[platform]?.label || platform;

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-8">
      <div className="w-16 h-16 rounded-2xl bg-[#f3f0ff] flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8364ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#131d29] mb-1">Your QR code is ready!</h2>
        <p className="text-sm text-[#6e6e6e]">
          {typeLabel} QR code created successfully. Download it or share the link.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={() => qrCode?.download({ name: 'qr-code', extension: 'png' })}
          className="h-11 px-5 bg-[#8364ff] hover:bg-[#6b4ddb] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Download PNG
        </button>
        <button
          onClick={() => qrCode?.download({ name: 'qr-code', extension: 'svg' })}
          className="h-11 px-5 border border-[#eeeeee] hover:bg-[#f7f7f7] text-[#131d29] text-sm font-semibold rounded-lg transition-colors"
        >
          Download SVG
        </button>
        <button
          onClick={onDownloadComplete}
          className="h-11 px-5 border border-[#eeeeee] hover:bg-[#f7f7f7] text-[#131d29] text-sm font-semibold rounded-lg transition-colors"
        >
          Create Another
        </button>
      </div>

      {shortlink && (
        <div className="w-full max-w-xs">
          <p className="text-xs text-[#6e6e6e] mb-1">Share this link:</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shortlink}
              className="flex-1 h-9 rounded-lg border border-[#eeeeee] bg-[#f7f7f7] px-3 text-xs text-[#6e6e6e] truncate"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shortlink);
              }}
              className="h-9 px-3 bg-[#8364ff] hover:bg-[#6b4ddb] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
