'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/xano/xano-auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return;
        }

        if (password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, displayName);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Kayıt başarısız. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 animated-gradient opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>

            <Card className="relative z-10 w-full max-w-md glass border-2 border-primary/20">
                <CardHeader className="text-center space-y-2 pt-8">
                    <div className="inline-flex justify-center">
                        <div className="p-4 bg-gradient-primary rounded-2xl">
                            <GraduationCap className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-display font-bold">Kayıt Ol</h1>
                    <p className="text-muted-foreground">
                        Başarı yolculuğuna başla
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="displayName" className="text-sm font-medium">
                                Ad Soyad
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="displayName"
                                    type="text"
                                    placeholder="Ahmet Yılmaz"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                E-posta
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Şifre
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">
                                Şifre Tekrar
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full gradient-primary"
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Kayıt yapılıyor...
                                </>
                            ) : (
                                'Kayıt Ol'
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <div className="text-center text-sm text-muted-foreground">
                        Zaten hesabın var mı?{' '}
                        <Link href="/login" className="text-primary font-semibold hover:underline">
                            Giriş Yap
                        </Link>
                    </div>
                    <Link href="/" className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                        ← Ana Sayfaya Dön
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
