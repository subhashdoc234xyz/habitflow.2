import { useState } from 'react';
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

export default function App() {
  // Mock Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      {/* Global Background Orbs */}
      <div className="orb-1"></div>
      <div className="orb-2"></div>
      <div className="orb-3"></div>

      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/" />} 
        />
        
        {/* Protected Routes */}
        <Route element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/review" element={<Review />} />
          <Route path="/settings" element={<SettingsPage onLogout={() => setIsAuthenticated(false)} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
