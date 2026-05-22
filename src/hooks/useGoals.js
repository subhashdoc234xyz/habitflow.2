import { useEffect } from 'react';
import useGoalStore from '../store/goalStore';
import useAuthStore from '../store/authStore';

export default function useGoals() {
  const { user } = useAuthStore();
  const store = useGoalStore();

  useEffect(() => {
    if (user) {
      store.fetchGoals(user.uid);
    }
  }, [user]);

  return store;
}
