const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const buildInsightPrompt = (data) => `
You are a personal productivity coach analyzing a user's habit and goal data.
Based on the data below, provide 3-5 personalized, actionable insights.
Be specific, encouraging, and use the actual data in your response.
Format: Return plain text insights separated by newlines, no markdown.

DATA:
- Period: Last 30 days
- Habit completion rate: ${data.completionRate}%
- Total habits tracked: ${data.totalHabits}
- Best streak: ${data.bestStreak} days (habit: ${data.bestStreakHabit})
- Average mood score: ${data.avgMood}/5
- Todos completed: ${data.todosCompleted}
- Goals in progress: ${data.activeGoals}
- Most missed habit: ${data.mostMissedHabit}
- Best day of week: ${data.bestDay}
- Worst day of week: ${data.worstDay}

Provide insights that help the user improve their habits and achieve their goals.
`;

export const generateInsights = async (data) => {
  try {
    const prompt = buildInsightPrompt(data);
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text.split('\n').filter((line) => line.trim());
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

export const getCachedInsights = () => {
  try {
    const cached = localStorage.getItem('habitflow_gemini_cache');
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    const ttl = 6 * 60 * 60 * 1000; // 6 hours
    if (Date.now() - timestamp > ttl) {
      localStorage.removeItem('habitflow_gemini_cache');
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

export const setCachedInsights = (data) => {
  localStorage.setItem(
    'habitflow_gemini_cache',
    JSON.stringify({ data, timestamp: Date.now() })
  );
};
