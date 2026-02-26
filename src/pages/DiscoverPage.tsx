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
    let isMounted = true;

    const fetchFavorites = async () => {
      try {
        if (!user) {
          if (isMounted) {
            setFavoritePets([]);
            setIsLoading(false);
          }
          return;
        }

        setIsLoading(true);
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            post_id,
            posts (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(2);

        if (error) throw error;

        if (isMounted && data) {
          const validPosts = data.map(f => f.posts).filter(p => p !== null) as any[];
          setFavoritePets(validPosts.map(post => ({
            id: post.id,
            name: post.nickname || '未知',
            breed: post.breed || '',
            location: post.location || '未知位置',
            time: formatTimeAgo(post.created_at),
            imageUrl: post.images && post.images.length > 0 ? post.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
            isUrgent: post.post_type === 'lost' || post.post_type === 'seek',
            reward: post.reward_amount ? `¥${post.reward_amount}` : undefined,
            postType: post.post_type,
            petType: post.pet_type
          })));
        }
      } catch (err) {
        console.warn('获取收藏列表失败:', err);
        // 如果失败，保证不抛出白屏，设置为空列表
        if (isMounted) setFavoritePets([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // 设置一个最多加载 5 秒的兜底，防止因为网络问题一直转圈
    const timeoutId = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn('请求超时，强制结束 loading...');
        setIsLoading(false);
      }
    }, 5000);

    fetchFavorites();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [user]);

  const [dogGuideCount, setDogGuideCount] = useState(0);
  const [catGuideCount, setCatGuideCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchGuideCounts = async () => {
      try {
        // 使用 Promise.allSettled 避免一个失败导致另一个也无法渲染
        const results = await Promise.allSettled([
          supabase.from('guides').select('*', { count: 'exact', head: true }).eq('category', 'dog').eq('status', '已发布'),
          supabase.from('guides').select('*', { count: 'exact', head: true }).eq('category', 'cat').eq('status', '已发布')
        ]);

        if (isMounted) {
          if (results[0].status === 'fulfilled' && results[0].value.count !== null) {
            setDogGuideCount(results[0].value.count);
          }
          if (results[1].status === 'fulfilled' && results[1].value.count !== null) {
            setCatGuideCount(results[1].value.count);
          }
        }
      } catch (error) {
        console.warn("获取指南数量失败:", error);
      }
    };

    fetchGuideCounts();
    return () => { isMounted = false; };
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
            <div
              onClick={() => navigate('/guides?type=dog')}
              className="bg-[#FFF5E5] dark:bg-[#3A2D1B] p-4 rounded-2xl relative overflow-hidden h-28 flex flex-col justify-between group active:scale-95 transition-transform cursor-pointer shadow-sm"
            >
              {/* Decorative Circle */}
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
              <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-amber-500/10 dark:bg-amber-500/5 rounded-full"></div>

              <div className="z-10">
                <div className="text-xl mb-2">🐶</div>
                <h3 className="text-[#8B5E34] dark:text-[#E6C37A] font-bold text-[15px] tracking-tight truncate">狗狗养宠指南</h3>
                <p className="text-[#A68A6B] dark:text-[#E6C37A]/70 text-[11px] mt-1 truncate">新手养狗必看攻略</p>
              </div>
            </div>

            <div
              onClick={() => navigate('/guides?type=cat')}
              className="bg-[#F0F5FF] dark:bg-[#1E2638] p-4 rounded-2xl relative overflow-hidden h-28 flex flex-col justify-between group active:scale-95 transition-transform cursor-pointer shadow-sm"
            >
              {/* Decorative Circle */}
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
              <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-blue-500/10 dark:bg-blue-500/5 rounded-full"></div>

              <div className="z-10">
                <div className="text-xl mb-2">🐱</div>
                <h3 className="text-[#3A5B8C] dark:text-[#7ABCE6] font-bold text-[15px] tracking-tight truncate">猫咪养宠指南</h3>
                <p className="text-[#6B8BA6] dark:text-[#7ABCE6]/70 text-[11px] mt-1 truncate">给主人的猫科秘籍</p>
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
