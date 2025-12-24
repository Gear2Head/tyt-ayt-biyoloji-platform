'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Youtube, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Sample video data - will be replaced with real data from Xano
const SAMPLE_VIDEOS = [
    {
        id: '1',
        title: 'Fotosentez - Kloroplast Yapısı',
        videoId: 'dQw4w9WgXcQ', // Placeholder
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        category: '12-sinif'
    },
    {
        id: '2',
        title: 'Hücresel Solunum - Glikoliz',
        videoId: 'dQw4w9WgXcQ', // Placeholder
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        category: '12-sinif'
    },
    {
        id: '3',
        title: 'Bitki Dokuları - Meristem',
        videoId: 'dQw4w9WgXcQ', // Placeholder
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        category: '11-sinif'
    }
];

export function VideoWidget() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-red-600" />
                    <span>Popüler Videolar</span>
                    <TrendingUp className="w-4 h-4 text-muted-foreground ml-auto" />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {SAMPLE_VIDEOS.map((video) => (
                    <Link
                        key={video.id}
                        href={`https://youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                        <div className="relative w-32 h-18 flex-shrink-0 rounded overflow-hidden bg-muted">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                                    <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-2 mb-1">{video.title}</p>
                            <p className="text-xs text-muted-foreground">{video.category}</p>
                        </div>
                    </Link>
                ))}

                <Link href="/videos" className="block">
                    <button className="w-full mt-2 text-sm text-primary hover:underline">
                        Tüm Videoları Görüntüle →
                    </button>
                </Link>
            </CardContent>
        </Card>
    );
}
