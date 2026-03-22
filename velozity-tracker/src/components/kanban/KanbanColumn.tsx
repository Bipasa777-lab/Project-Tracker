import type { Task, Status } from '../../types';
import { STATUS_LABELS, STATUS_COLORS } from '../../types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  status:      Status;
  tasks:       Task[];
  isDragOver:  boolean;
  draggingId:  string | null;
  onMouseDown: (e: React.MouseEvent, task: Task) => void;
  onTouchStart:(e: React.TouchEvent, task: Task) => void;
  onDragEnter: (status: Status) => void;
  onDragLeave: () => void;
  placeholderHeight: number | null; // show placeholder in this col
  placeholderIndex:  number | null; // position in list
}

const DOT_COLORS: Record<Status, string> = {
  todo:       'bg-indigo-400',
  inprogress: 'bg-blue-400',
  inreview:   'bg-purple-400',
  done:       'bg-green-400',
};

function EmptyColumn() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-600 py-8 px-4 text-center">
      <svg className="w-10 h-10 opacity-40" fill="none" viewBox="0 0 40 40">
        <rect x="6" y="10" width="28" height="20" rx="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M13 20h14M13 25h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span className="text-xs">No tasks here</span>
    </div>
  );
}

export default function KanbanColumn({
  status, tasks, isDragOver, draggingId,
  onMouseDown, onTouchStart, onDragEnter, onDragLeave,
  placeholderHeight, placeholderIndex,
}: KanbanColumnProps) {
  return (
    <div
      className={`w-full h-full flex flex-col rounded-xl border transition-colors
                  ${isDragOver ? 'drop-active border-accent bg-accent/5' : 'bg-bg-2 border-border-1'}`}
      onMouseEnter={() => onDragEnter(status)}
      onMouseLeave={onDragLeave}
      onTouchMove={() => onDragEnter(status)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3.5 py-3 border-b border-border-1 flex-shrink-0">
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${DOT_COLORS[status]}`} />
        <span className="text-sm font-semibold text-slate-200 flex-1">{STATUS_LABELS[status]}</span>
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-bg-4 text-slate-400"
          style={{ borderColor: STATUS_COLORS[status] }}
        >
          {tasks.filter(t => t.id !== draggingId).length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-2 min-h-[80px]">
        {tasks.length === 0 && placeholderHeight === null
          ? <EmptyColumn />
          : tasks.map((task, idx) => (
            <div key={task.id} className="flex flex-col gap-2">
              {placeholderIndex === idx && placeholderHeight !== null && (
                <div
                  className="drag-placeholder flex-shrink-0"
                  style={{ height: placeholderHeight }}
                />
              )}
              {task.id !== draggingId && (
                <TaskCard
                  task={task}
                  isDragging={task.id === draggingId}
                  onMouseDown={onMouseDown}
                  onTouchStart={onTouchStart}
                />
              )}
            </div>
          ))
        }
        {/* Placeholder at end */}
        {placeholderHeight !== null && placeholderIndex !== null && placeholderIndex >= tasks.length && (
          <div
            key="placeholder-end"
            className="drag-placeholder flex-shrink-0"
            style={{ height: placeholderHeight }}
          />
        )}
        {/* Empty + placeholder */}
        {tasks.length === 0 && placeholderHeight !== null && (
          <div className="drag-placeholder flex-shrink-0" style={{ height: placeholderHeight }} />
        )}
      </div>
    </div>
  );
}
