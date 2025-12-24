'use client';

import { VideoResource } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Clock, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VideoListProps {
    videos: VideoResource[];
    onVideoSelect?: (video: VideoResource) => void;
    selectedVideoId?: string;
}

export function VideoList({ videos, onVideoSelect, selectedVideoId }: VideoListProps) {
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getYoutubeThumbnail = (url: string): string => {
        // Extract video ID from YouTube URL
        const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (videoIdMatch && videoIdMatch[1]) {
            return `https://img.youtube.com/vi/${videoIdMatch[1]}/mqdefault.jpg`;
        }
        return '/placeholder-video.jpg';
    };

    if (videos.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <Play className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">Henüz video eklenmemiş</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {videos.map((video) => (
                <Card
                    key={video.id}
                    className={`cursor-pointer transition-all hover:border-primary/50 ${selectedVideoId === video.id ? 'border-primary bg-primary/5' : ''
                        }`}
                    onClick={() => onVideoSelect?.(video)}
                >
                    <CardContent className="p-3">
                        <div className="flex gap-3">
                            {/* Thumbnail */}
                            <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted group">
                                <img
                                    src={video.thumbnail || getYoutubeThumbnail(video.url)}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = '/placeholder-video.jpg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                                        <Play className="w-6 h-6 text-black ml-1" fill="black" />
                                    </div>
                                </div>
                                {video.duration > 0 && (
                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                                        {formatDuration(video.duration)}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium line-clamp-2 mb-1">{video.title}</h4>
                                {video.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                        {video.description}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="secondary" className="text-xs">
                                        {video.source}
                                    </Badge>
                                    {video.duration > 0 && (
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDuration(video.duration)}
                                        </span>
                                    )}
                                    <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary flex items-center gap-1 hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Kaynağı Aç
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
