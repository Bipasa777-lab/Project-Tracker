import type { Priority } from '../../types';

const CLASS_MAP: Record<Priority, string> = {
  critical: 'badge-critical',
  high:     'badge-high',
  medium:   'badge-medium',
  low:      'badge-low',
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${CLASS_MAP[priority]}`}>
      {priority}
    </span>
  );
}
