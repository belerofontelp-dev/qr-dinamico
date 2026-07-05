import { cn } from '../../lib/cn';

export default function Card({ children, className, hover = false, selected = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-150',
        selected
          ? 'border-[#8364ff] bg-[#f3f0ff] shadow-sm'
          : 'border-[#eeeeee] bg-white',
        hover && !selected && 'hover:border-[#d5d5d5] hover:shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={cn('p-4', className)}>{children}</div>;
}
