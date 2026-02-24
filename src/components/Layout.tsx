import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      <Outlet />
      <BottomNav />
    </div>
  );
}
