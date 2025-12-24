'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/xano/xano-auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AchievementGrid } from '@/components/achievements/achievement-card';
import { ACHIEVEMENTS } from '@/lib/achievements';

export default function AchievementsPage() {
    const { user } = useAuth();
    const router = useRouter();

    // Mock data - will be replaced with real data from Xano
    const [unlockedAchievements] = useState<string[]>(['first_topic', 'first_quiz']);
    const [currentProgress] = useState({
        completedTopics: user?.completedTopics?.length || 0,
        completedQuizzes: 0,
        streak: 0,
        highestScore: 0
    });

    if (!user) {
        router.push('/login');
        return null;
    }

    const totalAchievements = ACHIEVEMENTS.length;
    const unlockedCount = unlockedAchievements.length;
    const totalPoints = ACHIEVEMENTS.reduce((sum, ach) =>
        unlockedAchievements.includes(ach.id) ? sum + ach.points : sum, 0
    );
    const maxPoints = ACHIEVEMENTS.reduce((sum, ach) => sum + ach.points, 0);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-background sticky top-0 z-50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link href="/profile">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Profile'e Dön
                        </Button>
                    </Link>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-display font-bold">Başarımlar</h1>
                                <p className="text-muted-foreground">Rozetlerini topla ve XP kazan</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-3xl font-bold text-amber-600">
                                {unlockedCount}/{totalAchievements}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Kazanılan Rozet
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Trophy className="w-8 h-8 text-amber-600" />
                                <div>
                                    <div className="text-2xl font-bold">{unlockedCount}</div>
                                    <div className="text-xs text-muted-foreground">Kazanılan Rozet</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Star className="w-8 h-8 text-blue-600" />
                                <div>
                                    <div className="text-2xl font-bold">{totalPoints}</div>
                                    <div className="text-xs text-muted-foreground">Toplam XP</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-8 h-8 text-green-600" />
                                <div>
                                    <div className="text-2xl font-bold">
                                        {Math.round((unlockedCount / totalAchievements) * 100)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">Tamamlama Oranı</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Achievements Grid */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Tüm Başarımlar</h2>
                    <AchievementGrid
                        unlockedIds={unlockedAchievements}
                        currentProgress={currentProgress}
                    />
                </div>
            </main>
        </div>
    );
}
