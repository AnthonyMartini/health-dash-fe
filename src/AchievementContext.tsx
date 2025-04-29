import React, { createContext, useContext, useState } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
}

interface AchievementContextType {
  showAchievement: (achievement: Achievement) => void;
  currentAchievement: Achievement | null;
  hideAchievement: () => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  const showAchievement = (achievement: Achievement) => {
    setCurrentAchievement(achievement);
  };

  const hideAchievement = () => {
    setCurrentAchievement(null);
  };

  return (
    <AchievementContext.Provider value={{ showAchievement, currentAchievement, hideAchievement }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievement = () => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievement must be used within an AchievementProvider');
  }
  return context;
}; 