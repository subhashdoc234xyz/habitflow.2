import { format } from 'date-fns';
import { Settings, Plus, Check, MoreVertical, Clock, Flame, Target as TargetIcon } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GhostButton } from '../components/GhostButton';

export function Dashboard() {
  const today = new Date();
  
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Good morning, Alex ☀️
          </h1>
          <p className="text-gray-500 font-medium">
            {format(today, "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        <GhostButton>
          <Settings className="w-5 h-5 text-gray-400" />
        </GhostButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* XP Card */}
          <GlassCard className="relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="heading-2 mb-1">Level 1: Seedling 🌱</h3>
                <p className="text-sm font-medium text-gray-500">120 / 500 XP to next level</p>
              </div>
              <div className="px-3 py-1 bg-white/60 rounded-full border border-violet-200 text-sm font-bold text-violet-700 shadow-sm">
                120 XP
              </div>
            </div>
            <div className="h-2.5 w-full bg-violet-600/10 rounded-full overflow-hidden">
              <div className="h-full w-[24%] bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 rounded-full relative">
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
              <span>Level 1</span>
              <span>Next: Level 2</span>
            </div>
          </GlassCard>

          {/* Today's Habits */}
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h2 className="heading-2 flex items-center gap-2">
                Today's Habits
              </h2>
              <button className="flex items-center gap-1 text-sm font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {/* Habit Item Active */}
              <div className="flex items-center justify-between p-3 bg-white/40 border border-white/60 rounded-[16px] hover:bg-white/60 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    💧
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Drink Water</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-medium border border-blue-100">Health</span>
                      <span className="text-xs text-orange-500 font-bold flex items-center">🔥 3</span>
                    </div>
                  </div>
                </div>
                <button className="w-7 h-7 rounded-full border-2 border-dashed border-violet-300 hover:border-violet-500 transition-colors flex items-center justify-center"></button>
              </div>

              {/* Habit Item Completed */}
              <div className="flex items-center justify-between p-3 bg-white/20 border border-white/40 rounded-[16px] opacity-70">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg grayscale">
                    🧘
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-500 line-through decoration-gray-300">Meditation</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md font-medium border border-gray-200">Mindfulness</span>
                    </div>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-sm">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Today's Focus */}
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h2 className="heading-2">Today's Focus</h2>
              <button className="flex items-center gap-1 text-sm font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors">
                <Plus className="w-4 h-4" /> Add task
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              {/* Task 1 */}
              <div className="flex items-start gap-3 p-2 group">
                <div className="w-5 h-5 rounded-full border-2 border-violet-300 mt-0.5 flex-shrink-0 cursor-pointer hover:border-violet-500"></div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium mb-1">Finish weekly report</p>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> High
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-3 h-3" /> 2:00 PM
                    </span>
                  </div>
                </div>
                <GhostButton className="opacity-0 group-hover:opacity-100 h-8 w-8">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </GhostButton>
              </div>

              {/* Task 2 */}
              <div className="flex items-start gap-3 p-2 group">
                <div className="w-5 h-5 rounded-full border-2 border-violet-300 mt-0.5 flex-shrink-0 cursor-pointer hover:border-violet-500"></div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium mb-1">Grocery shopping</p>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="flex items-center gap-1 text-blue-500 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Low
                    </span>
                  </div>
                </div>
                <GhostButton className="opacity-0 group-hover:opacity-100 h-8 w-8">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </GhostButton>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Right Column - 1/3 */}
        <div className="flex flex-col gap-6">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Streak Card */}
            <GlassCard className="flex flex-col items-center justify-center p-6 text-center">
              <Flame className="w-8 h-8 text-orange-500 mb-2" />
              <div className="stat-number">12</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">Day Streak</div>
            </GlassCard>

            {/* Completion Ring */}
            <GlassCard className="flex flex-col items-center justify-center p-6 text-center">
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="8" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeDasharray="175" strokeDashoffset="44" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-violet-600 to-pink-500">
                  75%
                </div>
              </div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">Completed</div>
            </GlassCard>
          </div>

          {/* This Week */}
          <GlassCard>
            <h3 className="card-label mb-4">THIS WEEK</h3>
            <div className="flex justify-between">
              {['M','T','W','T','F','S','S'].map((day, i) => {
                const isToday = i === 3;
                return (
                  <div key={i} className={`flex flex-col items-center p-2 rounded-full w-10 ${isToday ? 'bg-gradient-to-b from-violet-600 to-indigo-600 shadow-[0_4px_12px_rgba(124,58,237,0.4)]' : 'bg-white/40'}`}>
                    <span className={`text-[10px] font-bold mb-1 ${isToday ? 'text-violet-200' : 'text-gray-400'}`}>{day}</span>
                    <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-gray-700'}`}>{12 + i}</span>
                    <div className={`w-1 h-1 rounded-full mt-1 ${isToday ? 'bg-white' : i < 3 ? 'bg-violet-500' : 'bg-transparent'}`}></div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Upcoming Goals */}
          <GlassCard>
            <h3 className="card-label mb-4">UPCOMING GOALS</h3>
            <div className="flex flex-col gap-4">
              <div className="bg-white/40 p-3 rounded-2xl border border-white/60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <TargetIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Run 50km this month</h4>
                    <p className="text-xs font-medium text-gray-500">12 days left</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-200/50 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-[60%] rounded-full"></div>
                  </div>
                  <span className="text-xs font-bold text-orange-600">30km</span>
                </div>
              </div>
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
}
