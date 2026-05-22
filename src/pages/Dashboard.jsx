import { useState, useMemo } from 'react';
import { Plus, CheckSquare, Sparkles, Target, Calendar, TrendingUp, Moon, Sun } from 'lucide-react';
import { format, startOfWeek, eachDayOfInterval, addDays, isSameDay } from 'date-fns';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import XPBar from '../components/gamification/XPBar';
import BadgeDisplay from '../components/gamification/BadgeDisplay';
import StreakBadge from '../components/habits/StreakBadge';
import useHabitStore from '../store/habitStore';
import useTodoStore from '../store/todoStore';
import useGoalStore from '../store/goalStore';
import useAuthStore from '../store/authStore';
import { calculateAllStreaks } from '../utils/streaks';
import { getGreeting, getMoodEmoji } from '../utils/dateHelpers';
import HabitForm from '../components/habits/HabitForm';
import TodoForm from '../components/todos/TodoForm';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, profile } = useAuthStore();
  const { habits, habitLogs, toggleHabit } = useHabitStore();
  const { todos, toggleTodo } = useTodoStore();
  const { goals } = useGoalStore();
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showTodoForm, setShowTodoForm] = useState(false);

  const streaks = useMemo(() => calculateAllStreaks(habitLogs, habits), [habitLogs, habits]);

  const bestStreak = useMemo(() => {
    return Object.values(streaks).reduce((best, s) => Math.max(best, s.current), 0);
  }, [streaks]);

  const todayHabits = habits.filter((h) => h.is_active !== false);
  const today = format(new Date(), 'yyyy-MM-dd');
  const completedToday = habitLogs.filter((l) => l.completed_date === today && l.completed).length;
  const completionPercent = todayHabits.length > 0 ? Math.round((completedToday / todayHabits.length) * 100) : 0;

  const todayTodos = todos.filter((t) => !t.completed && (t.due_date === today || !t.due_date)).slice(0, 3);

  const activeGoals = goals.filter((g) => g.status === 'active').slice(0, 2);

  // Mini week calendar
  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end: addDays(start, 6) });
  }, []);

  // Mood check
  const moodLogs = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('habitflow_mood_logs') || '[]');
    } catch { return []; }
  }, []);
  const hasMorningMood = moodLogs.some((m) => m.log_date === today && m.review_type === 'morning');

  const handleToggle = async (habitId) => {
    try {
      await toggleHabit(habitId, user.uid, today);
      toast.success('Habit checked off! +10 XP');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* XP + Streak Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <XPBar xp={profile?.xp || 0} />
        </div>
        <Card className="flex items-center gap-3" hover={false}>
          <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-orange-400" size={20} />
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)]">Best Streak</p>
            <p className="text-lg font-bold text-[var(--text-primary)]">
              {bestStreak > 0 ? `🔥 ${bestStreak} days` : 'No streaks yet'}
            </p>
          </div>
        </Card>
      </div>

      {/* Today's Habits + Completion Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Today's Habits</h2>
              <Button size="sm" variant="secondary" onClick={() => setShowHabitForm(true)}>
                <Plus size={14} /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {todayHabits.length === 0 && (
                <p className="text-[var(--text-muted)] text-sm py-4 text-center">
                  No habits yet. Create your first habit!
                </p>
              )}
              {todayHabits.map((habit) => {
                const log = habitLogs.find((l) => l.habit_id === habit.id && l.completed_date === today);
                const done = log?.completed || false;
                return (
                  <button
                    key={habit.id}
                    onClick={() => handleToggle(habit.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      done
                        ? 'bg-accent/10 border-accent/30'
                        : 'bg-[var(--bg-secondary)] border-[var(--border)] hover:border-accent/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      done ? 'bg-accent border-accent' : 'border-[var(--border)]'
                    }`}>
                      {done && <CheckSquare size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm flex-1 text-left ${done ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                      {habit.name}
                    </span>
                    <StreakBadge streak={streaks[habit.id]?.current || 0} size="sm" showLabel={false} />
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Completion Ring */}
        <Card hover={false} className="flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 mb-3">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-hover)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - completionPercent / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-[var(--text-primary)]">{completionPercent}%</span>
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)]">{completedToday}/{todayHabits.length} done</p>
          {!hasMorningMood && (
            <Button size="sm" variant="ghost" className="mt-3 text-xs" onClick={() => window.location.href = '/review'}>
              <Sun size={12} /> Morning check-in
            </Button>
          )}
        </Card>
      </div>

      {/* Today's Focus + Mini Calendar + Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Focus */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Today's Focus</h2>
            <Button size="sm" variant="ghost" onClick={() => setShowTodoForm(true)}>
              <Plus size={14} />
            </Button>
          </div>
          <div className="space-y-2">
            {todayTodos.length === 0 && (
              <p className="text-xs text-[var(--text-muted)] py-2">No todos for today</p>
            )}
            {todayTodos.map((todo) => (
              <label key={todo.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="rounded accent-accent"
                />
                <span className="text-sm text-[var(--text-primary)]">{todo.title}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Mini Calendar */}
        <Card hover={false}>
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">This Week</h2>
          <div className="grid grid-cols-7 gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-center text-[10px] text-[var(--text-muted)] font-medium">{d}</div>
            ))}
            {weekDays.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const count = habitLogs.filter((l) => l.completed_date === dateStr && l.completed).length;
              const isToday = isSameDay(day, new Date());
              return (
                <div key={dateStr} className={`text-center p-1 rounded-lg ${isToday ? 'bg-accent/20' : ''}`}>
                  <div className="text-xs font-medium text-[var(--text-primary)]">{format(day, 'd')}</div>
                  <div className="flex justify-center gap-0.5 mt-0.5">
                    {count > 0 && <div className="w-1 h-1 rounded-full bg-accent" />}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming Goals */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Upcoming Goals</h2>
            <Target size={14} className="text-[var(--text-muted)]" />
          </div>
          <div className="space-y-3">
            {activeGoals.length === 0 && (
              <p className="text-xs text-[var(--text-muted)] py-2">No active goals</p>
            )}
            {activeGoals.map((goal) => (
              <div key={goal.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text-primary)]">{goal.title}</span>
                  <span className="text-[var(--text-muted)]">{goal.progress}%</span>
                </div>
                <ProgressBar value={goal.progress} size="sm" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <HabitForm isOpen={showHabitForm} onClose={() => setShowHabitForm(false)} />
      <TodoForm isOpen={showTodoForm} onClose={() => setShowTodoForm(false)} />
    </div>
  );
}
