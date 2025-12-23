'use client';

import { useAuth } from '@/lib/xano/xano-auth-context';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Crown, Shield, Users as UsersIcon, Calendar, Clock, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
    const { user, signOut, isAdmin, isModerator } = useAuth();
    const router = useRouter();

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
            {/* Header */}
            <div className="bg-muted/30 border-b pb-12 pt-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Dashboard'a Dön
                    </Link>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg ring-4 ring-background">
                                <span className="text-3xl font-bold text-white">
                                    {user.displayName?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-background p-1.5 rounded-full shadow-sm border">
                                <Settings className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </div>

                        <div className="text-center md:text-left space-y-2 flex-1">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <h1 className="text-3xl font-display font-bold">{user.displayName}</h1>
                                {getRoleBadge()}
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                            </div>
                        </div>

                        <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Çıkış Yap
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
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

                        {/* Recent Activity Placeholder - Could be actual data later */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Son Aktiviteler</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground text-center py-8">
                                    Henüz kaydedilmiş bir aktivite bulunmuyor.
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar / Admin Panel Access */}
                    <div className="space-y-6">
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
                                    <div className="bg-background/80 backdrop-blur p-3 rounded border text-center">
                                        <span className="text-xs text-muted-foreground block mb-1">Erişim Kodu</span>
                                        <code className="text-sm font-bold text-amber-600 dark:text-amber-400">GearAdmin9150</code>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
