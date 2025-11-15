import React from 'react';
import { UserStats, XP_PER_LEVEL, MAX_HEALTH } from '../types';
import { Heart, Coins, Star } from 'lucide-react';

interface StatsBarProps {
  stats: UserStats;
}

const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const xpPercentage = (stats.experience / XP_PER_LEVEL) * 100;
  const healthPercentage = (stats.health / MAX_HEALTH) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="text-yellow-500" size={24} />
          <span className="text-2xl font-bold text-gray-800">Level {stats.level}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Coins className="text-yellow-500" size={20} />
            <span className="font-semibold text-gray-700">{stats.gold.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Health Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Heart className="text-red-500" size={16} />
              <span className="text-sm font-medium text-gray-600">Health</span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {stats.health.toFixed(1)} / {MAX_HEALTH}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* XP Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-600">Experience</span>
            <span className="text-sm font-medium text-gray-700">
              {stats.experience.toFixed(1)} / {XP_PER_LEVEL}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
