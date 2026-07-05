export default function PhoneMockup({ children }) {
  return (
    <div className="relative mx-auto" style={{ width: 260, height: 520 }}>
      <svg viewBox="0 0 260 520" className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <rect x="0" y="0" width="260" height="520" rx="32" fill="none" stroke="#1f2937" strokeWidth="6" />
        <rect x="8" y="8" width="244" height="504" rx="24" fill="none" />
        <rect x="95" y="30" width="70" height="4" rx="2" fill="#d1d5db" />
        <rect x="100" y="480" width="60" height="4" rx="2" fill="#d1d5db" />
      </svg>
      <div className="absolute z-0" style={{ left: 16, top: 48, right: 16, bottom: 48, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}
