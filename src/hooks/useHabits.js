import { useEffect, useMemo } from 'react';
import useHabitStore from '../store/habitStore';
import useAuthStore from '../store/authStore';
import { calculateAllStreaks } from '../utils/streaks';

export default function useHabits() {
  const { user } = useAuthStore();
  const store = useHabitStore();

  useEffect(() => {
    if (user) {
      store.fetchHabits(user.uid);
    }
  }, [user]);

  const streaks = useMemo(() => {
    if (store.habits.length > 0 && store.habitLogs.length > 0) {
      return calculateAllStreaks(store.habitLogs, store.habits);
    }
    return {};
  }, [store.habits, store.habitLogs]);

  const todayHabits = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return store.habits.filter((h) => h.is_active !== false);
  }, [store.habits]);

  return { ...store, streaks, todayHabits };
}
