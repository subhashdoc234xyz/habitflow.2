import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useGoalStore = create((set, get) => ({
  goals: [],
  milestones: [],
  loading: false,

  fetchGoals: async (userId) => {
    set({ loading: true });
    try {
      const { data: goals, error: gErr } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (gErr) throw gErr;

      const { data: milestones, error: mErr } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (mErr) throw mErr;

      set({ goals: goals || [], milestones: milestones || [], loading: false });
    } catch (error) {
      console.error('Error fetching goals:', error);
      set({ loading: false });
    }
  },

  addGoal: async (goal) => {
    const { data, error } = await supabase.from('goals').insert(goal).select().single();
    if (error) throw error;
    set((state) => ({ goals: [data, ...state.goals] }));
    return data;
  },

  updateGoal: async (id, updates) => {
    const { error } = await supabase.from('goals').update(updates).eq('id', id);
    if (error) throw error;
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  },

  deleteGoal: async (id) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
      milestones: state.milestones.filter((m) => m.goal_id !== id),
    }));
  },

  addMilestone: async (milestone) => {
    const { data, error } = await supabase.from('milestones').insert(milestone).select().single();
    if (error) throw error;
    set((state) => ({ milestones: [...state.milestones, data] }));

    // Update goal progress
    const goalMilestones = get().milestones.filter((m) => m.goal_id === milestone.goal_id);
    const completedMilestones = [...goalMilestones, data].filter((m) => m.completed).length;
    const totalMilestones = [...goalMilestones, data].length;
    const progress = Math.round((completedMilestones / totalMilestones) * 100);

    await supabase.from('goals').update({ progress }).eq('id', milestone.goal_id);
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === milestone.goal_id ? { ...g, progress } : g
      ),
    }));

    return data;
  },

  toggleMilestone: async (id) => {
    const { milestones } = get();
    const milestone = milestones.find((m) => m.id === id);
    if (!milestone) return;

    const newCompleted = !milestone.completed;
    set((state) => ({
      milestones: state.milestones.map((m) =>
        m.id === id ? { ...m, completed: newCompleted } : m
      ),
    }));

    const { error } = await supabase
      .from('milestones')
      .update({ completed: newCompleted })
      .eq('id', id);

    if (error) {
      set((state) => ({
        milestones: state.milestones.map((m) =>
          m.id === id ? { ...m, completed: milestone.completed } : m
        ),
      }));
      throw error;
    }

    // Recalculate goal progress
    const goalMilestones = get().milestones.filter((m) => m.goal_id === milestone.goal_id);
    const completedCount = goalMilestones.filter((m) => m.completed).length;
    const progress = Math.round((completedCount / goalMilestones.length) * 100);

    await supabase.from('goals').update({ progress }).eq('id', milestone.goal_id);
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === milestone.goal_id ? { ...g, progress } : g
      ),
    }));
  },

  deleteMilestone: async (id) => {
    const milestone = get().milestones.find((m) => m.id === id);
    set((state) => ({
      milestones: state.milestones.filter((m) => m.id !== id),
    }));

    const { error } = await supabase.from('milestones').delete().eq('id', id);
    if (error) {
      set((state) => ({ milestones: [...state.milestones, milestone] }));
      throw error;
    }
  },
}));

export default useGoalStore;
