import React from 'react';
import { DailyLog, Task } from '../../types';
import { getTodayDateStr } from '../../utils/date';

interface DayIndicatorDotsProps {
  phaseTasks: Task[];
  dailyLogs: Record<string, DailyLog>;
}

export const DayIndicatorDots: React.FC<DayIndicatorDotsProps> = ({
  phaseTasks,
  dailyLogs,
}) => {
  const today = new Date();
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayStr = getTodayDateStr();

  // Find Monday of current week
  const dayOfWeek = today.getDay();
  const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mondayDate = new Date(today);
  mondayDate.setDate(today.getDate() + distanceToMonday);

  let completedDaysCount = 0;

  const daysData = weekDays.map((letter, idx) => {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + idx);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${day}`;

    const isToday = dateKey === todayStr;
    const isPast = d <= today;
    const log = dailyLogs[dateKey];

    let isDone = false;
    let isPaused = false;

    if (log?.paused) {
      isPaused = true;
      if (isPast) completedDaysCount++;
    } else if (log && phaseTasks.length > 0) {
      const activeTasks = phaseTasks.filter((t) => !log.naTaskIds.includes(t.id));
      if (activeTasks.length > 0) {
        const checked = activeTasks.filter((t) => log.checkedTaskIds.includes(t.id));
        if (checked.length === activeTasks.length) {
          isDone = true;
          completedDaysCount++;
        }
      }
    }

    return {
      letter,
      isToday,
      isDone,
      isPaused,
      isPast,
    };
  });

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-[11px] text-[#FFFFFA]/70">
        <span>Weekly Cadence</span>
        <span className="font-semibold text-[#78CDD7] tabular-nums">
          {completedDaysCount}/7 Days
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 pt-1">
        {daysData.map((d, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <div
              className={`w-full h-3 rounded-sm transition-all ${
                d.isDone
                  ? 'bg-[#78CDD7] shadow-[0_0_6px_rgba(120,205,215,0.4)]'
                  : d.isPaused
                  ? 'bg-[#44A1A0]'
                  : d.isToday
                  ? 'bg-[#103b41] border border-[#78CDD7]'
                  : d.isPast
                  ? 'bg-[#103b41]'
                  : 'bg-[#082226] border border-[#247B7B]/30'
              }`}
            />
            <span
              className={`text-[10px] ${
                d.isToday ? 'text-[#78CDD7] font-bold' : 'text-[#FFFFFA]/50'
              }`}
            >
              {d.letter}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
