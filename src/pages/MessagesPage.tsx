import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreHorizontal } from 'lucide-react';

const MOCK_CHATS = [
  {
    id: '1',
    name: '张先生',
    avatar: 'https://i.pravatar.cc/150?u=1',
    lastMessage: '好的，我们可以约个时间见面看看。',
    time: '10:35',
    unread: 2,
    online: true
  },
  {
    id: '2',
    name: '李女士',
    avatar: 'https://i.pravatar.cc/150?u=2',
    lastMessage: '请问这只狗狗还在吗？',
    time: '昨天',
    unread: 0,
    online: false
  },
  {
    id: '3',
    name: '王小明',
    avatar: 'https://i.pravatar.cc/150?u=3',
    lastMessage: '谢谢你的帮助！',
    time: '星期一',
    unread: 0,
    online: false
  }
];

export default function MessagesPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto relative min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-24">
      <header className="px-5 py-4 pb-0 bg-white dark:bg-zinc-900 sticky top-0 z-30">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">消息</h1>
          <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <MoreHorizontal className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="搜索联系人..."
            className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-zinc-900 dark:text-zinc-100"
          />
        </div>
      </header>

      <main className="px-4 space-y-2">
        {MOCK_CHATS.map((chat) => (
          <div
            key={chat.id}
            onClick={() => navigate(`/chat/${chat.id}`)}
            className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-800 rounded-2xl active:scale-[0.98] transition-transform cursor-pointer border border-zinc-100 dark:border-zinc-700/50 shadow-sm"
          >
            <div className="relative">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-12 h-12 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-800 rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{chat.name}</h3>
                <span className="text-xs text-zinc-400">{chat.time}</span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <div className="w-5 h-5 bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {chat.unread}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
