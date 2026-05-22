import { Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import useAuthStore from '../../store/authStore';
import { getGreeting } from '../../utils/dateHelpers';

export default function TopBar({ onMenuToggle }) {
  const { profile } = useAuthStore();
  const greeting = getGreeting();
  const today = new Date();

  return (
    <header className="sticky top-0 z-20 bg-[var(--bg-primary)]/80 backdrop-blur-lg border-b border-[var(--border)]">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>

          <div>
            <h1 className="text-xl font-semibold font-display text-[var(--text-primary)]">
              {greeting}, {profile?.name || 'there'} 🌤️
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              {format(today, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center">
            <Sparkles className="text-accent-light" size={16} />
          </div>
        </div>
      </div>
    </header>
  );
}
