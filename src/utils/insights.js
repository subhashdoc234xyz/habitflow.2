export function generateRuleBasedInsights({ habits, habitLogs, todos, goals, milestones, moodLogs, streaks }) {
  const insights = [];
  const now = new Date();

  // Helper to get today's date string
  const todayStr = now.toISOString().split('T')[0];

  // 1. Best streak habit
  if (streaks && Object.keys(streaks).length > 0) {
    const best = Object.entries(streaks).reduce((a, b) => (a[1].current > b[1].current ? a : b));
    const habit = habits.find((h) => h.id === best[0]);
    if (habit && best[1].current > 0) {
      insights.push({
        type: 'habit',
        headline: `Your top habit is '${habit.name}' with a ${best[1].current}-day streak!`,
        detail: `Best streak ever: ${best[1].longest} days. Keep the momentum going!`,
        category: 'Habits',
        tone: 'positive',
      });
    }
  }

  // 2. Weakest day
  const dayCompletion = { 0: { total: 0, done: 0 }, 1: { total: 0, done: 0 }, 2: { total: 0, done: 0 }, 3: { total: 0, done: 0 }, 4: { total: 0, done: 0 }, 5: { total: 0, done: 0 }, 6: { total: 0, done: 0 } };
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  habitLogs.forEach((log) => {
    const d = new Date(log.completed_date);
    const day = d.getDay();
    dayCompletion[day].total++;
    if (log.completed) dayCompletion[day].done++;
  });

  let worstDay = null;
  let bestDay = null;
  let worstRate = 100;
  let bestRate = 0;

  Object.entries(dayCompletion).forEach(([day, data]) => {
    if (data.total > 0) {
      const rate = (data.done / data.total) * 100;
      if (rate < worstRate) { worstRate = rate; worstDay = parseInt(day); }
      if (rate > bestRate) { bestRate = rate; bestDay = parseInt(day); }
    }
  });

  if (worstDay !== null) {
    insights.push({
      type: 'habit',
      headline: `You complete the fewest habits on ${dayNames[worstDay]} (${Math.round(worstRate)}% rate)`,
      detail: `Try setting a reminder or simplifying your ${dayNames[worstDay]} routine.`,
      category: 'Habits',
      tone: 'warning',
    });
  }

  // 3. Best day
  if (bestDay !== null) {
    insights.push({
      type: 'habit',
      headline: `${dayNames[bestDay]} is your power day — ${Math.round(bestRate)}% habit completion`,
      detail: `You're most consistent on ${dayNames[bestDay]}s. What's your secret?`,
      category: 'Habits',
      tone: 'positive',
    });
  }

  // 4. Morning vs evening completion
  const morningHabits = habits.filter((h) => h.target_time === 'morning');
  const eveningHabits = habits.filter((h) => h.target_time === 'evening');

  if (morningHabits.length > 0 && eveningHabits.length > 0) {
    const morningLogs = habitLogs.filter((l) => morningHabits.some((h) => h.id === l.habit_id));
    const eveningLogs = habitLogs.filter((l) => eveningHabits.some((h) => h.id === l.habit_id));

    const morningRate = morningLogs.length > 0
      ? (morningLogs.filter((l) => l.completed).length / morningLogs.length) * 100
      : 0;
    const eveningRate = eveningLogs.length > 0
      ? (eveningLogs.filter((l) => l.completed).length / eveningLogs.length) * 100
      : 0;

    if (morningRate > 0 || eveningRate > 0) {
      const diff = Math.abs(morningRate - eveningRate);
      const better = morningRate > eveningRate ? 'morning' : 'evening';
      insights.push({
        type: 'habit',
        headline: `You complete ${better} habits ${Math.round(diff)}% more than ${better === 'morning' ? 'evening' : 'morning'} ones`,
        detail: `Morning rate: ${Math.round(morningRate)}% | Evening rate: ${Math.round(eveningRate)}%`,
        category: 'Habits',
        tone: 'info',
      });
    }
  }

  // 5. Overdue todos
  const overdueTodos = todos.filter((t) => !t.completed && t.due_date && new Date(t.due_date) < now);
  if (overdueTodos.length > 0) {
    const overdueDays = overdueTodos.reduce((sum, t) => sum + differenceInDays(now, new Date(t.due_date)), 0);
    const avgOverdue = Math.round(overdueDays / overdueTodos.length);
    insights.push({
      type: 'todo',
      headline: `You have ${overdueTodos.length} todo${overdueTodos.length > 1 ? 's' : ''} overdue by ${avgOverdue}+ days`,
      detail: `Catch up on your ${overdueTodos.length > 1 ? 'top priorities' : 'top priority'} first.`,
      category: 'Todos',
      tone: 'warning',
    });
  }

  // 6. Goal at risk
  goals.filter((g) => g.status === 'active').forEach((goal) => {
    if (goal.deadline) {
      const daysLeft = differenceInDays(new Date(goal.deadline), now);
      if (daysLeft > 0 && daysLeft <= 30 && goal.progress < 50) {
        insights.push({
          type: 'goal',
          headline: `Goal '${goal.title}' is ${goal.progress}% done with only ${daysLeft} days left`,
          detail: `Consider breaking remaining work into daily tasks to accelerate progress.`,
          category: 'Goals',
          tone: 'danger',
        });
      }
    }
  });

  // 7. Mood-habit correlation
  if (moodLogs.length > 0 && habitLogs.length > 0) {
    const exerciseHabits = habits.filter((h) => h.category === 'fitness' || h.name.toLowerCase().includes('exercise') || h.name.toLowerCase().includes('workout'));
    if (exerciseHabits.length > 0) {
      const exerciseHabitIds = exerciseHabits.map((h) => h.id);
      const exerciseDays = habitLogs
        .filter((l) => exerciseHabitIds.includes(l.habit_id) && l.completed)
        .map((l) => l.completed_date);

      const daysWithExercise = moodLogs.filter((m) => exerciseDays.includes(m.log_date));
      const daysWithoutExercise = moodLogs.filter((m) => !exerciseDays.includes(m.log_date));

      if (daysWithExercise.length > 0 && daysWithoutExercise.length > 0) {
        const avgWith = Math.round((daysWithExercise.reduce((s, m) => s + m.mood_score, 0) / daysWithExercise.length) * 10) / 10;
        const avgWithout = Math.round((daysWithoutExercise.reduce((s, m) => s + m.mood_score, 0) / daysWithoutExercise.length) * 10) / 10;

        if (avgWith > avgWithout) {
          insights.push({
            type: 'mood',
            headline: `On days you exercise, your mood scores ${avgWith} vs ${avgWithout} on rest days`,
            detail: `Exercise boosts your mood by ${Math.round((avgWith - avgWithout) / avgWithout * 100)}%!`,
            category: 'Mood',
            tone: 'positive',
          });
        }
      }
    }
  }

  // 8. Consistency score
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  });

  const logsLast7 = habitLogs.filter((l) => last7Days.includes(l.completed_date));
  const totalPossibleLast7 = habits.filter((h) => h.is_active).length * 7;
  const completedLast7 = logsLast7.filter((l) => l.completed).length;
  const consistency = totalPossibleLast7 > 0 ? Math.round((completedLast7 / totalPossibleLast7) * 100) : 0;

  const consistencyDesc = consistency >= 80 ? 'excellent!' : consistency >= 50 ? 'keep going!' : 'room for improvement';
  insights.push({
    type: 'habit',
    headline: `You've been consistent ${completedLast7}/${totalPossibleLast7} this week — ${consistencyDesc}`,
    detail: `Weekly consistency: ${consistency}%`,
    category: 'Habits',
    tone: consistency >= 70 ? 'positive' : consistency >= 40 ? 'warning' : 'info',
  });

  // 9. Longest gap/missed streak
  habits.forEach((habit) => {
    const habitSpecific = habitLogs.filter((l) => l.habit_id === habit.id && l.completed).sort((a, b) => new Date(a.completed_date) - new Date(b.completed_date));
    if (habitSpecific.length >= 2) {
      let maxGap = 0;
      let gapStart = '';
      let gapEnd = '';
      for (let i = 1; i < habitSpecific.length; i++) {
        const diff = differenceInDays(new Date(habitSpecific[i].completed_date), new Date(habitSpecific[i - 1].completed_date));
        if (diff > maxGap + 1) {
          maxGap = diff - 1;
          gapStart = habitSpecific[i - 1].completed_date;
          gapEnd = habitSpecific[i].completed_date;
        }
      }
      if (maxGap >= 3) {
        insights.push({
          type: 'habit',
          headline: `You skipped '${habit.name}' for ${maxGap} days (${gapStart} to ${gapEnd})`,
          detail: `Longest gap in your ${habit.name} routine.`,
          category: 'Habits',
          tone: 'warning',
        });
      }
    }
  });

  // 10. Monthly completion comparison
  const thisMonth = now.getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const thisYear = now.getFullYear();
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const thisMonthLogs = habitLogs.filter((l) => {
    const d = new Date(l.completed_date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const lastMonthLogs = habitLogs.filter((l) => {
    const d = new Date(l.completed_date);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });

  const calcRate = (logs) => logs.length > 0 ? Math.round((logs.filter((l) => l.completed).length / logs.length) * 100) : 0;
  const thisRate = calcRate(thisMonthLogs);
  const lastRate = calcRate(lastMonthLogs);

  if (lastRate > 0) {
    const diff = thisRate - lastRate;
    insights.push({
      type: 'habit',
      headline: `This month: ${thisRate}% habit completion — ${diff >= 0 ? 'up' : 'down'} ${Math.abs(diff)}% from last month`,
      detail: diff >= 0 ? `Great improvement! Keep building momentum.` : `Let's turn this around next month.`,
      category: 'Habits',
      tone: diff >= 0 ? 'positive' : 'warning',
    });
  }

  // 11. Todo completion rate
  if (todos.length > 0) {
    const completedTodos = todos.filter((t) => t.completed).length;
    const rate = Math.round((completedTodos / todos.length) * 100);
    insights.push({
      type: 'todo',
      headline: `You complete ${rate}% of todos you create (${completedTodos}/${todos.length})`,
      detail: rate >= 70 ? 'Great task management!' : rate >= 40 ? 'Room for improvement in task follow-through.' : 'Try breaking tasks into smaller pieces.',
      category: 'Todos',
      tone: rate >= 70 ? 'positive' : rate >= 40 ? 'info' : 'warning',
    });
  }

  // 12. Most productive week
  const weekGroups = {};
  habitLogs.forEach((l) => {
    const d = new Date(l.completed_date);
    const weekStart = d.toISOString().split('T')[0]; // simplified
    if (!weekGroups[weekStart]) weekGroups[weekStart] = { total: 0, done: 0 };
    weekGroups[weekStart].total++;
    if (l.completed) weekGroups[weekStart].done++;
  });

  let bestWeek = null;
  let bestWeekRate = 0;
  Object.entries(weekGroups).forEach(([week, data]) => {
    const rate = data.total > 0 ? (data.done / data.total) * 100 : 0;
    if (rate > bestWeekRate) { bestWeekRate = rate; bestWeek = week; }
  });

  if (bestWeek && bestWeekRate > 0) {
    const bestDate = new Date(bestWeek);
    const weekEnd = new Date(bestDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    insights.push({
      type: 'habit',
      headline: `Your best week was ${bestDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${Math.round(bestWeekRate)}% completion)`,
      detail: `That's your peak performance week. Let's beat it!`,
      category: 'Habits',
      tone: 'positive',
    });
  }

  return insights.slice(0, 12);
}

function differenceInDays(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
}
