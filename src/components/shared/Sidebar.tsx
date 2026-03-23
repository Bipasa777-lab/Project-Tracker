import { useStore } from '../../store/useStore';
import type { ViewType } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onGoHome?: () => void;
}

const NAV_ITEMS: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  {
    id: 'dashboard',
    label: 'Overview',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    id: 'kanban',
    label: 'Kanban',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2" width="4" height="12" rx="1.5" fill="currentColor" opacity=".7"/>
        <rect x="6" y="2" width="4" height="8" rx="1.5" fill="currentColor"/>
        <rect x="11" y="2" width="4" height="10" rx="1.5" fill="currentColor" opacity=".5"/>
      </svg>
    ),
  },
  {
    id: 'list',
    label: 'List',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="5" width="9" height="2.5" rx="1.25" fill="currentColor"/>
        <rect x="5" y="9" width="10" height="2.5" rx="1.25" fill="currentColor" opacity=".6"/>
        <path d="M1 13h14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".3"/>
      </svg>
    ),
  },
];

export default function Sidebar({ isOpen, onClose, onGoHome }: SidebarProps) {
  const currentView = useStore((s) => s.currentView);
  const setView = useStore((s) => s.setView);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar surface */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-bg-2 border-r border-border-1 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand */}
        <button onClick={onGoHome} className="h-14 flex w-full items-center px-6 border-b border-border-1 gap-2.5 hover:bg-bg-3 transition-colors cursor-pointer text-left">
          <div className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 w-7 h-7 rounded-md shadow-lg shadow-blue-500/20">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="7" width="5" height="10" rx="1.5" fill="currentColor" opacity="0.9"/>
              <rect x="10" y="4" width="5" height="13" rx="1.5" fill="currentColor"/>
              <rect x="16" y="9" width="5" height="8" rx="1.5" fill="currentColor" opacity="0.7"/>
            </svg>
          </div>
          <span className="text-[15px] font-bold tracking-tight text-white">Project Tracker</span>
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto no-scrollbar">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-3">
            Views
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent/10 text-accent shadow-sm shadow-accent/5'
                    : 'text-slate-400 hover:bg-bg-3 hover:text-slate-200'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer info (optional for aesthetics) */}
        <div className="p-4 border-t border-border-1 m-3 rounded-xl bg-bg-3 flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-300">Project Workspace</span>
          <div className="w-full bg-border-1 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2/3 h-full"></div>
          </div>
          <span className="text-[10px] text-slate-500">67% Storage capacity</span>
        </div>
      </aside>
    </>
  );
}
