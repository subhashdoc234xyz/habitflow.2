import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Dynamic Floating Nebula Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="floating-orb floating-orb-1 -top-[10%] -left-[10%] w-[600px] h-[600px]" />
        <div className="floating-orb floating-orb-2 top-[30%] -right-[10%] w-[500px] h-[500px]" />
        <div className="floating-orb floating-orb-3 -bottom-[10%] left-[25%] w-[700px] h-[700px]" />
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
