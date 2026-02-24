import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Bell, Lock, Eye, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-24">
      <header className="px-4 py-4 bg-white dark:bg-zinc-900 sticky top-0 z-10 flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
        </button>
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">设置</h1>
      </header>

      <main className="p-4 space-y-6">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-700/50">
          <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-zinc-500" />
              <span className="font-medium text-zinc-900 dark:text-zinc-100">消息通知</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-zinc-500" />
              <span className="font-medium text-zinc-900 dark:text-zinc-100">账号与安全</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-700/50">
          <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-zinc-500" />
              <span className="font-medium text-zinc-900 dark:text-zinc-100">隐私设置</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-zinc-500" />
              <span className="font-medium text-zinc-900 dark:text-zinc-100">清理缓存</span>
            </div>
            <span className="text-xs text-zinc-400">128MB</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full py-4 bg-white dark:bg-zinc-800 text-red-500 font-bold rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </button>

        <div className="text-center text-xs text-zinc-400 mt-8">
          <p>当前版本 v1.0.0</p>
          <p className="mt-1">© 2024 PetAdoption. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
