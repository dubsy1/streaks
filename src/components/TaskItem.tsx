import React from 'react';
import { Task } from '../types';
import { calculateStreak, isCompletedToday } from '../utils/streakUtils';
import { Check, X, Pencil, Flame } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit }) => {
  const completed = isCompletedToday(task);
  const streak = calculateStreak(task);

  const difficultyColors = {
    trivial: 'bg-gray-100 text-gray-700',
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-all ${
      completed
        ? 'bg-green-50 border-green-300'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {task.emoji && <span className="text-xl">{task.emoji}</span>}
            <h3 className={`font-medium ${completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                <Flame size={14} />
                <span>{streak}</span>
              </div>
            )}
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          )}

          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${difficultyColors[task.difficulty]}`}>
              {task.difficulty}
            </span>
            <span className="text-xs text-gray-500 capitalize">{task.type}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {task.type === 'habit' && task.isPositive === false ? (
            <button
              onClick={() => onToggle(task.id)}
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
              title="Mark as done (bad habit)"
            >
              <X size={20} />
            </button>
          ) : (
            <button
              onClick={() => onToggle(task.id)}
              className={`p-2 rounded-full transition-colors ${
                completed
                  ? 'bg-green-200 text-green-700'
                  : 'bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600'
              }`}
              title="Mark as complete"
            >
              <Check size={20} />
            </button>
          )}

          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-colors"
            title="Edit task"
          >
            <Pencil size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
