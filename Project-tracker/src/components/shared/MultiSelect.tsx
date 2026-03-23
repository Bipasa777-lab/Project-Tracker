import { useState, useRef, useEffect } from 'react';

interface Option { value: string; label: string }

interface MultiSelectProps {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (value: string) => void;
}

export default function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 bg-bg-3 border border-border-1 hover:border-border-2 rounded-md px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="bg-accent text-white rounded-full px-1.5 py-px text-[10px] font-semibold leading-none">
            {selected.length}
          </span>
        )}
        <svg className={`w-3 h-3 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-bg-3 border border-border-2 rounded-lg shadow-2xl z-50 min-w-[160px] py-1">
          {options.map(opt => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-bg-4 cursor-pointer text-sm text-slate-300 hover:text-white"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => onChange(opt.value)}
                className="accent-accent w-3.5 h-3.5 flex-shrink-0"
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
