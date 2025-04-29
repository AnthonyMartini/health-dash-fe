import React, { useEffect } from 'react';
import { useAchievementCheck } from '../utils/achievementChecks';
import { apiService } from '../utils/APIService';

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const checkAchievements = useAchievementCheck();

  useEffect(() => {
    // Set up the achievement check in the API service
    apiService.setAchievementCheck(checkAchievements);
  }, [checkAchievements]);

  return <>{children}</>;
}; 