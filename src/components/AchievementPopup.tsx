import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievement } from '../AchievementContext';

const AchievementPopup: React.FC = () => {
  const { currentAchievement, hideAchievement } = useAchievement();

  useEffect(() => {
    if (currentAchievement) {
      const timer = setTimeout(() => {
        hideAchievement();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentAchievement, hideAchievement]);

  return (
    <AnimatePresence>
      {currentAchievement && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 bg-gradient-to-r from-red-400 to-orange-400 text-white p-4 rounded-lg shadow-lg z-50 min-w-[300px]"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-yellow-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16a1 1 0 11-2 0V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 013 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L7 4.323V3a1 1 0 011-1h2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">{currentAchievement.title}</h3>
              <p className="text-sm opacity-90">{currentAchievement.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementPopup; 