import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Habits } from './pages/Habits';
import { Todos } from './pages/Todos';
import { Goals } from './pages/Goals';
import { CalendarPage } from './pages/Calendar';
import { Insights } from './pages/Insights';
import { Review } from './pages/Review';
import { SettingsPage } from './pages/Settings';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/" />} 
      />
      
      {/* Protected Routes */}
      <Route element={user ? <AppLayout /> : <Navigate to="/login" />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/review" element={<Review />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Global Background Orbs */}
        <div className="orb-1"></div>
        <div className="orb-2"></div>
        <div className="orb-3"></div>

        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

