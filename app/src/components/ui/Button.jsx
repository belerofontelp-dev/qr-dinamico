import { cn } from '../../lib/cn';

const variants = {
  primary: 'bg-[#8364ff] hover:bg-[#6b4ddb] text-white shadow-sm',
  outline: 'border border-[#eeeeee] bg-white text-[#131d29] hover:bg-[#f7f7f7]',
  secondary: 'bg-[#f7f7f7] text-[#131d29] hover:bg-[#eeeeee]',
  ghost: 'text-[#6e6e6e] hover:text-[#131d29] hover:bg-[#f7f7f7]',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
};

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-sm',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#8364ff]/30 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
