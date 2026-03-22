import type { Task, User, Priority, Status } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Alex Kim',     initials: 'AK', color: '#4f8ef7', bgColor: 'rgba(79,142,247,0.2)' },
  { id: 'u2', name: 'Sara Chen',    initials: 'SC', color: '#a855f7', bgColor: 'rgba(168,85,247,0.2)' },
  { id: 'u3', name: 'Mike Ross',    initials: 'MR', color: '#22c55e', bgColor: 'rgba(34,197,94,0.2)' },
  { id: 'u4', name: 'Priya Patel',  initials: 'PP', color: '#ef4444', bgColor: 'rgba(239,68,68,0.2)' },
  { id: 'u5', name: 'James Wu',     initials: 'JW', color: '#f97316', bgColor: 'rgba(249,115,22,0.2)' },
  { id: 'u6', name: 'Lena Torres',  initials: 'LT', color: '#eab308', bgColor: 'rgba(234,179,8,0.2)' },
];

const TITLE_PREFIXES = [
  'Implement', 'Fix', 'Design', 'Refactor', 'Deploy', 'Write', 'Review',
  'Audit', 'Migrate', 'Integrate', 'Optimise', 'Document', 'Configure',
  'Test', 'Update', 'Build', 'Research', 'Analyse', 'Monitor', 'Debug',
];
const TITLE_SUBJECTS = [
  'auth flow', 'API rate limiting', 'design system', 'database schema',
  'CI/CD pipeline', 'unit tests', 'performance metrics', 'error handling',
  'payment gateway', 'email templates', 'mobile layout', 'cache layer',
  'admin panel', 'search indexing', 'data export', 'webhook support',
  'OAuth provider', 'load balancer', 'CDN setup', 'SSL certificates',
  'backup automation', 'log aggregation', 'feature flags', 'API versioning',
  'GraphQL schema', 'WebSocket server', 'image pipeline', 'SEO metadata',
  'onboarding flow', 'notification service', 'multi-tenancy', 'rate limiter',
  'session tokens', 'password reset', '2FA support', 'role permissions',
  'audit trail', 'data validation', 'error boundaries', 'state management',
  'component library', 'accessibility audit', 'dark mode', 'keyboard nav',
  'i18n support', 'timezone handling', 'currency formatting', 'PDF export',
  'CSV pipeline', 'bulk operations', 'file upload', 'real-time sync',
  'offline mode', 'push notifications', 'deep links', 'app icon',
  'crash reporting', 'memory profiler', 'bundle analyser', 'tree shaking',
];

const STATUSES: Status[]   = ['todo', 'inprogress', 'inreview', 'done'];
const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];

function rnd<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rndInt(a: number, b: number): number { return Math.floor(Math.random() * (b - a + 1)) + a; }

export function generateTasks(count = 520): Task[] {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const dueOffset = rndInt(-25, 45);
    const due = new Date(today); due.setDate(today.getDate() + dueOffset);

    let startDate: Date | null = null;
    if (Math.random() > 0.12) {
      const startOffset = rndInt(-15, Math.max(dueOffset - 1, 0));
      startDate = new Date(today); startDate.setDate(today.getDate() + startOffset);
    }

    tasks.push({
      id: `task-${i}`,
      title: `${rnd(TITLE_PREFIXES)} ${rnd(TITLE_SUBJECTS)} #${i + 1}`,
      assignee: rnd(USERS),
      priority: rnd(PRIORITIES),
      status: rnd(STATUSES),
      startDate,
      dueDate: due,
    });
  }

  return tasks;
}
