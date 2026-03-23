import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useStore } from '../../store/useStore';
import { PRIORITY_COLORS } from '../../utils';
import type { Task } from '../../types';

const ROW_H    = 38;
const LABEL_W  = 220;
const HEADER_H = 36;
const BUFFER   = 5;

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function TimelineView() {
  const tasks = useStore(s => s.filteredTasks());
  const gridRef   = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const daysHRef  = useRef<HTMLDivElement>(null);

  const [scrollTop, setScrollTop] = useState(0);
  const [viewHeight, setViewHeight] = useState(600);

  const now        = new Date(); now.setHours(0, 0, 0, 0);
  const year       = now.getFullYear();
  const month      = now.getMonth();
  const totalDays  = getDaysInMonth(year, month);
  const monthStart = new Date(year, month, 1);
  const todayCol   = Math.floor((now.getTime() - monthStart.getTime()) / 86_400_000);

  // Measure viewport height of the main grid for virtualization
  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    setViewHeight(el.clientHeight);
    const ro = new ResizeObserver(() => setViewHeight(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Sync internal state with DOM scrollTop when list drastically shrinks/expands
  useLayoutEffect(() => {
    if (gridRef.current) setScrollTop(gridRef.current.scrollTop);
  }, [tasks.length]);

  // Sync scroll between grid ↔ label sidebar and day header
  useEffect(() => {
    const grid = gridRef.current;
    const labels = labelsRef.current;
    const daysH = daysHRef.current;
    if (!grid || !labels || !daysH) return;

    function onGridScroll() {
      setScrollTop(grid!.scrollTop); // Trigger virtual rerender
      if (labels) labels.scrollTop = grid!.scrollTop;
      if (daysH)  daysH.scrollLeft = grid!.scrollLeft;
    }
    grid.addEventListener('scroll', onGridScroll, { passive: true });
    return () => grid.removeEventListener('scroll', onGridScroll);
  }, []);

  function barProps(task: Task): { left: string; width: string; isMarker: boolean } | null {
    const due = new Date(task.dueDate); due.setHours(0, 0, 0, 0);
    const dueDay = Math.floor((due.getTime() - monthStart.getTime()) / 86_400_000);

    // Task entirely outside current month — still render as marker on boundary
    if (dueDay < 0 || dueDay >= totalDays) return null;

    if (!task.startDate) {
      return { 
        left: `calc(${(dueDay / totalDays) * 100}% + 3px)`, 
        width: `calc(${(1 / totalDays) * 100}% - 6px)`, 
        isMarker: true 
      };
    }

    const start    = new Date(task.startDate); start.setHours(0, 0, 0, 0);
    const startDay = Math.max(0, Math.floor((start.getTime() - monthStart.getTime()) / 86_400_000));
    const endDay   = Math.min(totalDays - 1, dueDay);
    if (startDay > endDay) {
      return { 
        left: `calc(${(dueDay / totalDays) * 100}% + 3px)`, 
        width: `calc(${(1 / totalDays) * 100}% - 6px)`, 
        isMarker: true 
      };
    }

    const spanDays = Math.max(1, endDay - startDay + 1);
    return {
      left:     `calc(${(startDay / totalDays) * 100}% + 2px)`,
      width:    `calc(${(spanDays / totalDays) * 100}% - 4px)`,
      isMarker: false,
    };
  }

  const monthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Virtual window calculation (removing the static 300 constraint)
  const totalH   = tasks.length * ROW_H;
  const maxScroll = Math.max(0, totalH - viewHeight);
  const clampedScrollTop = Math.min(scrollTop, maxScroll);
  const startIdx = Math.max(0, Math.floor(clampedScrollTop / ROW_H) - BUFFER);
  const endIdx   = Math.min(tasks.length - 1, Math.ceil((clampedScrollTop + viewHeight) / ROW_H) + BUFFER);
  const offsetY  = startIdx * ROW_H;
  
  const visibleTasks = tasks.slice(startIdx, endIdx + 1);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Header row ── */}
      <div className="flex flex-shrink-0 border-b border-border-1 bg-bg-2" style={{ height: HEADER_H }}>
        {/* Month label col */}
        <div
          className="flex items-center px-3 flex-shrink-0 border-r border-border-1 text-xs font-semibold text-slate-400"
          style={{ width: LABEL_W }}
        >
          {monthName}
        </div>

        {/* Day numbers — scrolls with grid */}
        <div ref={daysHRef} className="flex-1 overflow-hidden relative" style={{ height: HEADER_H }}>
          <div className="flex absolute top-0 left-0 w-full" style={{ height: HEADER_H }}>
            {Array.from({ length: totalDays }, (_, d) => {
              const isToday = d === todayCol;
              return (
                <div
                  key={d}
                  className={`flex items-center justify-center text-[11px] border-r border-border-1 flex-shrink-0
                              ${isToday ? 'text-accent font-bold' : 'text-slate-500'}`}
                  style={{ width: `${100 / totalDays}%`, height: HEADER_H }}
                >
                  {d + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Label sidebar */}
        <div
          ref={labelsRef}
          className="flex-shrink-0 overflow-hidden border-r border-border-1 relative"
          style={{ width: LABEL_W }}
        >
          {/* Virtual spacer container */}
          <div style={{ height: totalH, position: 'relative' }}>
            {/* Absolute positioning of rendering window offset */}
            <div style={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
              {visibleTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 px-3 border-b border-border-1 overflow-hidden"
                  style={{ height: ROW_H }}
                >
                  <span
                    className="text-[9px] font-bold flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: task.assignee.bgColor, color: task.assignee.color }}
                  >
                    {task.assignee.initials}
                  </span>
                  <span className="text-xs text-slate-300 truncate" title={task.title}>{task.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gantt grid */}
        <div ref={gridRef} className="flex-1 overflow-auto overflow-x-hidden relative">
          <div className="w-full" style={{ minHeight: Math.max(totalH, viewHeight), position: 'relative' }}>
            {/* Background columns */}
            {Array.from({ length: totalDays }, (_, d) => (
              <div
                key={d}
                className={`absolute top-0 bottom-0 border-r border-border-1/40
                            ${d === todayCol ? 'bg-accent/5' : d % 2 === 0 ? '' : 'bg-bg-2/30'}`}
                style={{ left: `${(d / totalDays) * 100}%`, width: `${100 / totalDays}%` }}
              />
            ))}

            {/* Today line */}
            <div
              className="absolute top-0 bottom-0 z-10 pointer-events-none"
              style={{ left: `calc(${((todayCol + 0.5) / totalDays) * 100}% - 1px)`, width: 2, background: 'rgba(79,142,247,0.7)' }}
            />

            {/* Task rows */}
            {visibleTasks.map((task, i) => {
              const bp = barProps(task);
              const absoluteIndex = startIdx + i;
              return (
                <div
                  key={task.id}
                  className="absolute left-0 right-0 border-b border-border-1/40"
                  style={{ height: ROW_H, top: absoluteIndex * ROW_H }}
                >
                  {bp && (
                    <div
                      className="absolute top-[7px] flex items-center overflow-hidden text-[10px] font-medium rounded-md cursor-default transition-all hover:brightness-125"
                      style={{
                        left:    bp.left,
                        width:   bp.width,
                        height:  ROW_H - 14,
                        background: PRIORITY_COLORS[task.priority] + '28',
                        border:  `1px solid ${PRIORITY_COLORS[task.priority]}66`,
                        color:   PRIORITY_COLORS[task.priority],
                        padding: '0 5px',
                      }}
                      title={`${task.title}\n${task.startDate ? task.startDate.toLocaleDateString() + ' → ' : ''}${task.dueDate.toLocaleDateString()}`}
                    >
                      {!bp.isMarker && (
                        <span className="truncate">{task.title}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
