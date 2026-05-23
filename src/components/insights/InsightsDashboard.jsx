import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import RuleBasedInsights from './RuleBasedInsights';
import GeminiInsights from './GeminiInsights';
import useHabitStore from '../../store/habitStore';
import useTodoStore from '../../store/todoStore';
import useInsights from '../../hooks/useInsights';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export default function InsightsDashboard() {
  const { habitLogs, habits } = useHabitStore();
  const { todos } = useTodoStore();
  const { insights, geminiData } = useInsights();

  // Mood over time chart
  const moodChartData = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });
    return last7Days.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const moods = JSON.parse(localStorage.getItem('habitflow_mood_logs') || '[]')
        .filter((m) => m.log_date === dateStr);
      const avgMood = moods.length > 0
        ? moods.reduce((s, m) => s + m.mood_score, 0) / moods.length
        : 0;
      return {
        day: format(date, 'EEE'),
        mood: avgMood || null,
      };
    });
  }, []);

  // 4-week habit completion chart
  const completionChartData = useMemo(() => {
    const weeks = [];
    for (let w = 3; w >= 0; w--) {
      const weekStart = subDays(new Date(), w * 7 + 6);
      const weekEnd = subDays(new Date(), w * 7);
      const logs = habitLogs.filter((l) => {
        const d = new Date(l.completed_date);
        return d >= weekStart && d <= weekEnd;
      });
      const rate = logs.length > 0
        ? Math.round((logs.filter((l) => l.completed).length / logs.length) * 100)
        : 0;
      weeks.push({
        week: `Week ${4 - w}`,
        rate,
      });
    }
    return weeks;
  }, [habitLogs]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const cats = {};
    habits.forEach((h) => {
      const cat = h.category || 'general';
      if (!cats[cat]) cats[cat] = { total: 0, done: 0 };
      const logs = habitLogs.filter((l) => l.habit_id === h.id);
      cats[cat].total += logs.length;
      cats[cat].done += logs.filter((l) => l.completed).length;
    });
    return Object.entries(cats).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: data.total > 0 ? Math.round((data.done / data.total) * 100) : 0,
    }));
  }, [habits, habitLogs]);

  const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#a78bfa', '#ef4444'];

  // Streak leaderboard data
  const streakLeaderboard = useMemo(() => {
    const streaks = habits.map((h) => {
      const logs = habitLogs.filter((l) => l.habit_id === h.id && l.completed)
        .map((l) => l.completed_date)
        .sort((a, b) => new Date(b) - new Date(a));

      let current = 0;
      for (const dateStr of logs) {
        const diff = Math.round((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
        if (diff <= current + 1) current++;
        else break;
      }

      return { name: h.name, streak: current };
    })
      .filter((s) => s.streak > 0)
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5);
    return streaks;
  }, [habits, habitLogs]);

  return (
    <div className="space-y-6">
      {/* Insights Cards */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">💡 Insights</h2>
        <RuleBasedInsights insights={insights} />
      </div>

      {/* Gemini AI */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">🤖 AI Coach</h2>
        <GeminiInsights geminiData={geminiData} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit completion rate */}
        <div className="glass p-5 border border-[#7C3AED]/40 shadow-[0_8px_32px_rgba(0,0,0,0.3),_0_0_15px_rgba(124,58,237,0.2)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Habit Completion Rate (4 Weeks)</h3>
          <div className="h-64 bg-white/[0.03] rounded-lg p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Bar dataKey="rate" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood over time */}
        <div className="glass p-5 border border-[#ec4899]/40 shadow-[0_8px_32px_rgba(0,0,0,0.3),_0_0_15px_rgba(236,72,153,0.2)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Mood Over Time (7 Days)</h3>
          <div className="h-64 bg-white/[0.03] rounded-lg p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodChartData}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 5]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Area type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#moodGradient)" dot={{ fill: '#ec4899' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Category Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-[var(--text-muted)] text-sm">No data yet</p>
            )}
          </div>
        </div>

        {/* Streak leaderboard */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">🔥 Streak Leaderboard</h3>
          <div className="space-y-3">
            {streakLeaderboard.length > 0 ? streakLeaderboard.map((s, idx) => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-[var(--text-muted)] w-5">#{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[var(--text-primary)]">{s.name}</span>
                    <span className="text-sm font-semibold text-accent-light">{s.streak} days</span>
                  </div>
                  <div className="w-full bg-[var(--bg-hover)] rounded-full h-1.5">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${Math.min(100, (s.streak / 30) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )) : <p className="text-[var(--text-muted)] text-sm">No streaks yet. Keep going!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
