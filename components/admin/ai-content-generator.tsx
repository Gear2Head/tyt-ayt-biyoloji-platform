'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { topicsApi } from '@/lib/xano/xano-api';
import { Bot, RefreshCw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/xano/xano-auth-context';

interface AiContentGeneratorProps {
    topicId: string;
    lastUpdate?: Date;
    onSuccess: (updatedTopic: any) => void;
}

export function AiContentGenerator({ topicId, lastUpdate, onSuccess }: AiContentGeneratorProps) {
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Only admins can see this
    if (!isAdmin) return null;

    const handleGenerate = async () => {
        if (!confirm('Mevcut AI içeriği yeniden oluşturulacak. Emin misiniz?')) return;

        setLoading(true);
        setError(null);
        try {
            const updatedTopic = await topicsApi.generateAiContent(topicId);
            onSuccess(updatedTopic);
        } catch (err) {
            console.error('AI Error:', err);
            // Simulate success for demo purposes if backend is missing
            setError('AI servisi şu an yanıt vermiyor (Xano endpoint kurulu mu?)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                    <Bot className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                    <h4 className="font-semibold text-purple-900 text-sm">AI İçerik Üretici</h4>
                    <p className="text-xs text-purple-700">
                        {lastUpdate
                            ? `Son güncelleme: ${lastUpdate.toLocaleDateString('tr-TR')} ${lastUpdate.toLocaleTimeString('tr-TR')}`
                            : 'Henüz AI içeriği üretilmedi'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {error && (
                    <span className="text-xs text-red-600 flex items-center bg-red-50 px-2 py-1 rounded">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Ayar Gerekli
                    </span>
                )}
                <Button
                    size="sm"
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                    {loading ? (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Üretiliyor...
                        </>
                    ) : (
                        <>
                            <Bot className="w-4 h-4 mr-2" />
                            İçerik Üret
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
