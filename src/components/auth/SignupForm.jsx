import { useState } from 'react';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';

export default function SignupForm({ onToggle }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await signup(email, password, name);
      toast.success('Account created! Welcome to HabitFlow 🌱');
    } catch (error) {
      toast.error(error.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent focus:bg-white/[0.08] focus:shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-all duration-300"
          required
          aria-label="Full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent focus:bg-white/[0.08] focus:shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-all duration-300"
          required
          aria-label="Email address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full px-4 py-2.5 pr-10 bg-white/[0.04] border border-white/15 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent focus:bg-white/[0.08] focus:shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-all duration-300"
            required
            minLength={6}
            aria-label="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat your password"
          className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent focus:bg-white/[0.08] focus:shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-all duration-300"
          required
          aria-label="Confirm password"
        />
      </div>

      <Button type="submit" loading={loading} className="w-full" size="lg">
        <UserPlus size={18} />
        Create Account
      </Button>

      <p className="text-center text-sm text-[var(--text-muted)]">
        Already have an account?{' '}
        <button type="button" onClick={onToggle} className="text-accent hover:text-accent-light font-medium transition-colors">
          Sign in
        </button>
      </p>
    </form>
  );
}
