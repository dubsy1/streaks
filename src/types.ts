export type TaskType = 'habit' | 'daily' | 'todo';

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description?: string;
  createdAt: string;
  completedDates: string[]; // ISO date strings
  isPositive?: boolean; // For habits: true = good habit, false = bad habit
  difficulty: 'trivial' | 'easy' | 'medium' | 'hard';
  dueDate?: string; // For todos
  repeatDays?: number[]; // For dailies: 0-6 (Sun-Sat)
  archived: boolean;
}

export interface UserStats {
  level: number;
  experience: number;
  health: number;
  gold: number;
  equippedHat?: string; // ID of equipped hat
  ownedHats: string[]; // Array of owned hat IDs
}

export interface Hat {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const DIFFICULTY_XP = {
  trivial: 1,
  easy: 5,
  medium: 10,
  hard: 15,
};

export const DIFFICULTY_GOLD = {
  trivial: 0.5,
  easy: 1,
  medium: 1.5,
  hard: 2,
};

export const XP_PER_LEVEL = 100;
export const MAX_HEALTH = 50;
