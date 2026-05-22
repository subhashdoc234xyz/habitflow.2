import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useTodoStore = create((set, get) => ({
  todos: [],
  loading: false,

  fetchTodos: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ todos: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching todos:', error);
      set({ loading: false });
    }
  },

  addTodo: async (todo) => {
    const { data, error } = await supabase.from('todos').insert(todo).select().single();
    if (error) throw error;
    set((state) => ({ todos: [data, ...state.todos] }));
    return data;
  },

  updateTodo: async (id, updates) => {
    const { error } = await supabase.from('todos').update(updates).eq('id', id);
    if (error) throw error;
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  toggleTodo: async (id) => {
    const { todos } = get();
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newCompleted = !todo.completed;
    // Optimistic update
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id
          ? { ...t, completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
          : t
      ),
    }));

    const { error } = await supabase
      .from('todos')
      .update({ completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null })
      .eq('id', id);

    if (error) {
      // Rollback
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === id ? { ...t, completed: todo.completed, completed_at: todo.completed_at } : t
        ),
      }));
      throw error;
    }
  },

  deleteTodo: async (id) => {
    const { todos } = get();
    const original = todos.find((t) => t.id === id);
    set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));

    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) {
      set((state) => ({ todos: [...state.todos, original] }));
      throw error;
    }
  },

  reorderTodos: async (reorderedTodos) => {
    set({ todos: reorderedTodos });
    // Reorder is local for now
  },
}));

export default useTodoStore;
