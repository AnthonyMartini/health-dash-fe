import { useAchievement } from '../AchievementContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
}

export interface ApiResponse {
  status: number;
  message: string;
  achievements?: Achievement[];
}

export const useAchievementCheck = () => {
  const { showAchievement } = useAchievement();

  const checkAchievements = (response: any) => {
    // If the response includes achievements array, show each achievement
    if (response?.achievements && Array.isArray(response.achievements)) {
      response.achievements.forEach((achievement: any) => {
        showAchievement(achievement);
      });
    }
  };

  return checkAchievements;
}; 