import { useState, useRef, useEffect } from 'react';
import PresenceBar from './PresenceBar';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export default function Header({ onOpenSidebar }: HeaderProps) {
  const currentView = useStore((s) => s.currentView);
  const setView = useStore((s) => s.setView);
  const { user, logout } = useAuthStore();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const titleMap: Record<string, string> = {
    dashboard: 'Overview',
    kanban: 'Kanban Board',
    list: 'Task List',
    timeline: 'Timeline',
    profile: 'My Profile',
    settings: 'Settings'
  };

  return (
    <header className="h-14 bg-bg-2 border-b border-border-1 flex items-center px-3 sm:px-6 gap-3 sm:gap-4 flex-shrink-0 z-20 justify-between">
      <div className="flex items-center gap-3">
        {/* Hamburger menu for mobile */}
        <button 
          onClick={onOpenSidebar}
          className="md:hidden p-1.5 -ml-1.5 text-slate-400 hover:text-slate-200 hover:bg-bg-3 rounded-md transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Breadcrumbs / Title */}
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
           <span className="hidden sm:inline">Workspace</span>
           <span className="text-slate-500 hidden sm:inline">/</span>
           <span className="text-slate-100">{titleMap[currentView] || 'Overview'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <PresenceBar />
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center text-white font-bold text-[10px] shadow-md cursor-pointer border border-border-1 hover:border-accent hover:scale-105 transition-all outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-2"
          >
            {user?.name?.substring(0, 2).toUpperCase() || 'ME'}
          </button>
          
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-3 w-64 bg-bg-2/95 backdrop-blur-xl border border-border-1 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-fade-in-up origin-top-right">
              <div className="p-5 border-b border-border-1 bg-bg-3/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-inner">
                    {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate text-sm">{user?.name || 'User'}</h4>
                    <p className="text-slate-400 text-xs truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-2 space-y-1">
                <button 
                  onClick={() => { setView('profile'); setIsProfileOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-bg-3 rounded-xl transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </button>
                <button 
                  onClick={() => { setView('settings'); setIsProfileOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-bg-3 rounded-xl transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
              </div>

              <div className="p-2 border-t border-border-1 gap-1 flex flex-col mt-1">
                <button 
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
