import { useState } from 'react';
import { Target, Calendar, ChevronDown, ChevronUp, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import ProgressBar from '../ui/ProgressBar';
import MilestoneList from './MilestoneList';

export default function GoalCard({ goal, milestones, onEdit, onDelete, onToggleMilestone, onAddMilestone }) {
  const [expanded, setExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const daysLeft = goal.deadline ? differenceInDays(new Date(goal.deadline), new Date()) : null;
  const goalMilestones = milestones.filter((m) => m.goal_id === goal.id);
  const completedMilestones = goalMilestones.filter((m) => m.completed).length;

  const statusColors = {
    active: '#22c55e',
    completed: '#818cf8',
    paused: '#f59e0b',
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden card-hover">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: statusColors[goal.status] || statusColors.active }}
            />
            <h3 className="font-semibold text-[var(--text-primary)]">{goal.title}</h3>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
              aria-label="Goal options"
            >
              <MoreHorizontal size={16} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-xl py-1 min-w-[120px] z-20 animate-fade-in">
                  <button onClick={() => { onEdit(goal); setShowMenu(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => { onDelete(goal.id); setShowMenu(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-[var(--bg-hover)]">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {goal.description && (
          <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">{goal.description}</p>
        )}

        <div className="space-y-2 mb-3">
          <ProgressBar value={goal.progress} color={statusColors[goal.status] || '#6366f1'} />
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>{goal.progress}% complete</span>
            {goalMilestones.length > 0 && (
              <span>{completedMilestones}/{goalMilestones.length} milestones</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {goal.category && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg-hover)] text-[var(--text-muted)]">
              {goal.category}
            </span>
          )}
          {daysLeft !== null && daysLeft >= 0 ? (
            <span className={`text-xs flex items-center gap-1 ${daysLeft <= 7 ? 'text-red-400' : 'text-[var(--text-muted)]'}`}>
              <Calendar size={12} />
              {daysLeft === 0 ? 'Due today' : `${daysLeft} days left`}
            </span>
          ) : daysLeft !== null && daysLeft < 0 ? (
            <span className="text-xs text-red-400 flex items-center gap-1">
              <Calendar size={12} />
              Overdue by {Math.abs(daysLeft)} days
            </span>
          ) : null}
        </div>
      </div>

      {/* Expand for milestones */}
      {goalMilestones.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border-t border-[var(--border)] transition-colors"
        >
          {expanded ? (
            <>Hide milestones <ChevronUp size={14} /></>
          ) : (
            <>Show milestones ({goalMilestones.length}) <ChevronDown size={14} /></>
          )}
        </button>
      )}

      {expanded && (
        <div className="border-t border-[var(--border)] p-4">
          <MilestoneList
            milestones={goalMilestones}
            onToggle={onToggleMilestone}
            onAdd={() => onAddMilestone(goal.id)}
          />
        </div>
      )}
    </div>
  );
}
