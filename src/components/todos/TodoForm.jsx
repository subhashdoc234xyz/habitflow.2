import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import useAuthStore from '../../store/authStore';
import useTodoStore from '../../store/todoStore';

const defaultForm = {
  title: '',
  description: '',
  priority: 'medium',
  due_date: '',
  due_time: '',
  is_recurring: false,
  recurrence_rule: '',
  tags: [],
};

export default function TodoForm({ isOpen, onClose, editTodo = null }) {
  const { user } = useAuthStore();
  const { addTodo, updateTodo } = useTodoStore();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (editTodo) {
      setForm({
        title: editTodo.title || '',
        description: editTodo.description || '',
        priority: editTodo.priority || 'medium',
        due_date: editTodo.due_date || '',
        due_time: editTodo.due_time || '',
        is_recurring: editTodo.is_recurring || false,
        recurrence_rule: editTodo.recurrence_rule || '',
        tags: editTodo.tags || [],
      });
    } else {
      setForm(defaultForm);
    }
  }, [editTodo, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Please enter a todo title');
      return;
    }
    setLoading(true);
    try {
      if (editTodo) {
        await updateTodo(editTodo.id, form);
        toast.success('Todo updated!');
      } else {
        await addTodo({ ...form, user_id: user.uid });
        toast.success('Todo added!');
      }
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editTodo ? 'Edit Todo' : 'New Todo'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="What needs to be done?"
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-accent transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-accent transition-colors"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Due date</label>
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Due time</label>
            <input
              type="time"
              value={form.due_time}
              onChange={(e) => setForm({ ...form, due_time: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_recurring}
            onChange={(e) => setForm({ ...form, is_recurring: e.target.checked })}
            className="rounded accent-accent"
            id="recurring"
          />
          <label htmlFor="recurring" className="text-sm text-[var(--text-secondary)]">Recurring todo</label>
        </div>

        {form.is_recurring && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Repeat every</label>
            <select
              value={form.recurrence_rule}
              onChange={(e) => setForm({ ...form, recurrence_rule: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-accent transition-colors"
            >
              <option value="">Select...</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tags</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {form.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-accent/15 text-accent-light">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="Add a tag"
              className="flex-1 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addTag}>Add</Button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">{editTodo ? 'Save' : 'Add Todo'}</Button>
        </div>
      </form>
    </Modal>
  );
}
