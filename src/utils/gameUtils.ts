import { UserStats, DIFFICULTY_XP, DIFFICULTY_GOLD, XP_PER_LEVEL, Task } from '../types';

export const addExperience = (stats: UserStats, xp: number): UserStats => {
  let newXP = stats.experience + xp;
  let newLevel = stats.level;

  // Level up if needed
  while (newXP >= XP_PER_LEVEL) {
    newXP -= XP_PER_LEVEL;
    newLevel += 1;
  }

  return {
    ...stats,
    experience: newXP,
    level: newLevel,
  };
};

export const addGold = (stats: UserStats, gold: number): UserStats => {
  return {
    ...stats,
    gold: stats.gold + gold,
  };
};

export const takeDamage = (stats: UserStats, damage: number): UserStats => {
  return {
    ...stats,
    health: Math.max(0, stats.health - damage),
  };
};

export const calculateReward = (task: Task): { xp: number; gold: number } => {
  const xp = DIFFICULTY_XP[task.difficulty];
  const gold = DIFFICULTY_GOLD[task.difficulty];
  return { xp, gold };
};

export const calculateDamage = (task: Task): number => {
  // For bad habits or missed dailies
  const baseDamage = {
    trivial: 0.5,
    easy: 1,
    medium: 2,
    hard: 3,
  };
  return baseDamage[task.difficulty];
};
