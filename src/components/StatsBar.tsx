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
    <div className="bg-ios-secondaryGroupedBackground rounded-ios-lg overflow-hidden mb-ios-md border border-ios-gray6">
      {/* Level and Gold Row */}
      <div className="flex items-center justify-between px-ios-md py-ios-sm bg-gradient-to-b from-ios-fillSecondary to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-ios-blue flex items-center justify-center">
            <Star className="text-white" size={20} fill="white" />
          </div>
          <div>
            <p className="text-[11px] text-ios-tertiaryLabel font-medium uppercase tracking-wide">Level</p>
            <p className="text-[22px] font-bold text-ios-label leading-none">{stats.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div>
            <p className="text-[11px] text-ios-tertiaryLabel font-medium uppercase tracking-wide text-right">Gold</p>
            <p className="text-[22px] font-bold text-ios-yellow leading-none text-right">{stats.gold.toFixed(0)}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-ios-yellow flex items-center justify-center">
            <Coins className="text-white" size={20} fill="white" />
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="px-ios-md py-ios-md space-y-ios-sm border-t border-ios-gray6">
        {/* Health Bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Heart className="text-ios-red" size={14} fill="currentColor" />
              <span className="text-[13px] font-semibold text-ios-label">Health</span>
            </div>
            <span className="text-[13px] font-semibold text-ios-secondaryLabel tabular-nums">
              {stats.health.toFixed(0)}/{MAX_HEALTH}
            </span>
          </div>
          <div className="w-full bg-ios-fillTertiary rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                healthPercentage > 50
                  ? 'bg-ios-red'
                  : healthPercentage > 20
                  ? 'bg-ios-orange'
                  : 'bg-ios-pink'
              }`}
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* XP Bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-ios-blue flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <span className="text-[13px] font-semibold text-ios-label">Experience</span>
            </div>
            <span className="text-[13px] font-semibold text-ios-secondaryLabel tabular-nums">
              {stats.experience.toFixed(0)}/{XP_PER_LEVEL}
            </span>
          </div>
          <div className="w-full bg-ios-fillTertiary rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-ios-blue rounded-full transition-all duration-500 ease-out"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
