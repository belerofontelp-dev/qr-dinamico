import { QR_TYPES } from '../../lib/qr-types';
import { cn } from '../../lib/cn';

export default function TypeSelector({ selected, onSelect }) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 7l4-4 14 14-4 4L3 7z" stroke="#8364ff" strokeWidth="1.5" fill="none" />
            <circle cx="18.5" cy="5.5" r="1.5" fill="#8364ff" />
          </svg>
          <span className="text-sm font-bold text-[#8364ff] uppercase tracking-wide">Choose a QR Type</span>
        </div>
        <h1 className="text-xl font-bold text-[#131d29]">
          Easily create a QR code <span className="font-normal text-[#6e6e6e]">for any occasion in seconds!</span>
        </h1>
      </div>

      <h2 className="text-sm font-bold text-[#131d29] mb-4">1. Select a type of QR code</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Object.values(QR_TYPES).sort((a, b) => a.order - b.order).map((type) => {
          const Icon = type.icon;
          const isSelected = selected === type.id;
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={cn(
                'group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-150 text-center cursor-pointer',
                isSelected
                  ? 'border-[#8364ff] bg-[#f3f0ff] shadow-sm'
                  : 'border-[#eeeeee] bg-white hover:border-[#d5d5d5] hover:shadow-sm'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                isSelected ? 'bg-[#8364ff] text-white' : 'bg-[#f7f7f7] text-[#6e6e6e] group-hover:text-[#131d29]'
              )}>
                <Icon />
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
              <div className={cn(
                'absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                isSelected ? 'border-[#8364ff] bg-[#8364ff]' : 'border-[#d5d5d5] bg-white'
              )}>
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
