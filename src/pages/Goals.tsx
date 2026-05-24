import { useState } from 'react';
import { Plus, Trash2, X, AlertCircle, Calendar } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { GhostButton } from '../components/GhostButton';
import { GlassInput } from '../components/GlassInput';
import { useGoals } from '../hooks/useGoals';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export function Goals() {
  const { goals, loading, addGoal, deleteGoal, updateGoal } = useGoals();
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    targetDate: new Date().toISOString().split('T')[0],
    color: '#3b82f6',
  });

  const handleOpenModal = () => {
    setFormData({
      title: '',
      description: '',
      category: 'General',
      targetDate: new Date().toISOString().split('T')[0],
      color: '#3b82f6',
    });
    setFormError(null);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSubmitting(true);
    setFormError(null);

    try {
      await addGoal({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        targetDate: formData.targetDate,
        color: formData.color,
        milestones: [],
      });
      setShowAddModal(false);
    } catch (err: any) {
      console.error('Failed to add goal:', err);
      setFormError(err.message || 'Failed to save goal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProgress = async (goalId: string, currentProgress: number) => {
    const nextProgress = Math.min(currentProgress + 10, 100);
    try {
      await updateGoal(goalId, { progress: nextProgress });
    } catch (err) {
      console.error(err);
    }
  };

  const activeGoals = goals.filter(g => g.progress < 100).length;
  const completedGoals = goals.filter(g => g.progress === 100).length;
  const successRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-2">
        <h1 className="heading-1 mb-1">Goals</h1>
        <PrimaryButton className="flex items-center gap-2" onClick={handleOpenModal}>
          <Plus className="w-4 h-4" /> New Goal
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
          <div className="stat-number">{loading ? '-' : activeGoals}</div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">Active Goals</div>
        </GlassCard>
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
          <div className="stat-number">{loading ? '-' : completedGoals}</div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">Completed</div>
        </GlassCard>
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
          <div className="stat-number text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
            {loading ? '-' : `${successRate}%`}
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">Success Rate</div>
        </GlassCard>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const isCompleted = goal.progress === 100;
            const today = new Date();
            const target = new Date(goal.targetDate);
            const diffTime = target.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const daysLabel = diffDays > 0 ? `${diffDays} Days Left` : 'Overdue / Completed';

            return (
              <GlassCard key={goal.id} className="relative overflow-hidden p-0">
                <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: goal.color }}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-xl font-bold text-gray-900 mb-1 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                        {goal.title}
                      </h3>
                      <p className="text-sm text-gray-500">{goal.category}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span 
                        className="text-xs font-bold border px-2 py-1 rounded-md"
                        style={{ 
                          backgroundColor: `${goal.color}08`, 
                          color: goal.color,
                          borderColor: `${goal.color}20` 
                        }}
                      >
                        {daysLabel}
                      </span>
                      <button 
                        onClick={() => deleteGoal(goal.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-gray-500 mb-4">{goal.description}</p>
                  )}
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span style={{ color: goal.color }}>{goal.progress || 0}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300"
                        style={{ 
                          width: `${goal.progress || 0}%`,
                          backgroundColor: goal.color 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Target: {goal.targetDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <PrimaryButton 
                      onClick={() => handleUpdateProgress(goal.id, goal.progress || 0)}
                      disabled={isCompleted}
                      className="flex-1 py-2 text-sm"
                      style={!isCompleted ? { background: `linear-gradient(135deg, ${goal.color}, ${goal.color}dd)` } : {}}
                    >
                      {isCompleted ? 'Goal Achieved! 🎉' : 'Update Progress (+10%)'}
                    </PrimaryButton>
                  </div>
                </div>
              </GlassCard>
            );
          })}

          {goals.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <p className="text-gray-400 font-bold mb-2">No goals set yet.</p>
              <GhostButton onClick={handleOpenModal} className="text-violet-600 font-bold">
                Set a goal to push your limits!
              </GhostButton>
            </div>
          )}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <GlassCard className="w-full max-w-[500px] shadow-2xl relative border-white/80 p-6">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="heading-2 mb-6">Create New Goal</h3>

            {formError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Goal Title</label>
                <GlassInput 
                  placeholder="e.g. Run 50km this month" 
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Description (Optional)</label>
                <GlassInput 
                  placeholder="e.g. Keep active and build cardiovascular stamina" 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/50 backdrop-blur-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium text-gray-700"
                    disabled={submitting}
                  >
                    <option value="General">General</option>
                    <option value="Health">Health</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Learning">Learning</option>
                    <option value="Mindfulness">Mindfulness</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Target Date</label>
                  <GlassInput 
                    type="date"
                    value={formData.targetDate}
                    onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Color Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Theme Color</label>
                <div className="flex gap-3 justify-between">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className="w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center flex-shrink-0"
                      style={{ 
                        backgroundColor: c, 
                        borderColor: formData.color === c ? '#1e293b' : 'transparent',
                        transform: formData.color === c ? 'scale(1.1)' : 'none'
                      }}
                      disabled={submitting}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <GhostButton 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 text-sm font-bold"
                  disabled={submitting}
                >
                  Cancel
                </GhostButton>
                <PrimaryButton 
                  type="submit" 
                  className="flex-1 py-3 text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-500"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Add Goal'}
                </PrimaryButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
