import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Bell, Loader2 } from 'lucide-react';
import PetCard from '../components/PetCard';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Helper for formatting time
const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  return `${days}天前`;
};

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'adopt' | 'lost'>('adopt');
  const [activeCategory, setActiveCategory] = useState<'all' | 'dog' | 'cat'>('all');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [pets, setPets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New features state
  const [showCitySheet, setShowCitySheet] = useState(false);
  const [currentCity, setCurrentCity] = useState('上海市');
  const [unreadCount] = useState(2); // Mock unread messages count

  // Fetch real data from supabase
  useEffect(() => {
    let isMounted = true;

    const fetchPets = async () => {
      try {
        setIsLoading(true);
        let query = supabase.from('posts').select('*').eq('status', '展示中');

        // Filter by category
        if (activeCategory !== 'all') {
          query = query.eq('pet_type', activeCategory);
        }

        // Filter by tab
        if (activeTab === 'adopt') {
          query = query.eq('post_type', 'adopt');
        } else {
          query = query.in('post_type', ['seek', 'found']);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        if (isMounted && data) {
          setPets(data.map(post => {
            return {
              id: post.id,
              name: post.nickname || '宠物',
              breed: post.breed || '',
              location: post.location || '未知位置',
              time: formatTimeAgo(post.created_at),
              imageUrl: post.images && post.images.length > 0 ? post.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
              isUrgent: post.post_type === 'lost' || post.post_type === 'seek',
              reward: post.reward_amount ? `¥${post.reward_amount}` : undefined,
              postType: post.post_type,
              petType: post.pet_type
            };
          }));
        }
      } catch (err) {
        console.warn('获取主页宠物数据失败:', err);
        if (isMounted) setPets([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // 5秒超时兜底，防止网络太差导致一直转圈
    const timeoutId = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn('请求超时，强制结束 loading...');
        setIsLoading(false);
      }
    }, 5000);

    fetchPets();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [activeTab, activeCategory]);

  // Banner Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % 2);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleBannerClick = (index: number) => {
    if (index === 0) {
      // Banner 1: Urgent Search -> Lost Pets
      setActiveTab('seek');
      // In a real app, we might also sort by time or filter by urgent
    } else {
      // Banner 2: Daily Recommendation -> Guide Detail
      navigate('/discover'); // Or specific guide page
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-zinc-900 relative flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="relative z-50">
            <div
              onClick={() => setShowCitySheet(!showCitySheet)}
              className="flex items-center gap-1 font-medium text-zinc-900 dark:text-zinc-100 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-lg">{currentCity}</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showCitySheet ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {showCitySheet && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowCitySheet(false)} />
                <div className="absolute top-full left-0 mt-3 w-36 bg-[#2c2c2e] dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 border border-white/10">
                  {['北京市', '上海市', '广州市', '深圳市', '成都市'].map((city) => (
                    <button
                      key={city}
                      onClick={() => { setCurrentCity(city); setShowCitySheet(false); }}
                      className={`w-full text-left px-5 py-3.5 text-[15px] transition-colors ${currentCity === city
                        ? 'text-white bg-white/10'
                        : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex-1 mx-4">
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-2 flex items-center gap-2 transition-colors focus-within:ring-2 focus-within:ring-amber-500/20">
              <Search className="w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="搜索猫猫狗狗、品种..."
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100 p-0"
              />
            </div>
          </div>

          <button
            onClick={() => navigate('/messages')}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
          >
            <Bell className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
            )}
          </button>
        </div>

        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 mb-4">
          <button
            onClick={() => setActiveTab('adopt')}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'adopt'
              ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
          >
            领养中心
          </button>
          <button
            onClick={() => setActiveTab('seek')}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'seek'
              ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
          >
            寻宠启事
          </button>
        </div>

        <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar pb-2">
          {['全部', '狗狗', '猫咪'].map((cat) => {
            const id = cat === '全部' ? 'all' : cat === '狗狗' ? 'dog' : 'cat';
            const isActive = activeCategory === id;
            return (
              <button
                key={id}
                onClick={() => setActiveCategory(id as 'all' | 'dog' | 'cat')}
                className={`px-6 py-1.5 rounded-full text-sm font-medium shrink-0 transition-colors ${isActive
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </header>

      <main className="px-4 space-y-4 pb-24">
        {/* Banner Carousel */}
        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden group cursor-pointer shadow-md">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {/* Banner 1 */}
            <div className="w-full h-full shrink-0 relative" onClick={() => handleBannerClick(0)}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRsrw1jWmiG1zU1t7fQh3lvdgnlfAPlfoBCZw_O0XBp2d9BA514ASiFOLvFMt0tp-QipwJn4tvhdKtRDmF7py-Qz0miRxmqmoU115Zcn2wQWh96rU0_cMKFco1XkMEAreLuXUpH1BWBWgkAEYKQWefuRmgAUWu6fdBulVA460CHaVB8Avo-fyHQvcRBv8e6o3mT7td902bLt2hn55p5NavK9BusgJvRZTWh_2q0tHbDjEImqWRwloVXW8Jn64N7xNrCPs4Km7Efn97"
                alt="Lost Golden Retriever"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <div className="bg-amber-500/90 backdrop-blur-sm self-start px-3 py-1 rounded-md mb-2 shadow-lg shadow-amber-500/20">
                  <span className="text-white text-xs font-bold tracking-wider">紧急搜寻</span>
                </div>
                <p className="text-white font-bold text-lg leading-tight drop-shadow-md">帮助寻找静安区走失的狗狗！</p>
              </div>
            </div>

            {/* Banner 2 */}
            <div className="w-full h-full shrink-0 relative" onClick={() => handleBannerClick(1)}>
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800"
                alt="Pet Guide"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <div className="bg-blue-500/90 backdrop-blur-sm self-start px-3 py-1 rounded-md mb-2 shadow-lg shadow-blue-500/20">
                  <span className="text-white text-xs font-bold tracking-wider">每日推荐</span>
                </div>
                <p className="text-white font-bold text-lg leading-tight drop-shadow-md">新手养狗必看：如何快速建立信任？</p>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="absolute bottom-2 right-4 flex gap-1.5">
            {[0, 1].map((idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${currentBanner === idx ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          ) : pets.length > 0 ? (
            pets.map((pet) => (
              <PetCard
                key={pet.id}
                id={pet.id}
                name={pet.name}
                breed={pet.breed}
                location={pet.location}
                time={pet.time}
                imageUrl={pet.imageUrl}
                reward={pet.reward}
                isUrgent={pet.isUrgent}
                postType={pet.postType}
                petType={pet.petType}
              />
            ))
          ) : (
            <div className="text-center py-10 text-zinc-400">
              <p>暂无相关数据</p>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
