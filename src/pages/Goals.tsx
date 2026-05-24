import { Plus } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { GhostButton } from '../components/GhostButton';

export function Goals() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h1 className="heading-1 mb-1">Goals</h1>
        <PrimaryButton className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Goal
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
          <div className="stat-number">4</div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">Active Goals</div>
        </GlassCard>
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
          <div className="stat-number">12</div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">Completed</div>
        </GlassCard>
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
          <div className="stat-number text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">85%</div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">Success Rate</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="relative overflow-hidden p-0">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 to-red-500"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Run 50km this month</h3>
                <p className="text-sm text-gray-500">Fitness & Health</p>
              </div>
              <span className="text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100 px-2 py-1 rounded-md">12 Days Left</span>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="text-orange-600">60%</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 w-[60%] rounded-full"></div>
              </div>
              <div className="text-right text-xs text-gray-400 font-medium mt-1">30 / 50 km</div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <GhostButton className="w-auto px-4 flex-1">View Details</GhostButton>
              <PrimaryButton className="flex-1 py-2 text-sm">Update Progress</PrimaryButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
