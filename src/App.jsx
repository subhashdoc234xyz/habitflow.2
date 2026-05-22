import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import useHabitStore from './store/habitStore';
import useTodoStore from './store/todoStore';
import useGoalStore from './store/goalStore';
import AppLayout from './components/layout/AppLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load pages
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const HabitsPage = lazy(() => import('./pages/HabitsPage'));
const TodosPage = lazy(() => import('./pages/TodosPage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function AuthGuard({ children }) {
  const { user, loading, initialized } = useAuthStore();

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, loading, initialized } = useAuthStore();

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppContent() {
  const { user, initialized } = useAuthStore();
  const { fetchHabits } = useHabitStore();
  const { fetchTodos } = useTodoStore();
  const { fetchGoals } = useGoalStore();

  useEffect(() => {
    if (user && initialized) {
      fetchHabits(user.uid);
      fetchTodos(user.uid);
      fetchGoals(user.uid);
    }
  }, [user, initialized]);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]"><LoadingSpinner text="Loading..." /></div>}>
      <Routes>
        <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/" element={<AuthGuard><AppLayout /></AuthGuard>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="habits" element={<HabitsPage />} />
          <Route path="todos" element={<TodosPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1c1c28',
            color: '#f1f1f5',
            border: '1px solid #2a2a3a',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#1c1c28' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#1c1c28' } },
        }}
      />
    </BrowserRouter>
  );
}
