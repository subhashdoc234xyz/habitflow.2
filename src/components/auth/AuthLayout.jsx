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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-[linear-gradient(135deg,#0f0c29,#302b63,#24243e)]">
      {/* Subtle Floating Gradient Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        <div className="floating-orb floating-orb-3" />
      </div>

      {/* Login Card centered */}
      <div 
        className="relative z-10 w-full max-w-[420px] mx-auto"
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[linear-gradient(135deg,#7C3AED,#6366f1)] rounded-xl flex items-center justify-center mb-4 shadow-[0_4px_15px_rgba(124,58,237,0.45)]">
            <Sparkles className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold font-display text-[var(--text-primary)] tracking-tight">HabitFlow</h1>
          <h2 className="text-xl font-medium text-[var(--text-secondary)] mt-2">
            {isLogin ? 'Welcome back' : 'Get started'}
          </h2>
        </div>

        {isLogin ? (
          <LoginForm onToggle={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggle={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
