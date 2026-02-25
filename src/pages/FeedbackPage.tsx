import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import { useAuth } from '../context/AuthContext';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [contact, setContact] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > 5) {
        alert('反馈图片最多上传5张');
        return;
      }
      setFiles([...files, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file as Blob));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      // 1. 上传图片
      const imageUrls: string[] = [];
      for (const file of files) {
        const url = await uploadImage(file, 'feedbacks');
        imageUrls.push(url);
      }

      // 2. 存入数据库
      const { error } = await supabase.from('feedbacks').insert({
        user_id: user?.id || null,
        content: `【联系方式：${contact}】\n\n${feedback}`,
        images: imageUrls,
        status: '待处理'
      });

      if (error) throw error;

      alert('感谢您的反馈！我们会尽快处理。');
      navigate(-1);
    } catch (err: any) {
      console.error('Feedback Error:', err);
      alert('提交失败: ' + (err.message || '网络错误'));
    } finally {
      setIsSubmitting(false);
    }
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              添加图片 (选填，最多5张)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {previews.map((preview, index) => (
                <div key={index} className="aspect-square relative group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl border border-zinc-200 dark:border-zinc-700" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <label className="aspect-square bg-white dark:bg-zinc-800 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-700 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors group relative">
                  <Upload className="text-zinc-400 group-hover:text-amber-500 w-6 h-6 transition-colors" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!feedback.trim() || isSubmitting}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold rounded-full shadow-lg shadow-amber-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {isSubmitting ? '提交中...' : '提交反馈'}
          </button>
        </form>
      </main>
    </div>
  );
}
