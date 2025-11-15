import { Task, UserStats, MAX_HEALTH } from '../types';

const TASKS_KEY = 'streaks_tasks';
const STATS_KEY = 'streaks_stats';

export const loadTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const loadStats = (): UserStats => {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure backward compatibility - add missing fields
      return {
        level: parsed.level || 1,
        experience: parsed.experience || 0,
        health: parsed.health !== undefined ? parsed.health : MAX_HEALTH,
        gold: parsed.gold || 0,
        equippedHat: parsed.equippedHat,
        ownedHats: parsed.ownedHats || [],
      };
    }
    return {
      level: 1,
      experience: 0,
      health: MAX_HEALTH,
      gold: 0,
      equippedHat: undefined,
      ownedHats: [],
    };
  } catch (error) {
    console.error('Error loading stats:', error);
    return {
      level: 1,
      experience: 0,
      health: MAX_HEALTH,
      gold: 0,
      equippedHat: undefined,
      ownedHats: [],
    };
  }
};

export const saveStats = (stats: UserStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};
