import { useState, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'habitflow_mood_logs';

function getStoredMoods() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function useMood() {
  const [moodLogs, setMoodLogs] = useState(getStoredMoods);

  const saveMood = useCallback((log) => {
    const updated = [...moodLogs, { ...log, id: Date.now().toString(), created_at: new Date().toISOString() }];
    setMoodLogs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return log;
  }, [moodLogs]);

  const getTodayMood = useCallback((reviewType) => {
    const today = new Date().toISOString().split('T')[0];
    return moodLogs.find((m) => m.log_date === today && m.review_type === reviewType) || null;
  }, [moodLogs]);

  const todayMorningMood = useMemo(() => getTodayMood('morning'), [getTodayMood]);
  const todayEveningMood = useMemo(() => getTodayMood('evening'), [getTodayMood]);
  const hasMorningReview = !!todayMorningMood;
  const hasEveningReview = !!todayEveningMood;

  const getRecentMoods = useCallback((days = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return moodLogs.filter((m) => new Date(m.log_date) >= cutoff);
  }, [moodLogs]);

  return {
    moodLogs,
    saveMood,
    getTodayMood,
    getRecentMoods,
    todayMorningMood,
    todayEveningMood,
    hasMorningReview,
    hasEveningReview,
  };
}
