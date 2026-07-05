import { cn } from '../../lib/cn';

export default function Input({ className, label, error, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-semibold text-[#131d29]">{label}</label>}
      <input
        className={cn(
          'w-full h-10 rounded-lg border border-[#eeeeee] bg-white px-3.5 text-sm text-[#131d29] placeholder:text-[#a0a0a0] transition-colors',
          'hover:border-[#d5d5d5]',
          'focus:outline-none focus:border-[#8364ff] focus:ring-2 focus:ring-[#8364ff]/15',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400/15',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
