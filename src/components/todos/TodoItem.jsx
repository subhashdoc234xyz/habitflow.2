import { useState } from 'react';
import { Check, Edit2, Trash2, Pin, PinOff, Clock, MoreHorizontal } from 'lucide-react';
import { getPriorityColor, formatTime } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';

export default function TodoItem({ todo, onToggle, onEdit, onDelete, onPin, isPinned = false }) {
  const [showMenu, setShowMenu] = useState(false);

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e',
  };

  return (
    <div
      className={`
        group flex items-center gap-3 px-4 py-3 rounded-xl
        transition-all duration-200
        ${todo.completed ? 'bg-[var(--bg-card)]/50' : 'bg-[var(--bg-card)]'}
        ${isPinned ? 'border border-accent/30' : 'border border-[var(--border)]'}
        card-hover
      `}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`
          flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center
          transition-all duration-200
          ${todo.completed
            ? 'bg-accent border-accent text-white'
            : 'border-[var(--border)] hover:border-accent'
          }
        `}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as completed'}
      >
        {todo.completed && <Check size={14} className="animate-check" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm transition-all duration-200 ${
              todo.completed
                ? 'line-through text-[var(--text-muted)]'
                : 'text-[var(--text-primary)]'
            }`}
          >
            {todo.title}
          </span>
          {/* Priority badge */}
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: priorityColors[todo.priority] || priorityColors.medium }}
            title={`${todo.priority} priority`}
          />
          {todo.is_recurring && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent-light">
              Recurring
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {todo.due_date && (
            <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
              <Clock size={10} />
              {todo.due_time ? formatTime(todo.due_time) : todo.due_date}
            </span>
          )}
          {todo.tags?.length > 0 && (
            <div className="flex gap-1">
              {todo.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-hover)] text-[var(--text-muted)]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {isPinned ? (
          <button
            onClick={() => onPin(todo.id)}
            className="p-1.5 rounded-lg text-accent-light"
            aria-label="Unpin todo"
          >
            <PinOff size={14} />
          </button>
        ) : (
          <button
            onClick={() => onPin(todo.id)}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-accent-light transition-all"
            aria-label="Pin todo"
          >
            <Pin size={14} />
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
            aria-label="Todo options"
          >
            <MoreHorizontal size={14} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-xl py-1 min-w-[120px] z-20 animate-fade-in">
                <button
                  onClick={() => { onEdit(todo); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => { onDelete(todo.id); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-[var(--bg-hover)]"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
