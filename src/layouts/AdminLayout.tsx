import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FileText,
    MessageSquare,
    Image as ImageIcon,
    Settings,
    LogOut,
    Bell,
    Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: '控制台首页', end: true },
        { path: '/admin/users', icon: Users, label: '用户管理' },
        { path: '/admin/posts', icon: FileText, label: '帖子管理' },
        { path: '/admin/feedback', icon: MessageSquare, label: '反馈管理' },
        { path: '/admin/content', icon: ImageIcon, label: '内容管理' },
        { path: '/admin/settings', icon: Settings, label: '系统设置' },
    ];

    return (
        <div className="flex h-screen bg-[#F5F6FA] text-zinc-800 font-sans">
            {/* Sidebar - Dark Theme as per design */}
            <aside className="w-[200px] bg-[#2C2C2C] text-zinc-400 flex flex-col shrink-0">
                <div className="h-16 flex items-center px-6 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex flex-col items-center justify-center">
                            {/* Simple Paw Icon mimicking the logo */}
                            <div className="flex gap-[2px] mb-[2px]">
                                <div className="w-[4px] h-[4px] bg-amber-500 rounded-full"></div>
                                <div className="w-[5px] h-[5px] bg-amber-500 rounded-full -mt-[2px]"></div>
                                <div className="w-[4px] h-[4px] bg-amber-500 rounded-full"></div>
                            </div>
                            <div className="w-[12px] h-[8px] bg-amber-500 rounded-[4px_4px_6px_6px]"></div>
                        </div>
                        <span className="text-white font-bold text-lg tracking-wider">控制台</span>
                    </div>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                                    ? 'bg-[#3A3A3A] text-amber-500 font-medium'
                                    : 'hover:bg-[#333333] hover:text-zinc-200'
                                }`
                            }
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-3 pb-6 border-t border-zinc-700/50 pt-4 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-[#333333] w-full rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        退出登录
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-zinc-100 flex items-center justify-between px-6 shrink-0">
                    <div className="w-96">
                        <div className="relative flex items-center">
                            <Search className="w-4 h-4 text-zinc-400 absolute left-3" />
                            <input
                                type="text"
                                placeholder="搜索"
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-zinc-400 hover:text-zinc-600 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <img
                                src="https://i.pravatar.cc/150?img=11"
                                alt="Admin"
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="text-sm">
                                <span className="text-zinc-700 font-medium">管理员</span>
                                <span className="text-zinc-400 ml-1 text-xs">▼</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
