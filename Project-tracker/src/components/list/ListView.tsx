import { useStore } from '../../store/useStore';
import VirtualList from './VirtualList';

export default function ListView() {
  const sortedFilteredTasks = useStore(s => s.sortedFilteredTasks());
  const sortKey   = useStore(s => s.sortKey);
  const sortDir   = useStore(s => s.sortDir);
  const setSort   = useStore(s => s.setSort);
  const clearFilters = useStore(s => s.clearFilters);

  return (
    <div className="flex flex-col h-full">
      <VirtualList
        tasks={sortedFilteredTasks}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={setSort}
        onClearFilters={clearFilters}
      />
    </div>
  );
}
