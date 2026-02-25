import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Helper for formatting time
const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    return `${days}天前`;
};

export default function MyApplicationsPage() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 此时数据库暂未实现真实的“申请表”，我们简单按时间正序取前3条帖子数据作为演示记录
    useEffect(() => {
        const fetchApplications = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: true }) // 老的帖子
                .limit(3);

            if (!error && data) {
                const statuses = [
                    { status: '对待沟通 / 审核中', statusClass: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30' },
                    { status: '已同意', statusClass: 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30' },
                    { status: '已婉拒', statusClass: 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700' }
                ];

                setApplications(data.map((post, idx) => ({
                    id: `app-${post.id}`,
                    pet: {
                        id: post.id,
                        name: post.title.split(' ')[0] || post.title,
                        imageUrl: post.images && post.images.length > 0 ? post.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
                    },
                    status: statuses[idx % 3].status,
                    time: formatTimeAgo(post.created_at),
                    statusClass: statuses[idx % 3].statusClass
                })));
            }
            setIsLoading(false);
        };
        fetchApplications();
    }, []);

    return (
        <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-24 relative flex flex-col">
            <header className="px-5 py-4 bg-white dark:bg-zinc-900 sticky top-0 z-30 flex items-center justify-center border-b border-zinc-100 dark:border-zinc-800 shadow-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                </button>
                <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">我的申请</h1>
            </header>

            <main className="flex-1 p-4 space-y-4 mt-2">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    </div>
                ) : applications.length > 0 ? (
                    applications.map(app => (
                        <div
                            key={app.id}
                            onClick={() => alert('快照查看功能开发中...')} // 查看表单快照交互
                            className="bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-700/50 cursor-pointer active:scale-[0.98] transition-all group hover:border-amber-500/30"
                        >
                            <div className="flex justify-between items-start mb-4 pb-3 border-b border-zinc-50 dark:border-zinc-700/50">
                                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>提交于 {app.time}</span>
                                </div>
                                <span className={`text-[11px] px-2 py-0.5 rounded border font-bold ${app.statusClass}`}>
                                    {app.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={app.pet.imageUrl}
                                        alt={app.pet.name}
                                        className="w-12 h-12 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-900"
                                        referrerPolicy="no-referrer"
                                    />
                                    <div>
                                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">申请领养：{app.pet.name}</h4>
                                        <p className="text-xs text-zinc-400 mt-1 line-clamp-1">点击查看我当时填写的申请表单</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-300 dark:text-zinc-600 group-hover:text-amber-500 transition-colors" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-[50vh] flex flex-col items-center justify-center space-y-4">
                        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-sm">
                            <FileText className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <p className="text-zinc-400 font-medium">暂无相关的申请记录</p>
                    </div>
                )}
            </main>
        </div>
    );
}
