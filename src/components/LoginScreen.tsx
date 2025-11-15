import React, { useState } from 'react';
import { signInWithPopup, OAuthProvider, signInAnonymously } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Zap, Apple, User } from 'lucide-react';

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

  const handleGuestSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInAnonymously(auth);
      console.log('Guest Sign-In successful:', result.user);
      onLogin();
    } catch (err: any) {
      console.error('Guest Sign-In error:', err);
      setError(err.message || 'Failed to sign in as guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="text-primary-600" size={48} />
            <h1 className="text-5xl font-bold text-gray-800">Streaks</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">Build habits, earn rewards</p>
          <p className="text-sm text-gray-500">Track your progress across all your devices</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Sign in to continue
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            {/* Sign in with Apple */}
            <button
              onClick={handleAppleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Apple size={24} />
              <span>Sign in with Apple</span>
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Continue as Guest */}
            <button
              onClick={handleGuestSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <User size={24} />
              <span>Continue as Guest</span>
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Sign in with Apple</strong> to sync your progress across all devices.
              <br />
              <strong>Guest mode</strong> saves data only on this device.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-1">📝</div>
            <p className="text-xs text-gray-600">Track Habits</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🔥</div>
            <p className="text-xs text-gray-600">Build Streaks</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🎩</div>
            <p className="text-xs text-gray-600">Earn Rewards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
