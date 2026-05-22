export default function ProgressBar({ value = 0, max = 100, size = 'md', color = 'var(--accent)', showLabel = false, animated = false, className = '' }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-[var(--text-secondary)]">Progress</span>
          <span className="text-xs font-medium text-[var(--text-primary)]">{Math.round(percent)}%</span>
        </div>
      )}
      <div className={`w-full bg-[var(--bg-hover)] rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`h-full rounded-full ${animated ? 'animate-xp' : ''}`}
          style={{
            width: `${percent}%`,
            backgroundColor: color,
            transition: 'width 0.5s ease-out',
          }}
        />
      </div>
    </div>
  );
}
