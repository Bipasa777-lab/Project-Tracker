import type { Status } from '../../types';
import { STATUS_LABELS, STATUS_COLORS, STATUSES } from '../../types';
import { useStore } from '../../store/useStore';

interface StatusSelectProps {
  taskId: string;
  status: Status;
}

export default function StatusSelect({ taskId, status }: StatusSelectProps) {
  const updateTaskStatus = useStore(s => s.updateTaskStatus);

  return (
    <div className="relative w-full">
      <select
        value={status}
        onChange={e => updateTaskStatus(taskId, e.target.value as Status)}
        className="w-full appearance-none bg-bg-4 border border-border-1 rounded-md px-2 py-1 text-xs cursor-pointer focus:outline-none focus:border-accent transition-colors"
        style={{ color: STATUS_COLORS[status] }}
      >
        {STATUSES.map(s => (
          <option key={s} value={s} style={{ color: STATUS_COLORS[s], background: '#1e2535' }}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}
