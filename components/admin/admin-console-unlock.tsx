'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/xano/xano-auth-context';
import { ADMIN_CONSOLE_CODE, MAX_LOGIN_ATTEMPTS, LOCKOUT_DURATION, ADMIN_EMAIL } from '@/lib/types';
import { Lock, Unlock, Shield, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AdminConsoleUnlock() {
    const { user } = useAuth();
    const [code, setCode] = useState('');
    const [unlocked, setUnlocked] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [lockedUntil, setLockedUntil] = useState<number | null>(null);
    const [error, setError] = useState('');

    // Check if user is admin
    const isAdminUser = user?.email === ADMIN_EMAIL;

    // Check lockout status
    useEffect(() => {
        const locked = localStorage.getItem('admin_console_locked');
        if (locked) {
            const lockoutTime = parseInt(locked);
            if (Date.now() < lockoutTime) {
                setLockedUntil(lockoutTime);
            } else {
                localStorage.removeItem('admin_console_locked');
                localStorage.removeItem('admin_console_attempts');
            }
        }

        // Check if previously unlocked
        const unlockedSession = sessionStorage.getItem('admin_console_unlocked');
        if (unlockedSession === 'true') {
            setUnlocked(true);
        }

        // Get attempt count
        const attemptCount = localStorage.getItem('admin_console_attempts');
        if (attemptCount) {
            setAttempts(parseInt(attemptCount));
        }
    }, []);

    // Update lockout timer
    useEffect(() => {
        if (lockedUntil) {
            const interval = setInterval(() => {
                if (Date.now() >= lockedUntil) {
                    setLockedUntil(null);
                    localStorage.removeItem('admin_console_locked');
                    localStorage.removeItem('admin_console_attempts');
                    setAttempts(0);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [lockedUntil]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (lockedUntil) {
            const remainingSeconds = Math.ceil((lockedUntil - Date.now()) / 1000);
            setError(`Çok fazla hatalı deneme. ${Math.floor(remainingSeconds / 60)} dakika ${remainingSeconds % 60} saniye sonra tekrar deneyin.`);
            return;
        }

        if (code === ADMIN_CONSOLE_CODE) {
            // Successful unlock
            setUnlocked(true);
            sessionStorage.setItem('admin_console_unlocked', 'true');
            localStorage.removeItem('admin_console_attempts');
            setAttempts(0);
            setError('');

            // Log successful access (in production, send to backend)
            console.log(`[ADMIN CONSOLE] Başarılı erişim - User: ${user?.email} - ${new Date().toISOString()}`);
        } else {
            // Failed attempt
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            localStorage.setItem('admin_console_attempts', newAttempts.toString());

            if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
                const lockUntil = Date.now() + LOCKOUT_DURATION;
                setLockedUntil(lockUntil);
                localStorage.setItem('admin_console_locked', lockUntil.toString());
                setError(`Çok fazla hatalı deneme! 10 dakika boyunca kilitlendiniz.`);

                // Log lockout (in production, send to backend)
                console.warn(`[ADMIN CONSOLE] Hesap kilitlendi - User: ${user?.email} - ${new Date().toISOString()}`);
            } else {
                setError(`Yanlış kod! Kalan deneme: ${MAX_LOGIN_ATTEMPTS - newAttempts}`);

                // Log failed attempt (in production, send to backend)
                console.warn(`[ADMIN CONSOLE] Başarısız deneme #${newAttempts} - User: ${user?.email} - ${new Date().toISOString()}`);
            }

            setCode('');
        }
    };

    // Don't show if not admin user
    if (!isAdminUser) {
        return null;
    }

    if (unlocked) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
            >
                <div className="glass rounded-xl p-6 border-2 border-emerald-500/30 bg-emerald-500/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500 rounded-lg">
                                <Unlock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-emerald-900 dark:text-emerald-400">Yönetici Modu Aktif</h3>
                                <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">Tam yetkili erişim sağlandı</p>
                            </div>
                        </div>
                        <Link href="/admin">
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <Shield className="w-4 h-4 mr-2" />
                                Admin Paneline Git
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-background/50 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30 text-center">
                            <div className="text-xl font-bold text-emerald-600">Aktif</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Durum</div>
                        </div>
                        <div className="bg-background/50 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30 text-center">
                            <div className="text-xl font-bold text-emerald-600">{user?.role === 'admin' ? 'Tam' : 'Sınırlı'}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Yetki</div>
                        </div>
                        <div className="bg-background/50 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30 text-center">
                            <div className="text-xl font-bold text-emerald-600">Güvenli</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Bağlantı</div>
                        </div>
                        <div className="bg-background/50 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30 text-center cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" onClick={() => {
                            setUnlocked(false);
                            sessionStorage.removeItem('admin_console_unlocked');
                        }}>
                            <div className="text-xl font-bold text-red-500">Kapat</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Otumu Kapat</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl p-8 border-2 border-primary/20"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                        <div className="relative p-4 bg-gradient-primary rounded-full">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="mt-4 text-2xl font-display font-bold text-foreground">
                        Admin Konsolu
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground text-center">
                        Gizli konsol kodunu girerek admin paneline erişin
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="admin-code" className="block text-sm font-medium mb-2">
                            Konsol Kodu
                        </label>
                        <input
                            type="password"
                            id="admin-code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={!!lockedUntil}
                            className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300"
                            placeholder="Gizli kodu girin..."
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg"
                            >
                                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-destructive">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={!code || !!lockedUntil}
                        className="w-full px-4 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Unlock className="w-4 h-4" />
                        Konsolu Aç
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                        {attempts > 0 && !lockedUntil && (
                            <span className="text-warning">
                                Uyarı: {attempts}/{MAX_LOGIN_ATTEMPTS} deneme yapıldı
                            </span>
                        )}
                        {lockedUntil && (
                            <span className="text-destructive">
                                Güvenlik nedeniyle geçici olarak kilitlendi
                            </span>
                        )}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
