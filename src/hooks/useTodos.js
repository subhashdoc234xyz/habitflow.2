import { useEffect } from 'react';
import useTodoStore from '../store/todoStore';
import useAuthStore from '../store/authStore';

export default function useTodos() {
  const { user } = useAuthStore();
  const store = useTodoStore();

  useEffect(() => {
    if (user) {
      store.fetchTodos(user.uid);
    }
  }, [user]);

  return store;
}
