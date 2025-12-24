'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
    videoId: string; // YouTube video ID
    title?: string;
    description?: string;
}

export function VideoPlayer({ videoId, title, description }: VideoPlayerProps) {
    const [isReady, setIsReady] = useState(false);

    // Extract video ID from full URL if provided
    const extractVideoId = (id: string): string => {
        if (id.includes('youtube.com') || id.includes('youtu.be')) {
            const urlParams = new URLSearchParams(new URL(id).search);
            return urlParams.get('v') || id.split('/').pop() || id;
        }
        return id;
    };

    const cleanVideoId = extractVideoId(videoId);

    return (
        <Card>
            {title && (
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary" />
                        {title}
                    </CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            )}
            <CardContent className={title ? '' : 'p-0'}>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${cleanVideoId}?rel=0&modestbranding=1`}
                        title={title || 'Video'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => setIsReady(true)}
                    />
                    {!isReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
