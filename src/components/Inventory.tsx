import React from 'react';
import { UserStats } from '../types';
import { HATS } from '../data/hats';
import { Package, Check } from 'lucide-react';

interface InventoryProps {
  stats: UserStats;
  onEquip: (hatId: string | undefined) => void;
}

const Inventory: React.FC<InventoryProps> = ({ stats, onEquip }) => {
  const ownedHats = HATS.filter(hat => stats.ownedHats.includes(hat.id));

  return (
    <div className="space-y-ios-md">
      <div className="bg-white rounded-ios-lg border border-ios-gray6 overflow-hidden">
        {/* Header */}
        <div className="px-ios-md py-ios-sm border-b border-ios-gray6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="text-ios-blue" size={24} />
              <h2 className="text-[22px] font-bold text-ios-label">Inventory</h2>
            </div>
            <span className="text-[13px] text-ios-secondaryLabel font-medium">
              {ownedHats.length} item{ownedHats.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Inventory Content */}
        {ownedHats.length === 0 ? (
          <div className="px-ios-md py-ios-2xl text-center">
            <Package className="mx-auto text-ios-tertiaryLabel mb-3" size={48} />
            <p className="text-ios-label text-[17px] font-semibold mb-1">No hats yet!</p>
            <p className="text-[13px] text-ios-secondaryLabel">
              Complete tasks to earn gold and buy hats from the shop.
            </p>
          </div>
        ) : (
          <div className="p-ios-sm">
            <div className="grid grid-cols-2 gap-ios-sm">
              {/* Option to unequip */}
              <button
                onClick={() => onEquip(undefined)}
                className={`bg-white rounded-ios-lg border-2 p-ios-sm transition-all active:scale-95 ${
                  !stats.equippedHat
                    ? 'border-ios-blue bg-ios-blue bg-opacity-5'
                    : 'border-ios-gray6 hover:border-ios-blue'
                }`}
              >
                <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center text-4xl">
                  👤
                </div>
                <p className="text-[13px] font-semibold text-center text-ios-label mb-1">No Hat</p>
                {!stats.equippedHat && (
                  <div className="flex justify-center">
                    <div className="flex items-center gap-1 text-ios-blue text-[11px] font-bold">
                      <Check size={12} strokeWidth={3} />
                      Equipped
                    </div>
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
                    className={`bg-white rounded-ios-lg border-2 p-ios-sm transition-all active:scale-95 ${
                      isEquipped
                        ? 'border-ios-blue bg-ios-blue bg-opacity-5'
                        : 'border-ios-gray6 hover:border-ios-blue'
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
                              <rect width="100" height="100" fill="#f3f4f6" rx="10"/>
                              <text x="50" y="55" text-anchor="middle" font-size="40" fill="#9ca3af">🎩</text>
                            </svg>
                          `);
                        }}
                      />
                    </div>

                    {/* Hat name */}
                    <p className="text-[13px] font-semibold text-center text-ios-label mb-1 line-clamp-1">
                      {hat.name}
                    </p>

                    {/* Rarity */}
                    <div className="flex justify-center mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                        hat.rarity === 'common' ? 'bg-ios-gray bg-opacity-10 text-ios-gray' :
                        hat.rarity === 'rare' ? 'bg-ios-blue bg-opacity-10 text-ios-blue' :
                        hat.rarity === 'epic' ? 'bg-ios-purple bg-opacity-10 text-ios-purple' :
                        'bg-ios-yellow bg-opacity-20 text-ios-yellow'
                      }`}>
                        {hat.rarity}
                      </span>
                    </div>

                    {/* Equipped indicator */}
                    {isEquipped && (
                      <div className="flex justify-center">
                        <div className="flex items-center gap-1 text-ios-blue text-[11px] font-bold">
                          <Check size={12} strokeWidth={3} />
                          Equipped
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
