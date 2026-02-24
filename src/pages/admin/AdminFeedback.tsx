import React, { useState } from 'react';

const mockFeedbacks = [
    { id: 'FB-1024', email: 'sarah.j@example.com', summary: '发现了狗狗的走丢贴上图片...', time: '2024-05-20 10:30 AM', status: '待处理' },
    { id: 'FB-1023', email: 'mike.b@email.com', summary: 'Adoption process inquiry...', time: '2024-05-19 03:15 PM', status: '已处理' },
    { id: 'FB-1022', email: 'sarah.j@example.com', summary: '麻烦查一下mmesseniq 个情要...', time: '2024-05-19 10:30 AM', status: '已处理' },
    { id: 'FB-1020', email: 'sarah.js@example.com', summary: '被骗了他说可以邮寄要求...', time: '2024-05-20 10:30 AM', status: '待处理' },
    { id: 'FB-1021', email: 'mike.b@email.com', summary: 'Adoption process inquiry...', time: '2024-05-19 03:15 PM', status: '已处理' },
    { id: 'FB-1019', email: 'mike.b@email.com', summary: '被骗了他说明确要押金...', time: '2024-05-19 03:15 AM', status: '已处理' },
];

export default function AdminFeedback() {
    const [selectedItem, setSelectedItem] = useState<any>(null);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-100 flex flex-col h-full overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-zinc-800">用户反馈处理</h2>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">🔍</span>
                        <input
                            type="text"
                            placeholder="搜索"
                            className="border border-zinc-200 rounded-lg pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 w-64 bg-zinc-50"
                        />
                    </div>
                    <button className="border border-zinc-200 text-zinc-600 px-4 py-2 rounded-lg text-sm bg-white hover:bg-zinc-50 flex items-center gap-1">
                        操作 <span className="text-xs">▼</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto border border-zinc-100 rounded-lg min-h-0">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-zinc-50 z-10">
                        <tr className="text-zinc-500 border-b border-zinc-100">
                            <th className="p-4 font-bold text-sm">反馈ID</th>
                            <th className="p-4 font-bold text-sm">提交人邮箱</th>
                            <th className="p-4 font-bold text-sm">内容摘要</th>
                            <th className="p-4 font-bold text-sm">提交时间</th>
                            <th className="p-4 font-bold text-sm text-center">状态</th>
                            <th className="p-4 font-bold text-sm text-center">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {mockFeedbacks.map((item) => (
                            <tr key={item.id} className="hover:bg-zinc-50/50">
                                <td className="p-4 text-sm text-zinc-800 font-medium">{item.id}</td>
                                <td className="p-4 text-sm text-zinc-600">{item.email}</td>
                                <td className="p-4 text-sm text-zinc-800 truncate max-w-[200px]">{item.summary}</td>
                                <td className="p-4 text-sm text-zinc-500">{item.time}</td>
                                <td className="p-4 text-center">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${item.status === '待处理'
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-green-100 text-green-700'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => setSelectedItem(item)}
                                        className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded text-xs transition-colors"
                                    >
                                        查看并处理
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
                        <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                            <h3 className="font-bold text-lg text-zinc-800">反馈详情 - #{selectedItem.id.split('-')[1]}</h3>
                            <button onClick={() => setSelectedItem(null)} className="text-zinc-400 hover:text-zinc-600">✕</button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            <div>
                                <h4 className="font-bold text-sm text-zinc-800 mb-2">反馈全文：</h4>
                                <p className="text-zinc-600 text-sm leading-relaxed p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
                                    Found a stray dog near the park, seems friendly but hungry. Attached photos.
                                    <br /><br />
                                    {selectedItem.summary}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-sm text-zinc-800 mb-2">处理备注 (仅后台可见)：</h4>
                                <textarea
                                    className="w-full h-24 border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                                    placeholder="输入处理备注..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3 shrink-0">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="bg-white border border-zinc-200 text-zinc-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50 transition"
                            >
                                取消
                            </button>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition shadow-sm shadow-amber-500/20"
                            >
                                标记为已处理
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
