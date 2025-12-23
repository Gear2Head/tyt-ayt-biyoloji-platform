'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/xano/xano-auth-context';
import { useRouter } from 'next/navigation';
import { ContentStats } from '@/components/admin/content-stats';
import { UserManagement } from '@/components/admin/user-management';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    const { user, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (!isAdmin) {
            router.push('/dashboard');
        }
    }, [user, isAdmin]);

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Erişim Reddedildi</h2>
                    <p className="text-muted-foreground mb-6">Bu sayfaya erişim yetkiniz yok.</p>
                    <Link href="/dashboard">
                        <Button>Dashboard'a Dön</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Button>
                            </Link>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-display font-bold">Admin Panel</h1>
                                    <p className="text-xs text-muted-foreground">
                                        Sistem Yönetimi
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-sm">
                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-600 border border-red-500/30 font-semibold">
                                Admin
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Welcome Banner */}
                <div className="p-6 glass rounded-xl border-2 border-primary/20">
                    <h2 className="text-2xl font-display font-bold mb-2">
                        Hoş Geldin, <span className="text-gradient">{user.displayName}</span>
                    </h2>
                    <p className="text-muted-foreground">
                        Sys admin panelinden platformu yönetebilir, kullanıcı rollerini düzenleyebilir ve içerikleri moderasyonunu yapabilirsiniz.
                    </p>
                </div>

                {/* Content Statistics */}
                <ContentStats />

                {/* User Management */}
                <UserManagement />
            </main>
        </div>
    );
}
