import { useState } from 'react';
import { Plus, ListFilter } from 'lucide-react';
import TodoItem from './TodoItem';
import Button from '../ui/Button';

export default function TodoList({ todos, onToggle, onEdit, onDelete, onPin, onAdd, pinnedTodos = [] }) {
  const [tab, setTab] = useState('today');
  const [filterPriority, setFilterPriority] = useState('all');
  const today = new Date().toISOString().split('T')[0];

  const filteredTodos = todos.filter((t) => {
    // Tab filter
    if (tab === 'today') {
      return t.due_date === today || !t.due_date;
    }
    if (tab === 'upcoming') {
      return t.due_date && t.due_date > today;
    }
    if (tab === 'completed') {
      return t.completed;
    }
    return true;
  }).filter((t) => {
    if (filterPriority === 'all') return true;
    return t.priority === filterPriority;
  }).filter((t) => !pinnedTodos.some((p) => p.id === t.id));

  const activeTodos = filteredTodos.filter((t) => !t.completed);
  const completedTodos = filteredTodos.filter((t) => t.completed);

  return (
    <div className="space-y-4">
      {/* Quick add */}
      <button
        onClick={onAdd}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-accent hover:text-accent-light transition-all group"
      >
        <Plus size={18} className="group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium">Quick add todo...</span>
      </button>

      {/* Pinned todos */}
      {pinnedTodos.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-light flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-accent" />
            Today's Focus
          </h3>
          {pinnedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onPin={onPin}
              isPinned
            />
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--border)] pb-1">
        {['today', 'upcoming', 'completed'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
              tab === t
                ? 'bg-accent/15 text-accent-light'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <div className="flex-1" />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-2 py-1.5 bg-transparent text-xs text-[var(--text-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-accent"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Todo list */}
      <div className="space-y-2">
        {activeTodos.length === 0 && completedTodos.length === 0 && (
          <div className="text-center py-10">
            <p className="text-[var(--text-muted)] text-sm">Nothing here yet! Add your first todo.</p>
          </div>
        )}

        {activeTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onPin={onPin}
          />
        ))}

        {/* Recently completed */}
        {completedTodos.length > 0 && (
          <>
            <div className="pt-4 pb-2">
              <h4 className="text-xs text-[var(--text-muted)]">Completed ({completedTodos.length})</h4>
            </div>
            {completedTodos.slice(0, 5).map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onPin={onPin}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
