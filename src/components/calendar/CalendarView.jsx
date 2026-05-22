import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday } from 'date-fns';

export default function CalendarView({ habits, habitLogs, todos, goals, onDayClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad with empty cells for alignment
  const startDay = getDay(monthStart);
  const emptyDays = Array(startDay).fill(null);
  const allCells = [...emptyDays, ...days];

  const getDayData = (date) => {
    if (!date) return { habits: 0, todos: 0, goals: 0 };
    const dateStr = format(date, 'yyyy-MM-dd');

    const habitsDone = habitLogs.filter(
      (l) => l.completed_date === dateStr && l.completed
    ).length;

    const todosDue = todos.filter(
      (t) => t.due_date === dateStr || (!t.completed && t.due_date === dateStr)
    ).length;

    const goalsDue = goals.filter(
      (g) => g.deadline === dateStr
    ).length;

    return { habits: habitsDone, todos: todosDue, goals: goalsDue };
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 border-b border-[var(--border)]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-[var(--text-muted)]">
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {allCells.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="min-h-[80px] bg-[var(--bg-secondary)]/30" />;
          }
          const data = getDayData(date);
          const isCurrentDay = isToday(date);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDayClick(date)}
              className={`
                min-h-[80px] p-1.5 border-b border-r border-[var(--border)]
                hover:bg-[var(--bg-hover)] transition-colors relative
                ${!isCurrentMonth ? 'opacity-30' : ''}
              `}
            >
              <span
                className={`
                  inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium
                  ${isCurrentDay ? 'bg-accent text-white' : 'text-[var(--text-secondary)]'}
                `}
              >
                {format(date, 'd')}
              </span>

              {/* Dots */}
              <div className="flex gap-0.5 mt-1 justify-center flex-wrap">
                {data.habits > 0 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" title={`${data.habits} habits`} />
                )}
                {data.todos > 0 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" title={`${data.todos} todos`} />
                )}
                {data.goals > 0 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" title={`${data.goals} goals due`} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-[var(--border)]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-[10px] text-[var(--text-muted)]">Habits</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-[10px] text-[var(--text-muted)]">Todos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-[10px] text-[var(--text-muted)]">Goals</span>
        </div>
      </div>
    </div>
  );
}
