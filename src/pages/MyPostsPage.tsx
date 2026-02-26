import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Edit3, CheckCircle, FileText, Loader2 } from 'lucide-react';
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

export default function MyPostsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'all' | 'seek' | 'found' | 'adopt'>('all');
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchMyPosts = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setPosts(data.map(post => ({
                    id: post.id,
                    name: post.nickname || '未知',
                    breed: post.breed || '',
                    location: post.location,
                    time: formatTimeAgo(post.created_at),
                    imageUrl: post.images && post.images.length > 0 ? post.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
                    postStatus: post.status,
                    postType: post.post_type,
                    reward: post.reward_amount ? `¥${post.reward_amount}` : undefined
                })));
            }
            setIsLoading(false);
        };
        fetchMyPosts();
    }, [user]);

    const handleFinish = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('确认该帖已解决并下架吗？')) {
            const { error } = await supabase.from('posts').update({ status: '已结案' }).eq('id', id);
            if (!error) {
                setPosts(prev => prev.map(p => p.id === id ? { ...p, postStatus: '已结案' } : p));
            } else {
                alert('操作失败');
            }
        }
    };

    const filteredPosts = posts.filter(p => activeTab === 'all' || p.postType === activeTab);

    const tabs = [
        { id: 'all', label: '全部' },
        { id: 'seek', label: '寻宠' },
        { id: 'found', label: '捡到' },
        { id: 'adopt', label: '送养' },
    ] as const;

    return (
        <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-24 relative flex flex-col">
            <header className="px-5 pt-4 pb-2 bg-white dark:bg-zinc-900 sticky top-0 z-30 shadow-sm border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-center mb-4 relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-0 p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                    </button>
                    <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">我的发布</h1>
                </div>

                {/* Tabs */}
                <div className="flex justify-between items-center -mx-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                                ? 'border-amber-500 text-amber-500'
                                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            <main className="flex-1 p-4">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <div className="space-y-4">
                        {filteredPosts.map(post => (
                            <div
                                key={post.id}
                                className="bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-700/50"
                            >
                                <div className="flex gap-4 cursor-pointer active:scale-95 transition-transform" onClick={() => navigate(`/detail/${post.id}`)}>
                                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
                                        <img src={post.imageUrl} alt={post.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate pr-2">
                                                    {(post.postType === 'adopt' ? post.name : (post.breed || post.name)).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()（）！，。？：；“”‘’]/g, "").trim()}
                                                </h3>
                                                <span className={`text-xs px-2 py-0.5 rounded focus:outline-none shrink-0 ${post.postStatus === '展示中' ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' :
                                                    post.postStatus === '审核中' ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                                                        post.postStatus === '被驳回' ? 'text-red-500 bg-red-50 dark:bg-red-900/20' :
                                                            post.postStatus === '已结案' ? 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800' :
                                                                'text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50'
                                                    }`}>
                                                    {post.postStatus}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-zinc-400 text-xs mt-1">
                                                <MapPin className="w-3 h-3 mr-1 shrink-0" />
                                                <span className="truncate">{post.location}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-zinc-400 text-xs mt-2">
                                            <Clock className="w-3 h-3 mr-1 shrink-0" />
                                            <span>发布于 {post.time}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 专属操作栏 */}
                                {post.postStatus !== '已下架' && post.postStatus !== '已结案' && (
                                    <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-700/50">
                                        <button
                                            onClick={(e) => handleFinish(e, post.id)}
                                            className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-500 text-sm font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            结束展示
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-[50vh] flex flex-col items-center justify-center space-y-4">
                        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-sm">
                            <FileText className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <p className="text-zinc-400 font-medium">还没有发布过该类型的内容</p>
                    </div>
                )}
            </main>
        </div>
    );
}
