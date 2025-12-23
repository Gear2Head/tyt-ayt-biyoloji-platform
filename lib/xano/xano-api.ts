import { xanoClient } from './xano-client';
import { Topic, Comment, StudyPlan, User } from '@/lib/types';

/**
 * Xano API Service
 * Centralized API methods for all backend operations
 */

// ==================== TOPICS API ====================

export const topicsApi = {
    /**
     * Get all topics with optional filters
     */
    async getAll(filters?: {
        category?: string;
        difficulty?: 'kolay' | 'orta' | 'zor';
        search?: string;
    }): Promise<Topic[]> {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.difficulty) params.append('difficulty', filters.difficulty);
        if (filters?.search) params.append('search', filters.search);

        const queryString = params.toString();
        const url = `/topics${queryString ? `?${queryString}` : ''}`;

        const response = await xanoClient.get<any[]>(url);
        return response.map(transformTopicFromXano);
    },

    /**
     * Get topic by ID
     */
    async getById(id: string): Promise<Topic> {
        const response = await xanoClient.get<any>(`/topics/${id}`);
        return transformTopicFromXano(response);
    },

    /**
     * Get topics by category
     */
    async getByCategory(category: string): Promise<Topic[]> {
        const response = await xanoClient.get<any[]>(`/topics?category=${category}`);
        return response.map(transformTopicFromXano);
    },

    /**
     * Create new topic (Admin only)
     */
    async create(topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>): Promise<Topic> {
        const response = await xanoClient.post<any>('/topics', {
            title: topic.title,
            category: topic.category,
            sub_category: topic.subCategory,
            content: topic.content,
            images: topic.images,
            videos: topic.videos,
            difficulty: topic.difficulty,
            priority: topic.priority,
            ai_summary: topic.aiSummary,
        });
        return transformTopicFromXano(response);
    },

    /**
     * Update topic (Admin only)
     */
    async update(id: string, updates: Partial<Topic>): Promise<Topic> {
        const response = await xanoClient.patch<any>(`/topics/${id}`, {
            title: updates.title,
            category: updates.category,
            sub_category: updates.subCategory,
            content: updates.content,
            images: updates.images,
            videos: updates.videos,
            difficulty: updates.difficulty,
            priority: updates.priority,
            ai_summary: updates.aiSummary,
        });
        return transformTopicFromXano(response);
    },

    /**
     * Delete topic (Admin only)
     */
    async delete(id: string): Promise<void> {
        await xanoClient.delete(`/topics/${id}`);
    },
};

// ==================== COMMENTS API ====================

export const commentsApi = {
    /**
     * Get comments for a topic
     */
    async getByTopicId(topicId: string): Promise<Comment[]> {
        const response = await xanoClient.get<any[]>(`/comments?topic_id=${topicId}`);
        return response.map(transformCommentFromXano);
    },

    /**
     * Create new comment
     */
    async create(topicId: string, text: string): Promise<Comment> {
        const response = await xanoClient.post<any>('/comments', {
            topic_id: topicId,
            text,
        });
        return transformCommentFromXano(response);
    },

    /**
     * Like/unlike comment
     */
    async toggleLike(commentId: string): Promise<Comment> {
        const response = await xanoClient.patch<any>(`/comments/${commentId}/like`);
        return transformCommentFromXano(response);
    },

    /**
     * Delete comment (Moderator/Admin or owner)
     */
    async delete(commentId: string): Promise<void> {
        await xanoClient.delete(`/comments/${commentId}`);
    },

    /**
     * Lock/unlock comment (Moderator/Admin only)
     */
    async toggleLock(commentId: string): Promise<Comment> {
        const response = await xanoClient.patch<any>(`/comments/${commentId}/lock`);
        return transformCommentFromXano(response);
    },
};

// ==================== STUDY PLANS API ====================

export const studyPlansApi = {
    /**
     * Get user's study plans
     */
    async getUserPlans(): Promise<StudyPlan[]> {
        const response = await xanoClient.get<any[]>('/study-plans');
        return response.map(transformStudyPlanFromXano);
    },

    /**
     * Get study plan by ID
     */
    async getById(id: string): Promise<StudyPlan> {
        const response = await xanoClient.get<any>(`/study-plans/${id}`);
        return transformStudyPlanFromXano(response);
    },

    /**
     * Create new study plan
     */
    async create(plan: {
        examType: 'TYT' | 'AYT' | 'BOTH';
        targetScore: number;
        dailyTimeMinutes: number;
        weakTopics: string[];
    }): Promise<StudyPlan> {
        const response = await xanoClient.post<any>('/study-plans', {
            exam_type: plan.examType,
            target_score: plan.targetScore,
            daily_time_minutes: plan.dailyTimeMinutes,
            weak_topics: plan.weakTopics,
        });
        return transformStudyPlanFromXano(response);
    },

    /**
     * Update study plan
     */
    async update(id: string, updates: Partial<StudyPlan>): Promise<StudyPlan> {
        const response = await xanoClient.patch<any>(`/study-plans/${id}`, {
            exam_type: updates.examType,
            target_score: updates.targetScore,
            daily_time_minutes: updates.dailyTimeMinutes,
            weak_topics: updates.weakTopics,
            plan: updates.plan,
        });
        return transformStudyPlanFromXano(response);
    },

    /**
     * Delete study plan
     */
    async delete(id: string): Promise<void> {
        await xanoClient.delete(`/study-plans/${id}`);
    },
};

// ==================== ADMIN API ====================

export const adminApi = {
    /**
     * Get all users (Admin only)
     */
    async getUsers(): Promise<User[]> {
        const response = await xanoClient.get<any[]>('/admin/users');
        return response.map(transformUserFromXano);
    },

    /**
     * Update user role (Admin only)
     */
    async updateUserRole(userId: string, role: 'admin' | 'moderator' | 'user'): Promise<User> {
        const response = await xanoClient.patch<any>(`/admin/users/${userId}/role`, { role });
        return transformUserFromXano(response);
    },

    /**
     * Get content statistics (Admin/Moderator)
     */
    async getStats(): Promise<{
        totalUsers: number;
        totalTopics: number;
        totalComments: number;
        totalStudyPlans: number;
    }> {
        return await xanoClient.get('/admin/stats');
    },

    /**
     * Get recent comments for moderation (Moderator/Admin)
     */
    async getRecentComments(limit: number = 20): Promise<Comment[]> {
        const response = await xanoClient.get<any[]>(`/admin/comments?limit=${limit}`);
        return response.map(transformCommentFromXano);
    },
};

// ==================== FAVORITES API ====================

export const favoritesApi = {
    /**
     * Get user's favorite topics
     */
    async getFavorites(): Promise<Topic[]> {
        const response = await xanoClient.get<any[]>('/favorites');
        return response.map(transformTopicFromXano);
    },

    /**
     * Add topic to favorites
     */
    async add(topicId: string): Promise<void> {
        await xanoClient.post('/favorites', { topic_id: topicId });
    },

    /**
     * Remove topic from favorites
     */
    async remove(topicId: string): Promise<void> {
        await xanoClient.delete(`/favorites/${topicId}`);
    },

    /**
     * Check if topic is favorited
     */
    async isFavorited(topicId: string): Promise<boolean> {
        try {
            const response = await xanoClient.get<{ is_favorited: boolean }>(`/favorites/check/${topicId}`);
            return response.is_favorited;
        } catch {
            return false;
        }
    },
};

// ==================== TRANSFORM FUNCTIONS ====================
// Convert Xano snake_case responses to our camelCase TypeScript types

function transformTopicFromXano(data: any): Topic {
    return {
        id: data.id.toString(),
        title: data.title,
        category: data.category,
        subCategory: data.sub_category,
        content: data.content,
        images: data.images || [],
        videos: data.videos || [],
        difficulty: data.difficulty,
        priority: data.priority,
        aiSummary: data.ai_summary,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
    };
}

function transformCommentFromXano(data: any): Comment {
    return {
        id: data.id.toString(),
        topicId: data.topic_id.toString(),
        userId: data.user_id.toString(),
        userName: data.user_name || data.user?.display_name || 'Anonymous',
        text: data.text,
        likes: data.likes || 0,
        isLocked: data.is_locked || false,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
    };
}

function transformStudyPlanFromXano(data: any): StudyPlan {
    return {
        id: data.id.toString(),
        userId: data.user_id.toString(),
        examType: data.exam_type,
        targetScore: data.target_score,
        dailyTimeMinutes: data.daily_time_minutes,
        weakTopics: data.weak_topics || [],
        plan: data.plan || { dailyTasks: [], weeklyGoals: [] },
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
    };
}

function transformUserFromXano(data: any): User {
    return {
        uid: data.uid,
        email: data.email,
        displayName: data.display_name,
        role: data.role,
        createdAt: new Date(data.created_at),
        lastLoginAt: new Date(data.last_login_at),
        favorites: data.favorites || [],
    };
}
