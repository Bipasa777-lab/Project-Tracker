import { formatDueDate, dueDateStatus } from '../../utils';

const CLASS_MAP = {
  overdue: 'due-overdue',
  today:   'due-today',
  normal:  'due-normal',
};

export default function DueBadge({ date }: { date: Date }) {
  const status = dueDateStatus(date);
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full ${CLASS_MAP[status]}`}>
      {formatDueDate(date)}
    </span>
  );
}
