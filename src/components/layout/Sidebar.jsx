import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Calendar,
  BarChart3,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/habits', label: 'Habits', icon: CheckSquare },
  { path: '/todos', label: 'Todos', icon: Sparkles },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/insights', label: 'Insights', icon: BarChart3 },
  { path: '/review', label: 'Review', icon: Sparkles },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { profile, logout } = useAuthStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col sticky top-0 h-screen z-30 transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-60'}
        `}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <div className={`flex items-center p-4 border-b border-white/5 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={18} />
              </div>
              <span className="font-extrabold font-display text-lg gradient-text">HabitFlow</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={18} />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 text-sm font-medium
                transition-all duration-200
                ${collapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'bg-gradient-to-r from-[#7C3AED]/20 to-[#3B82F6]/5 text-white border-l-[3px] border-[#7C3AED] rounded-r-lg shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] rounded-lg'
                }
              `}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className={`p-4 border-t border-white/5 ${collapsed ? 'text-center' : ''}`}>
          {!collapsed && (
            <p className="text-sm text-[var(--text-secondary)] truncate mb-2">
              {profile?.name || profile?.email}
            </p>
          )}
          <button
            onClick={logout}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-red-400 transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
            aria-label="Sign out"
          >
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 glass border-t border-[var(--border)] border-x-0 border-b-0 rounded-none safe-area-bottom">
        <div className="flex justify-around items-center py-2">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors
                ${isActive ? 'text-accent-light' : 'text-[var(--text-muted)]'}
              `}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
