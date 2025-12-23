'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/xano/xano-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, MessageSquare, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ContentStats() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTopics: 0,
        totalComments: 0,
        totalStudyPlans: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await adminApi.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statItems = [
        {
            label: 'Toplam Kullanıcı',
            value: stats.totalUsers,
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            label: 'Toplam Konu',
            value: stats.totalTopics,
            icon: BookOpen,
            color: 'from-purple-500 to-pink-500',
        },
        {
            label: 'Toplam Yorum',
            value: stats.totalComments,
            icon: MessageSquare,
            color: 'from-orange-500 to-amber-500',
        },
        {
            label: 'Oluşturulan Plan',
            value: stats.totalStudyPlans,
            icon: Calendar,
            color: 'from-green-500 to-emerald-500',
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-20 bg-muted rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((stat, i) => (
                <Card key={i} className="hover-lift">
                    <CardContent className="p-6">
                        <div className={cn(
                            "inline-flex p-3 rounded-xl bg-gradient-to-br mb-3",
                            stat.color
                        )}>
                            <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-3xl font-display font-bold mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
