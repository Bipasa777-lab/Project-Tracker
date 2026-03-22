import type { Priority, Status } from '../types';

const today = new Date(); today.setHours(0, 0, 0, 0);

export function formatDueDate(date: Date): string {
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return 'Due Today';
  if (diff < -7)  return `${Math.abs(diff)}d overdue`;
  if (diff < 0)   return `${Math.abs(diff)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function dueDateStatus(date: Date): 'overdue' | 'today' | 'normal' {
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  if (diff < 0)  return 'overdue';
  if (diff === 0) return 'today';
  return 'normal';
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#22c55e',
};

export const PRIORITY_BG: Record<Priority, string> = {
  critical: 'rgba(239,68,68,0.18)',
  high:     'rgba(249,115,22,0.18)',
  medium:   'rgba(234,179,8,0.18)',
  low:      'rgba(34,197,94,0.18)',
};

export const STATUS_COLORS: Record<Status, string> = {
  todo:       '#6366f1',
  inprogress: '#3b82f6',
  inreview:   '#a855f7',
  done:       '#22c55e',
};

export function prioritySort(p: Priority): number {
  return { critical: 0, high: 1, medium: 2, low: 3 }[p];
}
