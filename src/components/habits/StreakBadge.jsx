import { getStreakEmoji, getStreakColor } from '../../utils/streaks';

export default function StreakBadge({ streak, size = 'sm', showLabel = true }) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizes[size]}`}
      style={{
        backgroundColor: `${getStreakColor(streak)}15`,
        color: getStreakColor(streak),
      }}
    >
      <span className={streak >= 7 ? 'animate-fire' : ''}>{getStreakEmoji(streak)}</span>
      {streak > 0 && <span>{streak} day{streak !== 1 ? 's' : ''}</span>}
      {streak === 0 && <span>Start</span>}
      {showLabel && streak > 0 && <span className="opacity-70">streak</span>}
    </div>
  );
}
