import type { User } from '../../types';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = { sm: 'w-5 h-5 text-[8px]', md: 'w-7 h-7 text-[10px]', lg: 'w-8 h-8 text-xs' };

export default function Avatar({ user, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 ${SIZE_MAP[size]} ${className}`}
      style={{ background: user.bgColor, color: user.color }}
      title={user.name}
    >
      {user.initials}
    </div>
  );
}
