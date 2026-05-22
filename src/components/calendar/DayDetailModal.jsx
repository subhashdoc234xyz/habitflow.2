import { format } from 'date-fns';
import { X, Check, Target, Sparkles } from 'lucide-react';
import { getMoodEmoji } from '../../utils/dateHelpers';

export default function DayDetailModal({ date, isOpen, onClose, habits, habitLogs, todos, goals, moodLogs }) {
  if (!isOpen || !date) return null;

  const dateStr = format(date, 'yyyy-MM-dd');
  const dayHabitLogs = habitLogs.filter((l) => l.completed_date === dateStr);
  const dayTodos = todos.filter((t) => t.due_date === dateStr);
  const dayGoals = goals.filter((g) => g.deadline === dateStr);
  const dayMood = moodLogs.find((m) => m.log_date === dateStr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {format(date, 'EEEE, MMM d')}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)]" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Mood */}
          {dayMood && (
            <div className="flex items-center gap-3 p-3 bg-[var(--bg-hover)] rounded-lg">
              <span className="text-2xl">{getMoodEmoji(dayMood.mood_score)}</span>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Mood: {dayMood.mood_score}/5</p>
                {dayMood.journal_note && (
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{dayMood.journal_note}</p>
                )}
              </div>
            </div>
          )}

          {/* Habits */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
              <Check size={12} /> Habits
            </h3>
            <div className="space-y-1.5">
              {habits.length === 0 && (
                <p className="text-xs text-[var(--text-muted)] py-1">No habits tracked</p>
              )}
              {habits.map((habit) => {
                const log = dayHabitLogs.find((l) => l.habit_id === habit.id);
                const completed = log?.completed || false;
                return (
                  <div key={habit.id} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${completed ? 'bg-accent' : 'bg-[var(--border)]'}`} />
                    <span className={completed ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}>
                      {habit.name}
                    </span>
                    {completed && <Check size={12} className="text-accent" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Todos */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
              <Sparkles size={12} /> Todos
            </h3>
            <div className="space-y-1.5">
              {dayTodos.length === 0 && (
                <p className="text-xs text-[var(--text-muted)] py-1">No todos for this day</p>
              )}
              {dayTodos.map((todo) => (
                <div key={todo.id} className="flex items-center gap-2 text-sm">
                  <div className={`w-4 h-4 rounded border ${todo.completed ? 'bg-accent border-accent' : 'border-[var(--border)]'} flex items-center justify-center`}>
                    {todo.completed && <Check size={10} className="text-white" />}
                  </div>
                  <span className={todo.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}>
                    {todo.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
              <Target size={12} /> Goal Deadlines
            </h3>
            <div className="space-y-1.5">
              {dayGoals.length === 0 && (
                <p className="text-xs text-[var(--text-muted)] py-1">No goals due</p>
              )}
              {dayGoals.map((goal) => (
                <div key={goal.id} className="flex items-center gap-2 text-sm">
                  <span className="text-red-400">{goal.title}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">({goal.progress}% complete)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
