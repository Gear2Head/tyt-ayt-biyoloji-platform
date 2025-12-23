import React from 'react';
import { Topic } from '@/lib/types';
import { BookOpen, Heart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TopicCardProps {
    topic: Topic;
    isFavorited?: boolean;
    onFavoriteToggle?: (topicId: string) => void;
}

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

export function TopicCard({ topic, isFavorited = false, onFavoriteToggle }: TopicCardProps) {
    const categoryInfo = categoryConfig[topic.category] || { label: topic.category, color: 'from-gray-500 to-gray-600' };
    const difficultyInfo = difficultyConfig[topic.difficulty];

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onFavoriteToggle?.(topic.id);
    };

    return (
        <Link href={`/topics/${topic.id}`}>
            <Card className="hover-lift group relative overflow-hidden transition-all duration-300">
                {/* Category Badge with Gradient */}
                <div className={cn(
                    "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white z-10",
                    `bg-gradient-to-r ${categoryInfo.color}`
                )}>
                    {categoryInfo.label}
                </div>

                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={cn(
                            "p-3 rounded-xl bg-gradient-to-br shrink-0 group-hover:scale-110 transition-transform",
                            categoryInfo.color
                        )}>
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {topic.title}
                            </h3>

                            {topic.subCategory && (
                                <p className="text-sm text-muted-foreground mb-3">
                                    {topic.subCategory}
                                </p>
                            )}

                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {topic.content.substring(0, 150)}...
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center gap-3 flex-wrap">
                                {/* Difficulty Badge */}
                                <span className={cn(
                                    "px-2 py-1 rounded-md text-xs font-medium border",
                                    difficultyInfo.color
                                )}>
                                    {difficultyInfo.label}
                                </span>

                                {/* Priority Stars */}
                                {topic.priority > 0 && (
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(topic.priority, 5) }).map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                        ))}
                                    </div>
                                )}

                                {/* AI Summary Indicator */}
                                {topic.aiSummary && (
                                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-500/20 text-purple-600 border border-purple-500/30">
                                        AI Özet
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Favorite Button */}
                    <button
                        onClick={handleFavoriteClick}
                        className={cn(
                            "absolute bottom-4 right-4 p-2 rounded-full transition-all",
                            isFavorited
                                ? "bg-red-500/20 text-red-600 hover:bg-red-500/30"
                                : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
                        )}
                        aria-label={isFavorited ? "Favorilerden çıkar" : "Favorilere ekle"}
                    >
                        <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                    </button>
                </CardContent>
            </Card>
        </Link>
    );
}
