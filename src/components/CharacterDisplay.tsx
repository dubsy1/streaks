import React from 'react';
import { Hat } from '../types';

interface CharacterDisplayProps {
  equippedHat?: Hat;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ equippedHat }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Your Character</h2>

      <div className="relative flex justify-center items-center">
        {/* Character container */}
        <div className="relative w-48 h-48">
          {/* Character base image */}
          <img
            src="/character.png"
            alt="Your character"
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback if image doesn't exist
              e.currentTarget.src = 'data:image/svg+xml,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="#60a5fa"/>
                  <circle cx="80" cy="85" r="8" fill="#000"/>
                  <circle cx="120" cy="85" r="8" fill="#000"/>
                  <path d="M 70 120 Q 100 140 130 120" stroke="#000" stroke-width="3" fill="none"/>
                </svg>
              `);
            }}
          />

          {/* Equipped hat overlay */}
          {equippedHat && (
            <img
              src={equippedHat.image}
              alt={equippedHat.name}
              className="absolute top-0 left-0 w-full h-full object-contain"
              style={{ transform: 'translateY(-10%)' }}
              onError={(e) => {
                // Hide if hat image doesn't exist
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
      </div>

      {/* Character info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {equippedHat ? (
            <span className="text-primary-600 font-medium">
              Wearing: {equippedHat.name}
            </span>
          ) : (
            <span className="text-gray-400">No hat equipped</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default CharacterDisplay;
