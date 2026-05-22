import { useMemo } from 'react';
import MorningReview from '../components/review/MorningReview';
import EveningReview from '../components/review/EveningReview';
import useTodoStore from '../store/todoStore';
import useMood from '../hooks/useMood';

export default function ReviewPage() {
  const { todos } = useTodoStore();
  const { hasMorningReview, hasEveningReview, todayMorningMood, todayEveningMood } = useMood();
  const hour = new Date().getHours();

  const isEveningTime = hour >= 17;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">Daily Review</h1>
        <p className="text-sm text-[var(--text-muted)]">
          {isEveningTime ? 'Reflect on your day' : 'Set your intentions'}
        </p>
      </div>

      {isEveningTime ? (
        <EveningReview
          hasEveningReview={hasEveningReview}
          todayEveningMood={todayEveningMood}
        />
      ) : (
        <MorningReview
          todos={todos}
          hasMorningReview={hasMorningReview}
          todayMorningMood={todayMorningMood}
        />
      )}
    </div>
  );
}
