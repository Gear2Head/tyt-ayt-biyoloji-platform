'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';
import { Question } from '@/lib/types';

interface AIQuestionGeneratorProps {
    topicId?: string;
    onQuestionsGenerated?: (questions: Question[]) => void;
}

export function AIQuestionGenerator({ topicId, onQuestionsGenerated }: AIQuestionGeneratorProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        topic: '',
        difficulty: 'orta' as 'kolay' | 'orta' | 'zor',
        examType: 'TYT' as 'TYT' | 'AYT',
        count: 5,
        keywords: ''
    });

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/ai/generate-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: formData.topic,
                    difficulty: formData.difficulty,
                    examType: formData.examType,
                    count: formData.count,
                    keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
                    topicId
                })
            });

            if (!response.ok) throw new Error('Soru üretimi başarısız');

            const data = await response.json();
            onQuestionsGenerated?.(data.questions);
        } catch (error) {
            console.error('AI soru üretimi hatası:', error);
            alert('Soru üretilemedi. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Soru Üretici
                </CardTitle>
                <CardDescription>
                    Yapay zeka ile özel sorular oluşturun
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="topic">Konu Başlığı</Label>
                    <Input
                        id="topic"
                        placeholder="Örn: Fotosentez ve Kemosentez"
                        value={formData.topic}
                        onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Zorluk</Label>
                        <Select
                            value={formData.difficulty}
                            onValueChange={(value: any) => setFormData(prev => ({ ...prev, difficulty: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kolay">Kolay</SelectItem>
                                <SelectItem value="orta">Orta</SelectItem>
                                <SelectItem value="zor">Zor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Sınav Türü</Label>
                        <Select
                            value={formData.examType}
                            onValueChange={(value: any) => setFormData(prev => ({ ...prev, examType: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TYT">TYT</SelectItem>
                                <SelectItem value="AYT">AYT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="count">Soru Sayısı</Label>
                    <Input
                        id="count"
                        type="number"
                        min={1}
                        max={20}
                        value={formData.count}
                        onChange={(e) => setFormData(prev => ({ ...prev, count: parseInt(e.target.value) || 5 }))}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="keywords">Anahtar Kelimeler (virgülle ayırın)</Label>
                    <Textarea
                        id="keywords"
                        placeholder="Örn: Kloroplast, ATP, Güneş enerjisi"
                        value={formData.keywords}
                        onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                        rows={3}
                    />
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={loading || !formData.topic}
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sorular Üretiliyor...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Soru Üret
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
