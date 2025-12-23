'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/xano/xano-auth-context';
import { topicsApi, favoritesApi, progressApi } from '@/lib/xano/xano-api';
import { Topic } from '@/lib/types';
import { CommentSection } from '@/components/comments/comment-section';
import { AiContentGenerator } from '@/components/admin/ai-content-generator';
import { InlineEditor } from '@/components/admin/inline-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Heart, Star, BookOpen, Brain, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';


const difficultyConfig = {
    kolay: { label: 'Kolay', color: 'bg-green-500/20 text-green-600 border-green-500/30' },
    orta: { label: 'Orta', color: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' },
    zor: { label: 'Zor', color: 'bg-red-500/20 text-red-600 border-red-500/30' },
};

const categoryConfig: Record<string, { label: string; color: string }> = {
    '9-sinif': { label: '9. Sınıf', color: 'from-blue-500 to-cyan-500' },
    '10-sinif': { label: '10. Sınıf', color: 'from-purple-500 to-pink-500' },
    '11-sinif': { label: '11. Sınıf', color: 'from-orange-500 to-amber-500' },
    '12-sinif': { label: '12. Sınıf', color: 'from-green-500 to-emerald-500' },
    'tyt': { label: 'TYT', color: 'from-indigo-500 to-blue-500' },
    'ayt': { label: 'AYT', color: 'from-rose-500 to-pink-500' },
};

export default function TopicDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [topic, setTopic] = useState<Topic | null>(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    const topicId = params.id as string;

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        loadTopic();
        checkFavorite();
        setIsCompleted(user.completedTopics?.includes(topicId) || false);
    }, [user, topicId]);

    const handleToggleComplete = async () => {
        try {
            const nextState = !isCompleted;
            await progressApi.toggleCompleted(topicId, nextState);
            setIsCompleted(nextState);
        } catch (error) {
            console.error('Failed to toggle completion:', error);
        }
    };

    const loadTopic = async () => {
        try {
            const data = await topicsApi.getById(topicId);
            setTopic(data);
        } catch (error) {
            console.error('Failed to load topic:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkFavorite = async () => {
        try {
            const favorited = await favoritesApi.isFavorited(topicId);
            setIsFavorited(favorited);
        } catch (error) {
            console.error('Failed to check favorite:', error);
        }
    };

    const handleFavoriteToggle = async () => {
        try {
            if (isFavorited) {
                await favoritesApi.remove(topicId);
                setIsFavorited(false);
            } else {
                await favoritesApi.add(topicId);
                setIsFavorited(true);
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    if (!user || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!topic) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Konu bulunamadı</h2>
                    <Link href="/topics">
                        <Button>Konulara Dön</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const categoryInfo = categoryConfig[topic.category] || { label: topic.category, color: 'from-gray-500 to-gray-600' };
    const difficultyInfo = difficultyConfig[topic.difficulty];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/topics">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Konulara Dön
                            </Button>
                        </Link>
                        <Button
                            variant={isFavorited ? "default" : "outline"}
                            size="sm"
                            onClick={handleFavoriteToggle}
                            className={cn(isFavorited && "bg-red-500 hover:bg-red-600")}
                        >
                            <Heart className={cn("w-4 h-4 mr-2", isFavorited && "fill-current")} />
                            {isFavorited ? "Favorilerde" : "Favorilere Ekle"}
                        </Button>
                        <Button
                            variant={isCompleted ? "default" : "outline"}
                            size="sm"
                            onClick={handleToggleComplete}
                            className={cn(isCompleted && "bg-green-500 hover:bg-green-600")}
                        >
                            <CheckCircle className={cn("w-4 h-4 mr-2", isCompleted && "fill-current")} />
                            {isCompleted ? "Tamamlandı" : "Tamamla"}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Topic Header */}
                <div className="mb-8">
                    <div className="flex items-start gap-4 mb-4">
                        <div className={cn(
                            "p-4 rounded-xl bg-gradient-to-br shrink-0",
                            categoryInfo.color
                        )}>
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-sm font-semibold text-white",
                                    `bg-gradient-to-r ${categoryInfo.color}`
                                )}>
                                    {categoryInfo.label}
                                </span>
                                <span className={cn(
                                    "px-3 py-1 rounded-md text-sm font-medium border",
                                    difficultyInfo.color
                                )}>
                                    {difficultyInfo.label}
                                </span>
                                {topic.priority > 0 && (
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(topic.priority, 5) }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <h1 className="text-3xl font-display font-bold mb-2">{topic.title}</h1>
                            {topic.subCategory && (
                                <p className="text-lg text-muted-foreground">{topic.subCategory}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Content Generator (Admin Only) */}
                <AiContentGenerator
                    topicId={topicId}
                    lastUpdate={topic.lastAiUpdate}
                    onSuccess={(updatedTopic) => {
                        setTopic(updatedTopic);
                    }}
                />

                {/* AI Summary */}
                {topic.aiSummary && (
                    <Card className="mb-8 border-purple-500/30 bg-purple-500/5">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <Brain className="w-5 h-5 text-purple-600 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">AI Özet</h3>
                                    <p className="text-muted-foreground mb-4">{topic.aiSummary.shortSummary}</p>

                                    {topic.aiSummary.tytAytDifferences && (
                                        <div className="mb-4">
                                            <h4 className="font-medium mb-2">TYT - AYT Farkları:</h4>
                                            <p className="text-sm text-muted-foreground">{topic.aiSummary.tytAytDifferences}</p>
                                        </div>
                                    )}

                                    {topic.aiSummary.confusedConcepts && topic.aiSummary.confusedConcepts.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="font-medium mb-2">Karıştırılan Kavramlar:</h4>
                                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                                {topic.aiSummary.confusedConcepts.map((concept, i) => (
                                                    <li key={i}>{concept}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Sınav Çıkma Olasılığı:</span>
                                        <span className={cn(
                                            "px-2 py-1 rounded text-xs font-semibold",
                                            topic.aiSummary.examProbability === 'yüksek' && "bg-red-500/20 text-red-600",
                                            topic.aiSummary.examProbability === 'orta' && "bg-yellow-500/20 text-yellow-600",
                                            topic.aiSummary?.examProbability === 'düşük' && "bg-green-500/20 text-green-600"
                                        )}>
                                            {topic.aiSummary?.examProbability ? topic.aiSummary.examProbability.toUpperCase() : 'BELİRSİZ'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Content */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        {/* Admin Inline Editor for Admin Content */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center justify-between">
                                <span>Eğitmen Notları (Admin)</span>
                                {topic.source === 'ADMIN' && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Ana Kaynak</span>}
                            </h3>
                            <InlineEditor
                                topicId={topicId}
                                initialContent={topic.contentAdmin || ''}
                                fieldName="contentAdmin"
                                className="text-foreground"
                                onUpdate={(newContent) => {
                                    setTopic(prev => prev ? { ...prev, contentAdmin: newContent, content: newContent, source: 'ADMIN' } : null);
                                }}
                            />
                        </div>

                        {/* Admin Inline Editor for AI Content (or just display if not admin) */}
                        <div className="mb-6 relative">
                            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center justify-between">
                                <span>AI İçeriği (OGM/Meb)</span>
                                {topic.source === 'OGM' && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Kaynak: OGM</span>}
                            </h3>
                            <InlineEditor
                                topicId={topicId}
                                initialContent={topic.contentAi || (topic.source !== 'ADMIN' ? topic.content : '')}
                                fieldName="contentAi"
                                className="text-muted-foreground/90 text-sm border-l-2 pl-4 border-purple-200"
                                onUpdate={(newContent) => {
                                    setTopic(prev => prev ? { ...prev, contentAi: newContent } : null);
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Images */}
                {topic.images && topic.images.length > 0 && (
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-4">Görseller</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {topic.images.map((image, i) => (
                                    <img
                                        key={i}
                                        src={image}
                                        alt={`${topic.title} - Görsel ${i + 1}`}
                                        className="rounded-lg border border-border"
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Videos */}
                {topic.videos && topic.videos.length > 0 && (
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-4">Videolar</h3>
                            <div className="space-y-4">
                                {topic.videos.map((video, i) => (
                                    <div key={i} className="aspect-video">
                                        <iframe
                                            src={video}
                                            className="w-full h-full rounded-lg"
                                            allowFullScreen
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Comments Section */}
                <CommentSection topicId={topicId} />
            </main>
        </div>
    );
}
