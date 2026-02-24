import React, { useState } from 'react';
import { ChevronDown, Plus, Save } from 'lucide-react';

const initialMockBanners = [
    { id: 1, type: 'emergency', label: '紧急寻宠', target: '/adoption/dog/123', time: '2024-05-20 10:30 AM', url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=200' },
    { id: 2, type: 'daily', label: '每日推荐', target: '/adoption/cat/456', time: '2024-05-19 03:45 PM', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200' },
];

const initialMockGuides = [
    { id: 'G-101', title: '新手如何迎接第一只小狗回家', category: '狗', status: '已发布' },
    { id: 'G-102', title: '幼猫饲养指南：基础装备篇', category: '猫', status: '已发布' },
    { id: 'G-103', title: '老年宠物护理注意事项', category: '通用', status: '草稿' },
];

export default function AdminContent() {
    const [activeTab, setActiveTab] = useState('banner');
    const [showEditor, setShowEditor] = useState(false);

    // State lists
    const [banners, setBanners] = useState(initialMockBanners);
    const [guides, setGuides] = useState(initialMockGuides);

    // Add Banner Modal Form
    const [showAddBannerModal, setShowAddBannerModal] = useState(false);
    const [newBannerImage, setNewBannerImage] = useState('');
    const [newBannerLabel, setNewBannerLabel] = useState('');
    const [newBannerTarget, setNewBannerTarget] = useState('');

    // Add Guide Editor Form
    const [newArticleTitle, setNewArticleTitle] = useState('');
    const [newArticleCategory, setNewArticleCategory] = useState('通用');

    const handleAddBanner = () => {
        if (!newBannerImage || !newBannerLabel) {
            alert('请填写图片URL和标识');
            return;
        }
        const newBanner = {
            id: Date.now(),
            type: 'daily',
            label: newBannerLabel,
            target: newBannerTarget || '/',
            time: new Date().toLocaleString(),
            url: newBannerImage
        };
        setBanners([newBanner, ...banners]);
        setShowAddBannerModal(false);
        setNewBannerImage('');
        setNewBannerLabel('');
        setNewBannerTarget('');
    }

    const handleSaveGuide = (status: '草稿' | '已发布') => {
        if (!newArticleTitle) {
            alert('请填写文章标题');
            return;
        }
        const newGuide = {
            id: 'G-' + Date.now().toString().slice(-4),
            title: newArticleTitle,
            category: newArticleCategory,
            status: status
        };
        setGuides([newGuide, ...guides]);
        setShowEditor(false);
        setNewArticleTitle('');
    }

    return (
        <div className="h-full flex flex-col">
            {/* Tabs */}
            <div className="flex bg-white rounded-t-xl border-b border-zinc-100">
                <button
                    onClick={() => { setActiveTab('banner'); setShowEditor(false); }}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'banner' ? 'border-amber-500 text-amber-600' : 'border-transparent text-zinc-500 hover:text-zinc-800'
                        }`}
                >
                    Banner 管理
                </button>
                <button
                    onClick={() => { setActiveTab('guide'); }}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'guide' ? 'border-amber-500 text-amber-600' : 'border-transparent text-zinc-500 hover:text-zinc-800'
                        }`}
                >
                    养宠指南
                </button>
            </div>

            <div className="bg-white flex-1 p-6 rounded-b-xl shadow-sm">
                {activeTab === 'banner' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-zinc-800">Banner 列表</h2>
                            <button
                                onClick={() => setShowAddBannerModal(true)}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> 添加新 Banner
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-zinc-100">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50 text-zinc-500 border-b border-zinc-100">
                                        <th className="p-4 font-medium text-sm">缩略图</th>
                                        <th className="p-4 font-medium text-sm">位置标识</th>
                                        <th className="p-4 font-medium text-sm">跳转目标链接/ID</th>
                                        <th className="p-4 font-medium text-sm">更新时间</th>
                                        <th className="p-4 font-medium text-sm text-center">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {banners.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-50/50">
                                            <td className="p-4">
                                                <div className="relative w-24 h-12 rounded overflow-hidden">
                                                    <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                                                    <div className={`absolute left-0 bottom-0 text-[10px] text-white px-2 py-0.5 ${item.type === 'emergency' ? 'bg-red-500/90' :
                                                        item.type === 'daily' ? 'bg-amber-500/90' : 'bg-green-500/90'
                                                        }`}>
                                                        {item.label}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-zinc-800 font-medium">{item.label}</td>
                                            <td className="p-4 text-sm text-zinc-500">{item.target}</td>
                                            <td className="p-4 text-sm text-zinc-500">{item.time}</td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('确定删除该 Banner 吗？')) {
                                                            setBanners(banners.filter(b => b.id !== item.id));
                                                        }
                                                    }}
                                                    className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                                                >
                                                    删除
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Guides View */}
                {activeTab === 'guide' && !showEditor && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-zinc-800">养宠指南库</h2>
                            <button
                                onClick={() => setShowEditor(true)}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                发布新文章
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-zinc-100">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50 text-zinc-500 border-b border-zinc-100">
                                        <th className="p-4 font-medium text-sm">文章ID</th>
                                        <th className="p-4 font-medium text-sm">文章标题</th>
                                        <th className="p-4 font-medium text-sm">分类</th>
                                        <th className="p-4 font-medium text-sm">发布状态</th>
                                        <th className="p-4 font-medium text-sm text-center">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {guides.map((guide) => (
                                        <tr key={guide.id} className="hover:bg-zinc-50/50">
                                            <td className="p-4 text-sm text-zinc-800 font-medium">{guide.id}</td>
                                            <td className="p-4 text-sm text-zinc-800">{guide.title}</td>
                                            <td className="p-4 text-sm text-zinc-600">{guide.category}</td>
                                            <td className="p-4">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${guide.status === '已发布' ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-700'
                                                    }`}>
                                                    {guide.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('确定删除该文章吗？')) {
                                                            setGuides(guides.filter(g => g.id !== guide.id));
                                                        }
                                                    }}
                                                    className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                                                >
                                                    删除
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Article Editor */}
                {activeTab === 'guide' && showEditor && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowEditor(false)}
                                    className="text-zinc-400 hover:text-zinc-600"
                                >
                                    ← 返回列表
                                </button>
                                <h2 className="text-xl font-bold text-zinc-800">发布新文章</h2>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => handleSaveGuide('草稿')} className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                    <Save className="w-4 h-4" /> 存为草稿
                                </button>
                                <button onClick={() => handleSaveGuide('已发布')} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                                    发布上线
                                </button>
                            </div>
                        </div>

                        <div className="space-y-5 max-w-3xl border border-zinc-100 p-6 rounded-xl">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1">文章标题</label>
                                <input
                                    type="text"
                                    value={newArticleTitle}
                                    onChange={(e) => setNewArticleTitle(e.target.value)}
                                    placeholder="输入核心标题"
                                    className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-amber-500 outline-none block"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1">分类设置</label>
                                <select
                                    className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-amber-500 outline-none text-zinc-800 bg-white block"
                                    value={newArticleCategory}
                                    onChange={(e) => setNewArticleCategory(e.target.value)}
                                >
                                    <option value="狗">狗 (Dog)</option>
                                    <option value="猫">猫 (Cat)</option>
                                    <option value="通用">通用 (General)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1">文章图封面</label>
                                <div className="w-full border-2 border-dashed border-zinc-200 rounded-lg bg-zinc-50/50 py-8 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 hover:border-amber-300 transition-colors">
                                    <span className="text-zinc-600 text-2xl mb-2">☁️</span>
                                    <p className="text-sm text-zinc-500">点击或拖拽上传</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1">文章富文本域</label>
                                <div className="border border-zinc-200 rounded-t-lg bg-zinc-50 flex items-center gap-1 p-2">
                                    <button className="p-1.5 hover:bg-zinc-200 rounded text-zinc-700 font-bold" title="文字加粗">B</button>
                                    <button className="p-1.5 hover:bg-zinc-200 rounded text-amber-500 font-bold underline" title="字体颜色">A</button>
                                    <div className="w-px h-4 bg-zinc-300 mx-1"></div>
                                    <button className="p-1.5 hover:bg-zinc-200 rounded text-zinc-700" title="左对齐">≡</button>
                                    <button className="p-1.5 hover:bg-zinc-200 rounded text-zinc-700" title="居中对齐">☰</button>
                                    <div className="w-px h-4 bg-zinc-300 mx-1"></div>
                                    <button className="p-1.5 hover:bg-zinc-200 rounded text-zinc-700" title="插入图片">🖼️</button>
                                </div>
                                <textarea
                                    rows={10}
                                    placeholder="在此输入您的图文混排文章内容..."
                                    className="w-full border-x border-b border-zinc-200 rounded-b-lg p-4 outline-none focus:bg-amber-50/10 resize-y text-zinc-800"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Add Banner Modal */}
            {showAddBannerModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-zinc-800">新建 Banner 图</h3>
                            <button onClick={() => setShowAddBannerModal(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-1">图片网络直链 (URL)</label>
                                <input
                                    type="text"
                                    value={newBannerImage}
                                    onChange={e => setNewBannerImage(e.target.value)}
                                    className="w-full border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-amber-500"
                                    placeholder="https://images.unsplash..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-1">角标文本 (Label)</label>
                                <input
                                    type="text"
                                    value={newBannerLabel}
                                    onChange={e => setNewBannerLabel(e.target.value)}
                                    className="w-full border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-amber-500"
                                    placeholder="如：紧急寻宠" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-1">跳转页面 (Target URL)</label>
                                <input
                                    type="text"
                                    value={newBannerTarget}
                                    onChange={e => setNewBannerTarget(e.target.value)}
                                    className="w-full border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-amber-500"
                                    placeholder="如：/adoption/dog/..." />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowAddBannerModal(false)} className="px-5 py-2 rounded text-zinc-500 text-sm hover:bg-zinc-50 transition">取消</button>
                            <button onClick={handleAddBanner} className="bg-amber-500 text-white px-5 py-2 rounded text-sm font-medium hover:bg-amber-600 transition">确定保存</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
