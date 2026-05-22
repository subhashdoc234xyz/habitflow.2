import { useState } from 'react';
import { Sparkles, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import useMood from '../../hooks/useMood';
import { getMoodEmoji } from '../../utils/dateHelpers';

const MOODS = [
  { score: 1, emoji: '😴', label: 'Tired' },
  { score: 2, emoji: '😐', label: 'Meh' },
  { score: 3, emoji: '🙂', label: 'Good' },
  { score: 4, emoji: '😄', label: 'Great' },
  { score: 5, emoji: '🔥', label: 'Amazing' },
];

export default function MorningReview({ todos, hasMorningReview, todayMorningMood }) {
  const { saveMood } = useMood();
  const [intention, setIntention] = useState('');
  const [selectedMood, setSelectedMood] = useState(todayMorningMood?.mood_score || 0);
  const [topTodos, setTopTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(hasMorningReview);

  if (submitted && todayMorningMood) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
            <Sun className="text-amber-400" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">Morning Review Complete</h2>
            <p className="text-sm text-[var(--text-secondary)]">Today's intentions are set</p>
          </div>
        </div>
        <div className="space-y-2">
          {todayMorningMood.mood_score && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getMoodEmoji(todayMorningMood.mood_score)}</span>
              <span className="text-sm text-[var(--text-secondary)]">Mood: {todayMorningMood.mood_score}/5</span>
            </div>
          )}
          {todayMorningMood.top_intentions?.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Today's intentions:</p>
              <ul className="list-disc list-inside text-sm text-[var(--text-primary)]">
                {todayMorningMood.top_intentions.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast.error('Please select your mood');
      return;
    }
    setLoading(true);
    try {
      saveMood({
        log_date: new Date().toISOString().split('T')[0],
        mood_score: selectedMood,
        journal_note: intention,
        review_type: 'morning',
        top_intentions: topTodos.length > 0 ? topTodos : undefined,
      });
      toast.success('Morning check-in saved! ☀️');
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
        <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
          <Sun className="text-amber-400" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Good Morning! ☀️</h2>
          <p className="text-sm text-[var(--text-secondary)]">Set your intentions for today</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Intention */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            What's your intention for today?
          </label>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Today I want to..."
            rows={3}
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        {/* Mood check-in */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
            How are you feeling this morning?
          </label>
          <div className="flex gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.score}
                onClick={() => setSelectedMood(mood.score)}
                className={`
                  flex flex-col items-center gap-1 p-3 rounded-xl transition-all flex-1
                  ${selectedMood === mood.score
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

        {/* Top 3 todos */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Pick top 3 priorities for today
          </label>
          <div className="space-y-1.5">
            {todos.filter((t) => !t.completed).slice(0, 5).map((todo) => (
              <label key={todo.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={topTodos.includes(todo.title)}
                  onChange={() => {
                    setTopTodos((prev) =>
                      prev.includes(todo.title)
                        ? prev.filter((t) => t !== todo.title)
                        : [...prev, todo.title]
                    );
                  }}
                  className="rounded accent-accent"
                />
                <span className="text-sm text-[var(--text-primary)]">{todo.title}</span>
              </label>
            ))}
          </div>
        </div>

        <Button onClick={handleSubmit} loading={loading} className="w-full" size="lg">
          <Sparkles size={18} />
          Start My Day
        </Button>
      </div>
    </div>
  );
}
