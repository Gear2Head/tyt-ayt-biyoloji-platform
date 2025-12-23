'use client';

import React, { useState } from 'react';
import { studyPlansApi } from '@/lib/xano/xano-api';
import { StudyPlan } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Brain, Target, Clock, BookOpen } from 'lucide-react';

interface PlanGeneratorProps {
    onPlanCreated: (plan: StudyPlan) => void;
}

export function PlanGenerator({ onPlanCreated }: PlanGeneratorProps) {
    const [examType, setExamType] = useState<'TYT' | 'AYT' | 'BOTH'>('TYT');
    const [targetScore, setTargetScore] = useState('80');
    const [dailyTime, setDailyTime] = useState('120');
    const [weakTopics, setWeakTopics] = useState('');
    const [generating, setGenerating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerating(true);

        try {
            const plan = await studyPlansApi.create({
                examType,
                targetScore: parseInt(targetScore),
                dailyTimeMinutes: parseInt(dailyTime),
                weakTopics: weakTopics.split(',').map(t => t.trim()).filter(Boolean),
            });

            onPlanCreated(plan);
        } catch (error) {
            console.error('Failed to create study plan:', error);
            alert('Çalışma planı oluşturulamadı. Lütfen tekrar deneyin.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Kişisel Çalışma Planı Oluştur
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Exam Type Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-3">Sınav Türü</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['TYT', 'AYT', 'BOTH'] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setExamType(type)}
                                    className={`p-4 rounded-lg border-2 transition-all ${examType === type
                                            ? 'border-primary bg-primary/10 font-semibold'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    {type === 'BOTH' ? 'TYT + AYT' : type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Target Score */}
                    <div>
                        <label htmlFor="targetScore" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Hedef Net (0-100)
                        </label>
                        <Input
                            id="targetScore"
                            type="number"
                            min="0"
                            max="100"
                            value={targetScore}
                            onChange={(e) => setTargetScore(e.target.value)}
                            required
                        />
                    </div>

                    {/* Daily Study Time */}
                    <div>
                        <label htmlFor="dailyTime" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Günlük Çalışma Süresi (dakika)
                        </label>
                        <Input
                            id="dailyTime"
                            type="number"
                            min="30"
                            max="720"
                            step="30"
                            value={dailyTime}
                            onChange={(e) => setDailyTime(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            ~{Math.floor(parseInt(dailyTime) / 60)} saat {parseInt(dailyTime) % 60} dakika
                        </p>
                    </div>

                    {/* Weak Topics */}
                    <div>
                        <label htmlFor="weakTopics" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Zayıf Olduğunuz Konular (virgülle ayırın)
                        </label>
                        <Input
                            id="weakTopics"
                            type="text"
                            placeholder="Genetik, Ekosistem, Protein Sentezi"
                            value={weakTopics}
                            onChange={(e) => setWeakTopics(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            İsteğe bağlı - Ekstra odaklanmanız gereken konuları girin
                        </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full gradient-primary"
                        disabled={generating}
                    >
                        <Brain className="w-4 h-4 mr-2" />
                        {generating ? 'Plan Oluşturuluyor...' : 'Planı Oluştur'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
