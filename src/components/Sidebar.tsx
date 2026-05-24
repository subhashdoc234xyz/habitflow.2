import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, ListTodo, Target, Calendar, BarChart2, Star, Settings } from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/habits', icon: CheckSquare, label: 'Habits' },
  { path: '/todos', icon: ListTodo, label: "Today's Focus" },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/insights', icon: BarChart2, label: 'Insights' },
  { path: '/review', icon: Star, label: 'Review' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <div className="fixed left-0 top-0 w-[240px] h-screen bg-white/50 backdrop-blur-[28px] backdrop-saturate-200 border-r border-white/80 shadow-[4px_0_24px_rgba(139,92,246,0.08)] p-6 pt-8 flex flex-col gap-1 z-50">
      <div className="mb-8 pl-2">
        <h1 className="text-[22px] font-extrabold bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] bg-clip-text text-transparent">
          HabitFlow
        </h1>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 px-3.5 py-2.5 rounded-[14px] text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-br from-violet-600/15 to-indigo-500/10 border border-violet-600/25 text-[#6d28d9] font-bold shadow-[0_2px_12px_rgba(124,58,237,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] relative"
                    : "text-gray-500 hover:bg-violet-600/10 hover:text-[#7c3aed]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-[20%] h-[60%] w-[3px] rounded-r-[3px] bg-gradient-to-b from-[#7c3aed] to-[#4f46e5]" />
                  )}
                  <Icon className="w-5 h-5" />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
