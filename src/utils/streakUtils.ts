import { Task } from '../types';
import { getTodayDateString, getYesterdayDateString, getDaysDifference } from './dateUtils';

export const calculateStreak = (task: Task): number => {
  if (task.completedDates.length === 0) return 0;

  const sortedDates = [...task.completedDates].sort().reverse();
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  // Streak must include today or yesterday
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = getDaysDifference(sortedDates[i], sortedDates[i + 1]);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const isCompletedToday = (task: Task): boolean => {
  return task.completedDates.includes(getTodayDateString());
};

export const shouldShowDaily = (task: Task): boolean => {
  if (task.type !== 'daily') return false;
  if (!task.repeatDays || task.repeatDays.length === 0) return true;

  const today = new Date().getDay();
  return task.repeatDays.includes(today);
};
