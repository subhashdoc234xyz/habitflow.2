import { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import TodoList from '../components/todos/TodoList';
import TodoForm from '../components/todos/TodoForm';
import useTodoStore from '../store/todoStore';

const PINNED_KEY = 'habitflow_pinned_todos';

export default function TodosPage() {
  const { todos, toggleTodo, deleteTodo } = useTodoStore();
  const [showForm, setShowForm] = useState(false);
  const [editTodo, setEditTodo] = useState(null);

  const [pinnedIds, setPinnedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PINNED_KEY) || '[]');
    } catch { return []; }
  });

  const pinnedTodos = useMemo(() => {
    return todos.filter((t) => pinnedIds.includes(t.id)).slice(0, 3);
  }, [todos, pinnedIds]);

  const handleToggle = async (id) => {
    try {
      await toggleTodo(id);
      toast.success('Todo updated!');
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      toast.success('Todo deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handlePin = (id) => {
    const updated = pinnedIds.includes(id)
      ? pinnedIds.filter((pid) => pid !== id)
      : [...pinnedIds, id].slice(0, 3);
    setPinnedIds(updated);
    localStorage.setItem(PINNED_KEY, JSON.stringify(updated));
    toast.success(pinnedIds.includes(id) ? 'Unpinned' : 'Pinned to focus');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">Todos</h1>
          <p className="text-sm text-[var(--text-muted)]">Organize your daily tasks</p>
        </div>
      </div>

      <TodoList
        todos={todos}
        pinnedTodos={pinnedTodos}
        onToggle={handleToggle}
        onEdit={(todo) => { setEditTodo(todo); setShowForm(true); }}
        onDelete={handleDelete}
        onPin={handlePin}
        onAdd={() => { setEditTodo(null); setShowForm(true); }}
      />

      <TodoForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditTodo(null); }}
        editTodo={editTodo}
      />
    </div>
  );
}
