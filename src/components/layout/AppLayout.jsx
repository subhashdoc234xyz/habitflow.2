import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-accent-light/5 blur-[100px] mix-blend-screen" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-accent/5 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex flex-col w-full min-h-screen">
        <Sidebar />
        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="lg:ml-60 pb-16 lg:pb-0 min-h-screen flex flex-col">
          <TopBar onMenuToggle={() => setMobileMenuOpen(true)} />
          <main className="p-6 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
