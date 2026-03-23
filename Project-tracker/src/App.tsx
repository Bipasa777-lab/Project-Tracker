import { useStore } from './store/useStore';
import Header from './components/shared/Header';
import FilterBar from './components/filters/FilterBar';
import KanbanView from './components/kanban/KanbanView';
import ListView from './components/list/ListView';
import TimelineView from './components/timeline/TimelineView';

export default function App() {
  const currentView = useStore(s => s.currentView);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-1">
      {/* Ghost element for drag — lives outside React rendering for performance */}
      <div id="drag-ghost" aria-hidden="true" />

      <Header />
      <FilterBar />

      <main className="flex-1 overflow-hidden">
        {currentView === 'kanban'    && <KanbanView />}
        {currentView === 'list'      && <ListView />}
        {currentView === 'timeline'  && <TimelineView />}
      </main>
    </div>
  );
}
