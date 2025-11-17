import React, { useState } from 'react';
import { signInWithPopup, OAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Apple } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAppleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');

      const result = await signInWithPopup(auth, provider);
      console.log('Apple Sign-In successful:', result.user);
      onLogin();
    } catch (err: any) {
      console.error('Apple Sign-In error:', err);
      setError(err.message || 'Failed to sign in with Apple');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ios-groupedBackground flex items-center justify-center px-ios-md font-sf">
      <div className="max-w-md w-full">
        {/* Hero Section */}
        <div className="text-center mb-ios-2xl">
          <div className="w-24 h-24 bg-ios-blue rounded-[24px] flex items-center justify-center mx-auto mb-ios-lg">
            <span className="text-6xl">⚡</span>
          </div>
          <h1 className="text-[48px] font-bold text-ios-label mb-2 tracking-tight">Streaks</h1>
          <p className="text-[20px] text-ios-secondaryLabel mb-1 font-medium">Build habits, earn rewards</p>
          <p className="text-[15px] text-ios-tertiaryLabel">Syncs automatically across all your devices</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-ios-xl border border-ios-gray6 overflow-hidden mb-ios-lg">
          <div className="px-ios-lg py-ios-xl">
            <h2 className="text-[28px] font-bold text-ios-label text-center mb-ios-lg">
              Sign in to continue
            </h2>

            {error && (
              <div className="mb-ios-md p-ios-sm bg-ios-red bg-opacity-10 border border-ios-red rounded-ios-lg">
                <p className="text-[13px] text-ios-red text-center">{error}</p>
              </div>
            )}

            {/* Sign in with Apple */}
            <button
              onClick={handleAppleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-black hover:bg-opacity-90 active:bg-opacity-80 text-white font-semibold py-4 px-6 rounded-ios-lg transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Apple size={24} fill="white" />
              <span className="text-[17px]">{loading ? 'Signing in...' : 'Sign in with Apple'}</span>
            </button>

            {/* Info Box */}
            <div className="mt-ios-lg p-ios-sm bg-ios-blue bg-opacity-5 rounded-ios-lg">
              <p className="text-[13px] text-ios-secondaryLabel text-center leading-relaxed">
                Your habits, stats, and rewards sync automatically across iPhone, iPad, and Mac with iCloud.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-ios-sm">
          <div className="bg-white rounded-ios-lg border border-ios-gray6 p-ios-sm text-center">
            <div className="text-3xl mb-1">📝</div>
            <p className="text-[11px] text-ios-secondaryLabel font-medium">Track Habits</p>
          </div>
          <div className="bg-white rounded-ios-lg border border-ios-gray6 p-ios-sm text-center">
            <div className="text-3xl mb-1">🔥</div>
            <p className="text-[11px] text-ios-secondaryLabel font-medium">Build Streaks</p>
          </div>
          <div className="bg-white rounded-ios-lg border border-ios-gray6 p-ios-sm text-center">
            <div className="text-3xl mb-1">🎩</div>
            <p className="text-[11px] text-ios-secondaryLabel font-medium">Earn Rewards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
