import { format } from 'date-fns';
import { Settings, Plus, Check, Clock, Flame, Target as TargetIcon, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GhostButton } from '../components/GhostButton';
import { useAuth } from '../contexts/AuthContext';
import { useHabits } from '../hooks/useHabits';
import { useTodos } from '../hooks/useTodos';
import { useGoals } from '../hooks/useGoals';

export function Dashboard() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const { user } = useAuth();
  
  const { habits, loading: habitsLoading, toggleHabitComplete } = useHabits();
  const { todos, loading: todosLoading, toggleTodo } = useTodos();
  const { goals, loading: goalsLoading } = useGoals();

  const userName = user?.email ? user.email.split('@')[0] : 'Champion';

  // XP & Gamification Logic
  // Calculate completed items for XP
  const completedHabitsCount = habits.reduce((acc, h) => acc + (h.completedDates?.includes(todayStr) ? 1 : 0), 0);
  const completedTodosCount = todos.filter(t => t.completed).length;

  const totalXP = (completedHabitsCount * 25) + (completedTodosCount * 15);
  const currentLevel = Math.floor(totalXP / 100) + 1;
  const levelXP = totalXP % 100;
  const xpPercentage = Math.min(levelXP, 100);

  // Streak logic: max streak of any habit
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;

  // Today's Habit completion percentage
  const totalHabitsToday = habits.length;
  const completionPercentage = totalHabitsToday > 0 
    ? Math.round((completedHabitsCount / totalHabitsToday) * 100) 
    : 0;

  // Get active goals
  const activeGoals = goals.filter(g => g.progress < 100).slice(0, 2);

  // Filter today's pending todos
  const todayTodos = todos.filter(todo => {
    return todo.dueDate === todayStr && !todo.completed;
  }).slice(0, 3);

  const loading = habitsLoading || todosLoading || goalsLoading;

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1 capitalize">
            Good morning, {userName} ☀️
          </h1>
          <p className="text-gray-500 font-medium">
            {format(today, "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        <Link to="/settings">
          <GhostButton>
            <Settings className="w-5 h-5 text-gray-400" />
          </GhostButton>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* XP Card */}
            <GlassCard className="relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="heading-2 mb-1 flex items-center gap-1.5">
                    Level {currentLevel}: {currentLevel === 1 ? 'Seedling 🌱' : currentLevel === 2 ? 'Sprout 🌿' : 'Achiever 🏆'}
                  </h3>
                  <p className="text-sm font-medium text-gray-500">{levelXP} / 100 XP to next level</p>
                </div>
                <div className="px-3 py-1 bg-white/60 rounded-full border border-violet-200 text-sm font-bold text-violet-700 shadow-sm flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" /> {totalXP} XP
                </div>
              </div>
              <div className="h-2.5 w-full bg-violet-600/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 rounded-full relative transition-all duration-500"
                  style={{ width: `${xpPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                <span>Level {currentLevel}</span>
                <span>Next: Level {currentLevel + 1}</span>
              </div>
            </GlassCard>

            {/* Today's Habits */}
            <GlassCard>
              <div className="flex justify-between items-center mb-6">
                <h2 className="heading-2 flex items-center gap-2">
                  Today's Habits
                </h2>
                <Link to="/habits">
                  <button className="flex items-center gap-1 text-sm font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors">
                    <Plus className="w-4 h-4" /> Go to Habits
                  </button>
                </Link>
              </div>
              
              <div className="flex flex-col gap-3">
                {habits.map((habit) => {
                  const done = habit.completedDates?.includes(todayStr);

                  return (
                    <div 
                      key={habit.id} 
                      className={`flex items-center justify-between p-3 border rounded-[16px] transition-colors ${
                        done 
                          ? 'bg-white/20 border-white/40 opacity-70' 
                          : 'bg-white/40 border-white/60 hover:bg-white/60'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                            done ? 'grayscale' : ''
                          }`}
                          style={{ backgroundColor: `${habit.color}15` }}
                        >
                          {habit.icon}
                        </div>
                        <div>
                          <h4 className={`font-bold ${done ? 'text-gray-500 line-through decoration-gray-300' : 'text-gray-800'}`}>
                            {habit.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span 
                              className="text-xs px-2 py-0.5 rounded-md font-medium border"
                              style={{ 
                                backgroundColor: `${habit.color}08`, 
                                color: habit.color,
                                borderColor: `${habit.color}15`
                              }}
                            >
                              {habit.category}
                            </span>
                            <span className="text-xs text-orange-500 font-bold flex items-center">🔥 {habit.streak || 0}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => toggleHabitComplete(habit.id)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          done 
                            ? 'bg-green-500 border-green-500 text-white shadow-sm' 
                            : 'border-dashed border-violet-300 hover:border-violet-500 hover:bg-white'
                        }`}
                      >
                        {done ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 text-violet-400" />}
                      </button>
                    </div>
                  );
                })}

                {habits.length === 0 && (
                  <div className="py-6 text-center text-gray-400">
                    <p className="font-bold mb-1">No habits configured yet.</p>
                    <Link to="/habits" className="text-sm font-bold text-violet-600 hover:underline">Create a habit</Link>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Today's Focus */}
            <GlassCard>
              <div className="flex justify-between items-center mb-6">
                <h2 className="heading-2">Today's Focus</h2>
                <Link to="/todos">
                  <button className="flex items-center gap-1 text-sm font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors">
                    <Plus className="w-4 h-4" /> Go to Tasks
                  </button>
                </Link>
              </div>
              
              <div className="flex flex-col gap-2">
                {todayTodos.map((todo) => {
                  let priorityColor = 'bg-gray-100 text-gray-700 border-gray-200';
                  if (todo.priority === 'high') priorityColor = 'bg-red-50 text-red-500 border-red-100';
                  else if (todo.priority === 'medium') priorityColor = 'bg-orange-50 text-orange-500 border-orange-100';
                  else if (todo.priority === 'low') priorityColor = 'bg-blue-50 text-blue-500 border-blue-100';

                  return (
                    <div key={todo.id} className="flex items-start gap-3 p-2 group">
                      <button 
                        onClick={() => toggleTodo(todo.id, !todo.completed)}
                        className="w-5 h-5 rounded-full border-2 border-violet-300 mt-0.5 flex-shrink-0 cursor-pointer hover:border-violet-500 flex items-center justify-center"
                      >
                        {todo.completed && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium mb-1">{todo.title}</p>
                        <div className="flex items-center gap-2 text-xs font-medium">
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded border capitalize ${priorityColor}`}>
                            {todo.priority}
                          </span>
                          {todo.dueTime && (
                            <span className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-3 h-3" /> {todo.dueTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {todayTodos.length === 0 && (
                  <div className="py-6 text-center text-gray-400">
                    <p className="font-bold mb-1">All focus tasks completed! 🎉</p>
                    <Link to="/todos" className="text-sm font-bold text-violet-600 hover:underline">Add focus task</Link>
                  </div>
                )}
              </div>
            </GlassCard>

          </div>

          {/* Right Column - 1/3 */}
          <div className="flex flex-col gap-6">
            
            <div className="grid grid-cols-2 gap-4">
              {/* Streak Card */}
              <GlassCard className="flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <Flame className="w-8 h-8 text-orange-500 mb-2 animate-bounce" />
                <div className="stat-number">{maxStreak}</div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">Day Streak</div>
              </GlassCard>

              {/* Completion Ring */}
              <GlassCard className="flex flex-col items-center justify-center p-6 text-center">
                <div className="relative w-16 h-16 mb-2">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="8" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      fill="none" 
                      stroke="url(#gradient)" 
                      strokeWidth="8" 
                      strokeDasharray="175" 
                      strokeDashoffset={175 - (175 * completionPercentage) / 100} 
                      strokeLinecap="round" 
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-violet-600 to-pink-500">
                    {completionPercentage}%
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">Completed</div>
              </GlassCard>
            </div>

            {/* This Week */}
            <GlassCard>
              <h3 className="card-label mb-4">THIS WEEK</h3>
              <div className="flex justify-between">
                {['M','T','W','T','F','S','S'].map((day, i) => {
                  const isToday = i === (today.getDay() === 0 ? 6 : today.getDay() - 1);
                  return (
                    <div 
                      key={i} 
                      className={`flex flex-col items-center p-2 rounded-full w-10 ${
                        isToday 
                          ? 'bg-gradient-to-b from-violet-600 to-indigo-600 shadow-[0_4px_12px_rgba(124,58,237,0.4)] text-white' 
                          : 'bg-white/40'
                      }`}
                    >
                      <span className={`text-[10px] font-bold mb-1 ${isToday ? 'text-violet-200' : 'text-gray-400'}`}>{day}</span>
                      <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-gray-700'}`}>
                        {new Date(today.getTime() - (today.getDay() - 1 - i) * 86400000).getDate()}
                      </span>
                      <div className={`w-1 h-1 rounded-full mt-1 ${isToday ? 'bg-white' : 'bg-transparent'}`}></div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Upcoming Goals */}
            <GlassCard>
              <h3 className="card-label mb-4">UPCOMING GOALS</h3>
              <div className="flex flex-col gap-4">
                {activeGoals.map((goal) => {
                  const target = new Date(goal.targetDate);
                  const diffTime = target.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  const daysLabel = diffDays > 0 ? `${diffDays} days left` : 'Goal active';

                  return (
                    <div key={goal.id} className="bg-white/40 p-3 rounded-2xl border border-white/60">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${goal.color}15`, color: goal.color }}
                        >
                          <TargetIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm truncate max-w-[150px]">{goal.title}</h4>
                          <p className="text-xs font-medium text-gray-500">{daysLabel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress || 0}%`, backgroundColor: goal.color }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold" style={{ color: goal.color }}>{goal.progress || 0}%</span>
                      </div>
                    </div>
                  );
                })}

                {activeGoals.length === 0 && (
                  <div className="py-4 text-center text-gray-400 text-sm font-bold">
                    <p className="mb-1">No active goals.</p>
                    <Link to="/goals" className="text-xs text-violet-600 hover:underline">Set a goal</Link>
                  </div>
                )}
              </div>
            </GlassCard>

          </div>
        </div>
      )}
    </div>
  );
}
