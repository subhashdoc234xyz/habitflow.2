import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useHabits } from '../hooks/useHabits';
import { useTodos } from '../hooks/useTodos';

const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  
  const { habits } = useHabits();
  const { todos } = useTodos();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const generateCalendarDays = (year: number, month: number) => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    
    // Previous month trailing days
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    // Current month days
    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      days.push({
        date,
        isCurrentMonth: true,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
      });
    }
    
    // Next month leading days
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        date: new Date(year, month + 1, d),
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    return days;
  };

  const getWeekDays = (date: Date) => {
    const temp = new Date(date);
    const day = temp.getDay();
    const diff = temp.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    const monday = new Date(temp.setDate(diff));
    
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        date: d,
        isCurrentMonth: d.getMonth() === currentMonth,
        isToday:
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear(),
      };
    });
  };

  const goToPrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToPrevWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(currentDate.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Helper to check if any habit or todo was active/completed on a specific date
  const getDayActivities = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const completedHabits = habits.filter(h => (h.completedDates || []).includes(dateStr));
    const completedTodos = todos.filter(t => t.completed && t.dueDate === dateStr);
    return { completedHabits, completedTodos };
  };

  const days = viewMode === 'month' 
    ? generateCalendarDays(currentYear, currentMonth)
    : getWeekDays(currentDate);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="heading-1 mb-1">Calendar</h1>
          <p className="text-gray-500 font-medium">Visualize your progress and tasks</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Navigation Controls */}
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/80 shadow-sm">
            <button 
              onClick={viewMode === 'month' ? goToPrevMonth : goToPrevWeek}
              className="text-gray-500 hover:text-violet-600 p-1 rounded-full hover:bg-white/80 transition-all"
            >
              <ChevronLeft className="w-5 h-5"/>
            </button>
            <span className="font-bold text-gray-800 min-w-[120px] text-center capitalize">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button 
              onClick={viewMode === 'month' ? goToNextMonth : goToNextWeek}
              className="text-gray-500 hover:text-violet-600 p-1 rounded-full hover:bg-white/80 transition-all"
            >
              <ChevronRight className="w-5 h-5"/>
            </button>
          </div>
          
          {/* Today Button */}
          <button 
            onClick={goToToday}
            className="px-4 py-2 bg-white/60 hover:bg-white/80 backdrop-blur-md rounded-full text-sm font-bold border border-white/80 text-gray-700 shadow-sm transition-all"
          >
            Today
          </button>
          
          {/* View Toggles */}
          <div className="flex items-center gap-1 p-1 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full shadow-sm">
            <button 
              onClick={() => setViewMode('month')}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                viewMode === 'month' 
                  ? 'bg-white shadow-sm text-violet-600' 
                  : 'text-gray-500 hover:bg-white/50'
              }`}
            >
              Month
            </button>
            <button 
              onClick={() => setViewMode('week')}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                viewMode === 'week' 
                  ? 'bg-white shadow-sm text-violet-600' 
                  : 'text-gray-500 hover:bg-white/50'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      <GlassCard className="p-6">
        <div className="grid grid-cols-7 gap-3">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
            <div key={day} className="text-center font-bold text-gray-400 text-sm mb-2 uppercase tracking-wider">{day}</div>
          ))}

          {days.map((dayObj, index) => {
            const { completedHabits, completedTodos } = getDayActivities(dayObj.date);
            const hasActivity = completedHabits.length > 0 || completedTodos.length > 0;

            return (
              <div 
                key={index} 
                className={`min-h-[100px] rounded-2xl p-3 flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer border ${
                  dayObj.isToday 
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)] border-transparent font-bold' 
                    : dayObj.isCurrentMonth
                      ? 'bg-white/40 hover:bg-white/60 border-white/50 text-gray-800' 
                      : 'bg-white/10 opacity-35 border-white/10 text-gray-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-bold ${dayObj.isToday ? 'text-white' : 'text-gray-700'}`}>
                    {dayObj.date.getDate()}
                  </span>
                  {dayObj.isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  )}
                </div>

                {hasActivity && (
                  <div className="flex flex-col gap-1 mt-2">
                    {completedHabits.slice(0, 2).map(habit => (
                      <div 
                        key={habit.id}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded truncate ${
                          dayObj.isToday 
                            ? 'bg-white/20 text-white' 
                            : 'bg-violet-50 text-violet-700 border border-violet-100'
                        }`}
                        title={habit.name}
                      >
                        {habit.icon} {habit.name}
                      </div>
                    ))}
                    {completedTodos.slice(0, 1).map(todo => (
                      <div 
                        key={todo.id}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded truncate ${
                          dayObj.isToday 
                            ? 'bg-white/30 text-white' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}
                        title={todo.title}
                      >
                        ✓ {todo.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
