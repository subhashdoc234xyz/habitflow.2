import { useState, useMemo } from 'react';
import CalendarView from '../components/calendar/CalendarView';
import DayDetailModal from '../components/calendar/DayDetailModal';
import useHabitStore from '../store/habitStore';
import useTodoStore from '../store/todoStore';
import useGoalStore from '../store/goalStore';
import { format } from 'date-fns';

export default function CalendarPage() {
  const { habits, habitLogs } = useHabitStore();
  const { todos } = useTodoStore();
  const { goals } = useGoalStore();
  const [selectedDate, setSelectedDate] = useState(null);

  const moodLogs = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('habitflow_mood_logs') || '[]');
    } catch { return []; }
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">Calendar</h1>
        <p className="text-sm text-[var(--text-muted)]">View your habits, todos, and goals by day</p>
      </div>

      <CalendarView
        habits={habits}
        habitLogs={habitLogs}
        todos={todos}
        goals={goals}
        onDayClick={(date) => setSelectedDate(date)}
      />

      <DayDetailModal
        date={selectedDate}
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        habits={habits}
        habitLogs={habitLogs}
        todos={todos}
        goals={goals}
        moodLogs={moodLogs}
      />
    </div>
  );
}
