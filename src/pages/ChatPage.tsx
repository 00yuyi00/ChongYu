import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Image, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { id: otherUserId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user || !otherUserId) return;

    // 1. 获取对方信息
    const fetchOtherUser = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', otherUserId)
        .single();
      setOtherUser(data);
    };

    // 2. 获取历史消息
    const fetchMessages = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    };

    fetchOtherUser();
    fetchMessages();

    // 3. 订阅实时消息
    const channel = supabase
      .channel(`chat:${user.id}:${otherUserId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        // 确保这条消息确实是发给我的，且是从当前对话人发出的
        if (newMessage.sender_id === otherUserId) {
          setMessages(prev => [...prev, newMessage]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !user || !otherUserId || isSending) return;

    try {
      setIsSending(true);
      const content = inputText;
      setInputText('');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: otherUserId,
          content: content
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setMessages(prev => [...prev, data]);
      }
    } catch (err) {
      console.error('Send message error:', err);
      alert('消息发送失败');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col relative">
      <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md z-10 border-b border-zinc-200 dark:border-zinc-800">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {otherUser?.name || '用户'}
          </h1>
          {otherUser?.status === '封禁' && <span className="text-[10px] text-red-500">此账号已被封禁</span>}
        </div>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-4 overflow-y-auto pb-24 h-[calc(100vh-140px)]">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-zinc-400 text-sm">暂无消息，打个招呼吧 ~</div>
        ) : (
          messages.map((msg, index) => {
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const showDate = !prevMsg ||
              new Date(msg.created_at).toDateString() !== new Date(prevMsg.created_at).toDateString();

            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="text-[10px] text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full font-medium">
                      {formatFullDate(msg.created_at)}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div
                    className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender_id === user?.id
                        ? 'bg-amber-500 text-white rounded-tr-none'
                        : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none border border-zinc-100 dark:border-zinc-700/50'
                        }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                  <div className={`text-[10px] text-zinc-400 px-1 ${msg.sender_id === user?.id ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" title="发送图片">
            <Image className="w-6 h-6" />
          </button>
          <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-2 flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="发送消息..."
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100 p-0"
              disabled={isSending}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isSending}
            className={`p-2 rounded-full transition-all ${inputText.trim()
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600 active:scale-90'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
              }`}
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
