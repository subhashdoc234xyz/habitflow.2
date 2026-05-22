import { create } from 'zustand';
import { auth } from '../lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { supabase } from '../lib/supabase';

const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', firebaseUser.uid)
          .single();

        set({
          user: firebaseUser,
          profile: profile || { id: firebaseUser.uid, email: firebaseUser.email },
          loading: false,
          initialized: true,
        });
      } else {
        set({ user: null, profile: null, loading: false, initialized: true });
      }
    });
    return unsubscribe;
  },

  login: async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  },

  signup: async (email, password, name) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });

    // Create profile in Supabase
    const { error } = await supabase.from('profiles').insert({
      id: result.user.uid,
      email,
      name,
      xp: 0,
      level: 1,
    });

    if (error) throw error;
    return result.user;
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, profile: null });
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.uid);

    if (error) throw error;

    set((state) => ({
      profile: { ...state.profile, ...updates },
    }));
  },
}));

export default useAuthStore;
