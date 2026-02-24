import React from 'react';
import { Settings, ChevronRight, FileText, Heart, HelpCircle, LogOut, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto relative min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-24">
      <header className="bg-white dark:bg-zinc-900 px-6 py-8 pb-6 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">我的</h1>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Settings className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        <div className="flex items-center gap-4" onClick={() => navigate('/profile/edit')}>
          <div className="relative cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden ring-4 ring-white dark:ring-zinc-800 shadow-sm">
              <img
                src={user?.avatar || "https://i.pravatar.cc/150?u=user"}
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="cursor-pointer">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">{user?.name || '未登录用户'}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">ID: 8839201</p>
          </div>
        </div>

      </header>

      <main className="px-4 space-y-4">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-700/50">
          <button onClick={() => navigate('/profile/posts')} className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors border-b border-zinc-100 dark:border-zinc-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">我的发布</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </button>
          <button onClick={() => navigate('/profile/favorites')} className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors border-b border-zinc-100 dark:border-zinc-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
                <Heart className="w-5 h-5" />
              </div>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">我的收藏</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </button>
          <button onClick={() => navigate('/profile/applications')} className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                <User className="w-5 h-5" />
              </div>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">我的申请</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-700/50">
          <button
            onClick={() => navigate('/feedback')}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors border-b border-zinc-100 dark:border-zinc-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">帮助与反馈</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-zinc-500">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">退出登录</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </main>
    </div>
  );
}
