import type { Task } from '../../types';
import Avatar from '../shared/Avatar';
import PriorityBadge from '../shared/PriorityBadge';
import DueBadge from '../shared/DueBadge';
import SimUserIndicators from './SimUserIndicators';

interface TaskCardProps {
  task: Task;
  onMouseDown: (e: React.MouseEvent, task: Task) => void;
  onTouchStart: (e: React.TouchEvent, task: Task) => void;
  isDragging: boolean;
}

export default function TaskCard({ task, onMouseDown, onTouchStart, isDragging }: TaskCardProps) {
  return (
    <div
      id={`card-${task.id}`}
      className={`relative bg-bg-3 border border-border-1 rounded-lg p-2.5 cursor-grab select-none
                  hover:border-border-2 transition-colors flex-shrink-0
                  ${isDragging ? 'opacity-30' : ''}`}
      onMouseDown={e => onMouseDown(e, task)}
      onTouchStart={e => onTouchStart(e, task)}
      data-task-id={task.id}
    >
      <SimUserIndicators taskId={task.id} />

      <p className="text-sm font-medium text-slate-100 mb-2 leading-snug line-clamp-2">
        {task.title}
      </p>

      <div className="flex items-center gap-1.5 flex-wrap">
        <PriorityBadge priority={task.priority} />
        <DueBadge date={task.dueDate} />
        <div className="ml-auto">
          <Avatar user={task.assignee} size="sm" />
        </div>
      </div>
    </div>
  );
}
