import { Hat } from '../types';

export const HATS: Hat[] = [
  {
    id: 'hat-1',
    name: 'Classic Cap',
    image: '/hats/hat-1.png',
    price: 10,
    description: 'A stylish classic cap',
    rarity: 'common',
  },
  {
    id: 'hat-2',
    name: 'Wizard Hat',
    image: '/hats/hat-2.png',
    price: 50,
    description: 'Mystical and magical',
    rarity: 'rare',
  },
  {
    id: 'hat-3',
    name: 'Crown',
    image: '/hats/hat-3.png',
    price: 100,
    description: 'Fit for royalty',
    rarity: 'epic',
  },
  {
    id: 'hat-4',
    name: 'Dragon Helmet',
    image: '/hats/hat-4.png',
    price: 200,
    description: 'Legendary dragon-slayer gear',
    rarity: 'legendary',
  },
  {
    id: 'hat-5',
    name: 'Party Hat',
    image: '/hats/hat-5.png',
    price: 30,
    description: 'Time to celebrate!',
    rarity: 'common',
  },
  {
    id: 'hat-6',
    name: 'Top Hat',
    image: '/hats/hat-6.png',
    price: 75,
    description: 'Classy and sophisticated',
    rarity: 'rare',
  },
];

export const getRarityColor = (rarity: Hat['rarity']) => {
  switch (rarity) {
    case 'common':
      return 'text-gray-600 bg-gray-100';
    case 'rare':
      return 'text-blue-600 bg-blue-100';
    case 'epic':
      return 'text-purple-600 bg-purple-100';
    case 'legendary':
      return 'text-yellow-600 bg-yellow-100';
  }
};
