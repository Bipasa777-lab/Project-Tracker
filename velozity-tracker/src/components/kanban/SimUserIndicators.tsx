import { useStore } from '../../store/useStore';

interface Props { taskId: string }

export default function SimUserIndicators({ taskId }: Props) {
  const simUsers = useStore(s => s.simUsers).filter(u => u.currentTaskId === taskId);
  if (!simUsers.length) return null;

  const visible  = simUsers.slice(0, 2);
  const overflow = simUsers.length - 2;

  return (
    <div className="absolute -top-2 right-2 flex z-10" style={{ pointerEvents: 'none' }}>
      {visible.map((u, i) => (
        <div
          key={u.id}
          className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold
                     sim-avatar-enter border-[1.5px] border-bg-3"
          style={{
            background: u.bgColor,
            color: u.color,
            borderColor: u.color,
            marginLeft: i === 0 ? 0 : -6,
            zIndex: 10 - i,
          }}
          title={u.name}
        >
          {u.initials}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold
                     bg-bg-4 text-slate-400 border border-border-2 sim-avatar-enter"
          style={{ marginLeft: -6 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
