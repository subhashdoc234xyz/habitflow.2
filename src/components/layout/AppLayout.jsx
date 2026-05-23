import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Subtle Animated Gradient Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-15">
        <div className="absolute -top-[10%] -left-[10%] w-[550px] h-[550px] rounded-full bg-[#7C3AED] blur-[120px] animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[450px] h-[450px] rounded-full bg-[#3B82F6] blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex min-h-screen w-full">
        <Sidebar />
        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col min-h-screen min-w-0 pb-16 lg:pb-0">
          <TopBar onMenuToggle={() => setMobileMenuOpen(true)} />
          <main className="p-6 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
