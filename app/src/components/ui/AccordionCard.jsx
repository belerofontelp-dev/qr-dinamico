import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function AccordionCard({
  icon: Icon,
  title,
  subtitle,
  defaultOpen = false,
  children
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn(
      'bg-white rounded-xl border transition-all duration-200',
      open ? 'border-[#e0e0e0] shadow-sm' : 'border-[#eeeeee] hover:border-[#d5d5d5]'
    )}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-[#f3f0ff] flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-[#8364ff]" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-[#131d29]">{title}</h3>
          {subtitle && (
            <p className="text-xs text-[#6e6e6e] mt-0.5 line-clamp-1">{subtitle}</p>
          )}
        </div>
        <ChevronRight
          className={cn(
            'w-5 h-5 text-[#a0a0a0] shrink-0 transition-transform duration-200',
            open && 'rotate-90'
          )}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[#f0f0f0] pt-4">
          {children}
        </div>
      )}
    </div>
  );
}
