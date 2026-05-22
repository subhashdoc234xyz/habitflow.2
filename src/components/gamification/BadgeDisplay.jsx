import { Sparkles } from 'lucide-react';
import { BADGES } from '../../utils/xp';

export default function BadgeDisplay({ earnedBadges = [] }) {
  const earnedKeys = earnedBadges.map((b) => typeof b === 'string' ? b : b.badge_key);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-accent-light" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Badges</h3>
        <span className="text-xs text-[var(--text-muted)]">
          {earnedKeys.length}/{BADGES.length} earned
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {BADGES.map((badge) => {
          const earned = earnedKeys.includes(badge.key);
          return (
            <div
              key={badge.key}
              className={`
                flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all
                ${earned
                  ? 'bg-accent/10 border-accent/30'
                  : 'bg-[var(--bg-secondary)] border-[var(--border)] opacity-40'
                }
              `}
              title={badge.desc}
            >
              <span className="text-2xl">{earned ? badge.icon : '🔒'}</span>
              <span className={`text-xs font-medium ${earned ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                {badge.label}
              </span>
              <span className="text-[9px] text-[var(--text-muted)] leading-tight">
                {badge.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
