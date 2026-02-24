import React, { useEffect, useState } from 'react';
import { Users, FileEdit, MessageSquare, ClipboardCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock Data for charts falls back to empty if no data is loaded
const defaultUserTrendData = [
    { name: '0', value: 0 },
];

const defaultPostTrendData = [
    { name: '一', value: 0 },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        todayPosts: 0,
        pendingFeedbacks: 0,
        todayCheckTasks: 0
    });
    const [chartData, setChartData] = useState({
        userTrend: defaultUserTrendData,
        postTrend: defaultPostTrendData
    });

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                // 1. 获取总人数
                const { count: usersCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                // 2. 获取今日新增帖子数量
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const { count: postsCount } = await supabase
                    .from('posts')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', today.toISOString());

                // 3. 待处理反馈数
                const { count: feedbacksCount } = await supabase
                    .from('feedbacks')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', '待处理');

                // 4. 今日待抽查 (模拟算法，这里做成帖子数/10向下取整)
                const checkTasks = Math.floor((postsCount || 0) / 10) + 1;

                setStats({
                    totalUsers: usersCount || 0,
                    todayPosts: postsCount || 0,
                    pendingFeedbacks: feedbacksCount || 0,
                    todayCheckTasks: checkTasks
                });

                // ==========================
                // 图表真实数据获取
                // ==========================

                // 1) 用户增长趋势 (近30天累计趋势)
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
                thirtyDaysAgo.setHours(0, 0, 0, 0);

                const { data: recentProfiles } = await supabase
                    .from('profiles')
                    .select('created_at')
                    .gte('created_at', thirtyDaysAgo.toISOString());

                const { count: baseUsersCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .lt('created_at', thirtyDaysAgo.toISOString());

                let currentTotal = baseUsersCount || 0;
                const userTrend = [];
                for (let i = 29; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);

                    const dailyNew = (recentProfiles || []).filter(p => new Date(p.created_at).toDateString() === d.toDateString()).length;
                    currentTotal += dailyNew;

                    const displayDate = `${d.getMonth() + 1}/${d.getDate()}`;
                    userTrend.push({ name: displayDate, value: currentTotal });
                }

                // 2) 近7天新增帖子趋势
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
                sevenDaysAgo.setHours(0, 0, 0, 0);

                const { data: recentPosts } = await supabase
                    .from('posts')
                    .select('created_at')
                    .gte('created_at', sevenDaysAgo.toISOString());

                const postTrend = [];
                const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dayOfWeek = '周' + weekDays[d.getDay()];

                    const dailyPostsCount = (recentPosts || []).filter(p => new Date(p.created_at).toDateString() === d.toDateString()).length;
                    postTrend.push({ name: dayOfWeek, value: dailyPostsCount });
                }

                setChartData({
                    userTrend: userTrend.length > 0 ? userTrend : defaultUserTrendData,
                    postTrend: postTrend.length > 0 ? postTrend : defaultPostTrendData
                });

            } catch (error) {
                console.error("Error fetching admin stats:", error);
            }
        };

        fetchDashboardStats();
    }, []);

    return (
        <div className="max-w-[1200px] space-y-6">
            <h1 className="text-2xl font-bold text-zinc-800">控制台首页</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                        <Users className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-sm mb-1">总用户数</p>
                        <p className="text-2xl font-bold text-zinc-800">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                        <FileEdit className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-sm mb-1">今日新增帖子</p>
                        <p className="text-2xl font-bold text-zinc-800">{stats.todayPosts}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                        <MessageSquare className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-sm mb-1">待处理反馈</p>
                        <p className="text-2xl font-bold text-zinc-800">{stats.pendingFeedbacks}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                        <ClipboardCheck className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-sm mb-1">今日待抽查</p>
                        <p className="text-2xl font-bold text-zinc-800">{stats.todayCheckTasks}</p>
                    </div>
                </div>
            </div>

            {/* Alerts & Tasks */}
            <div>
                <h2 className="text-lg font-bold text-zinc-800 mb-4">待办与告警</h2>
                <div className="flex gap-4">
                    <div className="bg-[#FFF9F2] p-5 rounded-2xl border border-amber-100/50 flex-1 flex flex-col items-start gap-4">
                        <div>
                            <h3 className="font-bold text-zinc-800 text-lg">待处理反馈</h3>
                            <p className="text-zinc-500 text-sm mt-1">{stats.pendingFeedbacks} 项需要跟进</p>
                        </div>
                        <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm">
                            立即处理
                        </button>
                    </div>
                    <div className="bg-[#FFF9F2] p-5 rounded-2xl border border-amber-100/50 flex-1 flex flex-col items-start gap-4">
                        <div>
                            <h3 className="font-bold text-zinc-800 text-lg">今日待抽查帖子</h3>
                            <p className="text-zinc-500 text-sm mt-1">{stats.todayCheckTasks} 个帖子等待审核</p>
                        </div>
                        <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm">
                            立即处理
                        </button>
                    </div>
                    {/* Empty spacer to align with grid if needed, or keep two for emphasis */}
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
                {/* Line Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                    <h3 className="font-bold text-zinc-800 mb-6">用户增长趋势 (近30天)</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.userTrend} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                    <h3 className="font-bold text-zinc-800 mb-6">新增帖子 (周)</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.postTrend} margin={{ top: 5, right: 0, left: -20, bottom: 0 }} barSize={30}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f4f4f5' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
