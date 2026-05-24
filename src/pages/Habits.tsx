import { useState } from 'react';
import { Plus, Check, X, Trash2, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { GhostButton } from '../components/GhostButton';
import { GlassInput } from '../components/GlassInput';
import { useHabits } from '../hooks/useHabits';

const CATEGORIES = ['Health', 'Fitness', 'Learning', 'Mindfulness', 'General'];
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];
const ICONS = ['💧', '🧘', '🏃', '📚', '🍎', '💪', '🛌', '✏️', '⭐', '❤️'];

export function Habits() {
  const { habits, loading, error, addHabit, deleteHabit, toggleHabitComplete } = useHabits();
  const [activeTab, setActiveTab] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'General',
    color: '#3b82f6',
    icon: '⭐',
    frequency: 'daily' as 'daily' | 'weekly',
  });

  const handleOpenModal = () => {
    setFormData({
      name: '',
      description: '',
      category: 'General',
      color: '#3b82f6',
      icon: '⭐',
      frequency: 'daily',
    });
    setFormError(null);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    setFormError(null);

    try {
      await addHabit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        color: formData.color,
        icon: formData.icon,
        frequency: formData.frequency,
      });
      setShowAddModal(false);
    } catch (err: any) {
      console.error('Failed to add habit:', err);
      setFormError(err.message || 'Failed to save habit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredHabits = habits.filter(habit => {
    if (activeTab === 'All') return true;
    return habit.category === activeTab;
  });

  const getWeekDays = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const today = new Date();
    // Get last 7 days starting from 6 days ago to today
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return {
        label: days[d.getDay() === 0 ? 6 : d.getDay() - 1],
        dateStr: d.toISOString().split('T')[0],
      };
    });
  };

  const weekDays = getWeekDays();

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="heading-1 mb-1">Habits</h1>
          <p className="text-gray-500 font-medium">Track and build your routines</p>
        </div>
        <PrimaryButton className="flex items-center gap-2" onClick={handleOpenModal}>
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
        {['All', ...CATEGORIES].map(tab => (
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

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex gap-2 items-start">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Error loading habits</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        </div>
      )}

      {/* Habits Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHabits.map((habit) => {
            const todayStr = new Date().toISOString().split('T')[0];
            const isCompletedToday = (habit.completedDates || []).includes(todayStr);

            return (
              <GlassCard key={habit.id} className="relative overflow-hidden p-0">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: habit.color }}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full border flex items-center justify-center text-2xl shadow-inner"
                        style={{ backgroundColor: `${habit.color}15`, borderColor: `${habit.color}40` }}
                      >
                        {habit.icon}
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold text-gray-900 ${isCompletedToday ? 'line-through text-gray-400' : ''}`}>
                          {habit.name}
                        </h3>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-md font-medium border"
                          style={{ 
                            backgroundColor: `${habit.color}08`, 
                            color: habit.color,
                            borderColor: `${habit.color}20`
                          }}
                        >
                          {habit.category}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteHabit(habit.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Habit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {habit.description && (
                    <p className="text-sm text-gray-500 mb-4">{habit.description}</p>
                  )}

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-orange-500 font-bold text-sm bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                      🔥 {habit.streak || 0} days
                    </div>
                    <span className="text-xs font-medium text-gray-400">Best: {habit.bestStreak || 0} days</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">Last 7 Days</span>
                    </div>
                    <div className="flex gap-2">
                      {weekDays.map((day, i) => {
                        const done = (habit.completedDates || []).includes(day.dateStr);
                        return (
                          <div key={i} className="flex flex-col items-center gap-1 flex-1">
                            <span className="text-[10px] text-gray-400 font-medium">{day.label}</span>
                            <div 
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                done 
                                  ? 'text-white' 
                                  : 'bg-gray-100 border border-gray-200'
                              }`}
                              style={done ? { backgroundColor: habit.color } : {}}
                            >
                              {done && <Check className="w-4 h-4" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                    {isCompletedToday ? (
                      <button 
                        onClick={() => toggleHabitComplete(habit.id)}
                        className="w-full py-2.5 text-center text-sm font-bold text-green-600 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors"
                      >
                        Completed today ✓ (Click to undo)
                      </button>
                    ) : (
                      <PrimaryButton 
                        onClick={() => toggleHabitComplete(habit.id)}
                        className="flex-1 py-2 text-sm"
                        style={{ background: `linear-gradient(135deg, ${habit.color}, ${habit.color}dd)` }}
                      >
                        Mark done today
                      </PrimaryButton>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}

          {!loading && filteredHabits.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <p className="text-gray-400 font-bold mb-2">No habits found in this category.</p>
              <GhostButton onClick={handleOpenModal} className="text-violet-600 font-bold">
                Create a habit to get started!
              </GhostButton>
            </div>
          )}
        </div>
      )}

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <GlassCard className="w-full max-w-[500px] shadow-2xl relative border-white/80 p-6">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="heading-2 mb-6">Create New Habit</h3>

            {formError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Habit Name</label>
                <GlassInput 
                  placeholder="e.g. Drink 3L Water" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Description (Optional)</label>
                <GlassInput 
                  placeholder="e.g. Keep hydrated throughout the workday" 
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
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Frequency</label>
                  <select 
                    value={formData.frequency}
                    onChange={e => setFormData({ ...formData, frequency: e.target.value as 'daily' | 'weekly' })}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/50 backdrop-blur-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium text-gray-700"
                    disabled={submitting}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              {/* Color Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Select Color</label>
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

              {/* Icon Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Select Icon</label>
                <div className="flex gap-2.5 overflow-x-auto py-1">
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: icon })}
                      className={`text-xl p-2 rounded-xl border transition-all ${
                        formData.icon === icon 
                          ? 'bg-violet-100 border-violet-400 font-bold scale-110 shadow-inner' 
                          : 'bg-white/40 border-white/80 hover:bg-white/60'
                      }`}
                      disabled={submitting}
                    >
                      {icon}
                    </button>
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
                  {submitting ? 'Saving...' : 'Add Habit'}
                </PrimaryButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
