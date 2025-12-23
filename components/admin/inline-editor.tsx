'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Check, X, Pencil } from 'lucide-react';
import { topicsApi } from '@/lib/xano/xano-api';
import { useAuth } from '@/lib/xano/xano-auth-context';

interface InlineEditorProps {
    topicId: string;
    initialContent: string;
    fieldName: 'contentAdmin' | 'contentAi';
    className?: string;
    onUpdate: (newContent: string) => void;
}

export function InlineEditor({ topicId, initialContent, fieldName, className, onUpdate }: InlineEditorProps) {
    const { isAdmin } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(initialContent);
    const [saving, setSaving] = useState(false);

    // Only admins can edit
    if (!isAdmin) return <div className={cn("whitespace-pre-wrap", className)}>{initialContent}</div>;

    const handleSave = async () => {
        setSaving(true);
        try {
            // Determine updates object based on field name
            const updates: any = {};
            if (fieldName === 'contentAdmin') {
                updates.content_admin = content;
                updates.source = 'ADMIN'; // If admin edits, source becomes ADMIN
            } else {
                // Even if editing AI content, we might want to save it to content_admin 
                // to preserve original AI generation? 
                // For now, let's assume we can patch specific fields if backend supports it.
                // NOTE: transformTopicFromXano maps content_ai -> contentAi
                updates.content_ai = content;
            }

            await topicsApi.update(topicId, updates);
            onUpdate(content);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save content:', error);
            alert('Kaydetme başarısız oldu.');
        } finally {
            setSaving(false);
        }
    };

    if (isEditing) {
        return (
            <div className="relative group border border-blue-500/50 rounded-lg p-2 bg-background/50 backdrop-blur-sm">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] w-full resize-none bg-transparent border-none focus:ring-0"
                    placeholder="İçerik giriniz..."
                />
                <div className="flex items-center gap-2 justify-end mt-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setContent(initialContent);
                            setIsEditing(false);
                        }}
                        disabled={saving}
                    >
                        <X className="w-4 h-4 mr-1" />
                        İptal
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Check className="w-4 h-4 mr-1" />
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative group">
            <div className={cn("whitespace-pre-wrap pr-8", className)}>
                {content || <span className="text-muted-foreground italic">Henüz içerik eklenmemiş. Düzenlemek için tıklayın.</span>}
            </div>
            <Button
                size="icon"
                variant="ghost"
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background shadow-sm"
                onClick={() => setIsEditing(true)}
                title="İçeriği Düzenle"
            >
                <Pencil className="w-4 h-4 text-blue-500" />
            </Button>
        </div>
    );
}
