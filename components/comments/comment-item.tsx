import React from 'react';
import { Comment } from '@/lib/types';
import { useAuth } from '@/lib/xano/xano-auth-context';
import { ThumbsUp, Trash2, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CommentItemProps {
    comment: Comment;
    onLike: (commentId: string) => void;
    onDelete: (commentId: string) => void;
    onToggleLock: (commentId: string) => void;
}

export function CommentItem({ comment, onLike, onDelete, onToggleLock }: CommentItemProps) {
    const { user, isModerator } = useAuth();
    const isOwner = user?.uid === comment.userId;
    const canModerate = isModerator;
    const canDelete = isOwner || canModerate;

    return (
        <Card className={cn(
            "transition-all",
            comment.isLocked && "opacity-60 border-yellow-500/30"
        )}>
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold shrink-0">
                        {comment.userName.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm">{comment.userName}</span>
                            <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                            {comment.isLocked && (
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-600 border border-yellow-500/30 flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    Kilitli
                                </span>
                            )}
                        </div>

                        {/* Comment Text */}
                        <p className="text-sm text-foreground mb-3 whitespace-pre-wrap">
                            {comment.text}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Like Button */}
                            {!comment.isLocked && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onLike(comment.id)}
                                    className="h-8 px-2 text-muted-foreground hover:text-primary"
                                >
                                    <ThumbsUp className="w-4 h-4 mr-1" />
                                    <span className="text-xs">{comment.likes}</span>
                                </Button>
                            )}

                            {/* Delete Button */}
                            {canDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(comment.id)}
                                    className="h-8 px-2 text-muted-foreground hover:text-red-600"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    <span className="text-xs">Sil</span>
                                </Button>
                            )}

                            {/* Lock/Unlock Button (Moderators only) */}
                            {canModerate && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onToggleLock(comment.id)}
                                    className="h-8 px-2 text-muted-foreground hover:text-yellow-600"
                                >
                                    {comment.isLocked ? (
                                        <>
                                            <Unlock className="w-4 h-4 mr-1" />
                                            <span className="text-xs">Kilidi Aç</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4 mr-1" />
                                            <span className="text-xs">Kilitle</span>
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
