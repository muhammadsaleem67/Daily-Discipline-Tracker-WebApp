import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Course, DailyLog, PrayerTimes, Task, UserSettings } from '../types';
import { useAuth } from './AuthContext';
import {
  DEFAULT_COURSES,
  DEFAULT_PRAYER_TIMES,
  DEFAULT_SETTINGS,
  DEFAULT_TASKS,
} from '../utils/constants';
import {
  calculateDayProgress,
  calculateStreak,
  generateSampleHistory,
  getTodayDateStr,
} from '../utils/date';

interface DataContextType {
  tasks: Task[];
  effectiveTasks: Task[]; // with prayer times dynamically resolved
  dailyLogs: Record<string, DailyLog>;
  courses: Course[];
  settings: UserSettings;
  todayLog: DailyLog;
  todayDateStr: string;
  selectedDateStr: string;
  setSelectedDateStr: (date: string) => void;
  selectedDateLog: DailyLog;
  streak: { currentStreak: number; bestStreak: number };
  milestoneToCelebrate: number | null;
  clearCelebration: () => void;

  // Actions
  toggleTaskCheck: (taskId: string, dateStr?: string) => void;
  toggleTaskNA: (taskId: string, dateStr?: string) => void;
  togglePauseDay: (dateStr?: string) => void;
  updateDailyNotes: (notes: string, dateStr?: string) => void;
  addTask: (task: Omit<Task, 'id' | 'order'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  reorderTasks: (tasks: Task[]) => void;
  updatePrayerTimes: (prayerTimes: PrayerTimes) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  incrementCourse: (courseId: string, delta: number) => void;
  seedSampleData: () => void;
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const todayDateStr = getTodayDateStr();

  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayDateStr);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [milestoneToCelebrate, setMilestoneToCelebrate] = useState<number | null>(null);

  const storagePrefix = `daily_discipline_${userId}`;

  // Load user data whenever userId changes
  useEffect(() => {
    try {
      const savedTasksRaw = localStorage.getItem(`${storagePrefix}_tasks`);
      const savedLogsRaw = localStorage.getItem(`${storagePrefix}_logs`);
      const savedCoursesRaw = localStorage.getItem(`${storagePrefix}_courses`);
      const savedSettingsRaw = localStorage.getItem(`${storagePrefix}_settings`);

      if (savedTasksRaw) {
        setTasks(JSON.parse(savedTasksRaw));
      } else {
        // First time initialization for this user: seed sensible defaults
        setTasks(DEFAULT_TASKS);
        localStorage.setItem(`${storagePrefix}_tasks`, JSON.stringify(DEFAULT_TASKS));
      }

      if (savedCoursesRaw) {
        setCourses(JSON.parse(savedCoursesRaw));
      } else {
        setCourses(DEFAULT_COURSES);
        localStorage.setItem(`${storagePrefix}_courses`, JSON.stringify(DEFAULT_COURSES));
      }

      if (savedSettingsRaw) {
        setSettings(JSON.parse(savedSettingsRaw));
      } else {
        setSettings(DEFAULT_SETTINGS);
        localStorage.setItem(`${storagePrefix}_settings`, JSON.stringify(DEFAULT_SETTINGS));
      }

      if (savedLogsRaw) {
        setDailyLogs(JSON.parse(savedLogsRaw));
      } else {
        // If this is the primary demo user (user_alex), give rich 60-day history for heatmap
        if (userId === 'user_alex') {
          const sampleHistory = generateSampleHistory(DEFAULT_TASKS);
          setDailyLogs(sampleHistory);
          localStorage.setItem(`${storagePrefix}_logs`, JSON.stringify(sampleHistory));
        } else {
          setDailyLogs({});
        }
      }
    } catch {
      setTasks(DEFAULT_TASKS);
      setCourses(DEFAULT_COURSES);
      setSettings(DEFAULT_SETTINGS);
      setDailyLogs({});
    }
    setSelectedDateStr(todayDateStr);
  }, [userId, storagePrefix, todayDateStr]);

  // Persist helpers
  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem(`${storagePrefix}_tasks`, JSON.stringify(newTasks));
  };

  const saveDailyLogs = (newLogs: Record<string, DailyLog>) => {
    setDailyLogs(newLogs);
    localStorage.setItem(`${storagePrefix}_logs`, JSON.stringify(newLogs));
  };

  const saveCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
    localStorage.setItem(`${storagePrefix}_courses`, JSON.stringify(newCourses));
  };

  const saveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem(`${storagePrefix}_settings`, JSON.stringify(newSettings));
  };

  // Compute effective tasks where prayer-linked tasks dynamically resolve their times
  const effectiveTasks = useMemo(() => {
    return tasks.map((task) => {
      if (task.prayerLinked && settings.prayerTimes[task.prayerLinked]) {
        return {
          ...task,
          time: settings.prayerTimes[task.prayerLinked],
        };
      }
      return task;
    });
  }, [tasks, settings.prayerTimes]);

  // Retrieve or create empty log for a date
  const getLogForDate = (dateStr: string): DailyLog => {
    return (
      dailyLogs[dateStr] || {
        date: dateStr,
        checkedTaskIds: [],
        naTaskIds: [],
        notes: '',
        paused: false,
      }
    );
  };

  const todayLog = useMemo(() => getLogForDate(todayDateStr), [dailyLogs, todayDateStr]);
  const selectedDateLog = useMemo(
    () => getLogForDate(selectedDateStr),
    [dailyLogs, selectedDateStr]
  );

  // Dynamic streak calculation
  const streak = useMemo(() => {
    return calculateStreak(dailyLogs, effectiveTasks);
  }, [dailyLogs, effectiveTasks]);

  // Check milestone achievement
  useEffect(() => {
    const milestones = [7, 14, 30, 60, 100, 365];
    const cur = streak.currentStreak;
    if (milestones.includes(cur) && !settings.milestonesEarned.includes(cur)) {
      setMilestoneToCelebrate(cur);
      saveSettings({
        ...settings,
        milestonesEarned: [...settings.milestonesEarned, cur],
        bestStreak: Math.max(settings.bestStreak, cur),
      });
    }
  }, [streak.currentStreak, settings]);

  const clearCelebration = () => setMilestoneToCelebrate(null);

  // Task check toggle
  const toggleTaskCheck = (taskId: string, targetDate = todayDateStr) => {
    const curLog = getLogForDate(targetDate);
    const isCurrentlyChecked = curLog.checkedTaskIds.includes(taskId);

    let nextChecked = [...curLog.checkedTaskIds];
    let nextNa = [...curLog.naTaskIds];

    if (isCurrentlyChecked) {
      nextChecked = nextChecked.filter((id) => id !== taskId);
    } else {
      nextChecked.push(taskId);
      // If was marked NA, remove from NA
      nextNa = nextNa.filter((id) => id !== taskId);
    }

    const updatedLog: DailyLog = {
      ...curLog,
      checkedTaskIds: nextChecked,
      naTaskIds: nextNa,
    };

    saveDailyLogs({
      ...dailyLogs,
      [targetDate]: updatedLog,
    });
  };

  // Task N/A toggle
  const toggleTaskNA = (taskId: string, targetDate = todayDateStr) => {
    const curLog = getLogForDate(targetDate);
    const isCurrentlyNa = curLog.naTaskIds.includes(taskId);

    let nextNa = [...curLog.naTaskIds];
    let nextChecked = [...curLog.checkedTaskIds];

    if (isCurrentlyNa) {
      nextNa = nextNa.filter((id) => id !== taskId);
    } else {
      nextNa.push(taskId);
      // Remove from checked if it was checked
      nextChecked = nextChecked.filter((id) => id !== taskId);
    }

    const updatedLog: DailyLog = {
      ...curLog,
      checkedTaskIds: nextChecked,
      naTaskIds: nextNa,
    };

    saveDailyLogs({
      ...dailyLogs,
      [targetDate]: updatedLog,
    });
  };

  // Pause Day toggle (freezes streak for sick day or travel)
  const togglePauseDay = (targetDate = todayDateStr) => {
    const curLog = getLogForDate(targetDate);
    const updatedLog: DailyLog = {
      ...curLog,
      paused: !curLog.paused,
    };

    saveDailyLogs({
      ...dailyLogs,
      [targetDate]: updatedLog,
    });
  };

  // Update notes
  const updateDailyNotes = (notes: string, targetDate = todayDateStr) => {
    const curLog = getLogForDate(targetDate);
    const updatedLog: DailyLog = {
      ...curLog,
      notes,
    };

    saveDailyLogs({
      ...dailyLogs,
      [targetDate]: updatedLog,
    });
  };

  // Task management
  const addTask = (taskInput: Omit<Task, 'id' | 'order'>) => {
    const newTask: Task = {
      ...taskInput,
      id: `task_${Date.now()}`,
      order: tasks.length + 1,
    };
    saveTasks([...tasks, newTask]);
  };

  const updateTask = (taskToUpdate: Task) => {
    saveTasks(tasks.map((t) => (t.id === taskToUpdate.id ? taskToUpdate : t)));
  };

  const deleteTask = (taskId: string) => {
    saveTasks(tasks.filter((t) => t.id !== taskId));
  };

  const reorderTasks = (newOrderedList: Task[]) => {
    const reindexed = newOrderedList.map((t, idx) => ({ ...t, order: idx + 1 }));
    saveTasks(reindexed);
  };

  // Prayer times update
  const updatePrayerTimes = (prayerTimes: PrayerTimes) => {
    const updatedSettings = {
      ...settings,
      prayerTimes,
    };
    saveSettings(updatedSettings);
  };

  const updateSettings = (partial: Partial<UserSettings>) => {
    saveSettings({
      ...settings,
      ...partial,
    });
  };

  // Course actions
  const addCourse = (courseInput: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseInput,
      id: `course_${Date.now()}`,
    };
    saveCourses([...courses, newCourse]);
  };

  const updateCourse = (updatedCourse: Course) => {
    saveCourses(courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
  };

  const deleteCourse = (courseId: string) => {
    saveCourses(courses.filter((c) => c.id !== courseId));
  };

  const incrementCourse = (courseId: string, delta: number) => {
    saveCourses(
      courses.map((c) => {
        if (c.id === courseId) {
          const nextVal = Math.min(Math.max(0, c.completedUnits + delta), c.totalUnits);
          return { ...c, completedUnits: nextVal };
        }
        return c;
      })
    );
  };

  // Seed sample data
  const seedSampleData = () => {
    const sample = generateSampleHistory(effectiveTasks);
    saveDailyLogs(sample);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    saveTasks(DEFAULT_TASKS);
    saveCourses(DEFAULT_COURSES);
    saveSettings(DEFAULT_SETTINGS);
    saveDailyLogs({});
  };

  // Export / Import
  const exportDataJson = () => {
    const bundle = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user,
      tasks,
      dailyLogs,
      courses,
      settings,
    };
    return JSON.stringify(bundle, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.tasks && Array.isArray(parsed.tasks)) {
        saveTasks(parsed.tasks);
      }
      if (parsed.dailyLogs) {
        saveDailyLogs(parsed.dailyLogs);
      }
      if (parsed.courses && Array.isArray(parsed.courses)) {
        saveCourses(parsed.courses);
      }
      if (parsed.settings) {
        saveSettings(parsed.settings);
      }
      return true;
    } catch {
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        tasks,
        effectiveTasks,
        dailyLogs,
        courses,
        settings,
        todayLog,
        todayDateStr,
        selectedDateStr,
        setSelectedDateStr,
        selectedDateLog,
        streak,
        milestoneToCelebrate,
        clearCelebration,
        toggleTaskCheck,
        toggleTaskNA,
        togglePauseDay,
        updateDailyNotes,
        addTask,
        updateTask,
        deleteTask,
        reorderTasks,
        updatePrayerTimes,
        updateSettings,
        addCourse,
        updateCourse,
        deleteCourse,
        incrementCourse,
        seedSampleData,
        resetToDefaults,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
