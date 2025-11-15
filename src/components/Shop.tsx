import React from 'react';
import { UserStats } from '../types';
import { HATS, getRarityColor } from '../data/hats';
import { ShoppingBag, Lock, Check, Coins } from 'lucide-react';

interface ShopProps {
  stats: UserStats;
  onPurchase: (hatId: string) => void;
}

const Shop: React.FC<ShopProps> = ({ stats, onPurchase }) => {
  const canAfford = (price: number) => stats.gold >= price;
  const isOwned = (hatId: string) => stats.ownedHats.includes(hatId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="text-primary-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Hat Shop</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HATS.map((hat) => {
          const owned = isOwned(hat.id);
          const affordable = canAfford(hat.price);

          return (
            <div
              key={hat.id}
              className={`border-2 rounded-lg p-4 transition-all ${
                owned
                  ? 'border-green-300 bg-green-50'
                  : affordable
                  ? 'border-gray-200 hover:border-primary-300 bg-white'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              {/* Hat image */}
              <div className="relative w-24 h-24 mx-auto mb-3">
                <img
                  src={hat.image}
                  alt={hat.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback placeholder
                    e.currentTarget.src = 'data:image/svg+xml,' + encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <rect width="100" height="100" fill="#e5e7eb" rx="10"/>
                        <text x="50" y="55" text-anchor="middle" font-size="40" fill="#9ca3af">🎩</text>
                      </svg>
                    `);
                  }}
                />
                {owned && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <Check size={16} />
                  </div>
                )}
              </div>

              {/* Hat info */}
              <h3 className="font-bold text-center text-gray-800 mb-1">{hat.name}</h3>
              <p className="text-xs text-gray-600 text-center mb-2">{hat.description}</p>

              {/* Rarity badge */}
              <div className="flex justify-center mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getRarityColor(hat.rarity)}`}>
                  {hat.rarity}
                </span>
              </div>

              {/* Price and purchase button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Coins className="text-yellow-500" size={16} />
                  <span className="font-bold text-gray-800">{hat.price}</span>
                </div>

                {owned ? (
                  <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                    <Check size={16} />
                    Owned
                  </span>
                ) : (
                  <button
                    onClick={() => onPurchase(hat.id)}
                    disabled={!affordable}
                    className={`px-3 py-1 rounded-lg font-medium text-sm transition-colors ${
                      affordable
                        ? 'bg-primary-500 hover:bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {affordable ? 'Buy' : <Lock size={14} />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Shop;
