import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Helper to strip HTML tags if content contains any, for preview
const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
};

// Helper to format date
const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};


export default function GuideListPage() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'dog';
    const navigate = useNavigate();

    const [guides, setGuides] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const title = type === 'dog' ? '狗狗养宠指南' : '猫咪养宠指南';

    useEffect(() => {
        const fetchGuides = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('guides')
                .select('*')
                .eq('category', type)
                .eq('status', '已发布')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching guides:', error);
            } else if (data) {
                setGuides(data);
            }
            setIsLoading(false);
        };

        fetchGuides();
    }, [type]);

    const handleArticleClick = (id: string) => {
        // Navigate to article detail page. Assume we have or will have /guides/:id
        // If not, we can just alert for now.
        alert('文章详情页还在开发中哦！');
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col relative pb-24">
            <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md z-10">
                <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                </button>
                <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{title}</h1>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 px-4 space-y-4 pt-2">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    </div>
                ) : guides.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {guides.map((guide) => (
                            <div
                                key={guide.id}
                                onClick={() => handleArticleClick(guide.id)}
                                className="bg-white dark:bg-zinc-800 rounded-2xl p-4 flex gap-4 shadow-sm active:scale-[0.98] transition-transform cursor-pointer border border-zinc-100 dark:border-zinc-700/50"
                            >
                                {/* Left: Content */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-[16px] font-bold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
                                            {guide.title}
                                        </h2>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                                            {stripHtml(guide.content)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 mt-3 text-zinc-400 text-[11px]">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" />
                                            阅读全文
                                        </span>
                                        <span>•</span>
                                        <span>{formatDate(guide.created_at)}</span>
                                    </div>
                                </div>

                                {/* Right: Thumbnail */}
                                <div className="w-28 h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                    {guide.cover_image ? (
                                        <img
                                            src={guide.cover_image}
                                            alt={guide.title}
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                            无图
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-zinc-400 flex flex-col items-center">
                        <BookOpen className="w-12 h-12 mb-3 opacity-20" />
                        <p>这里还没有发布文章哦</p>
                    </div>
                )}
            </main>
        </div>
    );
}
