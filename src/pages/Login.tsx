import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { GlassInput } from '../components/GlassInput';

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('demo@habitflow.app');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;
        
        // Create user doc on signup
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          photoURL: user.photoURL || null,
          createdAt: serverTimestamp(),
          level: 1,
          xp: 0,
          streak: 0,
        });
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      let message = err.message || 'Authentication failed. Please try again.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. If you do not have an account, switch to Sign Up below.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already in use. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password must be at least 6 characters long.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log('Google sign in success:', user.uid, user.email);
      
      // Create user document in Firestore if first time
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          level: 1,
          xp: 0,
          streak: 0,
        });
        console.log('New user document created in Firestore');
      }
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      let message = err.message || 'Google sign in failed.';
      if (err.code === 'auth/popup-blocked') {
        message = 'Popup was blocked. Please allow popups for this site.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        message = 'Sign in cancelled.';
      } else if (err.code === 'auth/unauthorized-domain') {
        message = 'This domain is not authorized. Add it in Firebase Console → Auth → Settings → Authorized domains.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };


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
                <Sparkles className="text-violet-600 w-6 h-6 animate-pulse" />
              </div>
            </div>
            <h1 className="heading-1 mb-2">HabitFlow</h1>
            <p className="body-text">Build better habits, one day at a time</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <GlassInput 
                type="email" 
                placeholder="Email address" 
                className="pl-11" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <GlassInput 
                type="password" 
                placeholder="Password" 
                className="pl-11" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between mt-1 mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-violet-300 text-violet-600 focus:ring-violet-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-violet-600 font-medium hover:text-violet-700">Forgot password?</a>
            </div>

            <PrimaryButton type="submit" className="w-full" disabled={loading}>
              {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </PrimaryButton>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-300/50"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-gray-500">or continue with</span>
            <div className="flex-grow border-t border-gray-300/50"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/60 border border-white/80 shadow-sm hover:bg-white/80 transition-all font-medium text-gray-700 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-sm text-gray-600 mt-2">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-violet-600 font-bold hover:text-violet-700 outline-none"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
