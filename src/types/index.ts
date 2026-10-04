export type TaskDays = 'all' | 'weekdays' | 'weekends';
export type PrayerLink = 'fajr' | 'maghrib' | 'isha' | null;

export interface Task {
  id: string;
  phase: string;
  name: string;
  time: string;
  days: TaskDays;
  prayerLinked?: PrayerLink;
  order: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  checkedTaskIds: string[];
  naTaskIds: string[];
  notes: string;
  paused: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  completedUnits: number;
  totalUnits: number;
  unitName: string;
  targetDate?: string;
}

export interface PrayerTimes {
  fajr: string;
  maghrib: string;
  isha: string;
}

export interface UserSettings {
  prayerTimes: PrayerTimes;
  theme: string;
  bestStreak: number;
  milestonesEarned: number[];
  notificationTime?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
}

export type ViewTab = 'today' | 'insights' | 'courses' | 'settings';
