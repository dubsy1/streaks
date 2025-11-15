import { useState, useEffect } from 'react';
import { Task, UserStats, TaskType } from './types';
import { loadTasks, saveTasks, loadStats, saveStats } from './utils/storage';
import { getTodayDateString } from './utils/dateUtils';
import { isCompletedToday, shouldShowDaily, calculateStreak } from './utils/streakUtils';
import { addExperience, addGold, takeDamage, calculateReward, calculateDamage } from './utils/gameUtils';
import { checkDailyReset, setLastCompletionTime, canCompleteHabit, getRemainingCooldown } from './utils/dailyResetUtils';
import { HATS } from './data/hats';
import { MAX_HEALTH } from './types';
import StatsBar from './components/StatsBar';
import TaskItem from './components/TaskItem';
import AddTaskForm from './components/AddTaskForm';
import CharacterDisplay from './components/CharacterDisplay';
import Shop from './components/Shop';
import Inventory from './components/Inventory';
import { Zap } from 'lucide-react';

type View = 'tasks' | 'character' | 'shop' | 'inventory';

const HABIT_COOLDOWN_MINUTES = 5; // Prevent spam clicking habits

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [filter, setFilter] = useState<'all' | TaskType>('all');
  const [currentView, setCurrentView] = useState<View>('tasks');
  const [notification, setNotification] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    setTasks(loadTasks());
    const loadedStats = loadStats();
    setStats(loadedStats);

    // Check for daily reset and incomplete dailies
    const { needsReset, incompleteDailies } = checkDailyReset(loadTasks());
    if (needsReset && incompleteDailies.length > 0) {
      // Damage for each incomplete daily
      const totalDamage = incompleteDailies.reduce((sum, task) => sum + calculateDamage(task), 0);
      const newStats = takeDamage(loadedStats, totalDamage);
      setStats(newStats);
      showNotification(`❌ Lost ${totalDamage.toFixed(1)} HP for ${incompleteDailies.length} incomplete dailies!`);
    }
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

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

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
          health: Math.min(MAX_HEALTH, stats.health + calculateDamage(task)),
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
      // Check habit cooldown
      if (task.type === 'habit' && !canCompleteHabit(taskId, HABIT_COOLDOWN_MINUTES)) {
        const remaining = getRemainingCooldown(taskId, HABIT_COOLDOWN_MINUTES);
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        showNotification(`⏳ Cooldown: ${minutes}m ${seconds}s remaining`);
        return;
      }

      // Complete task - add today's date
      const updatedTasks = tasks.map(t =>
        t.id === taskId
          ? { ...t, completedDates: [...t.completedDates, today] }
          : t
      );
      setTasks(updatedTasks);

      // Set cooldown for habits
      if (task.type === 'habit') {
        setLastCompletionTime(taskId);
      }

      // Calculate streak bonus
      const updatedTask = updatedTasks.find(t => t.id === taskId)!;
      const streak = calculateStreak(updatedTask);
      const streakBonus = streak >= 7 ? 1.5 : streak >= 3 ? 1.2 : 1.0;

      // Grant rewards or damage
      if (task.type === 'habit' && !task.isPositive) {
        // Bad habit - take damage
        const damage = calculateDamage(task);
        const newStats = takeDamage(stats, damage);
        setStats(newStats);
        showNotification(`💔 -${damage.toFixed(1)} HP`);
      } else {
        // Good task - grant rewards with streak bonus
        const { xp, gold } = calculateReward(task);
        const bonusXp = xp * streakBonus;
        const bonusGold = gold * streakBonus;

        const oldLevel = stats.level;
        let newStats = addExperience(stats, bonusXp);
        newStats = addGold(newStats, bonusGold);
        setStats(newStats);

        // Level up notification
        if (newStats.level > oldLevel) {
          showNotification(`🎉 LEVEL UP! Now level ${newStats.level}!`);
        } else if (streakBonus > 1) {
          showNotification(`🔥 ${streak} day streak! +${bonusXp.toFixed(1)} XP, +${bonusGold.toFixed(1)} gold`);
        } else {
          showNotification(`✅ +${bonusXp.toFixed(1)} XP, +${bonusGold.toFixed(1)} gold`);
        }
      }
    }
  };

  const deleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const purchaseHat = (hatId: string) => {
    if (!stats) return;

    const hat = HATS.find(h => h.id === hatId);
    if (!hat) return;

    // Check if already owned
    if (stats.ownedHats.includes(hatId)) {
      showNotification('❌ You already own this hat!');
      return;
    }

    // Check if can afford
    if (stats.gold < hat.price) {
      showNotification(`❌ Need ${(hat.price - stats.gold).toFixed(1)} more gold!`);
      return;
    }

    // Purchase hat
    setStats({
      ...stats,
      gold: stats.gold - hat.price,
      ownedHats: [...stats.ownedHats, hatId],
    });
    showNotification(`🎩 Purchased ${hat.name}!`);
  };

  const equipHat = (hatId: string | undefined) => {
    if (!stats) return;
    const hat = hatId ? HATS.find(h => h.id === hatId) : undefined;
    setStats({
      ...stats,
      equippedHat: hatId,
    });
    showNotification(hat ? `👤 Equipped ${hat.name}!` : '👤 Hat removed');
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
  const equippedHat = stats?.equippedHat ? HATS.find(h => h.id === stats.equippedHat) : undefined;

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
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg text-center font-medium">
            {notification}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="text-primary-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-800">Streaks</h1>
          </div>
          <p className="text-gray-600">Track your habits, build streaks, level up!</p>
        </div>

        {/* Stats with Character - Always visible */}
        <StatsBar stats={stats} equippedHat={equippedHat} />

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'tasks', label: '📝 Tasks' },
            { id: 'character', label: '👤 Character' },
            { id: 'shop', label: '🛒 Shop' },
            { id: 'inventory', label: '🎒 Inventory' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as View)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                currentView === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on current view */}
        {currentView === 'tasks' && (
          <>
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
          </>
        )}

        {currentView === 'character' && (
          <CharacterDisplay equippedHat={equippedHat} />
        )}

        {currentView === 'shop' && (
          <Shop stats={stats} onPurchase={purchaseHat} />
        )}

        {currentView === 'inventory' && (
          <Inventory stats={stats} onEquip={equipHat} />
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Built with React + TypeScript + Vite</p>
        </div>
      </div>
    </div>
  );
}

export default App;
