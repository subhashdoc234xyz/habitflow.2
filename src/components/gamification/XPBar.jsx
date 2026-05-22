import { Sparkles, TrendingUp } from 'lucide-react';
import { getLevelProgress, getLevel } from '../../utils/xp';
import useAuthStore from '../../store/authStore';

export default function XPBar({ xp = 0, showDetails = true, size = 'md' }) {
  const { profile } = useAuthStore();
  const currentXP = xp || profile?.xp || 0;
  const level = getLevel(currentXP);
  const progress = getLevelProgress(currentXP);

  const sizes = {
    sm: { bar: 'h-2', text: 'text-xs' },
    md: { bar: 'h-3', text: 'text-sm' },
    lg: { bar: 'h-4', text: 'text-base' },
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
            <Sparkles className="text-amber-400" size={16} />
          </div>
          <div>
            <span className={`font-semibold text-[var(--text-primary)] ${sizes[size].text}`}>
              Level {level.level}: {level.name}
            </span>
            <span className={`${sizes[size].text} text-[var(--text-muted)] ml-2`}>
              {currentXP} XP
            </span>
          </div>
        </div>
        {showDetails && (
          <span className={`${sizes[size].text} text-[var(--text-muted)]`}>
            {progress}%
          </span>
        )}
      </div>

      <div className={`w-full bg-[var(--bg-hover)] rounded-full overflow-hidden ${sizes[size].bar}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r from-accent to-amber-400 animate-xp`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {showDetails && (
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-[var(--text-muted)]">Level {level.level}</span>
          <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
            <TrendingUp size={10} />
            <span>Next: Level {level.level + 1}</span>
          </div>
        </div>
      )}
    </div>
  );
}
