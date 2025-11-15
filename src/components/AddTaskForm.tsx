import React, { useState } from 'react';
import { TaskType } from '../types';
import { Plus } from 'lucide-react';

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
        className="w-full p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <Plus size={20} />
        Add New Task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Task</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Optional description"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TaskType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="habit">Habit</option>
            <option value="daily">Daily</option>
            <option value="todo">To-Do</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty *
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="trivial">Trivial</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {type === 'habit' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habit Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={isPositive}
                  onChange={() => setIsPositive(true)}
                  className="mr-2"
                />
                <span className="text-sm">Positive (gain rewards)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!isPositive}
                  onChange={() => setIsPositive(false)}
                  className="mr-2"
                />
                <span className="text-sm">Negative (lose health)</span>
              </label>
            </div>
          </div>
        )}

        {type === 'daily' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repeat On
            </label>
            <div className="flex gap-2">
              {dayNames.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    repeatDays.includes(index)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddTaskForm;
