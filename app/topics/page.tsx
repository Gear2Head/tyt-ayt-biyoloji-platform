'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/xano/xano-auth-context';
import { topicsApi, favoritesApi } from '@/lib/xano/xano-api';
import { Topic } from '@/lib/types';
import { TopicCard } from '@/components/topics/topic-card';
import { TopicFilters } from '@/components/topics/topic-filters';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, BookOpen, GraduationCap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function TopicsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        loadTopics();
        loadFavorites();
    }, [user]);

    useEffect(() => {
        filterTopics();
    }, [topics, selectedCategory, selectedDifficulty, searchQuery]);

    const loadTopics = async () => {
        try {
            const data = await topicsApi.getAll();
            setTopics(data);
        } catch (error) {
            console.error('Failed to load topics:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadFavorites = async () => {
        try {
            const favTopics = await favoritesApi.getFavorites();
            setFavorites(favTopics.map(t => t.id));
        } catch (error) {
            console.error('Failed to load favorites:', error);
        }
    };

    const filterTopics = () => {
        let filtered = [...topics];

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(t => t.category === selectedCategory);
        }

        // Difficulty filter
        if (selectedDifficulty !== 'all') {
            filtered = filtered.filter(t => t.difficulty === selectedDifficulty);
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(query) ||
                t.content.toLowerCase().includes(query) ||
                t.subCategory?.toLowerCase().includes(query)
            );
        }

        setFilteredTopics(filtered);
    };

    const handleFavoriteToggle = async (topicId: string) => {
        try {
            if (favorites.includes(topicId)) {
                await favoritesApi.remove(topicId);
                setFavorites(favorites.filter(id => id !== topicId));
            } else {
                await favoritesApi.add(topicId);
                setFavorites([...favorites, topicId]);
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
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
                                <div className="p-2 bg-gradient-primary rounded-lg">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-display font-bold">Konular</h1>
                                    <p className="text-xs text-muted-foreground">
                                        {filteredTopics.length} konu bulundu
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground hidden sm:block">
                                {user.displayName}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="mb-8 space-y-6">
                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Konu ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filters */}
                    <TopicFilters
                        selectedCategory={selectedCategory}
                        selectedDifficulty={selectedDifficulty}
                        onCategoryChange={setSelectedCategory}
                        onDifficultyChange={setSelectedDifficulty}
                    />
                </div>

                {/* Topics Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : filteredTopics.length === 0 ? (
                    <div className="text-center py-20">
                        <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Konu bulunamadı</h3>
                        <p className="text-muted-foreground">
                            Farklı filtreler deneyebilir veya arama yapabilirsiniz.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTopics.map((topic) => (
                            <TopicCard
                                key={topic.id}
                                topic={topic}
                                isFavorited={favorites.includes(topic.id)}
                                isCompleted={user.completedTopics?.includes(topic.id)}
                                onFavoriteToggle={handleFavoriteToggle}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
