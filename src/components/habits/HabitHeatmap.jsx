import { useMemo } from 'react';
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';

const LEVELS = ['#16161f', '#1a1a3e', '#2e2a6e', '#4c3f9e', '#6d5acf', '#8b7cf7'];

export default function HabitHeatmap({ habitLogs, habits, year = new Date().getFullYear() }) {
  const weeks = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 364);
    const days = eachDayOfInterval({ start, end });

    const weeks = [];
    let week = [];
    days.forEach((day, idx) => {
      week.push(day);
      if (week.length === 7 || idx === days.length - 1) {
        weeks.push(week);
        week = [];
      }
    });
    return weeks;
  }, [year]);

  const getLevel = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const completedCount = habitLogs.filter(
      (l) => l.completed_date === dateStr && l.completed
    ).length;
    if (completedCount === 0) return 0;
    const activeHabits = habits.filter((h) => h.is_active !== false).length || 1;
    const ratio = completedCount / activeHabits;
    if (ratio >= 0.8) return 4;
    if (ratio >= 0.6) return 3;
    if (ratio >= 0.4) return 2;
    if (ratio >= 0.2) return 1;
    return 0;
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  if (habits.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-muted)] text-sm">
        Complete habits to see your heatmap
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-0.5 min-w-fit">
        <div className="flex flex-col gap-0.5 mr-1">
          {['Mon', '', 'Wed', '', 'Fri', ''].map((day) => (
            <div key={day} className="h-3 text-[8px] text-[var(--text-muted)] leading-3">
              {day}
            </div>
          ))}
        </div>
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-0.5">
            {week.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const level = getLevel(day);
              const isToday = dateStr === today;
              return (
                <div
                  key={dateStr}
                  className="rounded-sm"
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: LEVELS[level],
                    outline: isToday ? '2px solid var(--accent)' : 'none',
                    outlineOffset: isToday ? '1px' : '0',
                  }}
                  title={`${format(day, 'MMM d, yyyy')}: ${level > 0 ? `${Math.round(level / 4 * 100)}% completion` : 'No completions'}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mt-2 justify-end">
        <span className="text-[10px] text-[var(--text-muted)]">Less</span>
        {LEVELS.map((color, idx) => (
          <div key={idx} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
        ))}
        <span className="text-[10px] text-[var(--text-muted)]">More</span>
      </div>
    </div>
  );
}
