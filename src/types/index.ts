export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'inprogress' | 'inreview' | 'done';
export type ViewType = 'dashboard' | 'kanban' | 'list' | 'timeline' | 'profile' | 'settings';
export type SortKey = 'title' | 'priority' | 'dueDate';
export type SortDir = 'asc' | 'desc';

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
  bgColor: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: User;
  priority: Priority;
  status: Status;
  startDate: Date | null;
  dueDate: Date;
}

export interface Filters {
  searchQuery: string;
  status: Status[];
  priority: Priority[];
  assignee: string[];
  dateFrom: string | null;
  dateTo: string | null;
}

export interface SimUser {
  id: string;
  name: string;
  initials: string;
  color: string;
  bgColor: string;
  currentTaskId: string | null;
}

export const STATUSES: Status[] = ['todo', 'inprogress', 'inreview', 'done'];
export const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];

export const STATUS_LABELS: Record<Status, string> = {
  todo: 'To Do',
  inprogress: 'In Progress',
  inreview: 'In Review',
  done: 'Done',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const STATUS_COLORS: Record<Status, string> = {
  todo: '#6366f1',
  inprogress: '#3b82f6',
  inreview: '#a855f7',
  done: '#22c55e',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};
