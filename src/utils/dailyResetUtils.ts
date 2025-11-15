import { Task } from '../types';
import { getTodayDateString, getYesterdayDateString } from './dateUtils';
import { shouldShowDaily } from './streakUtils';

const LAST_DAILY_CHECK_KEY = 'streaks_last_daily_check';

export const checkDailyReset = (tasks: Task[]): {
  needsReset: boolean;
  incompleteDailies: Task[];
} => {
  const today = getTodayDateString();
  const lastCheck = localStorage.getItem(LAST_DAILY_CHECK_KEY);

  if (lastCheck !== today) {
    // It's a new day! Check for incomplete dailies
    const yesterday = getYesterdayDateString();
    const incompleteDailies = tasks.filter(task => {
      if (task.type !== 'daily' || task.archived) return false;
      if (!shouldShowDaily(task)) return false; // Only dailies scheduled for yesterday
      return !task.completedDates.includes(yesterday);
    });

    localStorage.setItem(LAST_DAILY_CHECK_KEY, today);

    return {
      needsReset: true,
      incompleteDailies,
    };
  }

  return {
    needsReset: false,
    incompleteDailies: [],
  };
};

export const getLastCompletionTime = (taskId: string): number | null => {
  const key = `last_completion_${taskId}`;
  const time = localStorage.getItem(key);
  return time ? parseInt(time, 10) : null;
};

export const setLastCompletionTime = (taskId: string): void => {
  const key = `last_completion_${taskId}`;
  localStorage.setItem(key, Date.now().toString());
};

export const canCompleteHabit = (taskId: string, cooldownMinutes: number = 0): boolean => {
  if (cooldownMinutes === 0) return true;

  const lastTime = getLastCompletionTime(taskId);
  if (!lastTime) return true;

  const now = Date.now();
  const cooldownMs = cooldownMinutes * 60 * 1000;
  return (now - lastTime) >= cooldownMs;
};

export const getRemainingCooldown = (taskId: string, cooldownMinutes: number): number => {
  const lastTime = getLastCompletionTime(taskId);
  if (!lastTime) return 0;

  const now = Date.now();
  const cooldownMs = cooldownMinutes * 60 * 1000;
  const elapsed = now - lastTime;
  const remaining = Math.max(0, cooldownMs - elapsed);

  return Math.ceil(remaining / 1000); // Return seconds remaining
};
