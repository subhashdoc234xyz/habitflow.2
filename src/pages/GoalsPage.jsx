import { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';
import useGoalStore from '../store/goalStore';

export default function GoalsPage() {
  const { goals, milestones, deleteGoal, toggleMilestone } = useGoalStore();
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [statusFilter, setStatusFilter] = useState('active');

  const filteredGoals = goals.filter((g) => statusFilter === 'all' || g.status === statusFilter);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this goal and all its milestones?')) {
      try {
        await deleteGoal(id);
        toast.success('Goal deleted');
      } catch { toast.error('Failed to delete'); }
    }
  };

  const handleToggleMilestone = async (id) => {
    try {
      await toggleMilestone(id);
      const milestone = milestones.find((m) => m.id === id);
      if (milestone) {
        toast.success(milestone.completed ? 'Milestone unmarked' : 'Milestone completed! +25 XP');
      }
    } catch { toast.error('Failed to update milestone'); }
  };

  const handleAddMilestone = (goalId) => {
    // Will be handled by MilestoneList inline
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">Goals</h1>
          <p className="text-sm text-[var(--text-muted)]">Set and track your big objectives</p>
        </div>
        <Button onClick={() => { setEditGoal(null); setShowForm(true); }}>
          <Plus size={16} /> New Goal
        </Button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1">
        {['active', 'completed', 'paused', 'all'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
              statusFilter === status
                ? 'bg-accent/15 text-accent-light'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Goals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGoals.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-[var(--text-muted)]">No goals yet. Create your first goal!</p>
          </div>
        )}
        {filteredGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            milestones={milestones}
            onEdit={(g) => { setEditGoal(g); setShowForm(true); }}
            onDelete={handleDelete}
            onToggleMilestone={handleToggleMilestone}
            onAddMilestone={handleAddMilestone}
          />
        ))}
      </div>

      <GoalForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditGoal(null); }}
        editGoal={editGoal}
      />
    </div>
  );
}
