import { create } from 'zustand';
import type { Task, Filters, ViewType, SortKey, SortDir, Status, SimUser } from '../types';
import { generateTasks } from '../data/seed';
import { prioritySort } from '../utils';

// ─── URL sync helpers ────────────────────────────────────────────────────────

function parseURL(): Partial<{ view: ViewType; filters: Partial<Filters> }> {
  try {
    const p = new URLSearchParams(window.location.search);
    const view = (p.get('view') ?? 'kanban') as ViewType;
    const filters: Partial<Filters> = {
      searchQuery: p.get('q') ?? '',
      status:    p.get('status')   ? (p.get('status')!.split(',') as Status[]) : [],
      priority:  p.get('priority') ? (p.get('priority')!.split(',') as any[])  : [],
      assignee:  p.get('assignee') ? p.get('assignee')!.split(',')             : [],
      dateFrom:  p.get('from')  ?? null,
      dateTo:    p.get('to')    ?? null,
    };
    return { view, filters };
  } catch { return {}; }
}

function pushURL(view: ViewType, filters: Filters): void {
  try {
    const p = new URLSearchParams();
    if (view !== 'kanban')          p.set('view',     view);
    if (filters.searchQuery)        p.set('q',        filters.searchQuery);
    if (filters.status.length)      p.set('status',   filters.status.join(','));
    if (filters.priority.length)    p.set('priority', filters.priority.join(','));
    if (filters.assignee.length)    p.set('assignee', filters.assignee.join(','));
    if (filters.dateFrom)           p.set('from',     filters.dateFrom);
    if (filters.dateTo)             p.set('to',       filters.dateTo);
    const qs = p.toString();
    window.history.pushState({}, '', qs ? `?${qs}` : window.location.pathname);
  } catch { /* sandboxed */ }
}

// ─── Sim users ───────────────────────────────────────────────────────────────

const SIM_USERS: SimUser[] = [
  { id: 's1', name: 'Diana P',  initials: 'DP', color: '#ff6b9d', bgColor: 'rgba(255,107,157,0.25)', currentTaskId: null },
  { id: 's2', name: 'Carlos M', initials: 'CM', color: '#4ecdc4', bgColor: 'rgba(78,205,196,0.25)',  currentTaskId: null },
  { id: 's3', name: 'Yuki T',   initials: 'YT', color: '#ffe66d', bgColor: 'rgba(255,230,109,0.25)', currentTaskId: null },
];

// ─── Store interface ─────────────────────────────────────────────────────────

interface StoreState {
  // data
  tasks: Task[];
  // view
  currentView: ViewType;
  setView: (v: ViewType) => void;
  // filters
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  toggleFilterValue: (key: 'status' | 'priority' | 'assignee', value: string) => void;
  clearFilters: () => void;
  // derived
  filteredTasks: () => Task[];
  // list sort
  sortKey:  SortKey | null;
  sortDir:  SortDir;
  setSort:  (key: SortKey) => void;
  sortedFilteredTasks: () => Task[];
  // task mutations
  updateTaskStatus: (taskId: string, status: Status) => void;
  // sim users
  simUsers: SimUser[];
  tickSimUsers: () => void;
}

const EMPTY_FILTERS: Filters = {
  searchQuery: '', status: [], priority: [], assignee: [], dateFrom: null, dateTo: null,
};

const initial = parseURL();

export const useStore = create<StoreState>((set, get) => ({
  tasks: generateTasks(520),

  currentView: initial.view ?? 'kanban',
  setView(v) {
    set({ currentView: v });
    pushURL(v, get().filters);
  },

  filters: { ...EMPTY_FILTERS, ...(initial.filters ?? {}) },

  setFilter(key, value) {
    const filters = { ...get().filters, [key]: value };
    set({ filters });
    pushURL(get().currentView, filters);
  },

  toggleFilterValue(key, value) {
    const current = get().filters[key] as string[];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    const filters = { ...get().filters, [key]: next };
    set({ filters });
    pushURL(get().currentView, filters);
  },

  clearFilters() {
    set({ filters: { ...EMPTY_FILTERS } });
    pushURL(get().currentView, EMPTY_FILTERS);
  },

  filteredTasks() {
    const { tasks, filters } = get();
    return tasks.filter(t => {
      if (filters.searchQuery && !t.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
      if (filters.status.length   && !filters.status.includes(t.status))         return false;
      if (filters.priority.length && !filters.priority.includes(t.priority))     return false;
      if (filters.assignee.length && !filters.assignee.includes(t.assignee.id))  return false;
      if (filters.dateFrom) { const f = new Date(filters.dateFrom); if (t.dueDate < f) return false; }
      if (filters.dateTo)   { const to = new Date(filters.dateTo);  if (t.dueDate > to) return false; }
      return true;
    });
  },

  sortKey: null,
  sortDir: 'asc',

  setSort(key) {
    const { sortKey, sortDir } = get();
    if (sortKey === key) set({ sortDir: sortDir === 'asc' ? 'desc' : 'asc' });
    else set({ sortKey: key, sortDir: 'asc' });
  },

  sortedFilteredTasks() {
    const { sortKey, sortDir } = get();
    const tasks = [...get().filteredTasks()];
    if (!sortKey) return tasks;
    tasks.sort((a, b) => {
      let av: string | number, bv: string | number;
      if (sortKey === 'title')    { av = a.title.toLowerCase(); bv = b.title.toLowerCase(); }
      else if (sortKey === 'priority') { av = prioritySort(a.priority); bv = prioritySort(b.priority); }
      else { av = a.dueDate.getTime(); bv = b.dueDate.getTime(); }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return tasks;
  },

  updateTaskStatus(taskId, status) {
    set(s => ({ tasks: s.tasks.map(t => t.id === taskId ? { ...t, status } : t) }));
  },

  simUsers: SIM_USERS.map(u => ({ ...u })),

  tickSimUsers() {
    const taskIds = get().tasks
      .filter(t => t.status !== 'done')
      .map(t => t.id);
    if (!taskIds.length) return;
    set(s => ({
      simUsers: s.simUsers.map(u => {
        const move = Math.random() < 0.45;
        if (!move) return u;
        const goIdle = Math.random() < 0.2;
        return {
          ...u,
          currentTaskId: goIdle ? null : taskIds[Math.floor(Math.random() * taskIds.length)],
        };
      }),
    }));
  },
}));
