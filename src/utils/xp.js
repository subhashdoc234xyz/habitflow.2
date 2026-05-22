export const XP_REWARDS = {
  HABIT_COMPLETE: 10,
  TODO_COMPLETE: 5,
  STREAK_7_DAYS: 50,
  STREAK_30_DAYS: 200,
  GOAL_COMPLETE: 100,
  MILESTONE_COMPLETE: 25,
  DAILY_REVIEW: 15,
  MOOD_LOG: 5,
};

export const LEVELS = [
  { level: 1, name: 'Seedling', minXP: 0, maxXP: 100 },
  { level: 2, name: 'Sprout', minXP: 100, maxXP: 300 },
  { level: 3, name: 'Growing', minXP: 300, maxXP: 600 },
  { level: 4, name: 'Blooming', minXP: 600, maxXP: 1000 },
  { level: 5, name: 'Flourishing', minXP: 1000, maxXP: 1500 },
  { level: 6, name: 'Thriving', minXP: 1500, maxXP: 2200 },
  { level: 7, name: 'Mastery', minXP: 2200, maxXP: 3000 },
  { level: 8, name: 'Legend', minXP: 3000, maxXP: Infinity },
];

export const BADGES = [
  { key: 'first_habit', label: 'First Step', desc: 'Completed your first habit', icon: '🌱' },
  { key: 'streak_7', label: 'On Fire', desc: '7-day streak achieved', icon: '🔥' },
  { key: 'streak_30', label: 'Unstoppable', desc: '30-day streak achieved', icon: '⚡' },
  { key: 'todos_10', label: 'Task Master', desc: 'Completed 10 todos', icon: '✅' },
  { key: 'first_goal', label: 'Dream Chaser', desc: 'Created your first goal', icon: '🎯' },
  { key: 'goal_complete', label: 'Achiever', desc: 'Completed a goal', icon: '🏆' },
  { key: 'review_streak_7', label: 'Reflective', desc: '7 days of daily reviews', icon: '🧘' },
  { key: 'perfect_week', label: 'Perfect Week', desc: '100% habits for 7 days', icon: '💎' },
];

export function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelProgress(xp) {
  const current = getLevel(xp);
  const next = LEVELS.find((l) => l.level === current.level + 1);
  if (!next) return 100;
  const progress = ((xp - current.minXP) / (next.minXP - current.minXP)) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
}

export function checkBadgeConditions(xpData) {
  const earned = [];
  const { habitsCompleted, todosCompleted, goalsCompleted, currentStreak, reviewsDone, perfectWeeks } = xpData;

  if (habitsCompleted >= 1) earned.push('first_habit');
  if (currentStreak >= 7) earned.push('streak_7');
  if (currentStreak >= 30) earned.push('streak_30');
  if (todosCompleted >= 10) earned.push('todos_10');
  if (goalsCompleted >= 1) earned.push('goal_complete');
  if (reviewsDone >= 7) earned.push('review_streak_7');
  if (perfectWeeks >= 1) earned.push('perfect_week');

  return earned;
}
