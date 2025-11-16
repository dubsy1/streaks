import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../config/firebase';
import { Task, UserStats } from '../types';

// Cloud storage paths
const getUserDocPath = (userId: string) => `users/${userId}`;
const getTasksPath = (userId: string) => `${getUserDocPath(userId)}/data/tasks`;
const getStatsPath = (userId: string) => `${getUserDocPath(userId)}/data/stats`;

/**
 * Save tasks to cloud
 */
export const saveTasksToCloud = async (user: User, tasks: Task[]): Promise<void> => {
  try {
    const path = getTasksPath(user.uid);
    console.log(`☁️ Saving ${tasks.length} tasks to: ${path}`);
    const tasksRef = doc(db, path);
    await setDoc(tasksRef, {
      tasks,
      updatedAt: new Date().toISOString(),
    });
    console.log(`✅ Successfully saved ${tasks.length} tasks to cloud`);
  } catch (error) {
    console.error('❌ Error saving tasks to cloud:', error);
    throw error;
  }
};

/**
 * Load tasks from cloud
 */
export const loadTasksFromCloud = async (user: User): Promise<Task[]> => {
  try {
    const path = getTasksPath(user.uid);
    console.log(`☁️ Loading tasks from: ${path}`);
    const tasksRef = doc(db, path);
    const snapshot = await getDoc(tasksRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      const tasks = data.tasks || [];
      console.log(`✅ Loaded ${tasks.length} tasks from cloud`);
      return tasks;
    }

    console.log('ℹ️ No cloud data found, returning empty array');
    return [];
  } catch (error) {
    console.error('❌ Error loading tasks from cloud:', error);
    return [];
  }
};

/**
 * Save stats to cloud
 */
export const saveStatsToCloud = async (user: User, stats: UserStats): Promise<void> => {
  try {
    const path = getStatsPath(user.uid);
    console.log(`☁️ Saving stats to: ${path}`, stats);
    const statsRef = doc(db, path);
    await setDoc(statsRef, {
      ...stats,
      updatedAt: new Date().toISOString(),
    });
    console.log('✅ Successfully saved stats to cloud');
  } catch (error) {
    console.error('❌ Error saving stats to cloud:', error);
    throw error;
  }
};

/**
 * Load stats from cloud
 */
export const loadStatsFromCloud = async (user: User): Promise<UserStats | null> => {
  try {
    const path = getStatsPath(user.uid);
    console.log(`☁️ Loading stats from: ${path}`);
    const statsRef = doc(db, path);
    const snapshot = await getDoc(statsRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      const stats = {
        level: data.level,
        experience: data.experience,
        health: data.health,
        gold: data.gold,
        equippedHat: data.equippedHat,
        ownedHats: data.ownedHats || [],
      };
      console.log('✅ Loaded stats from cloud:', stats);
      return stats;
    }

    console.log('ℹ️ No cloud stats found, returning null');
    return null;
  } catch (error) {
    console.error('❌ Error loading stats from cloud:', error);
    return null;
  }
};

/**
 * Subscribe to real-time updates for tasks
 */
export const subscribeToTasks = (
  user: User,
  onUpdate: (tasks: Task[]) => void
): (() => void) => {
  const tasksRef = doc(db, getTasksPath(user.uid));

  return onSnapshot(tasksRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      onUpdate(data.tasks || []);
    }
  });
};

/**
 * Subscribe to real-time updates for stats
 */
export const subscribeToStats = (
  user: User,
  onUpdate: (stats: UserStats) => void
): (() => void) => {
  const statsRef = doc(db, getStatsPath(user.uid));

  return onSnapshot(statsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      onUpdate({
        level: data.level,
        experience: data.experience,
        health: data.health,
        gold: data.gold,
        equippedHat: data.equippedHat,
        ownedHats: data.ownedHats || [],
      });
    }
  });
};

/**
 * Migrate localStorage data to cloud on first sign-in
 */
export const migrateLocalDataToCloud = async (
  user: User,
  localTasks: Task[],
  localStats: UserStats
): Promise<void> => {
  try {
    // Check if cloud data already exists
    const cloudTasks = await loadTasksFromCloud(user);
    const cloudStats = await loadStatsFromCloud(user);

    // Only migrate if cloud is empty and local has data
    if (cloudTasks.length === 0 && localTasks.length > 0) {
      await saveTasksToCloud(user, localTasks);
      console.log('Migrated local tasks to cloud');
    }

    if (!cloudStats && localStats) {
      await saveStatsToCloud(user, localStats);
      console.log('Migrated local stats to cloud');
    }
  } catch (error) {
    console.error('Error migrating data to cloud:', error);
  }
};
