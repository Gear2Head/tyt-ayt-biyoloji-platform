'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/xano/xano-auth-context';
import { useRouter } from 'next/navigation';
import { studyPlansApi } from '@/lib/xano/xano-api';
import { StudyPlan } from '@/lib/types';
import { PlanGenerator } from '@/components/study-plan/plan-generator';
import { PlanViewer } from '@/components/study-plan/plan-viewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Brain } from 'lucide-react';
import Link from 'next/link';

export default function StudyPlanPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [plans, setPlans] = useState<StudyPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showGenerator, setShowGenerator] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        loadPlans();
    }, [user]);

    const loadPlans = async () => {
        try {
            const data = await studyPlansApi.getUserPlans();
            setPlans(data);
            setShowGenerator(data.length === 0);
        } catch (error) {
            console.error('Failed to load study plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlanCreated = (plan: StudyPlan) => {
        setPlans([plan, ...plans]);
        setShowGenerator(false);
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Button>
                            </Link>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-gradient-primary rounded-lg">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-display font-bold">Çalışma Planım</h1>
                                    <p className="text-xs text-muted-foreground">
                                        Kişiselleştirilmiş öğrenme rotanız
                                    </p>
                                </div>
                            </div>
                        </div>
                        {plans.length > 0 && !showGenerator && (
                            <Button
                                onClick={() => setShowGenerator(true)}
                                size="sm"
                                className="gradient-primary"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Yeni Plan
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : showGenerator ? (
                    <div>
                        {plans.length > 0 && (
                            <Button
                                variant="ghost"
                                onClick={() => setShowGenerator(false)}
                                className="mb-4"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Mevcut Plana Dön
                            </Button>
                        )}
                        <PlanGenerator onPlanCreated={handlePlanCreated} />
                    </div>
                ) : plans.length > 0 ? (
                    <PlanViewer plan={plans[0]} />
                ) : (
                    <div className="text-center py-20">
                        <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Henüz çalışma planınız yok</h3>
                        <p className="text-muted-foreground mb-6">
                            AI destekli kişisel planınızı oluşturmak için butona tıklayın
                        </p>
                        <Button
                            onClick={() => setShowGenerator(true)}
                            className="gradient-primary"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Plan Oluştur
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
