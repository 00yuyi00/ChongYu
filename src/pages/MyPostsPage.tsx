import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Edit3, CheckCircle, FileText } from 'lucide-react';
import { MOCK_PETS } from '../data/mockData';

export default function MyPostsPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found' | 'adopt'>('all');

    // 模拟"我的发布"专属数据
    const [posts, setPosts] = useState(MOCK_PETS.map((pet, idx) => ({
        ...pet,
        postStatus: idx === 0 ? '展示中' : idx === 1 ? '审核中' : (idx === 2 ? '被驳回' : '展示中'),
        postType: idx % 3 === 0 ? 'lost' : idx % 3 === 1 ? 'found' : 'adopt'
    })));

    const handleFinish = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('确认该帖已解决并下架吗？')) {
            setPosts(prev => prev.map(p => p.id === id ? { ...p, postStatus: '已结案' } : p));
        }
    };

    const filteredPosts = posts.filter(p => activeTab === 'all' || p.postType === activeTab);

    const tabs = [
        { id: 'all', label: '全部' },
        { id: 'lost', label: '寻宠' },
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
                {filteredPosts.length > 0 ? (
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
                                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate pr-2">{post.name}, {post.breed}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded focus:outline-none shrink-0 ${post.postStatus === '展示中' ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' :
                                                        post.postStatus === '审核中' ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                                                            post.postStatus === '被驳回' ? 'text-red-500 bg-red-50 dark:bg-red-900/20' :
                                                                'text-zinc-500 bg-zinc-100 dark:bg-zinc-800'
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
                                {post.postStatus !== '已结案' && (
                                    <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-700/50">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigate('/publish'); }} // Mock edit
                                            className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            修改信息
                                        </button>
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
