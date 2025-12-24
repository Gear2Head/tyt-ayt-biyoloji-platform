'use client';

import { Achievement } from '@/lib/types';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Lock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementCardProps {
    achievement: Achievement;
    isUnlocked: boolean;
    progress?: number; // 0-100
}

export function AchievementCard({ achievement, isUnlocked, progress = 0 }: AchievementCardProps) {
    return (
        <Card className={cn(
            "relative overflow-hidden transition-all",
            isUnlocked
                ? "bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20"
                : "opacity-60 grayscale"
        )}>
            {isUnlocked && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            )}

            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center text-3xl relative",
                        isUnlocked
                            ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg"
                            : "bg-muted"
                    )}>
                        {isUnlocked ? (
                            achievement.icon
                        ) : (
                            <Lock className="w-6 h-6 text-muted-foreground" />
                        )}
                        {isUnlocked && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-lg">{achievement.name}</h4>
                            <Badge variant={isUnlocked ? "default" : "secondary"} className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {achievement.points} XP
                            </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                            {achievement.description}
                        </p>

                        {/* Progress (if not unlocked) */}
                        {!isUnlocked && progress > 0 && (
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>İlerleme</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        )}

                        {/* Category Badge */}
                        <Badge variant="outline" className="mt-2 text-xs">
                            {achievement.category === 'topic' && '📚 Konu'}
                            {achievement.category === 'quiz' && '📝 Quiz'}
                            {achievement.category === 'streak' && '🔥 Seri'}
                            {achievement.category === 'score' && '⭐ Skor'}
                            {achievement.category === 'special' && '✨ Özel'}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface AchievementGridProps {
    unlockedIds: string[];
    currentProgress: {
        completedTopics: number;
        completedQuizzes: number;
        streak: number;
        highestScore: number;
    };
}

export function AchievementGrid({ unlockedIds, currentProgress }: AchievementGridProps) {
    const calculateProgress = (ach: Achievement): number => {
        switch (ach.category) {
            case 'topic':
                return Math.min((currentProgress.completedTopics / ach.requirement) * 100, 100);
            case 'quiz':
                return Math.min((currentProgress.completedQuizzes / ach.requirement) * 100, 100);
            case 'streak':
                return Math.min((currentProgress.streak / ach.requirement) * 100, 100);
            case 'score':
                return Math.min((currentProgress.highestScore / ach.requirement) * 100, 100);
            default:
                return 0;
        }
    };

    const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
        const aUnlocked = unlockedIds.includes(a.id);
        const bUnlocked = unlockedIds.includes(b.id);
        if (aUnlocked !== bUnlocked) return aUnlocked ? -1 : 1;
        return b.points - a.points;
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedAchievements.map((achievement) => (
                <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={unlockedIds.includes(achievement.id)}
                    progress={calculateProgress(achievement)}
                />
            ))}
        </div>
    );
}
