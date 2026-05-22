import { useState } from 'react';
import { Sparkles, Target, CheckCircle, Brain } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const features = [
  { icon: <CheckCircle size={20} />, text: 'Track daily habits with streaks & heatmaps' },
  { icon: <Target size={20} />, text: 'Set goals with milestone tracking' },
  { icon: <Brain size={20} />, text: 'AI-powered insights & recommendations' },
  { icon: <Sparkles size={20} />, text: 'Gamified XP, levels & badges system' },
];

export default function AuthLayout() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--bg-secondary)] border-r border-[var(--border)] flex-col justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
              <Sparkles className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-bold font-display text-[var(--text-primary)]">HabitFlow</h1>
          </div>

          <h2 className="text-4xl font-bold font-display text-[var(--text-primary)] mb-3 leading-tight">
            Build Your Best Life,<br />
            <span className="text-accent-light">One Habit at a Time</span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-10">
            Track habits. Crush goals. Live intentionally.
          </p>

          <div className="space-y-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-[var(--text-secondary)]">
                <span className="text-accent-light">{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={22} />
            </div>
            <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">HabitFlow</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold font-display text-[var(--text-primary)]">
              {isLogin ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="text-[var(--text-secondary)] mt-1">
              {isLogin ? 'Sign in to continue your journey' : 'Create your account to start tracking'}
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
            {isLogin ? (
              <LoginForm onToggle={() => setIsLogin(false)} />
            ) : (
              <SignupForm onToggle={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
