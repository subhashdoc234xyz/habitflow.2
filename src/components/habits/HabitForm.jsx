import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import useAuthStore from '../../store/authStore';
import useHabitStore from '../../store/habitStore';

const categories = [
  { value: 'health', label: 'Health' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'learning', label: 'Learning' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'general', label: 'General' },
];

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'custom', label: 'Custom' },
];

const timeSlots = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'anytime', label: 'Anytime' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const defaultForm = {
  name: '',
  description: '',
  category: 'general',
  color: '#6366f1',
  frequency: 'daily',
  custom_days: [1, 2, 3, 4, 5],
  target_time: 'anytime',
};

export default function HabitForm({ isOpen, onClose, editHabit = null }) {
  const { user } = useAuthStore();
  const { addHabit, updateHabit } = useHabitStore();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editHabit) {
      setForm({
        name: editHabit.name || '',
        description: editHabit.description || '',
        category: editHabit.category || 'general',
        color: editHabit.color || '#6366f1',
        frequency: editHabit.frequency || 'daily',
        custom_days: editHabit.custom_days || [1, 2, 3, 4, 5],
        target_time: editHabit.target_time || 'anytime',
      });
    } else {
      setForm(defaultForm);
    }
  }, [editHabit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    setLoading(true);
    try {
      if (editHabit) {
        await updateHabit(editHabit.id, form);
        toast.success('Habit updated!');
      } else {
        await addHabit({ ...form, user_id: user.uid });
        toast.success('Habit created! 🌱');
      }
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day) => {
    setForm((f) => ({
      ...f,
      custom_days: f.custom_days.includes(day)
        ? f.custom_days.filter((d) => d !== day)
        : [...f.custom_days, day].sort(),
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editHabit ? 'Edit Habit' : 'New Habit'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., Read 30 minutes"
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-accent transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description (optional)</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Why do you want to build this habit?"
            rows={2}
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-accent transition-colors"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Color</label>
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="w-full h-10 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Frequency</label>
          <select
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-accent transition-colors"
          >
            {frequencies.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {form.frequency === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Days of week</label>
            <div className="flex gap-1.5">
              {DAYS.map((day, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleDay(idx)}
                  className={`
                    w-10 h-10 rounded-lg text-xs font-medium transition-all
                    ${form.custom_days.includes(idx)
                      ? 'bg-accent text-white'
                      : 'bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
                    }
                  `}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Best time</label>
          <select
            value={form.target_time}
            onChange={(e) => setForm({ ...form, target_time: e.target.value })}
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-accent transition-colors"
          >
            {timeSlots.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            {editHabit ? 'Save Changes' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
