import React, { useState } from 'react';
import { Sparkles, Target, Zap } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: { goal: string; focusArea: string }) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [focusArea, setFocusArea] = useState('');

  const goals = [
    { id: 'health', label: 'Get Healthier', icon: '💪', color: 'bg-ios-green' },
    { id: 'productivity', label: 'Be More Productive', icon: '⚡', color: 'bg-ios-blue' },
    { id: 'learning', label: 'Learn New Skills', icon: '📚', color: 'bg-ios-purple' },
    { id: 'wellness', label: 'Improve Wellness', icon: '🧘', color: 'bg-ios-teal' },
  ];

  const focusAreas = [
    { id: 'exercise', label: 'Exercise', icon: '🏃' },
    { id: 'reading', label: 'Reading', icon: '📖' },
    { id: 'meditation', label: 'Meditation', icon: '🧘' },
    { id: 'work', label: 'Work', icon: '💼' },
    { id: 'diet', label: 'Diet', icon: '🥗' },
    { id: 'sleep', label: 'Sleep', icon: '😴' },
  ];

  const handleComplete = () => {
    onComplete({ goal, focusArea });
  };

  return (
    <div className="min-h-screen bg-ios-groupedBackground flex items-center justify-center px-ios-md font-sf">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-ios-2xl">
          <div className="w-20 h-20 bg-ios-blue rounded-full flex items-center justify-center mx-auto mb-ios-md">
            <Sparkles className="text-white" size={40} />
          </div>
          <h1 className="text-[34px] font-bold text-ios-label mb-2">Welcome to Streaks</h1>
          <p className="text-[17px] text-ios-secondaryLabel">
            Let's personalize your experience
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-ios-xl">
          <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-ios-blue' : 'bg-ios-gray5'}`} />
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-ios-blue' : 'bg-ios-gray5'}`} />
        </div>

        {/* Step 1: Goal Selection */}
        {step === 1 && (
          <div className="bg-ios-secondaryGroupedBackground rounded-ios-lg p-ios-lg mb-ios-md">
            <div className="flex items-center gap-2 mb-ios-md">
              <Target className="text-ios-blue" size={24} />
              <h2 className="text-[22px] font-bold text-ios-label">What's your main goal?</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {goals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setGoal(g.id);
                    setStep(2);
                  }}
                  className={`p-ios-md rounded-ios-lg border-2 transition-all duration-150 active:scale-95 ${
                    goal === g.id
                      ? 'border-ios-blue bg-ios-blue bg-opacity-10'
                      : 'border-ios-gray5 bg-ios-secondaryGroupedBackground'
                  }`}
                >
                  <div className="text-4xl mb-2">{g.icon}</div>
                  <div className="text-[15px] font-semibold text-ios-label">{g.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Focus Area */}
        {step === 2 && (
          <div className="bg-ios-secondaryGroupedBackground rounded-ios-lg p-ios-lg mb-ios-md">
            <div className="flex items-center gap-2 mb-ios-md">
              <Zap className="text-ios-blue" size={24} />
              <h2 className="text-[22px] font-bold text-ios-label">Pick your focus</h2>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-ios-lg">
              {focusAreas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => setFocusArea(area.id)}
                  className={`p-ios-sm rounded-ios-lg border-2 transition-all duration-150 active:scale-95 ${
                    focusArea === area.id
                      ? 'border-ios-blue bg-ios-blue bg-opacity-10'
                      : 'border-ios-gray5 bg-ios-secondaryGroupedBackground'
                  }`}
                >
                  <div className="text-3xl mb-1">{area.icon}</div>
                  <div className="text-[13px] font-semibold text-ios-label">{area.label}</div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-ios-fillSecondary text-ios-label rounded-ios-lg font-semibold text-[17px] transition-all duration-150 active:scale-95"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={!focusArea}
                className="flex-1 py-3 bg-ios-blue text-white rounded-ios-lg font-semibold text-[17px] transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Skip Button */}
        <button
          onClick={() => onComplete({ goal: 'skip', focusArea: 'skip' })}
          className="w-full text-ios-blue text-[17px] font-semibold py-3"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
