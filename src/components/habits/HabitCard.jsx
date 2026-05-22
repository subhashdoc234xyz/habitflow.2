import { useState } from 'react';
import { Check, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import StreakBadge from './StreakBadge';
import useAuthStore from '../../store/authStore';
import useHabitStore from '../../store/habitStore';
import { format } from '../../utils/dateHelpers';

export default function HabitCard({ habit, streak, onEdit, onDelete }) {
  const { user } = useAuthStore();
  const { habitLogs, toggleHabit } = useHabitStore();
  const [showMenu, setShowMenu] = useState(false);
  const [toggling, setToggling] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLog = habitLogs.find((l) => l.habit_id === habit.id && l.completed_date === today);
  const isCompleted = todayLog?.completed || false;

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      await toggleHabit(habit.id, user.uid, today);
      toast.success(isCompleted ? 'Unmarked habit' : 'Habit completed! +10 XP');
    } catch (error) {
      toast.error('Failed to update habit');
    } finally {
      setToggling(false);
    }
  };

  const categoryColors = {
    health: '#22c55e',
    fitness: '#f59e0b',
    learning: '#818cf8',
    mindfulness: '#a78bfa',
    general: '#6366f1',
  };

  const categoryColor = categoryColors[habit.category] || categoryColors.general;

  return (
    <div
      className="group relative bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 card-hover"
      onClick={() => setShowMenu(false)}
    >
      <div className="flex items-start gap-3">
        {/* Completion toggle */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`
            flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center
            transition-all duration-200
            ${isCompleted
              ? 'bg-accent border-accent text-white animate-check'
              : 'border-[var(--border)] hover:border-accent text-transparent hover:text-[var(--text-muted)]'
            }
          `}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
        >
          <Check size={16} className={isCompleted ? 'animate-check' : ''} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: habit.color || categoryColor }}
            />
            <h3 className="font-medium text-[var(--text-primary)] truncate">{habit.name}</h3>
          </div>

          {habit.description && (
            <p className="text-xs text-[var(--text-muted)] line-clamp-1 mb-2">{habit.description}</p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <StreakBadge streak={streak?.current || 0} size="sm" />
            {streak?.longest > (streak?.current || 0) && (
              <span className="text-xs text-[var(--text-muted)]">
                Best: {streak.longest} days
              </span>
            )}
          </div>

          {/* 7-day mini progress */}
          <div className="flex gap-1 mt-2">
            {[...Array(7)].map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              const dateStr = format(d, 'yyyy-MM-dd');
              const log = habitLogs.find((l) => l.habit_id === habit.id && l.completed_date === dateStr);
              const done = log?.completed || false;
              return (
                <div
                  key={i}
                  className="w-full h-1.5 rounded-full"
                  style={{
                    backgroundColor: done ? (habit.color || categoryColor) : 'var(--bg-hover)',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Habit options"
          >
            <MoreHorizontal size={16} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-xl py-1 min-w-[120px] z-10 animate-fade-in">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(habit); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(habit); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-[var(--bg-hover)]"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
