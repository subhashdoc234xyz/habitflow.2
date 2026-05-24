import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export function CalendarPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h1 className="heading-1 mb-1">Calendar</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/80 shadow-sm">
            <button className="text-gray-500 hover:text-violet-600"><ChevronLeft className="w-5 h-5"/></button>
            <span className="font-bold text-gray-800 min-w-[120px] text-center">October 2023</span>
            <button className="text-gray-500 hover:text-violet-600"><ChevronRight className="w-5 h-5"/></button>
          </div>
          
          <div className="flex items-center gap-1 p-1 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full shadow-sm">
            <button className="px-4 py-1.5 rounded-full text-sm font-bold bg-white shadow-sm text-violet-600">Month</button>
            <button className="px-4 py-1.5 rounded-full text-sm font-bold text-gray-500 hover:bg-white/50">Week</button>
          </div>
        </div>
      </div>

      <GlassCard className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
            <div key={day} className="text-center font-bold text-gray-400 text-sm mb-2">{day}</div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => {
            const isToday = i === 15;
            const hasHabits = i % 3 === 0;
            return (
              <div key={i} className={`h-24 rounded-2xl p-2 flex flex-col transition-transform hover:scale-[1.02] cursor-pointer ${isToday ? 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md text-white' : 'bg-white/40 hover:bg-white/60 border border-white/50'}`}>
                <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-gray-600'}`}>{i > 2 ? i - 2 : 30 + i}</span>
                {hasHabits && (
                  <div className="mt-auto flex gap-1">
                    <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-white' : 'bg-blue-400'}`}></div>
                    <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-white/80' : 'bg-purple-400'}`}></div>
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
