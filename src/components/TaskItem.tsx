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
    trivial: 'bg-ios-fillSecondary text-ios-secondaryLabel',
    easy: 'bg-ios-green bg-opacity-10 text-ios-green',
    medium: 'bg-ios-orange bg-opacity-10 text-ios-orange',
    hard: 'bg-ios-red bg-opacity-10 text-ios-red',
  };

  return (
    <div className={`bg-ios-secondaryGroupedBackground rounded-ios-lg border border-ios-gray6 overflow-hidden transition-all duration-200 ${
      completed ? 'opacity-60' : ''
    }`}>
      <div className="px-ios-md py-ios-sm flex items-center justify-between gap-3">
        {/* Left: Checkbox/Action Button */}
        <button
          onClick={() => onToggle(task.id)}
          className="flex-shrink-0 active:scale-95 transition-transform duration-150"
        >
          {task.type === 'habit' && task.isPositive === false ? (
            <div className="w-7 h-7 rounded-full bg-ios-red bg-opacity-10 flex items-center justify-center">
              <X size={18} className="text-ios-red" strokeWidth={3} />
            </div>
          ) : (
            <div
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                completed
                  ? 'bg-ios-blue border-ios-blue'
                  : 'border-ios-gray3 hover:border-ios-blue'
              }`}
            >
              {completed && <Check size={16} className="text-white" strokeWidth={3} />}
            </div>
          )}
        </button>

        {/* Middle: Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {task.emoji && <span className="text-lg leading-none">{task.emoji}</span>}
            <h3
              className={`text-[17px] font-semibold truncate ${
                completed ? 'line-through text-ios-tertiaryLabel' : 'text-ios-label'
              }`}
            >
              {task.title}
            </h3>
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-ios-orange bg-opacity-15 rounded-full flex-shrink-0">
                <Flame size={12} className="text-ios-orange" fill="currentColor" />
                <span className="text-[11px] font-bold text-ios-orange tabular-nums">{streak}</span>
              </div>
            )}
          </div>

          {task.description && (
            <p className="text-[13px] text-ios-secondaryLabel line-clamp-1">{task.description}</p>
          )}

          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[11px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wide ${difficultyColors[task.difficulty]}`}
            >
              {task.difficulty}
            </span>
            <span className="text-[11px] text-ios-tertiaryLabel font-medium capitalize">
              {task.type}
            </span>
          </div>
        </div>

        {/* Right: Edit Button */}
        <button
          onClick={() => onEdit(task)}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-ios-fillSecondary hover:bg-ios-fillPrimary flex items-center justify-center active:scale-95 transition-all duration-150"
        >
          <Pencil size={16} className="text-ios-blue" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
