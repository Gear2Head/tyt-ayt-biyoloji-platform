'use client';

import { useAuth } from '@/lib/xano/xano-auth-context';
import { AdminConsoleUnlock } from '@/components/admin/admin-console-unlock';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, BookOpen, Brain, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { UserNav } from '@/components/user-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
    const { user, signOut, isAdmin } = useAuth();
    const router = useRouter();

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
                    <h1 className="text-4xl font-display font-bold mb-2">
                        <span className="text-gradient">Hoş Geldin!</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Bugün hangi konuyu çalışmak istersin?
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { icon: BookOpen, label: 'Tamamlanan', value: '12', color: 'from-primary to-purple-500' },
                        { icon: Brain, label: 'Devam Eden', value: '3', color: 'from-accent to-cyan-500' },
                        { icon: TrendingUp, label: 'İlerleme', value: '68%', color: 'from-success to-emerald-500' },
                        { icon: GraduationCap, label: 'Seviye', value: 'İyi', color: 'from-warning to-amber-500' },
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
