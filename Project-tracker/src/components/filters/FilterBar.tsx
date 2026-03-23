import { useStore } from '../../store/useStore';
import MultiSelect from '../shared/MultiSelect';
import { USERS } from '../../data/seed';
import { STATUSES, PRIORITIES, STATUS_LABELS, PRIORITY_LABELS } from '../../types';

export default function FilterBar() {
  const filters          = useStore(s => s.filters);
  const toggleFilterValue = useStore(s => s.toggleFilterValue);
  const setFilter        = useStore(s => s.setFilter);
  const clearFilters     = useStore(s => s.clearFilters);

  const hasFilters =
    filters.searchQuery.length > 0 ||
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignee.length > 0 ||
    filters.dateFrom !== null ||
    filters.dateTo   !== null;

  return (
    <div className="flex items-center gap-2 flex-wrap px-5 py-2 bg-bg-2 border-b border-border-1 min-h-[48px]">
      {/* Search */}
      <div className="relative flex items-center">
        <svg className="w-4 h-4 text-slate-500 absolute left-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          value={filters.searchQuery || ''}
          onChange={e => setFilter('searchQuery', e.target.value)}
          className="bg-bg-3 border border-border-1 rounded-md text-slate-300 text-xs pl-8 pr-3 py-1.5 focus:outline-none focus:border-accent transition-colors w-48 placeholder-slate-500"
        />
      </div>

      {/* Status */}
      <MultiSelect
        label="Status"
        options={STATUSES.map(s => ({ value: s, label: STATUS_LABELS[s] }))}
        selected={filters.status}
        onChange={v => toggleFilterValue('status', v)}
      />

      {/* Priority */}
      <MultiSelect
        label="Priority"
        options={PRIORITIES.map(p => ({ value: p, label: PRIORITY_LABELS[p] }))}
        selected={filters.priority}
        onChange={v => toggleFilterValue('priority', v)}
      />

      {/* Assignee */}
      <MultiSelect
        label="Assignee"
        options={USERS.map(u => ({ value: u.id, label: u.name }))}
        selected={filters.assignee}
        onChange={v => toggleFilterValue('assignee', v)}
      />

      {/* Date From */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">From</span>
        <input
          type="date"
          value={filters.dateFrom ?? ''}
          onChange={e => setFilter('dateFrom', e.target.value || null)}
          className="bg-bg-3 border border-border-1 rounded-md text-slate-300 text-xs px-2 py-1.5 focus:outline-none focus:border-accent transition-colors"
          style={{ colorScheme: 'dark' }}
        />
      </div>

      {/* Date To */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">To</span>
        <input
          type="date"
          value={filters.dateTo ?? ''}
          onChange={e => setFilter('dateTo', e.target.value || null)}
          className="bg-bg-3 border border-border-1 rounded-md text-slate-300 text-xs px-2 py-1.5 focus:outline-none focus:border-accent transition-colors"
          style={{ colorScheme: 'dark' }}
        />
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="ml-auto flex items-center gap-1.5 border border-red-500/60 text-red-400 hover:bg-red-500/10
                     rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear Filters
        </button>
      )}
    </div>
  );
}
