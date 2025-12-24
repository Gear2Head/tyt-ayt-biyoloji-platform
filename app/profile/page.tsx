'use client';

import { useAuth } from '@/lib/xano/xano-auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    ArrowLeft, User, Mail, Crown, Shield, Users as UsersIcon,
    Calendar, Clock, LogOut, Settings, Trophy, Target,
    BookOpen, Award, TrendingUp, Zap, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
    const { user, signOut, isAdmin, isModerator } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        level: 1,
        xp: 0,
        xpToNext: 100,
        completedTopics: user?.completedTopics?.length || 0,
        totalQuestions: 0,
        streak: 0,
        accuracy: 0
    });

    useEffect(() => {
        // Calculate XP based on completed topics
        if (user) {
            const completed = user.completedTopics?.length || 0;
            const level = Math.floor(completed / 5) + 1;
            const xp = (completed % 5) * 20;
            setStats(prev => ({
                ...prev,
                level,
                xp,
                xpToNext: 100,
                completedTopics: completed
            }));
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const getRoleBadge = () => {
        if (isAdmin) {
            return (
                <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500 border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    Admin
                </Badge>
            );
        }
        if (isModerator) {
            return (
                <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-indigo-500 border-0">
                    <Shield className="w-3 h-3 mr-1" />
                    Moderatör
                </Badge>
            );
        }
        return (
            <Badge variant="secondary">
                <UsersIcon className="w-3 h-3 mr-1" />
                Üye
            </Badge>
        );
    };

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Modern Header with Level Bar */}
            <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-b pb-12 pt-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Dashboard'a Dön
                    </Link>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Profile Avatar with Level */}
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full bg-gradient-primary flex items-center justify-center shadow-xl ring-4 ring-background">
                                <span className="text-4xl font-bold text-white">
                                    {user.displayName?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full shadow-lg border-4 border-background font-bold text-sm">
                                <Star className="w-3 h-3 inline mr-1" />
                                Lvl {stats.level}
                            </div>
                        </div>

                        {/* User Info & XP Bar */}
                        <div className="text-center md:text-left space-y-3 flex-1">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                                <div>
                                    <h1 className="text-3xl font-display font-bold mb-2">{user.displayName}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-2">
                                        <Mail className="w-4 h-4" />
                                        <span>{user.email}</span>
                                    </div>
                                    {getRoleBadge()}
                                </div>
                            </div>

                            {/* XP Progress Bar */}
                            <div className="max-w-md">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Deneyim Puanı</span>
                                    <span className="font-semibold">{stats.xp} / {stats.xpToNext} XP</span>
                                </div>
                                <Progress value={(stats.xp / stats.xpToNext) * 100} className="h-3" />
                            </div>
                        </div>

                        <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Çıkış Yap
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Stats - 2 Columns */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
                                <CardContent className="pt-6 text-center">
                                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                    <div className="text-2xl font-bold">{stats.completedTopics}</div>
                                    <div className="text-xs text-muted-foreground">Tamamlanan Konu</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20">
                                <CardContent className="pt-6 text-center">
                                    <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                                    <div className="text-xs text-muted-foreground">Çözülen Soru</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/20">
                                <CardContent className="pt-6 text-center">
                                    <Zap className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                                    <div className="text-2xl font-bold">{stats.streak}</div>
                                    <div className="text-xs text-muted-foreground">Günlük Seri</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20">
                                <CardContent className="pt-6 text-center">
                                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                    <div className="text-2xl font-bold">{stats.accuracy}%</div>
                                    <div className="text-xs text-muted-foreground">Doğruluk Oranı</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Account Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Hesap Detayları</CardTitle>
                                <CardDescription>Üyelik bilgileriniz ve hesap durumunuz.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-muted/50 border space-y-1">
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Kayıt Tarihi
                                        </div>
                                        <div className="font-medium">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-muted/50 border space-y-1">
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Son Giriş
                                        </div>
                                        <div className="font-medium">
                                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Şimdi'}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Achievements Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-500" />
                                    Başarımlar
                                </CardTitle>
                                <CardDescription>Kazandığınız rozetler ve ödüller</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground text-center py-8">
                                    🏆 Yakında! Başarım sistemi çok yakında eklenecek.
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - 1 Column */}
                    <div className="space-y-6">
                        {/* Admin Panel Access */}
                        {isAdmin && (
                            <Card className="border-amber-500/20 bg-amber-500/5 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>
                                <CardHeader>
                                    <CardTitle className="text-amber-700 dark:text-amber-400 flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Yönetici Paneli
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Sistem ayarlarına ve özel yönetim araçlarına şifreli erişim.
                                    </p>
                                    <Link href="/admin">
                                        <Button variant="outline" className="w-full">
                                            Admin Panel'e Git
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Hızlı Erişim</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Link href="/topics">
                                    <Button variant="ghost" className="w-full justify-start">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Konular
                                    </Button>
                                </Link>
                                <Link href="/dashboard">
                                    <Button variant="ghost" className="w-full justify-start">
                                        <Target className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button variant="ghost" className="w-full justify-start" disabled>
                                    <Award className="w-4 h-4 mr-2" />
                                    Sorular (Yakında)
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
