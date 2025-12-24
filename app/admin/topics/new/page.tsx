'use client';

import { useAuth } from '@/lib/xano/xano-auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { TopicEditor } from '@/components/admin/topic-editor';

export default function NewTopicPage() {
    const { user, isAdmin } = useAuth();
    const router = useRouter();

    if (!user) {
        router.push('/login');
        return null;
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="text-destructive">Bu sayfaya erişim yetkiniz yok.</p>
                        <Link href="/dashboard">
                            <Button className="mt-4">Dashboard'a Dön</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Admin Panel
                        </Button>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-display font-bold">Yeni Konu Ekle</h1>
                            <p className="text-sm text-muted-foreground">
                                Platforma yeni bir konu ekleyin
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <TopicEditor />
            </main>
        </div>
    );
}
