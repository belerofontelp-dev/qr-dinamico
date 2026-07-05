import { useState } from 'react';
import { cn } from '../../lib/cn';

export default function Tabs({ tabs, activeTab, onChange, className }) {
  const [active, setActive] = useState(activeTab ?? 0);
  const current = activeTab !== undefined ? activeTab : active;

  const handleChange = (idx) => {
    if (activeTab === undefined) setActive(idx);
    onChange?.(idx);
  };

  return (
    <div className={cn('bg-[#f7f7f7] rounded-xl p-1 flex', className)}>
      {tabs.map((tab, idx) => (
        <button
          key={idx}
          onClick={() => handleChange(idx)}
          disabled={tab.disabled}
          className={cn(
            'flex-1 h-9 rounded-lg text-sm font-semibold transition-all duration-150',
            current === idx
              ? 'bg-white text-[#131d29] shadow-sm'
              : 'text-[#6e6e6e] hover:text-[#131d29]',
            tab.disabled && 'opacity-40 cursor-not-allowed'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
