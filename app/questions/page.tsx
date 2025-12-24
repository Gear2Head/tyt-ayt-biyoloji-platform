'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/xano/xano-auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Brain, Sparkles, BookOpen, Target } from 'lucide-react';
import Link from 'next/link';
import { QuizInterface } from '@/components/quiz/quiz-interface';
import { AIQuestionGenerator } from '@/components/quiz/ai-question-generator';
import { Question } from '@/lib/types';

export default function QuestionsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
    const [activeQuiz, setActiveQuiz] = useState<Question[]>([]);

    if (!user) {
        router.push('/login');
        return null;
    }

    const handleQuestionsGenerated = (questions: Question[]) => {
        setGeneratedQuestions(questions);
        setActiveQuiz(questions);
    };

    const handleQuizComplete = (score: number, answers: Record<string, string>) => {
        console.log('Quiz completed:', { score, answers });
        // TODO: Save to Xano
    };

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
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-display font-bold">Soru Bankası</h1>
                                    <p className="text-xs text-muted-foreground">
                                        AYT Biyoloji Soruları
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs defaultValue="ai-generator" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 max-w-md">
                        <TabsTrigger value="ai-generator">
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI Üretici
                        </TabsTrigger>
                        <TabsTrigger value="quiz" disabled={activeQuiz.length === 0}>
                            <Target className="w-4 h-4 mr-2" />
                            Quiz
                        </TabsTrigger>
                        <TabsTrigger value="bank">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Soru Bankası
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="ai-generator" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <AIQuestionGenerator onQuestionsGenerated={handleQuestionsGenerated} />

                            {generatedQuestions.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Üretilen Sorular</CardTitle>
                                        <CardDescription>
                                            {generatedQuestions.length} adet soru başarıyla oluşturuldu
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {generatedQuestions.map((q, idx) => (
                                            <div key={q.id} className="p-3 rounded-lg border bg-muted/30">
                                                <p className="text-sm font-medium">Soru {idx + 1}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                    {q.questionText}
                                                </p>
                                            </div>
                                        ))}
                                        <Button
                                            onClick={() => setActiveQuiz(generatedQuestions)}
                                            className="w-full"
                                        >
                                            Quiz'e Başla
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="quiz">
                        {activeQuiz.length > 0 && (
                            <div className="max-w-3xl mx-auto">
                                <QuizInterface
                                    questions={activeQuiz}
                                    onComplete={handleQuizComplete}
                                />
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="bank">
                        <Card>
                            <CardHeader>
                                <CardTitle>Soru Bankası</CardTitle>
                                <CardDescription>
                                    OGM Materyal entegrasyonu yakında...
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="py-12 text-center">
                                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <p className="text-muted-foreground mb-4">
                                    🚧 Bu özellik geliştirme aşamasındadır
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    OGM Materyal soru havuzundan direkt soru çekme özelliği eklenecek
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
