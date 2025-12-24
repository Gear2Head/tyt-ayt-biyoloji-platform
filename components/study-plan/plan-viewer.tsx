import React from 'react';
import { StudyPlan } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Target, Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanViewerProps {
    plan: StudyPlan;
}

export function PlanViewer({ plan }: PlanViewerProps) {
    const examTypeLabel = plan.examType === 'BOTH' ? 'TYT + AYT' : plan.examType;

    return (
        <div className="space-y-6">
            {/* Plan Overview */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Çalışma Planınız
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                            <div className="p-2 rounded-lg bg-primary/20">
                                <Target className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Sınav</p>
                                <p className="font-semibold">{examTypeLabel}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                            <div className="p-2 rounded-lg bg-accent/20">
                                <Target className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Hedef</p>
                                <p className="font-semibold">{plan.targetScore} Net</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                            <div className="p-2 rounded-lg bg-success/20">
                                <Clock className="w-5 h-5 text-success" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Günlük Süre</p>
                                <p className="font-semibold">{plan.dailyTimeMinutes} dk</p>
                            </div>
                        </div>
                    </div>

                    {/* Weak Topics */}
                    {Array.isArray(plan.weakTopics) && plan.weakTopics.length > 0 && (
                        <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-warning" />
                                Ekstra Odaklanma Gereken Konular:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {plan.weakTopics.map((topic, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 rounded-md text-xs font-medium bg-warning/20 text-warning border border-warning/30"
                                    >
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Daily Tasks */}
            {plan.plan && Array.isArray(plan.plan.dailyTasks) && plan.plan.dailyTasks.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-success" />
                            Günlük Görevler
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {plan.plan.dailyTasks.map((task, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold">Gün {task.day}</h4>
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {task.duration} dk
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(task.topics) && task.topics.map((topicId, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 rounded text-xs bg-primary/10 text-primary"
                                            >
                                                Konu #{topicId}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Weekly Goals */}
            {plan.plan && Array.isArray(plan.plan.weeklyGoals) && plan.plan.weeklyGoals.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-accent" />
                            Haftalık Hedefler
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {plan.plan.weeklyGoals.map((goal, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                                    <span className="text-sm">{goal}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {(!plan.plan || (!plan.plan.dailyTasks?.length && !plan.plan.weeklyGoals?.length)) && (
                <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">
                            Plan detayları henüz oluşturulmadı. Backend tarafından plan oluşturulması bekleniyor.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
