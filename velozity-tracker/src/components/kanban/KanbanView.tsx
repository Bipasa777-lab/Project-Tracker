import { useRef, useState, useCallback, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import KanbanColumn from './KanbanColumn';
import type { Task, Status } from '../../types';
import { STATUSES } from '../../types';

interface DragState {
  taskId: string;
  sourceStatus: Status;
  cardHeight: number;
  offsetX: number;
  offsetY: number;
}

interface DropTarget {
  status: Status;
  insertIndex: number;  // where placeholder should appear among visible tasks
}

export default function KanbanView() {
  const tasks            = useStore(s => s.filteredTasks());
  const updateTaskStatus = useStore(s => s.updateTaskStatus);

  const [drag, setDrag]         = useState<DragState | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const ghostRef = useRef<HTMLDivElement>(document.getElementById('drag-ghost') as HTMLDivElement);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function getTasksForCol(status: Status) {
    return tasks.filter(t => t.status === status);
  }

  function setGhostPos(x: number, y: number) {
    const g = ghostRef.current;
    if (!g) return;
    g.style.left = `${x - (drag?.offsetX ?? 0)}px`;
    g.style.top  = `${y - (drag?.offsetY ?? 0)}px`;
  }

  // ─── Start drag ────────────────────────────────────────────────────────────

  function startDrag(task: Task, clientX: number, clientY: number) {
    const cardEl = document.getElementById(`card-${task.id}`);
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();

    // Populate ghost
    const g = ghostRef.current;
    if (g) {
      g.innerHTML = cardEl.innerHTML;
      g.style.display = 'block';
      g.style.width   = `${rect.width}px`;
      g.style.left    = `${clientX - (clientX - rect.left)}px`;
      g.style.top     = `${clientY - (clientY - rect.top)}px`;
    }

    setDrag({
      taskId: task.id,
      sourceStatus: task.status,
      cardHeight: rect.height,
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
    });
  }

  // ─── Move ──────────────────────────────────────────────────────────────────

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!drag) return;
    setGhostPos(e.clientX, e.clientY);
    detectDropTarget(e.clientX, e.clientY);
  }, [drag]);  // eslint-disable-line react-hooks/exhaustive-deps

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!drag) return;
    e.preventDefault();
    const t = e.touches[0];
    setGhostPos(t.clientX, t.clientY);
    detectDropTarget(t.clientX, t.clientY);
  }, [drag]);  // eslint-disable-line react-hooks/exhaustive-deps

  function detectDropTarget(cx: number, cy: number) {
    const g = ghostRef.current;
    if (g) g.style.display = 'none';
    const el = document.elementFromPoint(cx, cy);
    if (g) g.style.display = 'block';

    if (!el) { setDropTarget(null); return; }

    const colEl = (el as HTMLElement).closest<HTMLElement>('[data-col-status]');
    if (!colEl) { setDropTarget(null); return; }

    const status = colEl.dataset.colStatus as Status;
    const cards  = [...colEl.querySelectorAll<HTMLElement>('[data-task-id]')]
      .filter(c => c.dataset.taskId !== drag?.taskId);

    let insertIndex = cards.length;
    for (let i = 0; i < cards.length; i++) {
      const r = cards[i].getBoundingClientRect();
      if (cy < r.top + r.height / 2) { insertIndex = i; break; }
    }

    setDropTarget({ status, insertIndex });
  }

  // ─── End drag ─────────────────────────────────────────────────────────────

  const endDrag = useCallback((cx: number, cy: number) => {
    if (!drag) return;

    const g = ghostRef.current;
    if (g) g.style.display = 'none';

    // Find target column at drop point
    if (g) g.style.display = 'none';
    const el = document.elementFromPoint(cx, cy);
    const colEl = el ? (el as HTMLElement).closest<HTMLElement>('[data-col-status]') : null;

    if (colEl) {
      const newStatus = colEl.dataset.colStatus as Status;
      if (newStatus !== drag.sourceStatus) {
        updateTaskStatus(drag.taskId, newStatus);
      }
    }
    // If dropped outside any column — snap back (do nothing, state unchanged)

    setDrag(null);
    setDropTarget(null);
    if (g) g.style.display = 'none';
  }, [drag, updateTaskStatus]);

  const onMouseUp = useCallback((e: MouseEvent) => { endDrag(e.clientX, e.clientY); }, [endDrag]);
  const onTouchEnd = useCallback((e: TouchEvent) => {
    const t = e.changedTouches[0];
    endDrag(t.clientX, t.clientY);
  }, [endDrag]);

  // ─── Global event listeners ────────────────────────────────────────────────

  useEffect(() => {
    if (!drag) return;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   onMouseUp);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend',  onTouchEnd);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup',   onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend',  onTouchEnd);
    };
  }, [drag, onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  // ─── Card event handlers ───────────────────────────────────────────────────

  function onCardMouseDown(e: React.MouseEvent, task: Task) {
    if (e.button !== 0) return;
    e.preventDefault();
    startDrag(task, e.clientX, e.clientY);
  }

  function onCardTouchStart(e: React.TouchEvent, task: Task) {
    e.preventDefault();
    const t = e.touches[0];
    startDrag(task, t.clientX, t.clientY);
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-3 h-full overflow-x-auto px-4 py-4">
      {STATUSES.map(status => {
        const colTasks   = getTasksForCol(status);
        const isDropZone = drag !== null && dropTarget?.status === status;
        const phIndex    = isDropZone ? (dropTarget?.insertIndex ?? null) : null;

        return (
          <div key={status} data-col-status={status} className="flex-1 min-w-[250px]">
            <KanbanColumn
              status={status}
              tasks={colTasks}
              isDragOver={isDropZone}
              draggingId={drag?.taskId ?? null}
              onMouseDown={onCardMouseDown}
              onTouchStart={onCardTouchStart}
              onDragEnter={() => {}}
              onDragLeave={() => {}}
              placeholderHeight={drag?.cardHeight ?? null}
              placeholderIndex={phIndex}
            />
          </div>
        );
      })}
    </div>
  );
}
