import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreHorizontal, Loader2, MessageSquareOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface ChatPreview {
  partnerId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      try {
        setIsLoading(true);
        // 1. 获取所有与我相关的消息，按时间倒序
        const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // 2. 内存内聚合对话伙伴
        const partnerMap = new Map<string, any>();

        messages?.forEach(msg => {
          const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          if (!partnerMap.has(partnerId)) {
            partnerMap.set(partnerId, {
              lastMessage: msg.content,
              time: msg.created_at,
              unread: 0 // 后续可根据状态计数
            });
          }
        });

        const partnerIds = Array.from(partnerMap.keys());
        if (partnerIds.length === 0) {
          setChats([]);
          return;
        }

        // 3. 批量获取伙伴的 Profile 信息
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .in('id', partnerIds);

        // 4. 合并结果
        const finalChats: ChatPreview[] = partnerIds.map(pid => {
          const profile = profiles?.find(p => p.id === pid);
          const meta = partnerMap.get(pid);
          const avatarColor = pid.replace(/-/g, '').slice(-6);
          return {
            partnerId: pid,
            name: profile?.name || '用户' + pid.slice(0, 4),
            avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=U&background=${avatarColor}&color=fff`,
            lastMessage: meta.lastMessage,
            time: formatChatTime(meta.time),
            unread: 0,
            online: false
          };
        });

        setChats(finalChats);
      } catch (err) {
        console.error('Fetch chats error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  const formatChatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 1000 * 60 * 60 * 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 1000 * 60 * 60 * 24 * 7) {
      const days = ['日', '一', '二', '三', '四', '五', '六'];
      return `周${days[date.getDay()]}`;
    } else {
      return `${date.getMonth() + 1}-${date.getDate()}`;
    }
  };

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

      <main className="px-4 space-y-2 py-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
            <MessageSquareOff className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">暂无聊天记录</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.partnerId}
              onClick={() => navigate(`/chat/${chat.partnerId}`)}
              className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-800 rounded-2xl active:scale-[0.98] transition-all cursor-pointer border border-zinc-100 dark:border-zinc-700/50 shadow-sm hover:border-amber-500/20"
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
                <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate font-medium">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {chat.unread}
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}
