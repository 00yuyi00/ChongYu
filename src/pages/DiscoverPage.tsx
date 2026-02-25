import React, { useState, useEffect } from 'react';
import { ChevronRight, Bookmark, BookOpen, Compass, Loader2, Heart } from 'lucide-react';
import PetCard from '../components/PetCard';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Helper for formatting time
const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  return `${days}天前`;
};

export default function DiscoverPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favoritePets, setFavoritePets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 真实查询当前用户的收藏帖子 (最多展示前两位)
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      if (!user) {
        setFavoritePets([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          post_id,
          posts (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(2);

      if (!error && data) {
        const validPosts = data.map(f => f.posts).filter(p => p !== null) as any[];
        setFavoritePets(validPosts.map(post => ({
          id: post.id,
          name: post.title.split(' ')[0] || post.title,
          breed: post.title.split(' ').length > 1 ? post.title.split(' ')[1] : '',
          location: post.location,
          time: formatTimeAgo(post.created_at),
          imageUrl: post.images && post.images.length > 0 ? post.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
          isUrgent: post.post_type === 'lost',
          reward: post.post_type === 'lost' ? '详议' : undefined,
          status: post.status
        })));
      }
      setIsLoading(false);
    };

    fetchFavorites();
  }, [user]);

  const [dogGuideCount, setDogGuideCount] = useState(0);
  const [catGuideCount, setCatGuideCount] = useState(0);

  useEffect(() => {
    const fetchGuideCounts = async () => {
      const [{ count: dogCount }, { count: catCount }] = await Promise.all([
        supabase.from('guides').select('*', { count: 'exact', head: true }).eq('category', 'dog').eq('status', '已发布'),
        supabase.from('guides').select('*', { count: 'exact', head: true }).eq('category', 'cat').eq('status', '已发布')
      ]);

      if (dogCount !== null) setDogGuideCount(dogCount);
      if (catCount !== null) setCatGuideCount(catCount);
    };

    fetchGuideCounts();
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-24 relative flex flex-col">
      <header className="pt-12 px-5 pb-4 bg-white dark:bg-zinc-900 sticky top-0 z-30">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">发现</h1>
      </header>

      <main className="px-5 space-y-8">
        {/* My Favorites */}
        <section>
          <div
            onClick={() => navigate('/profile/favorites')}
            className="flex justify-between items-center mb-4 cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">我的收藏 ({favoritePets.length})</h2>
            </div>
            <div className="text-zinc-400 group-hover:text-amber-500 transition-colors flex items-center">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

          {isLoading ? (
            <div className="h-48 flex justify-center items-center">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          ) : favoritePets.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5">
              {favoritePets.map(pet => (
                <div key={pet.id} className="w-72 shrink-0">
                  <PetCard {...pet} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-800 rounded-2xl py-12 flex flex-col items-center justify-center space-y-4 shadow-sm border border-zinc-100 dark:border-zinc-700/50">
              <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-full">
                <Bookmark className="text-zinc-300 dark:text-zinc-600 w-10 h-10" />
              </div>
              <div className="text-center">
                <h3 className="text-zinc-600 dark:text-zinc-300 font-medium mb-1">暂无收藏的毛孩子</h3>
                <p className="text-zinc-400 dark:text-zinc-500 text-[13px]">去主页看看有没有合眼缘的吧~</p>
              </div>
            </div>
          )}
        </section>

        {/* Pet Guides */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">养宠指南</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FFF9E6] dark:bg-[#2C281A] p-5 rounded-3xl relative overflow-hidden h-44 flex flex-col justify-between group active:scale-95 transition-transform cursor-pointer shadow-sm">
              <div className="z-10">
                <h3 className="text-[#8B6E2F] dark:text-[#E6C37A] font-bold text-lg">狗狗养宠指南</h3>
                <p className="text-[#8B6E2F]/70 dark:text-[#E6C37A]/70 text-xs mt-1">新手养狗必看攻略</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-40 group-hover:scale-110 transition-transform">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXOLyeGqouUYyYqwbv58AlbXH6jKbXxqeiuAdH60GJE05wDKxVR5dyaSoopJdkDG38DkC9ZFNi9ikeHDlDEqqYxbqyRWoWC9_MYWEDzHrNE0iQx7CFzenODKD6pidPHw2hq4Xb3AZRck20sIuR6DFz8pEPtt2mCYNoPvz3sninkrlWwnQDVg37kSMAURxgYqVvaiLtLbAg1gcbxfta2toaBqim-boIZLrlfzavpd_22n7v9Fh9QA8DxDVjC2E7R-SjNZNeGx04YvsV"
                  alt="Dog Icon"
                  className="w-24 h-24"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="z-10 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-[#8B6E2F] dark:text-[#E6C37A]" />
                <span className="text-[10px] text-[#8B6E2F] dark:text-[#E6C37A] font-medium">{dogGuideCount} 篇文章</span>
              </div>
            </div>
            <div className="bg-[#E6F4FF] dark:bg-[#1A232E] p-5 rounded-3xl relative overflow-hidden h-44 flex flex-col justify-between group active:scale-95 transition-transform cursor-pointer shadow-sm">
              <div className="z-10">
                <h3 className="text-[#2F658B] dark:text-[#7ABCE6] font-bold text-lg">猫咪养宠指南</h3>
                <p className="text-[#2F658B]/70 dark:text-[#7ABCE6]/70 text-xs mt-1">给主人的猫科秘籍</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-40 group-hover:scale-110 transition-transform">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA25y-51bOL1YZ_Je3bd9V00W10h4AEhygR7-4CylWLwUXBvMSNX4b9X8SgZfIgvVlz_ON-3Vbqr4xcrJhgaPURwQ8npeTel3Jo9Dmv1CYiGt_8yBHRIh1rMf-Q9MTmygxm7Qlr75RkJa0fdg0aPTbTCffO7zL4TcS78s6Mmj523lknsk3yGYwrFbQRApk4Ht2_-IlPkjqEgZWbSuhBhVPsmfg1MLlTfrllYsI_mvPqHTvTWFyRsh9FhOfaYQUJ1bDas__VYI3A9M6K"
                  alt="Cat Icon"
                  className="w-24 h-24"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="z-10 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-[#2F658B] dark:text-[#7ABCE6]" />
                <span className="text-[10px] text-[#2F658B] dark:text-[#7ABCE6] font-medium">{catGuideCount} 篇文章</span>
              </div>
            </div>
          </div>
        </section>

        {/* Explore More Placeholder */}
        <section className="pt-4">
          <div
            onClick={() => alert('该功能还在努力开发中，敬请期待！')}
            className="bg-white dark:bg-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer active:scale-[0.98] transition-all border border-zinc-100 dark:border-zinc-700/50 hover:border-amber-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Compass className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">探索更多</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">线下活动、周边商城等</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
          </div>
        </section>
      </main>
    </div>
  );
}
