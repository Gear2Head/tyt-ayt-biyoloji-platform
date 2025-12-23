'use client';

import { useAuth } from '@/lib/xano/xano-auth-context';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Crown, Shield, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold">
                    <Crown className="w-4 h-4" />
                    Admin
                </div>
            );
        }
        if (isModerator) {
            return (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold">
                    <Shield className="w-4 h-4" />
                    Moderatör
                </div>
            );
        }
        return (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold">
                <UsersIcon className="w-4 h-4" />
                Üye
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/dashboard">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Dashboard'a Dön
                    </Button>
                </Link>

                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold mb-2">
                        <span className="text-gradient">Profilim</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Hesap bilgilerinizi görüntüleyin
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Profile Card */}
                    <Card className="glass border-2 border-primary/20">
                        <CardHeader>
                            <CardTitle>Kullanıcı Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-gradient-primary rounded-full">
                                    <User className="w-12 h-12 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-2xl font-display font-bold">{user.displayName}</h2>
                                        {getRoleBadge()}
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border">
                                <dl className="space-y-3">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Üyelik Durumu</dt>
                                        <dd className="font-semibold">Aktif</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Kayıt Tarihi</dt>
                                        <dd className="font-semibold">
                                            {user.createdAt && new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Son Giriş</dt>
                                        <dd className="font-semibold">
                                            {user.lastLoginAt && new Date(user.lastLoginAt).toLocaleDateString('tr-TR')}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Admin Console Access */}
                    {isAdmin && (
                        <Card className="border-2 border-amber-500/30 bg-amber-500/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                    <Crown className="w-5 h-5" />
                                    Admin Konsol Erişimi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Admin konsol koduyla özel yönetim paneline erişebilirsiniz.
                                    Kodu Dashboard'da sol üstteki profil simgesine tıklayarak girebilirsiniz.
                                </p>
                                <div className="p-4 bg-background rounded-lg border border-border">
                                    <p className="text-xs text-muted-foreground mb-1">Konsol Kodu:</p>
                                    <p className="text-sm font-mono font-bold">GearAdmin9150</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hesap İşlemleri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleSignOut}
                            >
                                Çıkış Yap
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
