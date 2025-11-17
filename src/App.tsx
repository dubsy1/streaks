import { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { Task, UserStats, TaskType } from './types';
import { loadTasks, saveTasks, loadStats, saveStats } from './utils/storage';
import {
  saveTasksToCloud,
  saveStatsToCloud,
  loadTasksFromCloud,
  loadStatsFromCloud,
  migrateLocalDataToCloud
} from './utils/cloudSync';
import { getTodayDateString } from './utils/dateUtils';
import { isCompletedToday, shouldShowDaily, calculateStreak } from './utils/streakUtils';
import { addExperience, addGold, takeDamage, calculateReward, calculateDamage } from './utils/gameUtils';
import { checkDailyReset, setLastCompletionTime, canCompleteHabit, getRemainingCooldown } from './utils/dailyResetUtils';
import { HATS } from './data/hats';
import { MAX_HEALTH } from './types';
import { auth } from './config/firebase';
import LoginScreen from './components/LoginScreen';
import Onboarding from './components/Onboarding';
import UserProfile from './components/UserProfile';
import StatsBar from './components/StatsBar';
import TaskItem from './components/TaskItem';
import AddTaskForm from './components/AddTaskForm';
import CharacterDisplay from './components/CharacterDisplay';
import Shop from './components/Shop';
import Inventory from './components/Inventory';
import EditTaskModal from './components/EditTaskModal';
import ArchivedTodos from './components/ArchivedTodos';
import Statistics from './components/Statistics';

type View = 'tasks' | 'shop' | 'inventory' | 'statistics';

const HABIT_COOLDOWN_MINUTES = 5; // Prevent spam clicking habits

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [filter, setFilter] = useState<'all' | TaskType>('all');
  const [currentView, setCurrentView] = useState<View>('tasks');
  const [notification, setNotification] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(
    localStorage.getItem('onboardingComplete') === 'true'
  );

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);

      if (firebaseUser) {
        // User is signed in, load from cloud
        await loadDataFromCloud(firebaseUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load data from cloud
  const loadDataFromCloud = async (firebaseUser: User) => {
    setSyncing(true);
    try {
      console.log('🔄 Loading data for user:', firebaseUser.uid);

      // Load local data first (for migration)
      const localTasks = loadTasks();
      const localStats = loadStats();
      console.log('📱 Local data:', { taskCount: localTasks.length, stats: localStats });

      // Migrate local data to cloud if needed
      await migrateLocalDataToCloud(firebaseUser, localTasks, localStats);

      // Load from cloud
      const cloudTasks = await loadTasksFromCloud(firebaseUser);
      const cloudStats = await loadStatsFromCloud(firebaseUser);
      console.log('☁️ Cloud data:', { taskCount: cloudTasks.length, stats: cloudStats });

      const finalTasks = cloudTasks.length > 0 ? cloudTasks : localTasks;
      const finalStats = cloudStats || localStats;

      console.log('✅ Using data:', { taskCount: finalTasks.length, stats: finalStats });

      setTasks(finalTasks);
      setStats(finalStats);

      // Check for daily reset
      const { needsReset, incompleteDailies } = checkDailyReset(finalTasks);
      if (needsReset && incompleteDailies.length > 0) {
        const totalDamage = incompleteDailies.reduce((sum, task) => sum + calculateDamage(task), 0);
        const newStats = takeDamage(finalStats, totalDamage);
        setStats(newStats);
        await saveStatsToCloud(firebaseUser, newStats);
        showNotification(`❌ Lost ${totalDamage.toFixed(1)} HP for ${incompleteDailies.length} incomplete dailies!`);
      }
    } catch (error) {
      console.error('❌ Error loading cloud data:', error);
      // Fallback to local data
      setTasks(loadTasks());
      setStats(loadStats());
    } finally {
      setSyncing(false);
    }
  };

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0 || tasks.length === 0) {
      saveTasks(tasks); // Save locally
      console.log('💾 Saved tasks to localStorage:', tasks.length);

      if (user) {
        console.log('☁️ Saving tasks to cloud for user:', user.uid);
        saveTasksToCloud(user, tasks)
          .then(() => console.log('✅ Tasks saved to cloud successfully'))
          .catch(err => console.error('❌ Error saving tasks to cloud:', err));
      }
    }
  }, [tasks, user]);

  // Save stats whenever they change
  useEffect(() => {
    if (stats) {
      saveStats(stats); // Save locally
      console.log('💾 Saved stats to localStorage:', stats);

      if (user) {
        console.log('☁️ Saving stats to cloud for user:', user.uid);
        saveStatsToCloud(user, stats)
          .then(() => console.log('✅ Stats saved to cloud successfully'))
          .catch(err => console.error('❌ Error saving stats to cloud:', err));
      }
    }
  }, [stats, user]);

  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      // Don't clear tasks/stats here - the auth state listener will handle UI state
      // This prevents overwriting cloud data with empty arrays
      await signOut(auth);
      showNotification('👋 Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      showNotification('❌ Failed to sign out');
    }
  };

  const handleCompleteOnboarding = (data: { goal: string; focusArea: string }) => {
    console.log('Onboarding completed:', data);
    localStorage.setItem('onboardingComplete', 'true');
    setHasCompletedOnboarding(true);
    showNotification('🎉 Welcome to Streaks!');
  };

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

      // Complete task - add today's date and timestamp for todos
      const updatedTasks = tasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              completedDates: [...t.completedDates, today],
              completedAt: t.type === 'todo' ? new Date().toISOString() : t.completedAt,
            }
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

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    showNotification('✅ Task updated successfully');
  };

  const archiveTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const archivedTask = {
        ...task,
        archived: true,
        completedAt: task.type === 'todo' ? new Date().toISOString() : task.completedAt,
      };
      setTasks(tasks.map(t => t.id === taskId ? archivedTask : t));
      showNotification(`📦 ${task.type.charAt(0).toUpperCase() + task.type.slice(1)} archived`);
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

  const getArchivedTodos = () => {
    return tasks
      .filter(t => t.archived && t.type === 'todo')
      .sort((a, b) => {
        // Sort by completion date, most recent first
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
      });
  };

  const filteredTasks = getFilteredTasks();
  const archivedTodos = getArchivedTodos();
  const equippedHat = stats?.equippedHat ? HATS.find(h => h.id === stats.equippedHat) : undefined;

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-ios-groupedBackground flex items-center justify-center font-sf">
        <div className="text-center">
          <div className="animate-pulse text-ios-blue mx-auto mb-4 text-5xl">⚡</div>
          <p className="text-ios-secondaryLabel text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen onLogin={() => {}} />;
  }

  // Show onboarding for new users
  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleCompleteOnboarding} />;
  }

  // Show loading while syncing
  if (syncing || !stats) {
    return (
      <div className="min-h-screen bg-ios-groupedBackground flex items-center justify-center font-sf">
        <div className="text-center">
          <div className="animate-pulse text-ios-blue mx-auto mb-4">⚡</div>
          <p className="text-ios-secondaryLabel text-lg">Syncing your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ios-groupedBackground font-sf">
      {/* iOS-Style Notification Toast */}
      {notification && (
        <div className="fixed top-4 z-50 inset-x-0 flex justify-center px-4 pointer-events-none">
          <div className="bg-white border border-ios-gray6 text-ios-label px-5 py-3 rounded-ios-lg text-center font-semibold text-base transform transition-all duration-300 ease-out pointer-events-auto">
            {notification}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-ios-md pb-24">
        {/* iOS-Style Header */}
        <div className="pt-ios-lg px-ios-md pb-ios-lg">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-[34px] font-bold text-ios-label tracking-tight leading-tight">Streaks</h1>
            <UserProfile user={user} onSignOut={handleSignOut} />
          </div>
        </div>

        {/* Character Display - Always visible */}
        <CharacterDisplay equippedHat={equippedHat} />

        {/* Stats Bar - Always visible */}
        <StatsBar stats={stats} />

        {/* Content Area */}
        <div className="space-y-ios-md">

        {/* Content based on current view */}
        {currentView === 'tasks' && (
          <>
            {/* Add Task Form */}
            <AddTaskForm onAdd={addTask} />

            {/* iOS Segmented Control - Filter */}
            <div className="bg-ios-fillTertiary p-0.5 rounded-ios inline-flex gap-0.5 mb-ios-md">
              {(['all', 'habit', 'daily', 'todo'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-[7px] text-[13px] font-semibold capitalize transition-all duration-150 ${
                    filter === f
                      ? 'bg-ios-secondaryGroupedBackground text-ios-label shadow-ios-button'
                      : 'text-ios-label hover:bg-ios-secondaryGroupedBackground hover:bg-opacity-50'
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
                    onEdit={setEditingTask}
                  />
                ))
              )}
            </div>

            {/* Archived Todos - Only show when viewing all or todos */}
            {(filter === 'all' || filter === 'todo') && (
              <ArchivedTodos archivedTodos={archivedTodos} />
            )}
          </>
        )}

        {currentView === 'shop' && (
          <Shop stats={stats} onPurchase={purchaseHat} />
        )}

        {currentView === 'inventory' && (
          <Inventory stats={stats} onEquip={equipHat} />
        )}

        {currentView === 'statistics' && (
          <Statistics tasks={tasks} stats={stats} />
        )}
        </div>
      </div>

      {/* iOS-Style Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-ios-secondaryGroupedBackground bg-opacity-95 backdrop-blur-xl border-t border-ios-gray5 safe-bottom z-40">
        <div className="flex justify-around items-center px-2 py-1">
          {[
            { id: 'tasks', icon: '📝', label: 'Tasks' },
            { id: 'shop', icon: '🛒', label: 'Shop' },
            { id: 'inventory', icon: '🎒', label: 'Inventory' },
            { id: 'statistics', icon: '📊', label: 'Stats' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as View)}
              className={`flex flex-col items-center justify-center py-1.5 px-4 min-w-[60px] transition-all duration-150 active:scale-95 ${
                currentView === tab.id ? 'text-ios-blue' : 'text-ios-gray'
              }`}
            >
              <span className="text-[26px] leading-none mb-0.5">{tab.icon}</span>
              <span className="text-[10px] font-medium tracking-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={updateTask}
          onArchive={archiveTask}
        />
      )}
    </div>
  );
}

export default App;
