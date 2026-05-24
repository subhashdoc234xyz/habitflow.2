import { format } from 'date-fns';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { GhostButton } from '../components/GhostButton';

export function Todos() {
  const today = new Date();

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="heading-1 mb-1">Today's Focus</h1>
          <p className="text-gray-500 font-medium">{format(today, "EEEE, MMMM do")}</p>
        </div>
        <PrimaryButton className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Task
        </PrimaryButton>
      </div>

      <div className="flex items-center gap-2 p-1.5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full w-max shadow-sm mb-4">
        {['All', 'Today', 'This Week', 'Completed'].map(tab => (
          <button key={tab} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${tab === 'Today' ? 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white' : 'text-gray-500 hover:text-violet-600 hover:bg-white/50'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {/* Task 1 */}
        <GlassCard className="p-4 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
          <div className="w-6 h-6 rounded-full border-2 border-violet-300 flex-shrink-0 cursor-pointer hover:border-violet-500 transition-colors"></div>
          
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg mb-1">Finish weekly report</h3>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                <Clock className="w-3 h-3" /> 2:00 PM
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> High
              </span>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                Work
              </span>
            </div>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GhostButton><Edit2 className="w-4 h-4 text-gray-500" /></GhostButton>
            <GhostButton><Trash2 className="w-4 h-4 text-red-400" /></GhostButton>
          </div>
        </GlassCard>

        {/* Quick Add Form Placeholder */}
        <GlassCard className="p-4 border-dashed border-2 border-violet-200 bg-white/30 flex items-center justify-center cursor-pointer hover:bg-white/50 transition-colors">
          <span className="text-violet-500 font-bold flex items-center gap-2"><Plus className="w-5 h-5"/> Quick Add Task</span>
        </GlassCard>
      </div>
    </div>
  );
}
