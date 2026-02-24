import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    // Simulate API call
    setTimeout(() => {
      alert('感谢您的反馈！我们会尽快处理。');
      navigate(-1);
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-24 relative">
      <header className="px-4 py-4 bg-white dark:bg-zinc-900 sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
        </button>
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">意见反馈</h1>
      </header>

      <main className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              问题描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="请详细描述您遇到的问题或建议..."
              className="w-full h-40 p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              联系方式 (选填)
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="手机号 / 邮箱 / 微信号"
              className="w-full p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
          </div>

          <button
            type="submit"
            disabled={!feedback.trim()}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold rounded-full shadow-lg shadow-amber-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            提交反馈
          </button>
        </form>
      </main>
    </div>
  );
}
