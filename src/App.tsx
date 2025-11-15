import { useState, useEffect } from 'react';
import { Task, UserStats, TaskType } from './types';
import { loadTasks, saveTasks, loadStats, saveStats } from './utils/storage';
import { getTodayDateString } from './utils/dateUtils';
import { isCompletedToday, shouldShowDaily } from './utils/streakUtils';
import { addExperience, addGold, takeDamage, calculateReward, calculateDamage } from './utils/gameUtils';
import StatsBar from './components/StatsBar';
import TaskItem from './components/TaskItem';
import AddTaskForm from './components/AddTaskForm';
import { Zap } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [filter, setFilter] = useState<'all' | TaskType>('all');

  // Load data on mount
  useEffect(() => {
    setTasks(loadTasks());
    setStats(loadStats());
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0 || tasks.length === 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  // Save stats whenever they change
  useEffect(() => {
    if (stats) {
      saveStats(stats);
    }
  }, [stats]);

  const addTask = (taskData: {
    title: string;
    description: string;
    type: TaskType;
    difficulty: 'trivial' | 'easy' | 'medium' | 'hard';
    isPositive?: boolean;
    repeatDays?: number[];
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString(),
      completedDates: [],
      archived: false,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !stats) return;

    const today = getTodayDateString();
    const isCompleted = isCompletedToday(task);

    if (isCompleted) {
      // Uncomplete task - remove today's date
      setTasks(tasks.map(t =>
        t.id === taskId
          ? { ...t, completedDates: t.completedDates.filter(d => d !== today) }
          : t
      ));

      // Reverse rewards
      const { xp, gold } = calculateReward(task);
      if (task.type === 'habit' && !task.isPositive) {
        // Bad habit - restore health
        setStats({
          ...stats,
          health: Math.min(50, stats.health + calculateDamage(task)),
        });
      } else {
        // Remove rewards
        setStats({
          ...stats,
          experience: Math.max(0, stats.experience - xp),
          gold: Math.max(0, stats.gold - gold),
        });
      }
    } else {
      // Complete task - add today's date
      setTasks(tasks.map(t =>
        t.id === taskId
          ? { ...t, completedDates: [...t.completedDates, today] }
          : t
      ));

      // Grant rewards or damage
      if (task.type === 'habit' && !task.isPositive) {
        // Bad habit - take damage
        setStats(takeDamage(stats, calculateDamage(task)));
      } else {
        // Good task - grant rewards
        const { xp, gold } = calculateReward(task);
        let newStats = addExperience(stats, xp);
        newStats = addGold(newStats, gold);
        setStats(newStats);
      }
    }
  };

  const deleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks.filter(t => !t.archived);
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }
    // For dailies, only show those scheduled for today
    if (filter === 'daily') {
      filtered = filtered.filter(shouldShowDaily);
    }
    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Zap className="animate-pulse text-primary-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="text-primary-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-800">Streaks</h1>
          </div>
          <p className="text-gray-600">Track your habits, build streaks, level up!</p>
        </div>

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Add Task Form */}
        <AddTaskForm onAdd={addTask} />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'habit', 'daily', 'todo'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500">No tasks yet. Add one to get started!</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Built with React + TypeScript + Vite</p>
        </div>
      </div>
    </div>
  );
}

export default App;
