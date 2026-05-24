import { Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export function Insights() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h1 className="heading-1 mb-1">Insights</h1>
        <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all hover:-translate-y-0.5">
          <Sparkles className="w-4 h-4" /> Generate AI Report
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {['Weekly %', 'Best Streak', 'Total Done', 'Mood Avg'].map((stat, i) => (
          <GlassCard key={i} className="p-4 text-center">
            <div className="text-2xl font-black bg-gradient-to-br from-violet-600 to-indigo-500 bg-clip-text text-transparent">
              {['85%', '32', '1,402', 'Great'][i]}
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase mt-1">{stat}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="heading-2 mb-4">Habit Completion Rate</h3>
          <div className="h-64 flex items-end gap-2 pb-4 border-b border-gray-200">
            {/* Mock Chart */}
            {Array.from({length: 14}).map((_, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-violet-500 to-violet-300 rounded-t-sm" style={{height: `${Math.random() * 80 + 20}%`}}></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
            <span>2 Weeks Ago</span>
            <span>Today</span>
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden group border-l-4 border-l-violet-500">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="heading-2">AI Coach</h3>
            <span className="text-[10px] font-bold text-white bg-blue-500 px-1.5 py-0.5 rounded ml-2">Gemini</span>
          </div>
          <blockquote className="text-gray-700 leading-relaxed italic bg-white/40 p-4 rounded-xl border border-white/60">
            "You've been incredibly consistent with your morning meditation! I noticed your mood score is consistently higher on days you meditate. Keep it up. However, your water intake has dropped over the weekend. Try setting a reminder for Saturday morning."
          </blockquote>
        </GlassCard>
      </div>
    </div>
  );
}
