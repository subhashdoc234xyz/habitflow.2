import { useState } from 'react';
import { Moon, Sparkles, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import useMood from '../../hooks/useMood';
import useHabitStore from '../../store/habitStore';
import { getMoodEmoji, format } from '../../utils/dateHelpers';

const MOODS = [
  { score: 1, emoji: '😴', label: 'Exhausted' },
  { score: 2, emoji: '😐', label: 'Okay' },
  { score: 3, emoji: '🙂', label: 'Good' },
  { score: 4, emoji: '😄', label: 'Great' },
  { score: 5, emoji: '🔥', label: 'Amazing' },
];

export default function EveningReview({ hasEveningReview, todayEveningMood }) {
  const { saveMood } = useMood();
  const { habits, habitLogs } = useHabitStore();
  const [rating, setRating] = useState(todayEveningMood?.mood_score || 0);
  const [accomplishments, setAccomplishments] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(hasEveningReview);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayHabits = habits.filter((h) => h.is_active !== false);
  const completedToday = habitLogs.filter(
    (l) => l.completed_date === today && l.completed
  ).length;

  if (submitted && todayEveningMood) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
            <Moon className="text-indigo-400" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">Evening Review Complete</h2>
            <p className="text-sm text-[var(--text-secondary)]">Today's reflection saved</p>
          </div>
        </div>
        <div className="space-y-2">
          {todayEveningMood.mood_score && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getMoodEmoji(todayEveningMood.mood_score)}</span>
              <span className="text-sm text-[var(--text-secondary)]">Mood: {todayEveningMood.mood_score}/5</span>
            </div>
          )}
          {todayEveningMood.journal_note && (
            <p className="text-sm text-[var(--text-primary)]">{todayEveningMood.journal_note}</p>
          )}
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!rating) {
      toast.error('Please rate your day');
      return;
    }
    setLoading(true);
    try {
      saveMood({
        log_date: today,
        mood_score: rating,
        journal_note: accomplishments,
        review_type: 'evening',
      });
      toast.success('Evening review saved! 🌙');
      setSubmitted(true);
    } catch (error) {
      toast.error('Failed to save review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
          <Moon className="text-indigo-400" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Evening Reflection 🌙</h2>
          <p className="text-sm text-[var(--text-secondary)]">How did your day go?</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Habit summary */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
          <p className="text-sm text-[var(--text-secondary)] mb-1">Today's progress</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-accent-light">{completedToday}</span>
            <span className="text-[var(--text-muted)]">/ {todayHabits.length} habits completed</span>
          </div>
          <div className="w-full bg-[var(--bg-hover)] rounded-full h-2 mt-2">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${todayHabits.length > 0 ? (completedToday / todayHabits.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
            How would you rate your day?
          </label>
          <div className="flex gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.score}
                onClick={() => setRating(mood.score)}
                className={`
                  flex flex-col items-center gap-1 p-3 rounded-xl transition-all flex-1
                  ${rating === mood.score
                    ? 'bg-accent/20 border-accent border'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-accent/50'
                  }
                `}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accomplishments */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            What did you accomplish today?
          </label>
          <textarea
            value={accomplishments}
            onChange={(e) => setAccomplishments(e.target.value)}
            placeholder="Tell me about your day..."
            rows={4}
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        <Button onClick={handleSubmit} loading={loading} className="w-full" size="lg">
          <Moon size={18} />
          Save Reflection
        </Button>
      </div>
    </div>
  );
}
