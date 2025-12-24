'use client';

import { useState } from 'react';
import { Question } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizInterfaceProps {
    questions: Question[];
    onComplete?: (score: number, answers: Record<string, string>) => void;
}

export function QuizInterface({ questions, onComplete }: QuizInterfaceProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    const hasAnswered = answers[currentQuestion?.id];

    const handleAnswerSelect = (answer: string) => {
        if (!showResults) {
            setSelectedAnswer(answer);
        }
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswer && currentQuestion) {
            setAnswers(prev => ({
                ...prev,
                [currentQuestion.id]: selectedAnswer
            }));
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            // Calculate score
            const correctCount = questions.filter(
                q => answers[q.id] === q.correctAnswer
            ).length;
            const score = Math.round((correctCount / questions.length) * 100);
            setShowResults(true);
            onComplete?.(score, answers);
        } else {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer('');
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setSelectedAnswer(answers[questions[currentIndex - 1]?.id] || '');
        }
    };

    const getOptionClassName = (optionKey: string) => {
        if (!hasAnswered) {
            return selectedAnswer === optionKey
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50';
        }

        const isCorrect = optionKey === currentQuestion.correctAnswer;
        const isSelected = answers[currentQuestion.id] === optionKey;

        if (isCorrect) {
            return 'border-green-500 bg-green-500/10';
        }
        if (isSelected && !isCorrect) {
            return 'border-red-500 bg-red-500/10';
        }
        return 'border-border opacity-60';
    };

    if (!currentQuestion) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Henüz soru bulunmuyor.</p>
                </CardContent>
            </Card>
        );
    }

    if (showResults) {
        const correctCount = questions.filter(
            q => answers[q.id] === q.correctAnswer
        ).length;
        const score = Math.round((correctCount / questions.length) * 100);

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Quiz Tamamlandı! 🎉</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <div className="text-6xl font-bold text-primary mb-2">{score}%</div>
                        <p className="text-muted-foreground">
                            {correctCount} / {questions.length} doğru cevap
                        </p>
                    </div>

                    <div className="space-y-2">
                        {questions.map((q, idx) => {
                            const isCorrect = answers[q.id] === q.correctAnswer;
                            return (
                                <div
                                    key={q.id}
                                    className={cn(
                                        'p-3 rounded-lg border flex items-center gap-2',
                                        isCorrect
                                            ? 'bg-green-500/10 border-green-500/20'
                                            : 'bg-red-500/10 border-red-500/20'
                                    )}
                                >
                                    {isCorrect ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                    <span className="text-sm">Soru {idx + 1}</span>
                                </div>
                            );
                        })}
                    </div>

                    <Button onClick={() => typeof window !== 'undefined' && window.location.reload()} className="w-full">
                        Yeni Quiz Başlat
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    Soru {currentIndex + 1} / {questions.length}
                </span>
                <span className="font-medium">
                    {Object.keys(answers).length} cevaplandı
                </span>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg leading-relaxed">
                        {currentQuestion.questionText}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                        {Object.entries(currentQuestion.options).map(([key, value]) => (
                            <div
                                key={key}
                                className={cn(
                                    'relative flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer',
                                    getOptionClassName(key)
                                )}
                                onClick={() => !hasAnswered && handleAnswerSelect(key)}
                            >
                                <RadioGroupItem
                                    value={key}
                                    id={key}
                                    disabled={!!hasAnswered}
                                    className="mt-1"
                                />
                                <Label
                                    htmlFor={key}
                                    className="ml-3 cursor-pointer flex-1 font-normal"
                                >
                                    <span className="font-semibold mr-2">{key})</span>
                                    {value}
                                </Label>

                                {hasAnswered && key === currentQuestion.correctAnswer && (
                                    <CheckCircle2 className="w-5 h-5 text-green-600 ml-2" />
                                )}
                                {hasAnswered &&
                                    answers[currentQuestion.id] === key &&
                                    key !== currentQuestion.correctAnswer && (
                                        <XCircle className="w-5 h-5 text-red-600 ml-2" />
                                    )}
                            </div>
                        ))}
                    </RadioGroup>

                    {/* Explanation after answering */}
                    {hasAnswered && currentQuestion.explanation && (
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                            <p className="text-sm font-medium mb-1">Açıklama:</p>
                            <p className="text-sm text-muted-foreground">
                                {currentQuestion.explanation}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Önceki
                        </Button>

                        {!hasAnswered ? (
                            <Button
                                onClick={handleSubmitAnswer}
                                disabled={!selectedAnswer}
                                className="flex-1"
                            >
                                Cevapla
                            </Button>
                        ) : (
                            <Button onClick={handleNext} className="flex-1">
                                {isLastQuestion ? 'Sonuçları Gör' : 'Sonraki'}
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
