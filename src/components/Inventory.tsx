import React from 'react';
import { UserStats } from '../types';
import { HATS, getRarityColor } from '../data/hats';
import { Package, Check } from 'lucide-react';

interface InventoryProps {
  stats: UserStats;
  onEquip: (hatId: string | undefined) => void;
}

const Inventory: React.FC<InventoryProps> = ({ stats, onEquip }) => {
  const ownedHats = HATS.filter(hat => stats.ownedHats.includes(hat.id));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="text-primary-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
        <span className="ml-auto text-sm text-gray-600">
          {ownedHats.length} item{ownedHats.length !== 1 ? 's' : ''}
        </span>
      </div>

      {ownedHats.length === 0 ? (
        <div className="text-center py-8">
          <Package className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-500">No hats yet!</p>
          <p className="text-sm text-gray-400 mt-1">Complete tasks to earn gold and buy hats from the shop.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Option to unequip */}
          <button
            onClick={() => onEquip(undefined)}
            className={`border-2 rounded-lg p-4 transition-all ${
              !stats.equippedHat
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center text-4xl">
              👤
            </div>
            <p className="text-sm font-medium text-center text-gray-700">No Hat</p>
            {!stats.equippedHat && (
              <div className="flex justify-center mt-2">
                <Check className="text-primary-600" size={16} />
              </div>
            )}
          </button>

          {/* Owned hats */}
          {ownedHats.map((hat) => {
            const isEquipped = stats.equippedHat === hat.id;

            return (
              <button
                key={hat.id}
                onClick={() => onEquip(hat.id)}
                className={`border-2 rounded-lg p-4 transition-all ${
                  isEquipped
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 bg-white'
                }`}
              >
                {/* Hat image */}
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <img
                    src={hat.image}
                    alt={hat.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                          <rect width="100" height="100" fill="#e5e7eb" rx="10"/>
                          <text x="50" y="55" text-anchor="middle" font-size="40" fill="#9ca3af">🎩</text>
                        </svg>
                      `);
                    }}
                  />
                </div>

                {/* Hat name */}
                <p className="text-sm font-medium text-center text-gray-800 mb-1">{hat.name}</p>

                {/* Rarity */}
                <div className="flex justify-center mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getRarityColor(hat.rarity)}`}>
                    {hat.rarity}
                  </span>
                </div>

                {/* Equipped indicator */}
                {isEquipped && (
                  <div className="flex justify-center">
                    <span className="text-xs text-primary-600 font-medium flex items-center gap-1">
                      <Check size={14} />
                      Equipped
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inventory;
