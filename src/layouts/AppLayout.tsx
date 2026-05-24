import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-[240px] p-8 max-w-[1440px] mx-auto w-full z-10 relative">
        <Outlet />
      </main>
    </div>
  );
}
