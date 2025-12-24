'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/xano/xano-auth-context';
import { AdminConsoleUnlock } from '@/components/admin/admin-console-unlock';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { topicsApi, progressApi } from '@/lib/xano/xano-api';
import { GraduationCap, BookOpen, Brain, TrendingUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/mode-toggle';
import { UserNav } from '@/components/user-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
    const { user, signOut, isAdmin } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        completedCount: 0,
        inProgressCount: 0,
        totalTimeMinutes: 0,
        averageScore: 0
    });

    useEffect(() => {
        if (user) {
            loadStats();
        }
    }, [user]);

    const loadStats = async () => {
        try {
            const data = await progressApi.getStudyStats();
            if (data) {
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/topics?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-primary rounded-lg">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-display font-bold">TYT-AYT Biyoloji</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <ModeToggle />
                            <UserNav />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Admin Console Unlock */}
                {isAdmin && (
                    <div className="mb-8">
                        <AdminConsoleUnlock />
                    </div>
                )}

                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-display font-bold mb-2">
                                <span className="text-gradient">Hoş Geldin!</span>
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Bugün hangi konuyu çalışmak istersin?
                            </p>
                        </div>
                        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Konu ara..."
                                className="pl-10 h-12 bg-card/50 border-primary/20 focus:border-primary transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { icon: BookOpen, label: 'Tamamlanan', value: stats.completedCount.toString(), color: 'from-primary to-purple-500' },
                        { icon: Brain, label: 'Devam Eden', value: stats.inProgressCount.toString(), color: 'from-accent to-cyan-500' },
                        { icon: TrendingUp, label: 'Toplam Süre', value: `${stats.totalTimeMinutes} dk`, color: 'from-success to-emerald-500' },
                        { icon: GraduationCap, label: 'Başarı Puanı', value: `%${stats.averageScore}`, color: 'from-warning to-amber-500' },
                    ].map((stat, i) => (
                        <Card key={i} className="hover-lift">
                            <CardContent className="p-6">
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-3xl font-display font-bold mb-1">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="hover-lift">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="w-5 h-5 text-primary" />
                                Kişisel Çalışma Planı
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                AI destekli çalışma planını görüntüle ve takip et.
                            </p>
                            <Link href="/study-plan">
                                <Button className="w-full gradient-primary">
                                    Planımı Gör
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover-lift">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-accent" />
                                Konu Listesi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                TYT ve AYT konularına göz at ve çalışmaya başla.
                            </p>
                            <Link href="/topics">
                                <Button className="w-full gradient-accent">
                                    Konulara Git
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Info Message */}
                <div className="mt-8 p-6 glass rounded-xl border-2 border-primary/20">
                    <h3 className="text-lg font-semibold mb-2">🚀 Platform Geliştirme Aşamasında</h3>
                    <p className="text-muted-foreground">
                        Bu demo, temel altyapı ve güvenlik sistemlerini göstermektedir.
                        Konu içerikleri, AI özellikleri ve diğer fonksiyonlar yakında eklenecektir.
                    </p>
                    {isAdmin && (
                        <p className="mt-4 text-sm text-success">
                            ✅ Admin hesabı olarak giriş yaptınız. Profil sayfasında admin konsol kodunu girebilirsiniz.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
