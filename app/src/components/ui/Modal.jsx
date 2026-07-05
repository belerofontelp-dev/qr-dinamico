import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function Modal({ isOpen, onClose, title, children, className }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isOpen) onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose?.();
      }}
    >
      <div
        className={cn(
          'bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto',
          'animate-in zoom-in-95',
          className
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eeeeee]">
          <h3 className="text-base font-bold text-[#131d29]">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f7f7f7] transition-colors"
          >
            <X className="w-4 h-4 text-[#6e6e6e]" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
