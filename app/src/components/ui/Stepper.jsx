import { cn } from '../../lib/cn';
import { Check } from 'lucide-react';

export default function Stepper({ steps, current }) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                current > idx + 1
                  ? 'bg-[#8364ff] text-white'
                  : current === idx + 1
                    ? 'bg-[#8364ff] text-white'
                    : 'bg-[#eeeeee] text-[#a0a0a0]'
              )}
            >
              {current > idx + 1 ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                idx + 1
              )}
            </div>
            <span
              className={cn(
                'text-xs font-semibold hidden md:inline',
                current >= idx + 1 ? 'text-[#131d29]' : 'text-[#a0a0a0]'
              )}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={cn(
                'w-8 md:w-12 h-0.5 mx-2 rounded-full transition-colors',
                current > idx + 1 ? 'bg-[#8364ff]' : 'bg-[#eeeeee]'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
