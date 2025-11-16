import React from 'react';
import { Hat } from '../types';

interface CharacterDisplayProps {
  equippedHat?: Hat;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ equippedHat }) => {
  return (
    <div className="bg-ios-secondaryGroupedBackground rounded-ios-lg shadow-ios overflow-hidden mb-ios-md">
      {/* Character Container */}
      <div className="relative flex justify-center items-center py-ios-xl px-ios-md bg-gradient-to-b from-ios-fillSecondary to-transparent">
        <div className="relative w-40 h-40">
          {/* Character base image */}
          <img
            src="/character.png"
            alt="Your character"
            className="w-full h-full object-contain drop-shadow-lg"
            onError={(e) => {
              // Fallback if image doesn't exist
              e.currentTarget.src = 'data:image/svg+xml,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="#007AFF"/>
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
              className="absolute top-0 left-0 w-full h-full object-contain drop-shadow-lg"
              style={{ transform: 'translateY(-10%)' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
      </div>

      {/* Hat info - iOS style */}
      {equippedHat && (
        <div className="px-ios-md pb-ios-md pt-ios-sm border-t border-ios-gray6">
          <p className="text-[13px] text-ios-secondaryLabel text-center font-medium">
            Wearing <span className="text-ios-blue font-semibold">{equippedHat.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CharacterDisplay;
