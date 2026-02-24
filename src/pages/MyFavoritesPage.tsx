import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark } from 'lucide-react';
import PetCard from '../components/PetCard';
import { MOCK_PETS } from '../data/mockData';

export default function MyFavoritesPage() {
    const navigate = useNavigate();
    // 模拟收藏数据，包含一条正常数据和一条模拟"已结案"的数据作为演示
    const [favorites, setFavorites] = useState([
        MOCK_PETS[0],
        { ...MOCK_PETS[1], isResolved: true } // 模拟添加已结案的标记
    ]);

    const removeFavorite = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        const confirmRemove = window.confirm('确认取消收藏该宠物吗？');
        if (confirmRemove) {
            setFavorites(prev => prev.filter(pet => pet.id !== id));
            // 真实项目中这里还会使用 Toast 动画
            alert('已取消收藏');
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
                {favorites.length > 0 ? (
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
