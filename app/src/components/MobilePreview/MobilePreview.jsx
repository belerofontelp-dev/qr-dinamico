import { useState } from 'react';
import { cn } from '../../lib/cn';

export default function MobilePreview({ children, qrContent, tabs = true, qrTabEnabled = false, activeTab = 0, onTabChange }) {
  const [internalTab, setInternalTab] = useState(activeTab);
  const tab = onTabChange ? activeTab : internalTab;
  const setTab = onTabChange || setInternalTab;

  return (
    <div className="flex flex-col items-center">
      {tabs && (
        <div className="mb-5 bg-[#f0f0f0] rounded-xl p-1 flex w-56">
          <button
            onClick={() => setTab(0)}
            className={cn(
              'flex-1 h-9 rounded-lg text-sm font-semibold transition-all duration-200',
              tab === 0
                ? 'bg-white text-[#131d29] shadow-sm'
                : 'text-[#6e6e6e] hover:text-[#131d29]'
            )}
          >
            Vista previa
          </button>
          <button
            onClick={() => setTab(1)}
            disabled={!qrTabEnabled}
            className={cn(
              'flex-1 h-9 rounded-lg text-sm font-semibold transition-all duration-200',
              tab === 1
                ? 'bg-white text-[#131d29] shadow-sm'
                : !qrTabEnabled
                  ? 'text-[#c0c0c0] cursor-not-allowed'
                  : 'text-[#6e6e6e] hover:text-[#131d29]'
            )}
          >
            Código QR
          </button>
        </div>
      )}

      <div className="relative">
        <svg
          width="280"
          height="570"
          viewBox="0 0 280 570"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
        >
          <defs>
            <linearGradient id="phoneFrame" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3a3a3c" />
              <stop offset="50%" stopColor="#1c1c1e" />
              <stop offset="100%" stopColor="#2c2c2e" />
            </linearGradient>
            <linearGradient id="phoneScreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0f0f5" />
              <stop offset="100%" stopColor="#e8e8f0" />
            </linearGradient>
          </defs>
          <rect x="0.5" y="0.5" width="279" height="569" rx="45" fill="url(#phoneFrame)" stroke="#1a1a1c" strokeWidth="1" />
          <rect x="8" y="8" width="264" height="554" rx="38" fill="url(#phoneScreen)" />
          <rect x="85" y="24" width="110" height="26" rx="13" fill="#1a1a1c" />
          <circle cx="139" cy="561" r="1.5" fill="#3a3a3c" />
          <line x1="124" y1="563" x2="155" y2="563" stroke="#3a3a3c" strokeWidth="3" strokeLinecap="round" />
          <rect x="16" y="56" width="1.5" height="200" rx="0.75" fill="rgba(0,0,0,0.06)" />
        </svg>

        <div className="absolute top-[48px] left-[22px] w-[236px] h-[500px] rounded-[28px] overflow-hidden bg-white">
          {tab === 0 ? (
            <div className="w-full h-full overflow-y-auto scrollbar-hide">
              {children ? (
                children
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#f3f0ff] flex items-center justify-center mb-3">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8364ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 21h8M12 17v4" />
                    </svg>
                  </div>
                  <p className="text-xs text-[#a0a0a0] leading-relaxed">
                    Seleccioná un tipo de código QR a la izquierda
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white p-4">
              {qrContent ? (
                qrContent
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8364ff] border-t-transparent" />
                  <p className="text-xs text-[#a0a0a0]">Generando QR...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
