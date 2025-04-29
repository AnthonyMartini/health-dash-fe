interface BaseAchievement {
    id: string;
    title: string;
    description: string;
    type: 'one_time' | 'streak' | 'quantity';
    check: (achievements: any) => boolean;
}

interface StreakAchievement extends BaseAchievement {
    type: 'streak';
    target: number;
}

interface QuantityAchievement extends BaseAchievement {
    type: 'quantity';
    target: number;
}

interface OneTimeAchievement extends BaseAchievement {
    type: 'one_time';
}

export type Achievement = StreakAchievement | QuantityAchievement | OneTimeAchievement;

export const ACHIEVEMENTS: Record<string, Achievement> = {
    // First Time Achievements
    FIRST_WORKOUT: {
        id: 'first_workout',
        title: 'First Workout!',
        description: 'You logged your first workout',
        type: 'one_time',
        check: (achievements) => !achievements?.first_workout?.completed
    },
    FIRST_HEALTH_LOG: {
        id: 'first_health_log',
        title: 'First Health Log!',
        description: 'You logged your first health data',
        type: 'one_time',
        check: (achievements) => !achievements?.first_health_log?.completed
    },
    FIRST_WEEKLY_PLAN: {
        id: 'first_weekly_plan',
        title: 'First Weekly Plan!',
        description: 'You created your first weekly workout plan',
        type: 'one_time',
        check: (achievements) => !achievements?.first_weekly_plan?.completed
    },

    // Streak Achievements
    FIVE_DAY_STREAK: {
        id: 'five_day_streak',
        title: '5 Day Streak!',
        description: 'You logged workouts for 5 days in a row',
        type: 'streak',
        target: 5,
        check: (achievements) => {
            const streak = achievements?.five_day_streak;
            return streak?.progress >= 5 && !streak?.completed;
        }
    },
    SEVEN_DAY_STREAK: {
        id: 'seven_day_streak',
        title: '7 Day Streak!',
        description: 'You logged workouts for 7 days in a row',
        type: 'streak',
        target: 7,
        check: (achievements) => {
            const streak = achievements?.seven_day_streak;
            return streak?.progress >= 7 && !streak?.completed;
        }
    },
    THIRTY_DAY_STREAK: {
        id: 'thirty_day_streak',
        title: '30 Day Streak!',
        description: 'You logged workouts for 30 days in a row',
        type: 'streak',
        target: 30,
        check: (achievements) => {
            const streak = achievements?.thirty_day_streak;
            return streak?.progress >= 30 && !streak?.completed;
        }
    },

    // Quantity Achievements
    WORKOUT_CREATOR: {
        id: 'workout_creator',
        title: 'Workout Creator!',
        description: 'You created 10 workout plans',
        type: 'quantity',
        target: 10,
        check: (achievements) => {
            const progress = achievements?.workout_creator?.progress || 0;
            return progress >= 10 && !achievements?.workout_creator?.completed;
        }
    },
    HEALTH_LOGGER: {
        id: 'health_logger',
        title: 'Health Logger!',
        description: 'You logged 50 health data points',
        type: 'quantity',
        target: 50,
        check: (achievements) => {
            const progress = achievements?.health_logger?.progress || 0;
            return progress >= 50 && !achievements?.health_logger?.completed;
        }
    },
    WORKOUT_FAVORITER: {
        id: 'workout_favoriter',
        title: 'Workout Favoriter!',
        description: 'You favorited 20 workout plans',
        type: 'quantity',
        target: 20,
        check: (achievements) => {
            const progress = achievements?.workout_favoriter?.progress || 0;
            return progress >= 20 && !achievements?.workout_favoriter?.completed;
        }
    }
}; 