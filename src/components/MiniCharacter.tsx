import React from 'react';
import { Hat } from '../types';

interface MiniCharacterProps {
  equippedHat?: Hat;
  health: number;
  maxHealth: number;
}

const MiniCharacter: React.FC<MiniCharacterProps> = ({ equippedHat, health, maxHealth }) => {
  // Determine character mood based on health
  const getCharacterMood = () => {
    const healthPercent = (health / maxHealth) * 100;
    if (healthPercent >= 80) return 'happy';
    if (healthPercent >= 50) return 'neutral';
    if (healthPercent >= 20) return 'sad';
    return 'critical';
  };

  const mood = getCharacterMood();

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      {/* Character base */}
      <div className="relative w-full h-full">
        <img
          src="/character.png"
          alt="Character"
          className={`w-full h-full object-contain transition-all ${
            mood === 'critical' ? 'animate-pulse opacity-70' : ''
          }`}
          onError={(e) => {
            // Fallback character based on mood
            const colors: Record<string, string> = {
              happy: '#60a5fa',
              neutral: '#fbbf24',
              sad: '#fb923c',
              critical: '#ef4444',
            };
            e.currentTarget.src = 'data:image/svg+xml,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="${colors[mood]}"/>
                <circle cx="38" cy="42" r="4" fill="#000"/>
                <circle cx="62" cy="42" r="4" fill="#000"/>
                ${mood === 'happy' ? '<path d="M 32 60 Q 50 72 68 60" stroke="#000" stroke-width="3" fill="none"/>' : ''}
                ${mood === 'neutral' ? '<line x1="32" y1="65" x2="68" y2="65" stroke="#000" stroke-width="3"/>' : ''}
                ${mood === 'sad' ? '<path d="M 32 70 Q 50 58 68 70" stroke="#000" stroke-width="3" fill="none"/>' : ''}
                ${mood === 'critical' ? '<path d="M 32 72 Q 50 60 68 72" stroke="#000" stroke-width="4" fill="none"/>' : ''}
              </svg>
            `);
          }}
        />

        {/* Equipped hat overlay */}
        {equippedHat && (
          <img
            src={equippedHat.image}
            alt={equippedHat.name}
            className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
            style={{ transform: 'translateY(-10%)' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}

        {/* Health indicator ring */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-0.5">
            {[...Array(3)].map((_, i) => {
              const healthPercent = (health / maxHealth) * 100;
              const isActive = healthPercent > (i * 33);
              return (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCharacter;
