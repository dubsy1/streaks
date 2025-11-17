import React, { useState } from 'react';
import { UserStats } from '../types';
import { HATS } from '../data/hats';
import { ShoppingBag, Lock, Check, Coins, ChevronDown } from 'lucide-react';

interface ShopProps {
  stats: UserStats;
  onPurchase: (hatId: string) => void;
}

type Category = 'Hats' | 'Pets' | 'Equipables';

const Shop: React.FC<ShopProps> = ({ stats, onPurchase }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Hats');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const canAfford = (price: number) => stats.gold >= price;
  const isOwned = (hatId: string) => stats.ownedHats.includes(hatId);

  const categories: Category[] = ['Hats', 'Pets', 'Equipables'];

  // For now, only show hats. Pets and Equipables will show empty state
  const items = selectedCategory === 'Hats' ? HATS : [];

  return (
    <div className="space-y-ios-md">
      {/* Header with Category Dropdown */}
      <div className="bg-white rounded-ios-lg border border-ios-gray6 overflow-hidden">
        <div className="px-ios-md py-ios-sm border-b border-ios-gray6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-ios-blue" size={24} />
              <h2 className="text-[22px] font-bold text-ios-label">Shop</h2>
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-ios-sm py-1.5 bg-ios-fillSecondary rounded-ios text-ios-label font-semibold text-[15px] active:scale-95 transition-all duration-150"
              >
                {selectedCategory}
                <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-12 w-40 bg-white rounded-ios-lg border border-ios-gray5 overflow-hidden z-50">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-ios-sm py-2.5 text-left text-[15px] transition-all duration-150 ${
                          selectedCategory === category
                            ? 'bg-ios-blue text-white font-semibold'
                            : 'text-ios-label hover:bg-ios-fillSecondary'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Shop Items Grid - 2 columns */}
        {items.length === 0 ? (
          <div className="px-ios-md py-ios-xl text-center">
            <p className="text-ios-secondaryLabel text-[17px]">
              {selectedCategory} coming soon! 🎉
            </p>
          </div>
        ) : (
          <div className="p-ios-sm">
            <div className="grid grid-cols-2 gap-ios-sm">
              {items.map((hat) => {
                const owned = isOwned(hat.id);
                const affordable = canAfford(hat.price);

                return (
                  <div
                    key={hat.id}
                    className={`bg-white rounded-ios-lg border-2 p-ios-sm transition-all ${
                      owned
                        ? 'border-ios-green bg-ios-green bg-opacity-5'
                        : affordable
                        ? 'border-ios-gray6 hover:border-ios-blue'
                        : 'border-ios-gray6 opacity-60'
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
                      {owned && (
                        <div className="absolute -top-1 -right-1 bg-ios-green text-white rounded-full p-1">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Hat info */}
                    <h3 className="font-bold text-center text-ios-label text-[13px] mb-1 line-clamp-1">
                      {hat.name}
                    </h3>
                    <p className="text-[11px] text-ios-secondaryLabel text-center mb-2 line-clamp-1">
                      {hat.description}
                    </p>

                    {/* Rarity badge */}
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

                    {/* Price and purchase button */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-1 bg-ios-yellow bg-opacity-10 rounded-ios py-1">
                        <Coins className="text-ios-yellow" size={14} fill="currentColor" />
                        <span className="font-bold text-ios-label text-[13px]">{hat.price}</span>
                      </div>

                      {owned ? (
                        <div className="text-[13px] text-ios-green font-semibold flex items-center justify-center gap-1 py-1.5">
                          <Check size={14} strokeWidth={3} />
                          Owned
                        </div>
                      ) : (
                        <button
                          onClick={() => onPurchase(hat.id)}
                          disabled={!affordable}
                          className={`w-full py-1.5 rounded-ios text-[13px] font-semibold transition-all duration-150 active:scale-95 ${
                            affordable
                              ? 'bg-ios-blue hover:bg-opacity-90 text-white'
                              : 'bg-ios-fillSecondary text-ios-tertiaryLabel cursor-not-allowed flex items-center justify-center gap-1'
                          }`}
                        >
                          {affordable ? 'Buy' : (
                            <>
                              <Lock size={12} />
                              Locked
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
