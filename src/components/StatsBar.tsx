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
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="space-y-3">
        {/* Level and Gold */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-500" size={24} />
            <span className="text-2xl font-bold text-gray-800">Level {stats.level}</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="text-yellow-500" size={20} />
            <span className="text-xl font-semibold text-gray-700">{stats.gold.toFixed(1)}</span>
          </div>
        </div>

        {/* Health and XP Bars */}
        <div className="space-y-2">
          {/* Health Bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Heart className="text-red-500" size={16} />
                <span className="text-sm font-medium text-gray-600">HP</span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {stats.health.toFixed(0)} / {MAX_HEALTH}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  healthPercentage > 50 ? 'bg-red-500' : healthPercentage > 20 ? 'bg-orange-500' : 'bg-red-700'
                }`}
                style={{ width: `${healthPercentage}%` }}
              />
            </div>
          </div>

          {/* XP Bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-600">XP</span>
              <span className="text-sm font-medium text-gray-700">
                {stats.experience.toFixed(0)} / {XP_PER_LEVEL}
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
    </div>
  );
};

export default StatsBar;
