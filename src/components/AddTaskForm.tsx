import React, { useState } from 'react';
import { TaskType } from '../types';
import { Plus, X } from 'lucide-react';

interface AddTaskFormProps {
  onAdd: (task: {
    title: string;
    description: string;
    type: TaskType;
    difficulty: 'trivial' | 'easy' | 'medium' | 'hard';
    isPositive?: boolean;
    repeatDays?: number[];
  }) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('habit');
  const [difficulty, setDifficulty] = useState<'trivial' | 'easy' | 'medium' | 'hard'>('easy');
  const [isPositive, setIsPositive] = useState(true);
  const [repeatDays, setRepeatDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      type,
      difficulty,
      isPositive: type === 'habit' ? isPositive : undefined,
      repeatDays: type === 'daily' ? repeatDays : undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setType('habit');
    setDifficulty('easy');
    setIsPositive(true);
    setRepeatDays([0, 1, 2, 3, 4, 5, 6]);
    setIsOpen(false);
  };

  const toggleDay = (day: number) => {
    setRepeatDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3.5 bg-ios-blue hover:bg-opacity-90 active:bg-opacity-80 text-white rounded-ios-lg font-semibold text-[17px] flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] shadow-ios-button mb-ios-md"
      >
        <Plus size={22} strokeWidth={2.5} />
        Add Task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-ios-secondaryGroupedBackground rounded-ios-lg shadow-ios overflow-hidden mb-ios-md">
      {/* Header */}
      <div className="flex items-center justify-between px-ios-md py-ios-sm border-b border-ios-gray6">
        <h3 className="text-[17px] font-semibold text-ios-label">New Task</h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 rounded-full bg-ios-fillSecondary hover:bg-ios-fillPrimary flex items-center justify-center active:scale-95 transition-all duration-150"
        >
          <X size={18} className="text-ios-secondaryLabel" />
        </button>
      </div>

      <div className="p-ios-md space-y-ios-md">
        {/* Title */}
        <div>
          <label className="block text-[13px] font-semibold text-ios-label mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-ios-sm py-2.5 bg-ios-fillTertiary border border-ios-gray5 rounded-ios text-[17px] text-ios-label placeholder-ios-tertiaryLabel focus:outline-none focus:ring-2 focus:ring-ios-blue focus:border-transparent transition-all"
            placeholder="Enter task title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[13px] font-semibold text-ios-label mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-ios-sm py-2.5 bg-ios-fillTertiary border border-ios-gray5 rounded-ios text-[17px] text-ios-label placeholder-ios-tertiaryLabel focus:outline-none focus:ring-2 focus:ring-ios-blue focus:border-transparent transition-all resize-none"
            placeholder="Optional description"
            rows={2}
          />
        </div>

        {/* Type Selector - iOS Style */}
        <div>
          <label className="block text-[13px] font-semibold text-ios-label mb-1.5">
            Type
          </label>
          <div className="bg-ios-fillTertiary p-0.5 rounded-ios inline-flex gap-0.5">
            {(['habit', 'daily', 'todo'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-4 py-1.5 rounded-[7px] text-[13px] font-semibold capitalize transition-all duration-150 ${
                  type === t
                    ? 'bg-ios-secondaryGroupedBackground text-ios-label shadow-ios-button'
                    : 'text-ios-label hover:bg-ios-secondaryGroupedBackground hover:bg-opacity-50'
                }`}
              >
                {t === 'todo' ? 'To-Do' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-[13px] font-semibold text-ios-label mb-1.5">
            Difficulty
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['trivial', 'easy', 'medium', 'hard'] as const).map(diff => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficulty(diff)}
                className={`py-2 rounded-ios text-[13px] font-semibold capitalize transition-all duration-150 active:scale-95 ${
                  difficulty === diff
                    ? 'bg-ios-blue text-white shadow-ios-button'
                    : 'bg-ios-fillSecondary text-ios-label hover:bg-ios-fillPrimary'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Habit Type */}
        {type === 'habit' && (
          <div>
            <label className="block text-[13px] font-semibold text-ios-label mb-1.5">
              Habit Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPositive(true)}
                className={`py-2.5 rounded-ios text-[15px] font-semibold transition-all duration-150 active:scale-95 ${
                  isPositive
                    ? 'bg-ios-green text-white shadow-ios-button'
                    : 'bg-ios-fillSecondary text-ios-label hover:bg-ios-fillPrimary'
                }`}
              >
                ✅ Positive
              </button>
              <button
                type="button"
                onClick={() => setIsPositive(false)}
                className={`py-2.5 rounded-ios text-[15px] font-semibold transition-all duration-150 active:scale-95 ${
                  !isPositive
                    ? 'bg-ios-red text-white shadow-ios-button'
                    : 'bg-ios-fillSecondary text-ios-label hover:bg-ios-fillPrimary'
                }`}
              >
                ❌ Negative
              </button>
            </div>
          </div>
        )}

        {/* Daily Repeat Days */}
        {type === 'daily' && (
          <div>
            <label className="block text-[13px] font-semibold text-ios-label mb-1.5">
              Repeat On
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {dayNames.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`py-2 rounded-ios text-[11px] font-bold uppercase tracking-wide transition-all duration-150 active:scale-95 ${
                    repeatDays.includes(index)
                      ? 'bg-ios-blue text-white shadow-ios-button'
                      : 'bg-ios-fillSecondary text-ios-secondaryLabel hover:bg-ios-fillPrimary'
                  }`}
                >
                  {day.slice(0, 1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 bg-ios-blue hover:bg-opacity-90 active:bg-opacity-80 text-white rounded-ios-lg font-semibold text-[17px] transition-all duration-150 active:scale-[0.98] shadow-ios-button"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;
