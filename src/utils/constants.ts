import { Course, PrayerTimes, Task, UserSettings } from '../types';

export const DEFAULT_PRAYER_TIMES: PrayerTimes = {
  fajr: '05:15',
  maghrib: '18:25',
  isha: '20:00',
};

export const DEFAULT_SETTINGS: UserSettings = {
  prayerTimes: DEFAULT_PRAYER_TIMES,
  theme: 'teal-obsidian',
  bestStreak: 23,
  milestonesEarned: [7],
  notificationTime: '21:00',
};

export const DEFAULT_TASKS: Task[] = [
  // Morning Phase
  {
    id: 'task-m1',
    phase: 'Morning Routine',
    name: 'Hydrate 500ml water + Electrolytes',
    time: '06:00',
    days: 'all',
    order: 1,
  },
  {
    id: 'task-m2',
    phase: 'Morning Routine',
    name: 'Fajr Prayer & Contemplation',
    time: '05:15',
    days: 'all',
    prayerLinked: 'fajr',
    order: 2,
  },
  {
    id: 'task-m3',
    phase: 'Morning Routine',
    name: 'Morning Mobility & Cold Rinse',
    time: '06:45',
    days: 'weekdays',
    order: 3,
  },
  {
    id: 'task-m4',
    phase: 'Morning Routine',
    name: 'Define Top 3 Mission Targets',
    time: '07:15',
    days: 'all',
    order: 4,
  },

  // Focus & Study Phase
  {
    id: 'task-f1',
    phase: 'Deep Work & Study',
    name: 'Deep Work Sprint 1 (90m zero-distraction)',
    time: '08:30',
    days: 'weekdays',
    order: 5,
  },
  {
    id: 'task-f2',
    phase: 'Deep Work & Study',
    name: 'Technical Reading or Course Progress (30m)',
    time: '11:30',
    days: 'all',
    order: 6,
  },
  {
    id: 'task-f3',
    phase: 'Deep Work & Study',
    name: 'Clear Primary Queue & Triage Communications',
    time: '13:00',
    days: 'weekdays',
    order: 7,
  },

  // Physical & Training Phase
  {
    id: 'task-p1',
    phase: 'Physical & Health',
    name: 'Resistance Training or Zone 2 Cardio',
    time: '16:30',
    days: 'all',
    order: 8,
  },
  {
    id: 'task-p2',
    phase: 'Physical & Health',
    name: 'High Protein Recovery Meal & Hydration',
    time: '18:00',
    days: 'all',
    order: 9,
  },
  {
    id: 'task-p3',
    phase: 'Physical & Health',
    name: 'Maghrib Prayer & Grounding',
    time: '18:25',
    days: 'all',
    prayerLinked: 'maghrib',
    order: 10,
  },

  // Evening Routine
  {
    id: 'task-e1',
    phase: 'Evening Shutdown',
    name: 'Digital Sunset — Screen Amber & Off-grid',
    time: '21:15',
    days: 'all',
    order: 11,
  },
  {
    id: 'task-e2',
    phase: 'Evening Shutdown',
    name: 'Isha Prayer & Daily Retrospective',
    time: '20:00',
    days: 'all',
    prayerLinked: 'isha',
    order: 12,
  },
  {
    id: 'task-e3',
    phase: 'Evening Shutdown',
    name: 'Stage Tomorrow: Gear, Tasks, Water Glass',
    time: '22:00',
    days: 'all',
    order: 13,
  },
  {
    id: 'task-e4',
    phase: 'Evening Shutdown',
    name: 'Lights Out / Sleep Ready',
    time: '22:30',
    days: 'all',
    order: 14,
  },
];

export const DEFAULT_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Distributed Systems & Architecture',
    category: 'Engineering',
    completedUnits: 18,
    totalUnits: 28,
    unitName: 'Modules',
  },
  {
    id: 'course-2',
    title: 'Half-Marathon Aerobic Base Prep',
    category: 'Athletics',
    completedUnits: 11,
    totalUnits: 16,
    unitName: 'Weeks',
  },
  {
    id: 'course-3',
    title: 'Deep Work & Mental Fortitude Practice',
    category: 'Discipline',
    completedUnits: 24,
    totalUnits: 30,
    unitName: 'Days',
  },
];

export const MOTIVATIONAL_QUOTES = [
  "Small disciplines repeated with consistency lead to extraordinary achievements.",
  "Standards over feelings. Every rep matters.",
  "Win the morning, own the day, control your trajectory.",
  "Discipline isn't restriction; it is the ultimate creator of freedom.",
  "What you do repeatedly every single day defines who you become.",
  "The standard you walk past is the standard you accept.",
  "Action cures doubt. Execute the scheduled block.",
];
