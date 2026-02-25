import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Loader2 } from 'lucide-react';
import PetCard from '../components/PetCard';
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

export default function MyFavoritesPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            setIsLoading(true);
            if (!user) {
                setFavorites([]);
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
                .order('created_at', { ascending: false });

            if (!error && data) {
                const validPosts = data.map(f => f.posts).filter(p => p !== null) as any[];
                setFavorites(validPosts.map(post => ({
                    id: post.id,
                    name: post.title.split(' ')[0] || post.title,
                    breed: post.title.split(' ').length > 1 ? post.title.split(' ')[1] : '',
                    location: post.location,
                    time: formatTimeAgo(post.created_at),
                    imageUrl: post.images && post.images.length > 0 ? post.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
                    isResolved: post.status === '已结案'
                })));
            }
            setIsLoading(false);
        };
        fetchFavorites();
    }, [user]);

    const removeFavorite = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        const confirmRemove = window.confirm('确认取消收藏该宠物吗？');
        if (confirmRemove && user) {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('post_id', id);

            if (!error) {
                setFavorites(prev => prev.filter(pet => pet.id !== id));
            } else {
                alert('取消收藏失败，请稍后重试');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-24 relative flex flex-col">
            <header className="px-5 py-4 bg-white dark:bg-zinc-900 sticky top-0 z-30 flex items-center justify-center border-b border-zinc-100 dark:border-zinc-800">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                </button>
                <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">我的收藏</h1>
            </header>

            <main className="flex-1 p-5">
                {isLoading ? (
                    <div className="h-[60vh] flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="space-y-6">
                        {favorites.map(pet => (
                            <div key={pet.id} className="relative group cursor-pointer" onClick={() => navigate(`/detail/${pet.id}`)}>
                                <div className={pet.isResolved ? 'opacity-50 grayscale transition-all' : ''}>
                                    <PetCard {...pet} />
                                </div>

                                {/* 状态角标防迷路 */}
                                {pet.isResolved && (
                                    <div className="absolute top-4 right-4 bg-zinc-900/60 backdrop-blur-md text-white text-xs px-3 py-1 font-bold rounded-full border border-white/20 shadow-xl z-20">
                                        已结案
                                    </div>
                                )}

                                {/* 取消收藏动作 */}
                                <button
                                    onClick={(e) => removeFavorite(e, pet.id)}
                                    className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg shadow-amber-500/10 border border-zinc-100 dark:border-zinc-800 z-20 active:scale-90 transition-transform hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                >
                                    <svg className="w-5 h-5 text-amber-500 fill-amber-500" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
                        <div className="w-32 h-32 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-sm">
                            <Bookmark className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium">暂无收藏的毛孩子</h3>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">去首页逛逛，遇见心仪的 TA 吧</p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-6 bg-amber-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-amber-500/30 active:scale-95 transition-transform"
                        >
                            去首页逛逛
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
