import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Share2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function GuideDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [guide, setGuide] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGuideContent = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('guides')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setGuide(data);
            } catch (err) {
                console.error('Error fetching guide detail:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGuideContent();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <div className="text-center">
                    <p className="text-zinc-500 mb-4">未找到该文章内容</p>
                    <button onClick={() => navigate(-1)} className="text-amber-500 font-medium">返回上一页</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-zinc-900 relative pb-20">
            <header className="px-4 py-4 sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md z-10 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                </button>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">养宠指南</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <Share2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                </button>
            </header>

            <main className="px-6 pt-8">
                {/* Cover Image */}
                {guide.cover_image && (
                    <div className="w-full aspect-video rounded-3xl overflow-hidden mb-8 shadow-sm">
                        <img
                            src={guide.cover_image}
                            alt={guide.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                )}

                {/* Title */}
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-4">
                    {guide.title}
                </h1>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-zinc-400 mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(guide.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>约 {Math.ceil(guide.content.length / 500)} 分钟阅读</span>
                    </div>
                    <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg font-medium ml-auto">
                        {guide.category === 'dog' ? '狗狗' : '猫咪'}
                    </span>
                </div>

                {/* Article Body */}
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <div
                        className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-[16px] space-y-6 whitespace-pre-line
                                   [&_img]:w-full [&_img]:rounded-2xl [&_img]:my-6 [&_img]:shadow-md
                                   [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-zinc-900 [&_h3]:dark:text-zinc-100 [&_h3]:mt-8 [&_h3]:mb-4
                                   [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:pl-1"
                        dangerouslySetInnerHTML={{ __html: guide.content }}
                    />
                </div>
            </main>

            {/* Scroll to top button or similar could go here */}
        </div>
    );
}
