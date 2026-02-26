import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://i.pravatar.cc/150?u=user');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bio, setBio] = useState(user?.bio || '热爱生活，热爱宠物。');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user || isSaving) return;

    try {
      setIsSaving(true);
      let finalAvatarUrl = avatar;

      // 1. 如果有新选择的文件，先上传
      if (avatarFile) {
        finalAvatarUrl = await uploadImage(avatarFile, 'avatars');
      }

      // 2. 更新数据库
      const { error } = await supabase
        .from('profiles')
        .update({
          name: name,
          avatar_url: finalAvatarUrl,
          bio: bio
        })
        .eq('id', user.id);

      if (error) throw error;

      // 3. 提示并返回
      alert('个人资料已成功保存！');
      navigate(-1);
    } catch (err: any) {
      console.error('Update Profile Error:', err);
      alert('保存失败: ' + (err.message || '网络错误'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-24 shadow-sm">
        <header className="px-4 py-4 bg-white dark:bg-zinc-900 sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">编辑资料</h1>
          <button
            onClick={handleSave}
            className="p-2 -mr-2 text-amber-500 font-bold hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-full transition-colors"
          >
            <Check className="w-6 h-6" />
          </button>
        </header>

        <main className="p-6 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-lg">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">点击更换头像</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                昵称
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                个人简介
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={100}
                rows={3}
                className="w-full p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
              />
              <div className="text-right text-xs text-zinc-400">
                {bio.length}/100
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
