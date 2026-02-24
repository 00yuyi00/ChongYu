import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, MessageCircle, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800 px-6 py-2 pb-6 flex justify-between items-center z-50">
      <Link to="/" className="flex flex-col items-center gap-1 group">
        <Home
          className={cn(
            "w-6 h-6 transition-colors",
            isActive('/') ? "text-amber-500 fill-amber-500/20" : "text-zinc-400"
          )}
        />
        <span className={cn(
          "text-[10px] font-medium transition-colors",
          isActive('/') ? "text-amber-500" : "text-zinc-400"
        )}>
          首页
        </span>
      </Link>

      <Link to="/discover" className="flex flex-col items-center gap-1 group">
        <Compass
          className={cn(
            "w-6 h-6 transition-colors",
            isActive('/discover') ? "text-amber-500 fill-amber-500/20" : "text-zinc-400"
          )}
        />
        <span className={cn(
          "text-[10px] font-medium transition-colors",
          isActive('/discover') ? "text-amber-500" : "text-zinc-400"
        )}>
          发现
        </span>
      </Link>

      <div className="relative -top-6">
        <Link to="/publish" className="w-14 h-14 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40 border-4 border-white dark:border-zinc-900 active:scale-95 transition-transform">
          <Plus className="w-8 h-8" />
        </Link>
      </div>

      <Link to="/messages" className="flex flex-col items-center gap-1 group">
        <MessageCircle
          className={cn(
            "w-6 h-6 transition-colors",
            isActive('/messages') ? "text-amber-500 fill-amber-500/20" : "text-zinc-400"
          )}
        />
        <span className={cn(
          "text-[10px] font-medium transition-colors",
          isActive('/messages') ? "text-amber-500" : "text-zinc-400"
        )}>
          消息
        </span>
      </Link>

      <Link to="/profile" className="flex flex-col items-center gap-1 group">
        <User
          className={cn(
            "w-6 h-6 transition-colors",
            isActive('/profile') ? "text-amber-500 fill-amber-500/20" : "text-zinc-400"
          )}
        />
        <span className={cn(
          "text-[10px] font-medium transition-colors",
          isActive('/profile') ? "text-amber-500" : "text-zinc-400"
        )}>
          我的
        </span>
      </Link>
    </nav>
  );
}
