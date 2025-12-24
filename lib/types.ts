export const ADMIN_EMAIL = 'senerkadiralper@gmail.com';
export const ADMIN_CONSOLE_CODE = 'GearAdmin9150';
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

export type UserRole = 'admin' | 'moderator' | 'user';

export interface User {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    createdAt: Date;
    lastLoginAt: Date;
    favorites: string[];
    completedTopics: string[];
}

export interface Topic {
    id: string;
    title: string;
    category: string; // '9-sinif', '10-sinif', '11-sinif', '12-sinif', 'tyt', 'ayt'
    subCategory?: string;
    content: string; // Deprecated: Use contentAdmin or contentAi. Kept for fallback.
    contentAdmin?: string;
    contentAi?: string;
    source?: 'OGM' | 'ADMIN' | 'AI';
    images: string[];
    videos: string[];
    difficulty: 'kolay' | 'orta' | 'zor';
    priority: number;
    aiSummary?: {
        shortSummary: string;
        tytAytDifferences: string;
        confusedConcepts: string[];
        examProbability: 'düşük' | 'orta' | 'yüksek';
    };
    lastAiUpdate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Comment {
    id: string;
    topicId: string;
    userId: string;
    userName: string;
    text: string;
    likes: number;
    isLocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface StudyPlan {
    id: string;
    userId: string;
    examType: 'TYT' | 'AYT' | 'BOTH';
    targetScore: number;
    dailyTimeMinutes: number;
    weakTopics: string[];
    plan: {
        dailyTasks: Array<{
            day: number;
            topics: string[];
            duration: number;
        }>;
        weeklyGoals: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}

// ==================== NEW TYPES FOR PLATFORM EXPANSION ====================

export interface Question {
    id: string;
    topicId: string;
    questionText: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
    };
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    explanation?: string;
    difficulty: 'kolay' | 'orta' | 'zor';
    source: 'OGM' | 'ADMIN' | 'AI';
    examType: 'TYT' | 'AYT';
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface QuizSession {
    id: string;
    userId: string;
    topicId?: string;
    questions: string[]; // Question IDs
    answers: Record<string, string>; // questionId -> answer
    score: number;
    completedAt?: Date;
    createdAt: Date;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'streak' | 'score' | 'topic' | 'quiz' | 'special';
    requirement: number;
    points: number;
}

export interface UserAchievement {
    userId: string;
    achievementId: string;
    unlockedAt: Date;
}

export interface VideoResource {
    id: string;
    topicId: string;
    title: string;
    url: string; // YouTube or external URL
    duration: number; // in seconds
    thumbnail?: string;
    description?: string;
    source: 'YouTube' | 'Vimeo' | 'External';
    createdAt: Date;
}

export interface UserStats {
    userId: string;
    totalStudyTime: number; // in minutes
    completedTopics: number;
    completedQuestions: number;
    correctAnswers: number;
    streak: number; // consecutive days
    level: number;
    experiencePoints: number;
    achievements: string[]; // Achievement IDs
    lastActive: Date;
}

export interface LearningPath {
    id: string;
    name: string;
    description: string;
    topics: string[]; // Ordered topic IDs
    difficulty: 'kolay' | 'orta' | 'zor';
    estimatedHours: number;
    prerequisite?: string; // Another path ID
}
