import { useMemo } from 'react';
import { generateRuleBasedInsights } from '../utils/insights';
import useHabitStore from '../store/habitStore';
import useTodoStore from '../store/todoStore';
import useGoalStore from '../store/goalStore';
import { calculateAllStreaks } from '../utils/streaks';

export default function useInsights() {
  const { habits, habitLogs } = useHabitStore();
  const { todos } = useTodoStore();
  const { goals, milestones } = useGoalStore();

  // Get mood logs from localStorage for now (mood store integration)
  const moodLogs = useMemo(() => {
    try {
      const stored = localStorage.getItem('habitflow_mood_logs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const streaks = useMemo(() => {
    if (habits.length > 0 && habitLogs.length > 0) {
      return calculateAllStreaks(habitLogs, habits);
    }
    return {};
  }, [habits, habitLogs]);

  const insights = useMemo(() => {
    return generateRuleBasedInsights({
      habits,
      habitLogs,
      todos,
      goals,
      milestones,
      moodLogs,
      streaks,
    });
  }, [habits, habitLogs, todos, goals, milestones, moodLogs, streaks]);

  // Prepare data for Gemini
  const geminiData = useMemo(() => {
    const activeHabits = habits.filter((h) => h.is_active !== false);
    const completedLogs = habitLogs.filter((l) => l.completed);
    const completedTodos = todos.filter((t) => t.completed);
    const activeGoals = goals.filter((g) => g.status === 'active');

    const bestStreakEntry = Object.entries(streaks).sort((a, b) => b[1].current - a[1].current)[0];
    const bestStreakHabit = bestStreakEntry
      ? habits.find((h) => h.id === bestStreakEntry[0])?.name || 'N/A'
      : 'N/A';
    const bestStreak = bestStreakEntry ? bestStreakEntry[1].current : 0;

    // Most missed habit
    let mostMissedHabit = 'N/A';
    if (activeHabits.length > 0 && habitLogs.length > 0) {
      const completionRates = activeHabits.map((h) => {
        const logs = habitLogs.filter((l) => l.habit_id === h.id);
        const rate = logs.length > 0 ? logs.filter((l) => l.completed).length / logs.length : 1;
        return { name: h.name, rate };
      });
      completionRates.sort((a, b) => a.rate - b.rate);
      mostMissedHabit = completionRates[0]?.name || 'N/A';
    }

    const avgMood = moodLogs.length > 0
      ? (moodLogs.reduce((s, m) => s + m.mood_score, 0) / moodLogs.length).toFixed(1)
      : 'N/A';

    // Best/worst day
    const dayCompletion = {};
    habitLogs.forEach((l) => {
      const d = new Date(l.completed_date);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      if (!dayCompletion[dayName]) dayCompletion[dayName] = { total: 0, done: 0 };
      dayCompletion[dayName].total++;
      if (l.completed) dayCompletion[dayName].done++;
    });

    let bestDay = 'N/A', worstDay = 'N/A', bestRate = 0, worstRate = 100;
    Object.entries(dayCompletion).forEach(([day, data]) => {
      if (data.total > 0) {
        const rate = (data.done / data.total) * 100;
        if (rate > bestRate) { bestRate = rate; bestDay = day; }
        if (rate < worstRate) { worstRate = rate; worstDay = day; }
      }
    });

    return {
      completionRate: habitLogs.length > 0
        ? Math.round((completedLogs.length / habitLogs.length) * 100)
        : 0,
      totalHabits: activeHabits.length,
      bestStreak,
      bestStreakHabit,
      avgMood,
      todosCompleted: completedTodos.length,
      activeGoals: activeGoals.length,
      mostMissedHabit,
      bestDay,
      worstDay,
    };
  }, [habits, habitLogs, todos, goals, streaks, moodLogs]);

  return { insights, geminiData };
}
