import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { GlassInput } from '../components/GlassInput';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[440px]"
      >
        <GlassCard className="flex flex-col gap-6">
          <div className="text-center mb-2">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600/20 to-indigo-500/20 flex items-center justify-center border border-violet-500/30">
                <Sparkles className="text-violet-600 w-6 h-6" />
              </div>
            </div>
            <h1 className="heading-1 mb-2">HabitFlow</h1>
            <p className="body-text">Build better habits, one day at a time</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <GlassInput type="email" placeholder="Email address" className="pl-11" required defaultValue="demo@habitflow.app" />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <GlassInput type="password" placeholder="Password" className="pl-11" required defaultValue="password" />
            </div>

            <div className="flex items-center justify-between mt-1 mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-violet-300 text-violet-600 focus:ring-violet-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-violet-600 font-medium hover:text-violet-700">Forgot password?</a>
            </div>

            <PrimaryButton type="submit" className="w-full">
              Sign in
            </PrimaryButton>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-300/50"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-gray-500">or continue with</span>
            <div className="flex-grow border-t border-gray-300/50"></div>
          </div>

          <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/60 border border-white/80 shadow-sm hover:bg-white/80 transition-all font-medium text-gray-700">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-sm text-gray-600 mt-2">
            Don't have an account? <a href="#" className="text-violet-600 font-medium hover:text-violet-700">Sign up</a>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
