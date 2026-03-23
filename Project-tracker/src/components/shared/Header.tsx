import { useStore } from '../../store/useStore';
import PresenceBar from './PresenceBar';
import type { ViewType } from '../../types';

const VIEWS: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  {
    id: 'kanban',
    label: 'Kanban',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2" width="4" height="12" rx="1.5" fill="currentColor" opacity=".7"/>
        <rect x="6" y="2" width="4" height="8"  rx="1.5" fill="currentColor"/>
        <rect x="11" y="2" width="4" height="10" rx="1.5" fill="currentColor" opacity=".5"/>
      </svg>
    ),
  },
  {
    id: 'list',
    label: 'List',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="5"  width="9"  height="2.5" rx="1.25" fill="currentColor"/>
        <rect x="5" y="9"  width="10" height="2.5" rx="1.25" fill="currentColor" opacity=".6"/>
        <path d="M1 13h14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".3"/>
      </svg>
    ),
  },
];

export default function Header() {
  const currentView = useStore(s => s.currentView);
  const setView     = useStore(s => s.setView);

  return (
    <header className="h-14 bg-bg-2 border-b border-border-1 flex items-center px-5 gap-4 flex-shrink-0 z-20">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mr-2">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#161b27"/>
          <rect x="4" y="7"  width="5" height="10" rx="1.5" fill="#4f8ef7"/>
          <rect x="10" y="4" width="5" height="13" rx="1.5" fill="#6366f1"/>
          <rect x="16" y="9" width="5" height="8"  rx="1.5" fill="#a855f7"/>
        </svg>
        <span className="text-sm font-bold text-slate-100 tracking-tight hidden sm:block">
          Velozity ProjectTracker <span className="text-slate-500 font-normal"> </span>
        </span>
      </div>

      {/* View tabs */}
      <nav className="flex gap-1 bg-bg-3 rounded-lg p-1">
        {VIEWS.map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                        ${currentView === v.id
                          ? 'bg-bg-2 text-slate-100 shadow-sm'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-bg-4'}`}
          >
            {v.icon}
            {v.label}
          </button>
        ))}
      </nav>

      {/* Presence */}
      <PresenceBar />
    </header>
  );
}
