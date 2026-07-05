import { QR_TYPES } from '../../lib/qr-types';
import { cn } from '../../lib/cn';

export default function TypeSelector({ selected, onSelect }) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 7l5-5 13 13-5 5L3 7z" stroke="#8364ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 4l3 3" stroke="#8364ff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M17 17l2 2" stroke="#8364ff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-sm font-bold text-[#8364ff] uppercase tracking-wide">Elegí un tipo de QR</span>
        </div>
        <h1 className="text-xl font-bold text-[#131d29]">
          Creá un código QR <span className="font-normal text-[#6e6e6e]">para cualquier ocasión en segundos</span>
        </h1>
      </div>

      <h2 className="text-sm font-bold text-[#131d29] mb-4">1. Seleccioná un tipo de código QR</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Object.values(QR_TYPES).sort((a, b) => a.order - b.order).map((type) => {
          const Icon = type.icon;
          const isSelected = selected === type.id;
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={cn(
                'group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-150 text-center',
                isSelected
                  ? 'border-[#8364ff] bg-[#f3f0ff] shadow-sm'
                  : 'border-[#e8e8ed] bg-white hover:border-[#d5d5d5] hover:shadow-sm'
              )}
            >
              <div className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center transition-colors',
                isSelected ? 'bg-[#8364ff] text-white' : 'bg-[#f3f0ff] text-[#8364ff] group-hover:bg-[#ede8ff]'
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className={cn(
                  'text-xs font-bold transition-colors',
                  isSelected ? 'text-[#8364ff]' : 'text-[#131d29]'
                )}>
                  {type.label}
                </div>
                <div className="text-[10px] text-[#a0a0a0] mt-0.5 leading-tight">
                  {type.description}
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#8364ff] flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
