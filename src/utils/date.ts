import { DailyLog, Task } from '../types';

export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function isWeekday(dateStr: string): boolean {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();
  return dayOfWeek >= 1 && dayOfWeek <= 5;
}

export function getDayOfWeekName(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function getApplicableTasksForDate(tasks: Task[], dateStr: string): Task[] {
  const weekday = isWeekday(dateStr);
  return tasks.filter((t) => {
    if (t.days === 'all') return true;
    if (t.days === 'weekdays') return weekday;
    if (t.days === 'weekends') return !weekday;
    return true;
  });
}

export function calculateDayProgress(log: DailyLog | undefined, tasksForDate: Task[]): {
  checkedCount: number;
  totalApplicable: number;
  percentage: number;
  isCompleted: boolean;
} {
  if (!log) {
    return {
      checkedCount: 0,
      totalApplicable: tasksForDate.length,
      percentage: 0,
      isCompleted: false,
    };
  }

  if (log.paused) {
    return {
      checkedCount: 0,
      totalApplicable: 0,
      percentage: 100,
      isCompleted: true,
    };
  }

  const applicableExcludingNa = tasksForDate.filter(
    (t) => !log.naTaskIds.includes(t.id)
  );
  const total = applicableExcludingNa.length;
  if (total === 0) {
    return { checkedCount: 0, totalApplicable: 0, percentage: 100, isCompleted: true };
  }

  const checked = applicableExcludingNa.filter((t) =>
    log.checkedTaskIds.includes(t.id)
  ).length;

  const pct = Math.round((checked / total) * 100);
  return {
    checkedCount: checked,
    totalApplicable: total,
    percentage: pct,
    isCompleted: pct >= 80,
  };
}

// Calculate streak counting backwards from today or yesterday
export function calculateStreak(
  logs: Record<string, DailyLog>,
  tasks: Task[]
): { currentStreak: number; bestStreak: number } {
  const todayStr = getTodayDateStr();
  const [todayYear, todayMonth, todayDay] = todayStr.split('-').map(Number);
  let checkDate = new Date(todayYear, todayMonth - 1, todayDay);

  let currentStreak = 0;
  let checkCount = 0;

  // Check if today is completed or paused
  const todayLog = logs[todayStr];
  const todayTasks = getApplicableTasksForDate(tasks, todayStr);
  const todayProg = calculateDayProgress(todayLog, todayTasks);

  if (todayLog && (todayLog.paused || todayProg.isCompleted)) {
    currentStreak++;
    // Move to yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // If today is not completed yet, streak might be active from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Walk backwards
  while (checkCount < 365) {
    const y = checkDate.getFullYear();
    const m = String(checkDate.getMonth() + 1).padStart(2, '0');
    const d = String(checkDate.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${d}`;

    const log = logs[dateKey];
    if (!log) {
      break;
    }

    if (log.paused) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
      checkCount++;
      continue;
    }

    const dayTasks = getApplicableTasksForDate(tasks, dateKey);
    const prog = calculateDayProgress(log, dayTasks);
    if (prog.isCompleted) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
      checkCount++;
    } else {
      break;
    }
  }

  // Compute best streak ever across all logged days
  const allDates = Object.keys(logs).sort();
  let maxStreak = 0;
  let running = 0;

  for (let i = 0; i < allDates.length; i++) {
    const dKey = allDates[i];
    const log = logs[dKey];
    const dayTasks = getApplicableTasksForDate(tasks, dKey);
    const prog = calculateDayProgress(log, dayTasks);

    if (log.paused || prog.isCompleted) {
      running++;
      if (running > maxStreak) {
        maxStreak = running;
      }
    } else {
      running = 0;
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(maxStreak, currentStreak),
  };
}

// Generate realistic seeded history for demo or initialization
export function generateSampleHistory(tasks: Task[]): Record<string, DailyLog> {
  const logs: Record<string, DailyLog> = {};
  const today = new Date();

  // Create 60 days of historical logs
  for (let i = 59; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${day}`;

    const dayTasks = getApplicableTasksForDate(tasks, dateKey);

    // Occasional rest day
    if (i === 14 || i === 38) {
      logs[dateKey] = {
        date: dateKey,
        checkedTaskIds: [],
        naTaskIds: [],
        notes: i === 14 ? 'Active recovery & travel day' : 'Rest day: high fever, protected streak',
        paused: true,
      };
      continue;
    }

    // High consistency profile (simulate disciplined user)
    // 85% - 100% completion on most days, occasional partial
    const isToday = i === 0;
    const completionRate = isToday ? 0.75 : Math.random() > 0.12 ? 0.92 : 0.65;

    const checked: string[] = [];
    const na: string[] = [];

    dayTasks.forEach((t, idx) => {
      // Small chance of NA for morning cold shower or evening reading
      if (idx === 2 && Math.random() < 0.1) {
        na.push(t.id);
      } else if (Math.random() <= completionRate) {
        checked.push(t.id);
      }
    });

    logs[dateKey] = {
      date: dateKey,
      checkedTaskIds: checked,
      naTaskIds: na,
      notes:
        i % 7 === 0
          ? 'Weekly review completed. Deep work hours sustained at high quality.'
          : i % 10 === 0
          ? 'Felt fatigue in the afternoon but completed physical routine. Good discipline.'
          : '',
      paused: false,
    };
  }

  return logs;
}
