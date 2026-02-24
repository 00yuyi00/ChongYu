import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Image } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: number; // Unix timestamp
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '你好，请问这只猫还在吗？', sender: 'me', timestamp: Date.now() - 1000 * 60 * 30 },
    { id: '2', text: '在的，目前还在找领养人。', sender: 'other', timestamp: Date.now() - 1000 * 60 * 28 },
    { id: '3', text: '它的性格怎么样？粘人吗？', sender: 'me', timestamp: Date.now() - 1000 * 60 * 25 },
    { id: '4', text: '非常粘人，喜欢在腿上睡觉。', sender: 'other', timestamp: Date.now() - 1000 * 60 * 5 },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      timestamp: Date.now(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Mock reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: '好的，我们可以约个时间见面看看。',
        sender: 'other',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const shouldShowTimestamp = (currentMsg: Message, prevMsg: Message | null) => {
    if (!prevMsg) return true;
    return currentMsg.timestamp - prevMsg.timestamp > 5 * 60 * 1000; // 5 minutes
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col relative">
      <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md z-10 border-b border-zinc-200 dark:border-zinc-800">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">张先生</h1>
        </div>
        <div className="w-10 h-10"></div> {/* Empty right placeholder */}
      </header>

      <main className="flex-1 px-4 py-6 space-y-4 overflow-y-auto pb-24">
        {messages.map((msg, index) => {
          const showTime = shouldShowTimestamp(msg, index > 0 ? messages[index - 1] : null);
          return (
            <div key={msg.id} className="flex flex-col gap-2">
              {showTime && (
                <div className="text-center text-xs text-zinc-400 my-2">
                  {formatTime(msg.timestamp)}
                </div>
              )}
              <div
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'me'
                      ? 'bg-amber-500 text-white rounded-tr-none'
                      : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none border border-zinc-100 dark:border-zinc-700/50'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
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
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`p-2 rounded-full transition-all ${inputText.trim()
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600 active:scale-90'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
              }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
