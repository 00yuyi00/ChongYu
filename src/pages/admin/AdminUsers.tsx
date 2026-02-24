import React, { useState } from 'react';

const initialMockUsers = [
    { id: '1001', email: 'user1@example.com', name: '王小明', time: '2024-05-10', posts: 5, status: '正常' },
    { id: '1002', email: 'test2@test.com', name: '李大牛', time: '2024-05-18', posts: 0, status: '封禁' },
    { id: '1003', email: 'catlover@mail.com', name: '养猫猫的人', time: '2024-05-20', posts: 12, status: '正常' },
];

export default function AdminUsers() {
    const [users, setUsers] = useState(initialMockUsers);
    const [selectedUserForDrawer, setSelectedUserForDrawer] = useState<any>(null);
    const [selectedUserForBan, setSelectedUserForBan] = useState<any>(null);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-100 flex flex-col h-full overflow-hidden p-6 relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-zinc-800">用户管理</h2>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="按邮箱/昵称搜索"
                        className="border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 w-64 bg-zinc-50"
                    />
                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-amber-500/20">
                        搜索
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto border border-zinc-100 rounded-lg">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-zinc-50 z-10">
                        <tr className="text-zinc-800 border-b border-zinc-200 bg-zinc-100">
                            <th className="p-4 font-bold text-sm whitespace-nowrap">用户ID</th>
                            <th className="p-4 font-bold text-sm whitespace-nowrap">头像</th>
                            <th className="p-4 font-bold text-sm whitespace-nowrap">邮箱账号</th>
                            <th className="p-4 font-bold text-sm whitespace-nowrap">昵称</th>
                            <th className="p-4 font-bold text-sm whitespace-nowrap">注册时间</th>
                            <th className="p-4 font-bold text-sm text-center whitespace-nowrap">发帖数</th>
                            <th className="p-4 font-bold text-sm text-center whitespace-nowrap">账号状态</th>
                            <th className="p-4 font-bold text-sm whitespace-nowrap">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-zinc-50/50">
                                <td className="p-4 text-sm text-zinc-800 font-medium">#{user.id}</td>
                                <td className="p-4">
                                    <img src={`https://i.pravatar.cc/150?u=${user.id}`} className="w-10 h-10 rounded-full object-cover border border-zinc-200" />
                                </td>
                                <td className="p-4 text-sm text-zinc-800">{user.email}</td>
                                <td className="p-4 text-sm text-zinc-800 font-medium">{user.name}</td>
                                <td className="p-4 text-sm text-zinc-800">{user.time}</td>
                                <td className="p-4 text-sm text-zinc-800 text-center">{user.posts}</td>
                                <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-1.5 font-medium">
                                        <span className={`w-2 h-2 rounded-full ${user.status === '正常' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        <span className={`text-sm ${user.status === '正常' ? 'text-zinc-800' : 'text-red-600'}`}>
                                            {user.status === '正常' ? '正常' : '已封禁'}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col items-start gap-1">
                                        <button
                                            onClick={() => setSelectedUserForDrawer(user)}
                                            className="text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors"
                                        >
                                            查看详情
                                        </button>
                                        <div className="flex items-center text-zinc-300 text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedUserForBan(user)}
                                                className="text-amber-600 hover:text-amber-700 transition-colors pr-1"
                                            >
                                                {user.status === '正常' ? '封禁' : '解封'}
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 查看详情弹窗抽屉 (Drawer) */}
            {selectedUserForDrawer && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
                        onClick={() => setSelectedUserForDrawer(null)}
                    ></div>
                    {/* Drawer Content */}
                    <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
                        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                            <h3 className="text-lg font-bold text-zinc-800">该用户的历史帖子</h3>
                            <button onClick={() => setSelectedUserForDrawer(null)} className="text-zinc-400 hover:text-zinc-600">
                                ✕
                            </button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto space-y-4">
                            {/* Mock History Posts */}
                            {selectedUserForDrawer.posts > 0 ? (
                                Array.from({ length: Math.min(selectedUserForDrawer.posts, 3) }).map((_, i) => (
                                    <div key={i} className="border border-zinc-200 rounded-lg p-4 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded font-bold">寻宠</span>
                                            <span className="text-xs text-zinc-400">2024-05-1{i}</span>
                                        </div>
                                        <p className="text-sm text-zinc-800 font-medium mb-1">遗失了一只金毛猎犬...</p>
                                        <p className="text-xs text-zinc-500 truncate">在市中心公园附近走丢，戴着蓝色项圈。</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-zinc-500 py-10">该用户暂无发帖记录</div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* 封禁/解封 二次确认弹窗 (Modal) */}
            {selectedUserForBan && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="p-6 text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${selectedUserForBan.status === '正常' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                                ⚠
                            </div>
                            <h3 className="text-lg font-bold text-zinc-800 mb-2">
                                确定要{selectedUserForBan.status === '正常' ? '封禁' : '解封'}该用户吗？
                            </h3>
                            <p className="text-sm text-zinc-500">
                                {selectedUserForBan.status === '正常'
                                    ? '封禁后其将无法登录APP。'
                                    : '解封后该用户将恢复正常的应用访问及发帖权限。'}
                            </p>
                        </div>
                        <div className="flex border-t border-zinc-100 bg-zinc-50 divide-x divide-zinc-100">
                            <button
                                onClick={() => setSelectedUserForBan(null)}
                                className="flex-1 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={() => {
                                    setUsers(users.map(u =>
                                        u.id === selectedUserForBan.id
                                            ? { ...u, status: u.status === '正常' ? '封禁' : '正常' }
                                            : u
                                    ));
                                    setSelectedUserForBan(null);
                                }}
                                className={`flex-1 py-3 text-sm font-bold transition-colors ${selectedUserForBan.status === '正常'
                                    ? 'text-red-600 hover:bg-red-50'
                                    : 'text-green-600 hover:bg-green-50'
                                    }`}
                            >
                                确认{selectedUserForBan.status === '正常' ? '封禁' : '解封'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
