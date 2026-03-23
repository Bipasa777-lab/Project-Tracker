import { useRef, useState, useCallback, useLayoutEffect } from 'react';
import type { Task, SortKey, SortDir } from '../../types';
import PriorityBadge from '../shared/PriorityBadge';
import DueBadge from '../shared/DueBadge';
import Avatar from '../shared/Avatar';
import StatusSelect from '../shared/StatusSelect';

const ROW_H = 40;
const BUFFER = 5;

interface SortHeaderProps {
  label: string;
  sortKey: SortKey;
  activeSortKey: SortKey | null;
  sortDir: SortDir;
  onSort: (k: SortKey) => void;
  className?: string;
}

function SortHeader({ label, sortKey, activeSortKey, sortDir, onSort, className = '' }: SortHeaderProps) {
  const isActive = activeSortKey === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`flex items-center gap-1 text-left font-semibold text-[11px] uppercase tracking-wide
                  transition-colors select-none ${isActive ? 'text-accent-2' : 'text-slate-500 hover:text-slate-300'}
                  ${className}`}
    >
      {label}
      <span className="text-[10px] opacity-70">
        {isActive ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </button>
  );
}

interface VirtualListProps {
  tasks: Task[];
  sortKey: SortKey | null;
  sortDir: SortDir;
  onSort: (k: SortKey) => void;
  onClearFilters: () => void;
}

export default function VirtualList({ tasks, sortKey, sortDir, onSort, onClearFilters }: VirtualListProps) {
  const scrollRef    = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewHeight, setViewHeight] = useState(600);

  // Measure viewport
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setViewHeight(el.clientHeight);
    const ro = new ResizeObserver(() => setViewHeight(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Sync internal state with DOM scrollTop when list shrinks/expands
  useLayoutEffect(() => {
    if (scrollRef.current) setScrollTop(scrollRef.current.scrollTop);
  }, [tasks.length]);

  const onScroll = useCallback(() => {
    if (scrollRef.current) setScrollTop(scrollRef.current.scrollTop);
  }, []);

  const totalH   = tasks.length * ROW_H;
  const maxScroll = Math.max(0, totalH - viewHeight);
  const clampedScrollTop = Math.min(scrollTop, maxScroll);
  const startIdx = Math.max(0, Math.floor(clampedScrollTop / ROW_H) - BUFFER);
  const endIdx   = Math.min(tasks.length - 1, Math.ceil((clampedScrollTop + viewHeight) / ROW_H) + BUFFER);
  const offsetY  = startIdx * ROW_H;
  const visible  = tasks.slice(startIdx, endIdx + 1);

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500">
        <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 48 48">
          <rect x="8" y="12" width="32" height="24" rx="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M16 22h16M16 28h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <p className="text-sm text-slate-400">No tasks match your filters</p>
        <button
          onClick={onClearFilters}
          className="border border-accent/60 text-accent hover:bg-accent/10 rounded-md px-4 py-1.5 text-sm transition-colors"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-x-auto">
        <div className="min-w-[700px] flex-1 flex flex-col">
          {/* Table header */}
          <div className="grid bg-bg-2 border-b border-border-1 flex-shrink-0"
               style={{ gridTemplateColumns: '1fr 100px 120px 110px 160px' }}>
        <div className="px-4 py-2.5">
          <SortHeader label="Title"    sortKey="title"    activeSortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        </div>
        <div className="px-3 py-2.5">
          <SortHeader label="Priority" sortKey="priority" activeSortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        </div>
        <div className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Status</div>
        <div className="px-3 py-2.5">
          <SortHeader label="Due Date" sortKey="dueDate"  activeSortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        </div>
        <div className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Assignee</div>
      </div>

      {/* Virtual scroll viewport */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto relative"
      >
        {/* Total height spacer */}
        <div style={{ height: totalH, position: 'relative' }}>
          {/* Rendered window */}
          <div style={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
            {visible.map(task => (
              <div
                key={task.id}
                className="grid border-b border-border-1 hover:bg-bg-3 transition-colors"
                style={{ height: ROW_H, gridTemplateColumns: '1fr 100px 120px 110px 160px' }}
              >
                {/* Title */}
                <div className="px-4 flex items-center overflow-hidden">
                  <span className="text-sm text-slate-200 font-medium truncate" title={task.title}>
                    {task.title}
                  </span>
                </div>
                {/* Priority */}
                <div className="px-3 flex items-center">
                  <PriorityBadge priority={task.priority} />
                </div>
                {/* Status inline dropdown */}
                <div className="px-3 flex items-center">
                  <StatusSelect taskId={task.id} status={task.status} />
                </div>
                {/* Due date */}
                <div className="px-3 flex items-center">
                  <DueBadge date={task.dueDate} />
                </div>
                {/* Assignee */}
                <div className="px-3 flex items-center gap-2">
                  <Avatar user={task.assignee} size="sm" />
                  <span className="text-xs text-slate-400 truncate">{task.assignee.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
      </div>

      {/* Row count */}
      <div className="flex-shrink-0 px-4 py-1.5 bg-bg-2 border-t border-border-1 text-[11px] text-slate-500">
        {tasks.length.toLocaleString()} tasks
      </div>
    </div>
  );
}
