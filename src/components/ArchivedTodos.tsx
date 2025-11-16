import React, { useState } from 'react';
import { Task } from '../types';
import { ChevronDown, ChevronRight, Archive } from 'lucide-react';

interface ArchivedTodosProps {
  archivedTodos: Task[];
}

const ArchivedTodos: React.FC<ArchivedTodosProps> = ({ archivedTodos }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (archivedTodos.length === 0) {
    return null;
  }

  const formatCompletedTime = (isoString?: string) => {
    if (!isoString) return 'No completion date';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        <Archive size={20} className="text-gray-600" />
        <span className="font-medium text-gray-700">
          Archived Todos ({archivedTodos.length})
        </span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {archivedTodos.map((todo) => (
            <div
              key={todo.id}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="flex items-start gap-2 mb-2">
                {todo.emoji && <span className="text-lg">{todo.emoji}</span>}
                <h3 className="font-medium text-gray-700 line-through">
                  {todo.title}
                </h3>
              </div>
              {todo.description && (
                <p className="text-sm text-gray-500 mb-2 ml-7">{todo.description}</p>
              )}
              <div className="flex items-center gap-2 ml-7">
                <span className="text-xs text-gray-500">
                  Completed: {formatCompletedTime(todo.completedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchivedTodos;
