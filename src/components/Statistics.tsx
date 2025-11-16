import React from 'react';
import { Task, UserStats } from '../types';
import { calculateStreak } from '../utils/streakUtils';
import { TrendingUp, Target, Flame, Trophy, Zap, CheckCircle } from 'lucide-react';

interface StatisticsProps {
  tasks: Task[];
  stats: UserStats;
}

const Statistics: React.FC<StatisticsProps> = ({ tasks, stats }) => {
  // Calculate statistics
  const activeTasks = tasks.filter(t => !t.archived);
  const archivedTasks = tasks.filter(t => t.archived);
  const totalTasks = tasks.length;

  const habits = activeTasks.filter(t => t.type === 'habit');
  const dailies = activeTasks.filter(t => t.type === 'daily');
  const todos = activeTasks.filter(t => t.type === 'todo');

  // Calculate completion counts
  const totalCompletions = tasks.reduce((sum, task) => sum + task.completedDates.length, 0);

  // Calculate longest streaks
  const streaks = activeTasks.map(task => ({
    title: task.title,
    emoji: task.emoji,
    streak: calculateStreak(task),
    type: task.type,
  })).filter(s => s.streak > 0).sort((a, b) => b.streak - a.streak);

  const longestStreak = streaks.length > 0 ? streaks[0].streak : 0;

  // Calculate completion rate (tasks with at least one completion)
  const tasksWithCompletions = activeTasks.filter(t => t.completedDates.length > 0).length;
  const completionRate = activeTasks.length > 0
    ? Math.round((tasksWithCompletions / activeTasks.length) * 100)
    : 0;

  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
  }> = ({ icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <span className="text-sm text-gray-600 font-medium">{label}</span>
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Your Statistics</h2>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={<Zap className="text-blue-600" size={24} />}
            label="Level"
            value={stats.level}
            color="bg-blue-100"
          />
          <StatCard
            icon={<Trophy className="text-yellow-600" size={24} />}
            label="Total Gold"
            value={stats.gold.toFixed(0)}
            color="bg-yellow-100"
          />
          <StatCard
            icon={<TrendingUp className="text-green-600" size={24} />}
            label="Total XP"
            value={stats.experience.toFixed(0)}
            color="bg-green-100"
          />
        </div>

        {/* Task Counts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Target className="text-purple-600" size={20} />}
            label="Habits"
            value={habits.length}
            color="bg-purple-100"
          />
          <StatCard
            icon={<CheckCircle className="text-blue-600" size={20} />}
            label="Dailies"
            value={dailies.length}
            color="bg-blue-100"
          />
          <StatCard
            icon={<CheckCircle className="text-green-600" size={20} />}
            label="Todos"
            value={todos.length}
            color="bg-green-100"
          />
          <StatCard
            icon={<CheckCircle className="text-gray-600" size={20} />}
            label="Archived"
            value={archivedTasks.length}
            color="bg-gray-100"
          />
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<Flame className="text-orange-600" size={24} />}
            label="Longest Streak"
            value={longestStreak > 0 ? `${longestStreak} days` : 'None'}
            color="bg-orange-100"
          />
          <StatCard
            icon={<CheckCircle className="text-green-600" size={24} />}
            label="Total Completions"
            value={totalCompletions}
            color="bg-green-100"
          />
          <StatCard
            icon={<TrendingUp className="text-blue-600" size={24} />}
            label="Completion Rate"
            value={`${completionRate}%`}
            color="bg-blue-100"
          />
        </div>
      </div>

      {/* Current Streaks */}
      {streaks.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Flame className="text-orange-500" size={24} />
            Current Streaks
          </h3>
          <div className="space-y-2">
            {streaks.slice(0, 10).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {item.emoji && <span className="text-lg">{item.emoji}</span>}
                  <span className="font-medium text-gray-800">{item.title}</span>
                  <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded capitalize">
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">
                  <Flame size={16} />
                  <span>{item.streak}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalTasks === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">
            Start creating tasks to see your statistics!
          </p>
        </div>
      )}
    </div>
  );
};

export default Statistics;
