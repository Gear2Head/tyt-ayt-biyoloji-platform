'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/xano/xano-auth-context';
import { commentsApi } from '@/lib/xano/xano-api';
import { Comment } from '@/lib/types';
import { CommentItem } from './comment-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface CommentSectionProps {
    topicId: string;
}

export function CommentSection({ topicId }: CommentSectionProps) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
    }, [topicId]);

    const loadComments = async () => {
        try {
            const data = await commentsApi.getByTopicId(topicId);
            setComments(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || submitting) return;

        setSubmitting(true);
        try {
            const comment = await commentsApi.create(topicId, newComment.trim());
            setComments([comment, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to create comment:', error);
            alert('Yorum eklenemedi. Lütfen tekrar deneyin.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (commentId: string) => {
        try {
            const updatedComment = await commentsApi.toggleLike(commentId);
            setComments(comments.map(c => c.id === commentId ? updatedComment : c));
        } catch (error) {
            console.error('Failed to like comment:', error);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

        try {
            await commentsApi.delete(commentId);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert('Yorum silinemedi. Lütfen tekrar deneyin.');
        }
    };

    const handleToggleLock = async (commentId: string) => {
        try {
            const updatedComment = await commentsApi.toggleLock(commentId);
            setComments(comments.map(c => c.id === commentId ? updatedComment : c));
        } catch (error) {
            console.error('Failed to toggle lock:', error);
        }
    };

    if (!user) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Yorumlar ({comments.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* New Comment Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Yorumunuzu yazın..."
                        className="min-h-[100px] resize-none"
                        maxLength={1000}
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            {newComment.length}/1000 karakter
                        </span>
                        <Button
                            type="submit"
                            disabled={!newComment.trim() || submitting}
                            className="gradient-primary"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            {submitting ? 'Gönderiliyor...' : 'Gönder'}
                        </Button>
                    </div>
                </form>

                {/* Comments List */}
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Henüz yorum yapılmamış.</p>
                        <p className="text-sm text-muted-foreground">İlk yorumu siz yapın!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onLike={handleLike}
                                onDelete={handleDelete}
                                onToggleLock={handleToggleLock}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
