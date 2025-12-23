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
}

export interface Topic {
    id: string;
    title: string;
    category: string; // '9-sinif', '10-sinif', '11-sinif', '12-sinif', 'tyt', 'ayt'
    subCategory?: string;
    content: string;
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
