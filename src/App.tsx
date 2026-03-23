import { useState } from 'react';
import { useStore } from './store/useStore';
import Header from './components/shared/Header';
import FilterBar from './components/filters/FilterBar';
import KanbanView from './components/kanban/KanbanView';
import ListView from './components/list/ListView';
import TimelineView from './components/timeline/TimelineView';
import DashboardView from './components/dashboard/DashboardView';
import Sidebar from './components/shared/Sidebar';
import LandingPage from './components/landing/LandingPage';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ProfileView from './components/profile/ProfileView';
import SettingsView from './components/settings/SettingsView';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

export default function App() {
  const currentView = useStore(s => s.currentView);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  
  const [appView, setAppView] = useState<'landing' | 'signin' | 'signup' | 'app'>(
    isAuthenticated ? 'app' : 'landing'
  );

  useEffect(() => {
    if (!isAuthenticated && appView === 'app') {
      setAppView('landing');
    } else if (isAuthenticated && (appView === 'signin' || appView === 'signup')) {
      setAppView('app');
    }
  }, [isAuthenticated, appView]);

  if (appView === 'landing') {
    return (
      <LandingPage 
        onEnterApp={() => setAppView(isAuthenticated ? 'app' : 'signin')} 
        onGoToSignIn={() => setAppView('signin')}
        onGoToSignUp={() => setAppView('signup')}
      />
    );
  }

  if (appView === 'signin') {
    return (
      <SignIn 
        onGoHome={() => setAppView('landing')} 
        onGoToSignUp={() => setAppView('signup')} 
        onSuccess={() => setAppView('app')} 
      />
    );
  }

  if (appView === 'signup') {
    return (
      <SignUp 
        onGoHome={() => setAppView('landing')} 
        onGoToSignIn={() => setAppView('signin')} 
        onSuccess={() => setAppView('app')} 
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-1">
      {/* Ghost element for drag — lives outside React rendering for performance */}
      <div id="drag-ghost" aria-hidden="true" />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onGoHome={() => setAppView('landing')} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        {currentView !== 'dashboard' && currentView !== 'profile' && currentView !== 'settings' && <FilterBar />}

        <main className="flex-1 overflow-hidden flex flex-col">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'kanban'    && <KanbanView />}
          {currentView === 'list'      && <ListView />}
          {currentView === 'timeline'  && <TimelineView />}
          {currentView === 'profile'   && <ProfileView />}
          {currentView === 'settings'  && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
