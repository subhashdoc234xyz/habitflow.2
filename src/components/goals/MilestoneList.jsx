import { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import useGoalStore from '../../store/goalStore';

export default function MilestoneList({ milestones, goalId, onToggle, onAdd }) {
  const { user } = useAuthStore();
  const { addMilestone, deleteMilestone } = useGoalStore();
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      await addMilestone({
        goal_id: goalId,
        user_id: user.uid,
        title: newTitle.trim(),
        completed: false,
      });
      setNewTitle('');
      toast.success('Milestone added!');
    } catch (error) {
      toast.error('Failed to add milestone');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMilestone(id);
      toast.success('Milestone removed');
    } catch (error) {
      toast.error('Failed to delete milestone');
    }
  };

  return (
    <div className="space-y-2">
      {milestones.length === 0 && (
        <p className="text-xs text-[var(--text-muted)] text-center py-2">
          No milestones yet. Add your first one!
        </p>
      )}

      {milestones.map((milestone) => (
        <div key={milestone.id} className="flex items-center gap-2 group">
          <button
            onClick={() => onToggle(milestone.id)}
            className={`
              flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all
              ${milestone.completed
                ? 'bg-accent border-accent text-white'
                : 'border-[var(--border)] hover:border-accent'
              }
            `}
            aria-label={milestone.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {milestone.completed && <Check size={10} />}
          </button>
          <span className={`text-sm flex-1 ${milestone.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'}`}>
            {milestone.title}
          </span>
          <button
            onClick={() => handleDelete(milestone.id)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-[var(--text-muted)] hover:text-red-400 transition-all"
            aria-label="Delete milestone"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}

      {/* Add new milestone */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          placeholder="Add a milestone..."
          className="flex-1 px-2 py-1.5 bg-transparent border-b border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !newTitle.trim()}
          className="p-1 rounded text-[var(--text-muted)] hover:text-accent-light disabled:opacity-50"
          aria-label="Add milestone"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
