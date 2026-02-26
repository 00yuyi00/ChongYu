import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, MapPin, Share2, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
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

export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [pet, setPet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPetData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        // 第一步：查帖子基本信息（不关联 profiles，避免 profiles RLS 导致整条查询失败）
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          console.warn('获取帖子失败:', error);
          setIsLoading(false);
          return;
        }

        // 第二步：单独查发布者资料（查询失败不影响帖子显示）
        const avatarColor = data.user_id ? data.user_id.replace(/-/g, '').slice(-6) : 'f59e0b';
        const fallbackName = '用户' + (data.user_id ? data.user_id.slice(0, 4) : '未知');
        let publisherInfo = { id: data.user_id, name: fallbackName, avatar: `https://ui-avatars.com/api/?name=U&background=${avatarColor}&color=fff`, verified: false };
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, name, avatar_url')
            .eq('id', data.user_id)
            .maybeSingle();
          if (profile) {
            publisherInfo = {
              id: profile.id,
              name: profile.name || fallbackName,
              avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'U')}&background=${avatarColor}&color=fff`,
              verified: true
            };
          }
        } catch (_) { /* 查不到资料也没关系 */ }

        setPet({
          id: data.id,
          name: data.nickname || '未知',
          breed: data.breed || '',
          location: data.location,
          time: formatTimeAgo(data.created_at),
          imageUrl: data.images && data.images.length > 0 ? data.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
          images: data.images || [],
          status: data.post_type,
          reward: data.reward_amount ? `¥${data.reward_amount}` : (data.post_type === 'seek' ? '详议' : undefined),
          description: data.description,
          publisher: publisherInfo,
          age: data.age || '未知',
          health: `${data.vaccine !== 'unknown' ? '已免疫 ' : ''}${data.sterilization !== 'unknown' ? '已绝育' : ''}`.trim() || '疫苗/驱虫请私聊确认',
          phone: user ? (data.phone || '未留电话') : '登录后可见',
          requirements: data.requirements || [],
          petType: data.pet_type
        });

        // 获取收藏状态
        if (user) {
          const { data: favData } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('post_id', data.id)
            .maybeSingle();
          setIsFavorite(!!favData);
        }
      } catch (err) {
        console.warn('详情页加载失败:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPetData();
  }, [id, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">未找到该宠物信息</p>
          <button onClick={() => navigate(-1)} className="text-amber-500 font-medium">返回上一页</button>
        </div>
      </div>
    );
  }

  const handleFavorite = async () => {
    if (!user) {
      alert("请先登录");
      navigate('/login');
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', pet.id);
      if (!error) setIsFavorite(false);
      else alert('取消收藏失败');
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: user.id, post_id: pet.id }]);
      if (!error) setIsFavorite(true);
      else alert('收藏失败，可能已收藏');
    }
  };

  const handleContact = () => {
    if (!user) {
      alert("请先登录");
      navigate('/login');
      return;
    }
    if (user.id === pet.publisher.id) {
      alert("不能自己联系自己哦");
      return;
    }
    navigate(`/chat/${pet.publisher.id}`);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-24 relative">
      <header className="px-4 py-4 bg-transparent absolute top-0 left-0 right-0 z-10 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </header>
      {/* Header Image */}
      <div className="relative h-96 w-full">
        <img
          src={pet.imageUrl}
          alt={pet.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-6 bg-zinc-50 dark:bg-zinc-900 rounded-t-3xl px-5 pt-8 space-y-6">
        {/* Header Info */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {(pet.status === 'adopt' ? pet.name : (pet.breed || pet.name)).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()（）！，。？：；“”‘’]/g, "").trim()}
              </h1>
              {pet.status === 'lost' || pet.status === 'seek' ? (
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-medium border border-red-200 dark:border-red-800">
                  {pet.status === 'lost' ? '紧急寻宠' : '我要寻宠'}
                </span>
              ) : pet.status === 'found' ? (
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium border border-blue-200 dark:border-blue-800">
                  {`谁丢的${pet.petType === 'dog' ? '狗' : pet.petType === 'cat' ? '猫' : '宠'}`}
                </span>
              ) : (
                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium border border-green-200 dark:border-green-800">
                  待领养
                </span>
              )}
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {pet.location} · {pet.time}
            </p>
          </div>
          {pet.reward && pet.status === 'seek' && (
            <div className="text-right">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">悬赏金</p>
              <p className="text-xl font-bold text-amber-500">{pet.reward}</p>
            </div>
          )}
        </div>

        {/* Tags/Attributes */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-100 dark:border-zinc-700/50 min-w-[80px] text-center shrink-0">
            <p className="text-xs text-zinc-400 mb-0.5">品种</p>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{pet.breed || '未知'}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-100 dark:border-zinc-700/50 min-w-[80px] text-center shrink-0">
            <p className="text-xs text-zinc-400 mb-0.5">年龄</p>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{pet.age}</p>
          </div>
          {pet.health && (
            <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-100 dark:border-zinc-700/50 min-w-[100px] text-center shrink-0">
              <p className="text-xs text-zinc-400 mb-0.5">健康状况</p>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate">{pet.health}</p>
            </div>
          )}
          {pet.phone && (
            <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-100 dark:border-zinc-700/50 min-w-[120px] text-center shrink-0">
              <p className="text-xs text-zinc-400 mb-0.5">联系电话</p>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 font-mono">{pet.phone}</p>
            </div>
          )}
        </div>

        {/* Requirements */}
        {pet.requirements && pet.requirements.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">核心要求</h2>
            <div className="flex flex-wrap gap-2">
              {pet.requirements.map((req: string) => (
                <span key={req} className="bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-medium border border-amber-100 dark:border-amber-800/50">
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Publisher */}
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-sm border border-zinc-100 dark:border-zinc-700/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={pet.publisher.avatar}
                alt={pet.publisher.name}
                className="w-10 h-10 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              {pet.publisher.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white dark:border-zinc-800">
                  <ShieldCheck className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{pet.publisher.name}</p>
              <p className="text-xs text-zinc-400">已实名认证</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">详细信息</h2>
          <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
            {pet.description || '无详细描述'}
          </p>
        </div>

        {/* Safety Tip */}
        <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl flex gap-3 items-start">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-300/80 leading-5">
            温馨提示：涉及金钱交易请务必谨慎，建议线下见面核实。如遇诈骗请立即举报。
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-4 px-6 flex items-center gap-4 z-20 max-w-md mx-auto">
        <button
          onClick={handleFavorite}
          className="flex flex-col items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="text-[10px]">收藏</span>
        </button>
        <button
          onClick={handleContact}
          className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold py-3 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-zinc-900/20"
        >
          <MessageCircle className="w-5 h-5" />
          立即联系
        </button>
      </div>
    </div>
  );
}
