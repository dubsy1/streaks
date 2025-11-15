import React from 'react';
import { UserStats, XP_PER_LEVEL, MAX_HEALTH, Hat } from '../types';
import { Heart, Coins, Star } from 'lucide-react';
import MiniCharacter from './MiniCharacter';

interface StatsBarProps {
  stats: UserStats;
  equippedHat?: Hat;
}

const StatsBar: React.FC<StatsBarProps> = ({ stats, equippedHat }) => {
  const xpPercentage = (stats.experience / XP_PER_LEVEL) * 100;
  const healthPercentage = (stats.health / MAX_HEALTH) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center gap-4 mb-4">
        {/* Mini Character - Always visible */}
        <MiniCharacter
          equippedHat={equippedHat}
          health={stats.health}
          maxHealth={MAX_HEALTH}
        />

        {/* Stats Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500" size={20} />
              <span className="text-xl font-bold text-gray-800">Level {stats.level}</span>
            </div>
            <div className="flex items-center gap-1">
              <Coins className="text-yellow-500" size={18} />
              <span className="font-semibold text-gray-700">{stats.gold.toFixed(1)}</span>
            </div>
          </div>

          {/* Compact Bars */}
          <div className="space-y-2">
            {/* Health Bar */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1">
                  <Heart className="text-red-500" size={14} />
                  <span className="text-xs font-medium text-gray-600">HP</span>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {stats.health.toFixed(0)} / {MAX_HEALTH}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    healthPercentage > 50 ? 'bg-red-500' : healthPercentage > 20 ? 'bg-orange-500' : 'bg-red-700'
                  }`}
                  style={{ width: `${healthPercentage}%` }}
                />
              </div>
            </div>

            {/* XP Bar */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-medium text-gray-600">XP</span>
                <span className="text-xs font-medium text-gray-700">
                  {stats.experience.toFixed(0)} / {XP_PER_LEVEL}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
