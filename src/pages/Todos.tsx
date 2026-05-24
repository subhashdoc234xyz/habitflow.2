import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Check, Trash2, Clock, X, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { GhostButton } from '../components/GhostButton';
import { GlassInput } from '../components/GlassInput';
import { useTodos } from '../hooks/useTodos';

export function Todos() {
  const today = new Date();
  const { todos, loading, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [activeTab, setActiveTab] = useState('Today');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: 'General',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '',
  });

  // Quick Add State
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [quickAddSubmitting, setQuickAddSubmitting] = useState(false);

  const handleOpenModal = () => {
    setFormData({
      title: '',
      priority: 'medium',
      category: 'General',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '',
    });
    setFormError(null);
    setShowAddModal(true);
  };

  const handleQuickAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddTitle.trim()) return;

    setQuickAddSubmitting(true);
    try {
      await addTodo({
        title: quickAddTitle.trim(),
        priority: 'medium',
        category: 'General',
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '',
      });
      setQuickAddTitle('');
    } catch (err) {
      console.error(err);
    } finally {
      setQuickAddSubmitting(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Task title is required');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const timeout = setTimeout(() => {
      setSubmitting(false);
      setFormError('Request timed out. Check your connection and try again.');
    }, 10000);

    try {
      await addTodo({
        title: formData.title.trim(),
        priority: formData.priority,
        category: formData.category || 'General',
        dueDate: formData.dueDate,
        dueTime: formData.dueTime,
      });
      clearTimeout(timeout);
      // Reset form state
      setFormData({
        title: '',
        priority: 'medium',
        category: 'General',
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '',
      });
      setFormError(null);
      setShowAddModal(false);
    } catch (err: any) {
      clearTimeout(timeout);
      console.error('Failed to add todo:', err);
      if (err.code === 'permission-denied') {
        setFormError('Permission denied. Please sign out and sign in again.');
      } else if (err.code === 'unavailable') {
        setFormError('No internet connection. Please check your network.');
      } else if (err.code === 'unauthenticated') {
        setFormError('Session expired. Please sign in again.');
      } else {
        setFormError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      clearTimeout(timeout);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!showAddModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSubmitting(false);
        setShowAddModal(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal]);

  const filteredTodos = todos.filter(todo => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (activeTab === 'Today') {
      return todo.dueDate === todayStr && !todo.completed;
    }
    if (activeTab === 'This Week') {
      // Simple fallback: show all uncompleted
      return !todo.completed;
    }
    if (activeTab === 'Completed') {
      return todo.completed;
    }
    return true; // 'All'
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="heading-1 mb-1">Today's Focus</h1>
          <p className="text-gray-500 font-medium">{format(today, "EEEE, MMMM do")}</p>
        </div>
        <PrimaryButton className="flex items-center gap-2" onClick={handleOpenModal}>
          <Plus className="w-4 h-4" /> Add Task
        </PrimaryButton>
      </div>

      <div className="flex items-center gap-2 p-1.5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full w-max shadow-sm mb-4">
        {['All', 'Today', 'This Week', 'Completed'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              activeTab === tab 
                ? 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-md' 
                : 'text-gray-500 hover:text-violet-600 hover:bg-white/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        </div>
      )}

      {!loading && (
        <div className="flex flex-col gap-4">
          {filteredTodos.map((todo) => {
            let priorityColor = 'bg-gray-100 text-gray-700 border-gray-200';
            let stripeColor = 'bg-gray-400';
            if (todo.priority === 'high') {
              priorityColor = 'bg-red-50 text-red-500 border-red-100';
              stripeColor = 'bg-red-500';
            } else if (todo.priority === 'medium') {
              priorityColor = 'bg-orange-50 text-orange-500 border-orange-100';
              stripeColor = 'bg-orange-500';
            } else if (todo.priority === 'low') {
              priorityColor = 'bg-blue-50 text-blue-500 border-blue-100';
              stripeColor = 'bg-blue-500';
            }

            return (
              <GlassCard key={todo.id} className="p-4 flex items-center gap-4 relative overflow-hidden group">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stripeColor}`}></div>
                
                <button 
                  onClick={() => toggleTodo(todo.id, !todo.completed)}
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center cursor-pointer transition-all ${
                    todo.completed 
                      ? 'bg-violet-600 border-violet-600 text-white' 
                      : 'border-violet-300 hover:border-violet-500 bg-transparent'
                  }`}
                >
                  {todo.completed && <Check className="w-3.5 h-3.5" />}
                </button>
                
                <div className="flex-1">
                  <h3 className={`font-bold text-gray-800 text-lg mb-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                    {todo.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    {todo.dueTime && (
                      <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                        <Clock className="w-3 h-3" /> {todo.dueTime}
                      </span>
                    )}
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-md border capitalize ${priorityColor}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${stripeColor}`}></div> {todo.priority}
                    </span>
                    {todo.category && (
                      <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-md border border-violet-100">
                        {todo.category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GhostButton onClick={() => deleteTodo(todo.id)}>
                    <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                  </GhostButton>
                </div>
              </GlassCard>
            );
          })}

          {/* Quick Add Form */}
          <GlassCard className="p-4 border-dashed border-2 border-violet-200 bg-white/30">
            <form onSubmit={handleQuickAddSubmit} className="flex gap-3 items-center">
              <Plus className="w-5 h-5 text-violet-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Quick add task and press Enter..."
                value={quickAddTitle}
                onChange={e => setQuickAddTitle(e.target.value)}
                disabled={quickAddSubmitting}
                className="flex-1 bg-transparent outline-none text-gray-800 font-medium placeholder-gray-400"
              />
              {quickAddTitle.trim() && (
                <PrimaryButton 
                  type="submit" 
                  disabled={quickAddSubmitting}
                  className="py-1 px-4 text-xs font-bold"
                >
                  {quickAddSubmitting ? 'Adding...' : 'Add'}
                </PrimaryButton>
              )}
            </form>
          </GlassCard>

          {filteredTodos.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-400 font-bold mb-2">No tasks found.</p>
              <p className="text-xs text-gray-400">Use quick add above to schedule your focus.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSubmitting(false);
              setShowAddModal(false);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
        >
          <GlassCard onClick={e => e.stopPropagation()} className="w-full max-w-[500px] shadow-2xl relative border-white/80 p-6">
            <button 
              onClick={() => {
                setSubmitting(false);
                setShowAddModal(false);
              }}
              type="button"
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="heading-2 mb-6">Create New Task</h3>

            {formError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Task Title</label>
                <GlassInput 
                  placeholder="e.g. Finish weekly report" 
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/50 backdrop-blur-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium text-gray-700"
                    disabled={submitting}
                  >
                    <option value="high">🔥 High</option>
                    <option value="medium">⚡ Medium</option>
                    <option value="low">💤 Low</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                  <GlassInput 
                    placeholder="e.g. Work, Personal" 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Due Date</label>
                  <GlassInput 
                    type="date"
                    value={formData.dueDate}
                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    disabled={submitting}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Due Time (Optional)</label>
                  <GlassInput 
                    type="time"
                    value={formData.dueTime}
                    onChange={e => setFormData({ ...formData, dueTime: e.target.value })}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <GhostButton 
                  type="button" 
                  onClick={() => {
                    setSubmitting(false);
                    setFormError(null);
                    setShowAddModal(false);
                  }}
                  className="flex-1 py-3 text-sm font-bold"
                >
                  Cancel
                </GhostButton>
                <PrimaryButton 
                  type="submit" 
                  onClick={handleSubmit}
                  disabled={submitting || !formData.title?.trim()}
                  className="flex-1 py-3 text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-500"
                  style={{
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                      Saving...
                    </span>
                  ) : (
                    'Add Task'
                  )}
                </PrimaryButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
