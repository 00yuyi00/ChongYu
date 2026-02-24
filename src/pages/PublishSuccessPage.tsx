import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Home, FileText } from 'lucide-react';

export default function PublishSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col relative pb-24">
      <header className="flex items-center justify-center px-4 py-4 sticky top-0 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md z-10">
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">发布成功</h1>
      </header>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between relative">
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center text-sm font-bold">1</div>
            <span className="text-xs mt-1 text-zinc-400">基本信息</span>
          </div>
          <div className="flex-1 h-[2px] bg-zinc-200 dark:bg-zinc-800 -mt-5 mx-2"></div>
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-xs mt-1 text-zinc-400">签署协议</span>
          </div>
          <div className="flex-1 h-[2px] bg-zinc-200 dark:bg-zinc-800 -mt-5 mx-2"></div>
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-amber-500/30">3</div>
            <span className="text-xs mt-1 text-amber-500 font-medium">发布成功</span>
          </div>
        </div>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center px-5 pb-20">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
          <Check className="w-12 h-12 text-green-500" />
        </div>

        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">发布成功！</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-center mb-10 max-w-xs">
          您的信息已提交审核，审核通过后将立即展示在首页。
        </p>

        <div className="w-full space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 px-6 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-full py-4 px-6 rounded-2xl bg-amber-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-colors"
          >
            <FileText className="w-5 h-5" />
            查看我的发布
          </button>
        </div>
      </main>
    </div>
  );
}
