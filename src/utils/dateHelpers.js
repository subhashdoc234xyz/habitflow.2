import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  isTomorrow,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  addWeeks,
  subWeeks,
  subMonths,
  addMonths,
  getDay,
  differenceInDays,
  parseISO,
  isBefore,
  isAfter,
  isSameDay,
} from 'date-fns';

export {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  isTomorrow,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  addWeeks,
  subWeeks,
  subMonths,
  addMonths,
  getDay,
  differenceInDays,
  parseISO,
  isBefore,
  isAfter,
  isSameDay,
};

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getMoodEmoji(score) {
  const emojis = ['😴', '😐', '🙂', '😄', '🔥'];
  return emojis[score - 1] || '🙂';
}

export function getMoodLabel(score) {
  const labels = ['Terrible', 'Bad', 'Okay', 'Good', 'Amazing'];
  return labels[score - 1] || 'Okay';
}

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function formatDate(date) {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d, yyyy');
}

export function getDaysInMonth(year, month) {
  return eachDayOfInterval({
    start: startOfMonth(new Date(year, month)),
    end: endOfMonth(new Date(year, month)),
  });
}

export function getWeekDays(date = new Date()) {
  return eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  });
}

export function formatTime(time) {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function getPriorityColor(priority) {
  switch (priority) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#22c55e';
    default: return '#8b8ba0';
  }
}
