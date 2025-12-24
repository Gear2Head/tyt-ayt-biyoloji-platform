// Achievement definitions
export const ACHIEVEMENTS = [
    {
        id: 'first_topic',
        name: 'İlk Adım',
        description: 'İlk konunu tamamla',
        icon: '🎯',
        category: 'topic' as const,
        requirement: 1,
        points: 10
    },
    {
        id: 'topic_master_5',
        name: 'Hızlı Başlangıç',
        description: '5 konu tamamla',
        icon: '🚀',
        category: 'topic' as const,
        requirement: 5,
        points: 50
    },
    {
        id: 'topic_master_10',
        name: 'Konu Uzmanı',
        description: '10 konu tamamla',
        icon: '📚',
        category: 'topic' as const,
        requirement: 10,
        points: 100
    },
    {
        id: 'topic_master_25',
        name: 'Biyoloji Dehası',
        description: '25 konu tamamla',
        icon: '🧬',
        category: 'topic' as const,
        requirement: 25,
        points: 250
    },
    {
        id: 'first_quiz',
        name: 'İlk Quiz',
        description: 'İlk quiz\'ini tamamla',
        icon: '📝',
        category: 'quiz' as const,
        requirement: 1,
        points: 15
    },
    {
        id: 'quiz_ace',
        name: 'Quiz Ustası',
        description: '10 quiz tamamla',
        icon: '⭐',
        category: 'quiz' as const,
        requirement: 10,
        points: 150
    },
    {
        id: 'perfect_score',
        name: 'Mükemmel Skor',
        description: 'Bir quiz\'te %100 al',
        icon: '💯',
        category: 'score' as const,
        requirement: 100,
        points: 200
    },
    {
        id: 'streak_3',
        name: 'Kararlı',
        description: '3 gün üst üste çalış',
        icon: '🔥',
        category: 'streak' as const,
        requirement: 3,
        points: 30
    },
    {
        id: 'streak_7',
        name: 'Disiplinli',
        description: '7 gün üst üste çalış',
        icon: '💪',
        category: 'streak' as const,
        requirement: 7,
        points: 70
    },
    {
        id: 'streak_30',
        name: 'Efsane Seri',
        description: '30 gün üst üste çalış',
        icon: '👑',
        category: 'streak' as const,
        requirement: 30,
        points: 500
    },
    {
        id: 'early_bird',
        name: 'Erken Kuş',
        description: 'Sabah 6-9 arası çalış',
        icon: '🌅',
        category: 'special' as const,
        requirement: 1,
        points: 25
    },
    {
        id: 'night_owl',
        name: 'Gece Kuşu',
        description: 'Gece 22-2 arası çalış',
        icon: '🦉',
        category: 'special' as const,
        requirement: 1,
        points: 25
    }
];

export function checkAchievementUnlock(
    achievementId: string,
    userProgress: {
        completedTopics: number;
        completedQuizzes: number;
        streak: number;
        highestScore: number;
    }
): boolean {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return false;

    switch (achievement.category) {
        case 'topic':
            return userProgress.completedTopics >= achievement.requirement;
        case 'quiz':
            return userProgress.completedQuizzes >= achievement.requirement;
        case 'streak':
            return userProgress.streak >= achievement.requirement;
        case 'score':
            return userProgress.highestScore >= achievement.requirement;
        case 'special':
            // Special achievements checked elsewhere
            return false;
        default:
            return false;
    }
}

export function getNextAchievements(
    currentProgress: {
        completedTopics: number;
        completedQuizzes: number;
        streak: number;
        highestScore: number;
    },
    unlockedIds: string[]
) {
    return ACHIEVEMENTS
        .filter(ach => !unlockedIds.includes(ach.id))
        .filter(ach => {
            // Show achievements that are close to unlocking
            if (ach.category === 'topic') {
                return currentProgress.completedTopics < ach.requirement;
            }
            if (ach.category === 'quiz') {
                return currentProgress.completedQuizzes < ach.requirement;
            }
            if (ach.category === 'streak') {
                return currentProgress.streak < ach.requirement;
            }
            return true;
        })
        .slice(0, 3); // Show top 3 next achievements
}
