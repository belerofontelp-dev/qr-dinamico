import { useState } from 'react';
import { cn } from '../../lib/cn';
import { Tabs } from '../ui';
import { Monitor, QrCode } from 'lucide-react';

export default function MobilePreview({ children, qrContent, showQr = true }) {
  const [tab, setTab] = useState(0);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 w-48">
        {showQr && (
          <Tabs
            tabs={[
              { label: 'Preview', disabled: false },
              { label: 'QR code', disabled: qrContent === undefined }
            ]}
            activeTab={tab}
            onChange={setTab}
          />
        )}
      </div>

      <div className="relative">
        {/* iPhone mockup */}
        <svg
          width="280"
          height="580"
          viewBox="0 0 280 580"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          <rect x="0.5" y="0.5" width="279" height="579" rx="39.5" fill="white" stroke="#e5e5e5" />
          <rect x="12" y="12" width="256" height="556" rx="28" fill="white" />
          <rect x="108" y="32" width="64" height="4" rx="2" fill="#e5e5e5" />
          <circle cx="139.5" cy="557.5" r="1.5" fill="#d5d5d5" />
          <line x1="124" y1="560" x2="156" y2="560" stroke="#d5d5d5" strokeWidth="3" strokeLinecap="round" />
        </svg>

        {/* Screen content */}
        <div className="absolute top-[44px] left-[24px] w-[232px] h-[524px] rounded-[20px] overflow-hidden bg-white">
          {tab === 0 ? (
            <div className="w-full h-full overflow-y-auto scrollbar-hide">
              {children ? (
                children
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#f3f0ff] flex items-center justify-center mb-4">
                    <Monitor className="w-8 h-8 text-[#8364ff]" />
                  </div>
                  <p className="text-xs text-[#a0a0a0]">
                    Select a type of QR code on the left
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
              {qrContent ? (
                qrContent
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8364ff] border-t-transparent" />
                  <p className="text-xs text-[#a0a0a0]">QR code will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
