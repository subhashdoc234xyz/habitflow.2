import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useHabitStore = create((set, get) => ({
  habits: [],
  habitLogs: [],
  loading: false,

  fetchHabits: async (userId) => {
    set({ loading: true });
    try {
      const { data: habits, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const { data: habitLogs } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('completed_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      set({ habits: habits || [], habitLogs: habitLogs || [], loading: false });
    } catch (error) {
      console.error('Error fetching habits:', error);
      set({ loading: false });
    }
  },

  addHabit: async (habit) => {
    const { data, error } = await supabase.from('habits').insert(habit).select().single();
    if (error) throw error;
    set((state) => ({ habits: [data, ...state.habits] }));
    return data;
  },

  updateHabit: async (id, updates) => {
    const { error } = await supabase.from('habits').update(updates).eq('id', id);
    if (error) throw error;
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    }));
  },

  deleteHabit: async (id) => {
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
      habitLogs: state.habitLogs.filter((l) => l.habit_id !== id),
    }));
  },

  toggleHabit: async (habitId, userId, date) => {
    const { habitLogs } = get();
    const existingLog = habitLogs.find(
      (l) => l.habit_id === habitId && l.completed_date === date
    );

    // Optimistic update
    let updatedLogs;
    if (existingLog) {
      updatedLogs = habitLogs.map((l) =>
        l.id === existingLog.id ? { ...l, completed: !l.completed } : l
      );
    } else {
      updatedLogs = [
        ...habitLogs,
        {
          id: 'temp_' + Date.now(),
          habit_id: habitId,
          user_id: userId,
          completed_date: date,
          completed: true,
        },
      ];
    }
    set({ habitLogs: updatedLogs });

    try {
      const newCompleted = !existingLog?.completed;

      if (existingLog) {
        const { error } = await supabase
          .from('habit_logs')
          .update({ completed: newCompleted })
          .eq('id', existingLog.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('habit_logs')
          .insert({
            habit_id: habitId,
            user_id: userId,
            completed_date: date,
            completed: true,
          });
        if (error) throw error;
      }

      // Refresh logs to get accurate data
      const { data: freshLogs } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('completed_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      set({ habitLogs: freshLogs || [] });
    } catch (error) {
      // Rollback on error
      set({ habitLogs });
      throw error;
    }
  },
}));

export default useHabitStore;
