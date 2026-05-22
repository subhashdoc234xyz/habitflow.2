import { format, parseISO, startOfDay, differenceInDays, isBefore, isAfter } from 'date-fns';

export const STREAK_COLORS = {
  0: '#3b3b4f',
  1: '#1a1a3e',
  2: '#2e2a6e',
  3: '#4c3f9e',
  4: '#6d5acf',
  5: '#8b7cf7',
};

export function calculateStreak(logs, habitId) {
  const habitLogs = logs
    .filter((l) => l.habit_id === habitId && l.completed)
    .map((l) => l.completed_date)
    .sort((a, b) => new Date(b) - new Date(a));

  if (habitLogs.length === 0) return { current: 0, longest: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let today = startOfDay(new Date());
  let lastDate = null;

  for (const dateStr of habitLogs) {
    const date = startOfDay(parseISO(dateStr));
    if (lastDate === null) {
      const diff = differenceInDays(today, date);
      if (diff <= 1) tempStreak = 1;
      else tempStreak = 0;
    } else {
      const diff = differenceInDays(lastDate, date);
      if (diff === 1) tempStreak++;
      else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    lastDate = date;
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  currentStreak = tempStreak;

  // Check if today is logged
  const todayStr = format(today, 'yyyy-MM-dd');
  const loggedToday = habitLogs.some((d) => d === todayStr);
  if (!loggedToday && habitLogs.length > 0) {
    const yesterday = format(new Date(today.getTime() - 86400000), 'yyyy-MM-dd');
    if (habitLogs[0] === yesterday) {
      // streak continues, just hasn't checked today yet
    } else if (habitLogs[0] !== todayStr) {
      currentStreak = 0;
    }
  }

  return { current: currentStreak, longest: longestStreak };
}

export function calculateAllStreaks(logs, habits) {
  return habits.reduce((acc, habit) => {
    acc[habit.id] = calculateStreak(logs, habit.id);
    return acc;
  }, {});
}

export function getStreakEmoji(streak) {
  if (streak >= 30) return '⚡';
  if (streak >= 7) return '🔥';
  if (streak >= 3) return '💪';
  if (streak >= 1) return '🌱';
  return '🌑';
}

export function getStreakColor(streak) {
  if (streak >= 30) return '#f59e0b';
  if (streak >= 7) return '#ef4444';
  if (streak >= 3) return '#818cf8';
  if (streak >= 1) return '#22c55e';
  return '#555568';
}
