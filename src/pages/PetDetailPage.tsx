import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, MapPin, Share2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { MOCK_PETS } from '../data/mockData';

export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const pet = MOCK_PETS.find(p => p.id === id);

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">未找到该宠物信息</p>
          <button onClick={() => navigate('/')} className="text-amber-500 font-medium">返回首页</button>
        </div>
      </div>
    );
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would call an API
    const msg = !isFavorite ? '已添加到收藏' : '已取消收藏';
    // Simple toast replacement
    alert(msg);
  };

  const handleContact = () => {
    navigate('/chat');
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
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{pet.name}</h1>
              {pet.status === 'lost' ? (
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-medium border border-red-200 dark:border-red-800">
                  寻宠中
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
          {pet.reward && (
            <div className="text-right">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">悬赏金</p>
              <p className="text-xl font-bold text-amber-500">{pet.reward}</p>
            </div>
          )}
        </div>

        {/* Tags/Attributes */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-100 dark:border-zinc-700/50 min-w-[80px] text-center">
            <p className="text-xs text-zinc-400 mb-0.5">品种</p>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{pet.breed}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-100 dark:border-zinc-700/50 min-w-[80px] text-center">
            <p className="text-xs text-zinc-400 mb-0.5">年龄</p>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{pet.age || '未知'}</p>
          </div>
          {pet.health && (
            <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-100 dark:border-zinc-700/50 min-w-[80px] text-center">
              <p className="text-xs text-zinc-400 mb-0.5">健康</p>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{pet.health}</p>
            </div>
          )}
        </div>

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
            {pet.description}
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
