import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TopicFiltersProps {
    selectedCategory: string;
    selectedDifficulty: string;
    onCategoryChange: (category: string) => void;
    onDifficultyChange: (difficulty: string) => void;
}

const categories = [
    { value: 'all', label: 'Tümü', color: 'from-gray-500 to-gray-600' },
    { value: '9-sinif', label: '9. Sınıf', color: 'from-blue-500 to-cyan-500' },
    { value: '10-sinif', label: '10. Sınıf', color: 'from-purple-500 to-pink-500' },
    { value: '11-sinif', label: '11. Sınıf', color: 'from-orange-500 to-amber-500' },
    { value: '12-sinif', label: '12. Sınıf', color: 'from-green-500 to-emerald-500' },
    { value: 'tyt', label: 'TYT', color: 'from-indigo-500 to-blue-500' },
    { value: 'ayt', label: 'AYT', color: 'from-rose-500 to-pink-500' },
];

const difficulties = [
    { value: 'all', label: 'Tüm Zorluklar', color: 'bg-gray-500/20 text-gray-600' },
    { value: 'kolay', label: 'Kolay', color: 'bg-green-500/20 text-green-600' },
    { value: 'orta', label: 'Orta', color: 'bg-yellow-500/20 text-yellow-600' },
    { value: 'zor', label: 'Zor', color: 'bg-red-500/20 text-red-600' },
];

export function TopicFilters({
    selectedCategory,
    selectedDifficulty,
    onCategoryChange,
    onDifficultyChange,
}: TopicFiltersProps) {
    return (
        <div className="space-y-6">
            {/* Category Filters */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Kategori</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <Button
                            key={category.value}
                            variant={selectedCategory === category.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onCategoryChange(category.value)}
                            className={cn(
                                "transition-all",
                                selectedCategory === category.value && category.value !== 'all' &&
                                `bg-gradient-to-r ${category.color} text-white border-0 hover:opacity-90`
                            )}
                        >
                            {category.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Difficulty Filters */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Zorluk</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {difficulties.map((difficulty) => (
                        <Button
                            key={difficulty.value}
                            variant={selectedDifficulty === difficulty.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onDifficultyChange(difficulty.value)}
                            className={cn(
                                "transition-all",
                                selectedDifficulty === difficulty.value && difficulty.value !== 'all' &&
                                difficulty.color
                            )}
                        >
                            {difficulty.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
