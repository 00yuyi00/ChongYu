import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminPosts() {
    const [activeTab, setActiveTab] = useState('lost');
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [showTakeDownModal, setShowTakeDownModal] = useState(false);

    // Remote Data State
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [takeDownReason, setTakeDownReason] = useState('');
    const [postToTakeDown, setPostToTakeDown] = useState<any>(null);

    // Fetch posts whenever the activeTab changes
    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('posts')
                    .select('*, profiles(name, email)')
                    .eq('post_type', activeTab)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setPosts(data || []);
            } catch (err) {
                console.error("Error fetching admin posts:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [activeTab]);

    // Handle real take down API
    const handleTakeDownConfirm = async () => {
        if (!postToTakeDown) return;

        try {
            const { error } = await supabase
                .from('posts')
                .update({ status: '后台下架' })
                .eq('id', postToTakeDown.id);

            if (error) throw error;

            // update local state
            setPosts(posts.map(p => p.id === postToTakeDown.id ? { ...p, status: '后台下架' } : p));
            setShowTakeDownModal(false);
            setPostToTakeDown(null);
            setTakeDownReason('');
        } catch (err) {
            console.error("Take down failed:", err);
            alert("下架失败: " + (err as Error).message);
        }
    };

    return (
        <div className="h-full flex gap-4">
            {/* 左侧内联子菜单 */}
            <div className="w-48 shrink-0 bg-white rounded-xl shadow-sm border border-zinc-100 p-4 flex flex-col gap-2">
                <button
                    onClick={() => setActiveTab('lost')}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'lost' ? 'bg-amber-50 text-amber-600' : 'text-zinc-600 hover:bg-zinc-50'
                        }`}
                >
                    寻宠列表
                </button>
                <button
                    onClick={() => setActiveTab('found')}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'found' ? 'bg-amber-50 text-amber-600' : 'text-zinc-600 hover:bg-zinc-50'
                        }`}
                >
                    捡到列表
                </button>
                <button
                    onClick={() => setActiveTab('adopt')}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'adopt' ? 'bg-amber-50 text-amber-600' : 'text-zinc-600 hover:bg-zinc-50'
                        }`}
                >
                    送养列表
                </button>
            </div>

            <div className="bg-white flex-1 p-6 rounded-xl shadow-sm overflow-hidden flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="flex items-center gap-4 mb-6 pt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-600">状态</span>
                        <select className="border border-zinc-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-amber-500">
                            <option>全部</option>
                            <option>展示中</option>
                            <option>已结案</option>
                            <option>后台下架</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="date" className="border border-zinc-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-amber-500 text-zinc-600" />
                        <span className="text-zinc-400">-</span>
                        <input type="date" className="border border-zinc-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-amber-500 text-zinc-600" />
                    </div>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-1.5 rounded text-sm transition-colors shadow-sm shadow-amber-500/20">
                        搜索
                    </button>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto rounded-lg border border-zinc-100 min-h-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-zinc-50 z-10">
                            <tr className="text-zinc-500 border-b border-zinc-100">
                                <th className="p-4 font-bold text-sm">帖子ID</th>
                                <th className="p-4 font-bold text-sm">发布者</th>
                                <th className="p-4 font-bold text-sm">宠物类型</th>
                                <th className="p-4 font-bold text-sm">标题描述</th>
                                <th className="p-4 font-bold text-sm">发布时间</th>
                                <th className="p-4 font-bold text-sm text-center">状态</th>
                                <th className="p-4 font-bold text-sm text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="text-center p-8 text-zinc-500">正在加载数据...</td>
                                </tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center p-8 text-zinc-500">暂无相关帖子</td>
                                </tr>
                            ) : posts.map((item) => (
                                <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="p-4 text-sm text-zinc-800 font-mono text-xs">{item.id.split('-')[0]}...</td>
                                    <td className="p-4 text-sm text-zinc-800">{item.profiles?.name || '未知用户'}</td>
                                    <td className="p-4 text-sm text-zinc-800">{item.pet_type === 'dog' ? '狗' : item.pet_type === 'cat' ? '猫' : '其他'}</td>
                                    <td className="p-4 text-sm text-zinc-600 max-w-xs truncate">{item.title}</td>
                                    <td className="p-4 text-sm text-zinc-500">{new Date(item.created_at).toLocaleString()}</td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${item.status === '展示中' ? 'bg-green-100 text-green-700 border border-green-200' :
                                            item.status === '已结案' ? 'bg-zinc-200 text-zinc-600 border border-zinc-300' :
                                                'bg-red-50 text-red-500 border border-red-200'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setSelectedPost(item)}
                                                className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded text-xs font-bold hover:bg-amber-100 transition"
                                            >
                                                查看/编辑
                                            </button>
                                            <button
                                                onClick={() => { setPostToTakeDown(item); setShowTakeDownModal(true); }}
                                                className="bg-red-500 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-red-600 transition"
                                                disabled={item.status === '后台下架'}
                                                style={item.status === '后台下架' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                            >
                                                后台下架
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination placeholder */}
                <div className="mt-4 flex gap-1">
                    <button className="px-3 py-1 border border-zinc-200 rounded text-zinc-500 text-sm hover:bg-zinc-50">«</button>
                    <button className="px-3 py-1 border border-zinc-200 rounded text-zinc-500 text-sm hover:bg-zinc-50">‹</button>
                    <button className="px-3 py-1 bg-amber-500 text-white rounded text-sm border border-amber-500">1</button>
                    <button className="px-3 py-1 border border-zinc-200 rounded text-zinc-500 text-sm hover:bg-zinc-50">2</button>
                    <button className="px-3 py-1 border border-zinc-200 rounded text-zinc-500 text-sm hover:bg-zinc-50">›</button>
                    <button className="px-3 py-1 border border-zinc-200 rounded text-zinc-500 text-sm hover:bg-zinc-50">»</button>
                </div>
            </div>

            {/* 全屏编辑详情弹窗 (Full-screen Edit Modal) */}
            {selectedPost && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50 shrink-0">
                            <h3 className="font-bold text-xl text-zinc-800">查看/编辑帖子详细信息</h3>
                            <button onClick={() => setSelectedPost(null)} className="text-zinc-400 hover:text-zinc-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-200">✕</button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 bg-zinc-50/30">
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-zinc-800 mb-2">宠物图片</label>
                                <div className="flex gap-2">
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden group">
                                        <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=200" className="w-full h-full object-cover" />
                                        <button className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100">✕</button>
                                    </div>
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden group">
                                        <img src="https://images.unsplash.com/photo-1537151608804-ea2f1ea14a15?w=200" className="w-full h-full object-cover" />
                                        <button className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100">✕</button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-zinc-800 mb-2">详细描述 (允许修改以清除违规词汇)</label>
                                <textarea
                                    className="w-full h-32 border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                                    defaultValue={selectedPost.description || '无详细描述'}
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-6 border-t border-zinc-100 flex justify-end gap-3 bg-white shrink-0">
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="bg-white border border-zinc-200 text-zinc-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-50 transition"
                            >
                                取消
                            </button>
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition shadow-sm shadow-amber-500/20"
                            >
                                保存修改
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Take Down Modal */}
            {showTakeDownModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-bold text-lg text-zinc-800">确认下架帖子</h3>
                            <button onClick={() => setShowTakeDownModal(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-bold text-zinc-800 mb-2">原因</label>
                            <input
                                type="text"
                                value={takeDownReason}
                                onChange={(e) => setTakeDownReason(e.target.value)}
                                className="w-full border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                                placeholder="填写下架原因 (选填)"
                            />
                        </div>
                        <div className="p-4 border-t flex gap-3 justify-center">
                            <button
                                onClick={handleTakeDownConfirm}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded text-sm font-medium transition"
                            >
                                确认下架
                            </button>
                            <button
                                onClick={() => setShowTakeDownModal(false)}
                                className="bg-zinc-500 text-white px-6 py-2 rounded text-sm font-medium hover:bg-zinc-600 transition"
                            >
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
