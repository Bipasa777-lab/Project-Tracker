import { useEffect } from 'react';
import { useStore } from '../../store/useStore';

export default function PresenceBar() {
  const simUsers   = useStore(s => s.simUsers);
  const tickSimUsers = useStore(s => s.tickSimUsers);

  useEffect(() => {
    const id = setInterval(tickSimUsers, 2_500);
    return () => clearInterval(id);
  }, [tickSimUsers]);

  const active = simUsers.filter(u => u.currentTaskId !== null);
  const total  = active.length + 1; // +1 for "you"

  return (
    <div className="flex items-center gap-2 ml-auto">
      <div className="flex">
        {/* "You" avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-bg-2 flex-shrink-0 z-10"
          style={{ background: 'rgba(79,142,247,0.25)', color: '#4f8ef7' }}
          title="You"
        >
          ME
        </div>
        {/* Sim user avatars */}
        {active.map((u, i) => (
          <div
            key={u.id}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-bg-2 flex-shrink-0 sim-avatar-enter transition-all"
            style={{
              background: u.bgColor,
              color: u.color,
              borderColor: '#161b27',
              marginLeft: -8,
              zIndex: 9 - i,
            }}
            title={u.name}
          >
            {u.initials}
          </div>
        ))}
      </div>
      <span className="text-xs text-slate-500 whitespace-nowrap">
        {total} viewing
      </span>
    </div>
  );
}
