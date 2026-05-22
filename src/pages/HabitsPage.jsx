import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import HabitCard from '../components/habits/HabitCard';
import HabitForm from '../components/habits/HabitForm';
import HabitHeatmap from '../components/habits/HabitHeatmap';
import useAuthStore from '../store/authStore';
import useHabitStore from '../store/habitStore';
import { calculateAllStreaks } from '../utils/streaks';
import { format } from 'date-fns';

const categories = ['all', 'health', 'fitness', 'learning', 'mindfulness', 'general'];

export default function HabitsPage() {
  const { user } = useAuthStore();
  const { habits, habitLogs, deleteHabit, toggleHabit } = useHabitStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editHabit, setEditHabit] = useState(null);

  const streaks = useMemo(() => calculateAllStreaks(habitLogs, habits), [habitLogs, habits]);

  const filteredHabits = activeCategory === 'all'
    ? habits.filter((h) => h.is_active !== false)
    : habits.filter((h) => h.category === activeCategory && h.is_active !== false);

  const handleDelete = async (habit) => {
    if (window.confirm(`Delete "${habit.name}"? This cannot be undone.`)) {
      try {
        await deleteHabit(habit.id);
        toast.success('Habit deleted');
      } catch {
        toast.error('Failed to delete habit');
      }
    }
  };

  const handleEdit = (habit) => {
    setEditHabit(habit);
    setShowForm(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">Habits</h1>
          <p className="text-sm text-[var(--text-muted)]">Track and build your daily routines</p>
        </div>
        <Button onClick={() => { setEditHabit(null); setShowForm(true); }}>
          <Plus size={16} /> New Habit
        </Button>
      </div>

      {/* Heatmap */}
      <Card hover={false}>
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Activity Heatmap</h2>
        <HabitHeatmap habitLogs={habitLogs} habits={habits} />
      </Card>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-accent/15 text-accent-light'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Habit grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredHabits.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-[var(--text-muted)]">No habits found. Create your first one!</p>
          </div>
        )}
        {filteredHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            streak={streaks[habit.id]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <HabitForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditHabit(null); }}
        editHabit={editHabit}
      />
    </div>
  );
}
