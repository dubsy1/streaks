import React, { useState } from 'react';
import { Task } from '../types';
import { X, Archive, Smile } from 'lucide-react';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
  onArchive: (taskId: string) => void;
}

const EMOJI_OPTIONS = ['⚡', '🎯', '💪', '📚', '🏃', '🍎', '💧', '🧘', '🎨', '💻', '🎮', '🎵', '📝', '🔥', '⭐', '🌟', '✨', '🎉', '🏆', '💎'];

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onSave, onArchive }) => {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  const handleArchive = () => {
    if (window.confirm(`Archive this ${task.type}?`)) {
      onArchive(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Edit {task.type}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Emoji Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emoji (optional)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {editedTask.emoji ? (
                  <span className="text-2xl">{editedTask.emoji}</span>
                ) : (
                  <Smile size={20} className="text-gray-400" />
                )}
                <span className="text-sm text-gray-600">
                  {editedTask.emoji ? 'Change emoji' : 'Add emoji'}
                </span>
              </button>
              {editedTask.emoji && (
                <button
                  onClick={() => setEditedTask({ ...editedTask, emoji: undefined })}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            {showEmojiPicker && (
              <div className="mt-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                <div className="grid grid-cols-10 gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setEditedTask({ ...editedTask, emoji });
                        setShowEmojiPicker(false);
                      }}
                      className="text-2xl hover:bg-gray-200 rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['trivial', 'easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setEditedTask({ ...editedTask, difficulty: diff })}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    editedTask.difficulty === diff
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Habit-specific: Positive/Negative */}
          {task.type === 'habit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habit Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEditedTask({ ...editedTask, isPositive: true })}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    editedTask.isPositive !== false
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ✅ Good Habit
                </button>
                <button
                  type="button"
                  onClick={() => setEditedTask({ ...editedTask, isPositive: false })}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    editedTask.isPositive === false
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ❌ Bad Habit
                </button>
              </div>
            </div>
          )}

          {/* Daily-specific: Repeat Days */}
          {task.type === 'daily' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat on Days
              </label>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                  const isSelected = editedTask.repeatDays?.includes(index) || false;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const current = editedTask.repeatDays || [];
                        const updated = isSelected
                          ? current.filter(d => d !== index)
                          : [...current, index].sort();
                        setEditedTask({ ...editedTask, repeatDays: updated });
                      }}
                      className={`px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reset Time for Habits and Dailies */}
          {(task.type === 'habit' || task.type === 'daily') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reset Time (optional)
              </label>
              <input
                type="time"
                value={editedTask.resetTime || '00:00'}
                onChange={(e) => setEditedTask({ ...editedTask, resetTime: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Time of day when this {task.type} should reset
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={handleArchive}
            className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors font-medium"
          >
            <Archive size={18} />
            Archive
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!editedTask.title.trim()}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
