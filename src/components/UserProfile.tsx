import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { LogOut } from 'lucide-react';

interface UserProfileProps {
  user: User;
  onSignOut: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get user initials from display name or email
  const getInitials = () => {
    if (user.displayName) {
      const names = user.displayName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return names[0].slice(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    return user.displayName || user.email || 'User';
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-ios-blue flex items-center justify-center text-white font-bold text-[15px] active:scale-95 transition-all duration-150"
      >
        {getInitials()}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-12 w-64 bg-ios-secondaryGroupedBackground rounded-ios-lg overflow-hidden z-50 border border-ios-gray5">
            {/* User Info */}
            <div className="p-ios-md border-b border-ios-gray5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-ios-blue flex items-center justify-center text-white font-bold text-[20px]">
                  {getInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[17px] font-semibold text-ios-label truncate">
                    {getUserName()}
                  </p>
                  {user.email && (
                    <p className="text-[13px] text-ios-secondaryLabel truncate">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              {!user.isAnonymous && (
                <div className="flex items-center gap-1 text-[13px] text-ios-secondaryLabel">
                  <div className="w-2 h-2 rounded-full bg-ios-green"></div>
                  <span>Syncing with iCloud</span>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={onSignOut}
                className="w-full flex items-center gap-3 px-ios-sm py-2.5 hover:bg-ios-fillSecondary rounded-ios transition-all duration-150 active:scale-98"
              >
                <LogOut size={20} className="text-ios-red" />
                <span className="text-[17px] font-medium text-ios-red">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
