import { useState } from 'react';
import { Plus, Edit2, Check } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { GhostButton } from '../components/GhostButton';

export function Habits() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Health', 'Fitness', 'Learning', 'Mindfulness', 'General'];

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="heading-1 mb-1">Habits</h1>
          <p className="text-gray-500 font-medium">Track and build your routines</p>
        </div>
        <PrimaryButton className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Habit
        </PrimaryButton>
      </div>

      {/* Heatmap Placeholder */}
      <GlassCard className="w-full">
        <h3 className="card-label mb-4">ACTIVITY HEATMAP</h3>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {Array.from({ length: 52 }).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, rowIndex) => {
                const intensity = Math.random();
                let bgColor = 'bg-[rgba(139,92,246,0.08)]';
                if (intensity > 0.8) bgColor = 'bg-violet-600';
                else if (intensity > 0.5) bgColor = 'bg-violet-400';
                else if (intensity > 0.2) bgColor = 'bg-violet-300';

                return (
                  <div key={rowIndex} className={`w-3 h-3 rounded-sm ${bgColor}`} title="Activity"></div>
                );
              })}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full w-max shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-md'
                : 'text-gray-500 hover:text-violet-600 hover:bg-white/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Habit Card 1 */}
        <GlassCard className="relative overflow-hidden p-0">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100/50 border border-blue-200 flex items-center justify-center text-2xl shadow-inner">
                  💧
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Drink Water</h3>
                  <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-medium border border-blue-100">Health</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-orange-500 font-bold text-sm bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                🔥 3 days
              </div>
              <span className="text-xs font-medium text-gray-400">Best: 12 days</span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Last 7 Days</span>
                <span className="text-xs font-bold text-violet-600">85% this week</span>
              </div>
              <div className="flex gap-2">
                {['M','T','W','T','F','S','S'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-400 font-medium">{day}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${i < 4 ? 'bg-blue-500 text-white' : 'bg-gray-100 border border-gray-200'}`}>
                      {i < 4 && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <GhostButton className="w-10 h-10 flex-shrink-0">
                <Edit2 className="w-4 h-4 text-gray-500" />
              </GhostButton>
              <PrimaryButton className="flex-1 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                Mark done today
              </PrimaryButton>
            </div>
          </div>
        </GlassCard>

        {/* Habit Card 2 */}
        <GlassCard className="relative overflow-hidden p-0 opacity-80">
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500"></div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100/50 border border-purple-200 flex items-center justify-center text-2xl shadow-inner grayscale">
                  🧘
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-500 line-through">Meditation</h3>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md font-medium border border-gray-200">Mindfulness</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-500 font-bold text-sm bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                🔥 5 days
              </div>
              <span className="text-xs font-medium text-gray-400">Best: 30 days</span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Last 7 Days</span>
                <span className="text-xs font-bold text-purple-600">100% this week</span>
              </div>
              <div className="flex gap-2">
                {['M','T','W','T','F','S','S'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-400 font-medium">{day}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-purple-500 text-white`}>
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <div className="w-full py-2 text-center text-sm font-bold text-green-600 bg-green-50 rounded-xl border border-green-200">
                Completed today ✓
              </div>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
