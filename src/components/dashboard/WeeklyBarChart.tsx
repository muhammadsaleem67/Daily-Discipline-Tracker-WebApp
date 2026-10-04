import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { calculateDayProgress, getApplicableTasksForDate, getTodayDateStr } from '../../utils/date';

export const WeeklyBarChart: React.FC = () => {
  const { dailyLogs, effectiveTasks } = useData();
  const todayStr = getTodayDateStr();
  const today = new Date();

  // Find Monday of current week
  const dayOfWeek = today.getDay();
  const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mondayDate = new Date(today);
  mondayDate.setDate(today.getDate() + distanceToMonday);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  let sumPercentages = 0;
  let loggedDaysCount = 0;

  const weeklyData = daysOfWeek.map((dayName, idx) => {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + idx);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${day}`;

    const isToday = dateKey === todayStr;
    const isFuture = d > today && !isToday;
    const log = dailyLogs[dateKey];

    const applicable = getApplicableTasksForDate(effectiveTasks, dateKey);
    const prog = calculateDayProgress(log, applicable);

    let heightPct = 0;
    if (log?.paused) {
      heightPct = 100;
      sumPercentages += 100;
      loggedDaysCount++;
    } else if (log) {
      heightPct = prog.percentage;
      sumPercentages += prog.percentage;
      loggedDaysCount++;
    } else if (isToday) {
      heightPct = prog.percentage;
      sumPercentages += prog.percentage;
      loggedDaysCount++;
    }

    return {
      dayName,
      dateKey,
      heightPct: Math.min(100, Math.max(0, heightPct)),
      isToday,
      isFuture,
      isPaused: Boolean(log?.paused),
      checked: prog.checkedCount,
      total: prog.totalApplicable,
    };
  });

  const weeklyAvg = loggedDaysCount > 0 ? Math.round(sumPercentages / loggedDaysCount) : 0;

  return (
    <div className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl p-5 backdrop-blur-sm shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#082226]/80 border border-[#247B7B]/60 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-[#78CDD7]" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#FFFFFA] tracking-wide">
              Weekly Progress
            </h3>
            <span className="text-[11px] text-[#FFFFFA]/60 font-medium">
              Daily routine completion rate
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#FFFFFA] bg-[#082226]/70 px-2.5 py-1 rounded border border-[#247B7B]/50">
          <TrendingUp className="w-3.5 h-3.5 text-[#78CDD7]" />
          <span className="text-[#FFFFFA]/70">Avg:</span>
          <strong className="text-[#78CDD7] tabular-nums">{weeklyAvg}%</strong>
        </div>
      </div>

      {/* Chart Bars */}
      <div className="pt-2 pb-1">
        <div className="h-40 flex items-end justify-between gap-2 sm:gap-3 px-1">
          {weeklyData.map((col, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              {/* Value on Hover / Active */}
              <span
                className={`text-[11px] font-mono tabular-nums mb-1.5 transition-opacity ${
                  col.isToday
                    ? 'text-[#78CDD7] font-bold opacity-100'
                    : 'text-[#FFFFFA]/70 opacity-80 group-hover:opacity-100'
                }`}
              >
                {col.isFuture && !col.isToday ? '—' : `${col.heightPct}%`}
              </span>

              {/* Bar track and fill */}
              <div className="w-full max-w-[36px] h-28 bg-[#082226]/80 rounded-t-md p-0.5 flex items-end relative overflow-hidden border border-[#247B7B]/40 group-hover:border-[#78CDD7]/60 transition-colors">
                <div
                  className={`w-full rounded-t-sm transition-all duration-500 ease-out relative ${
                    col.isToday
                      ? 'bg-gradient-to-t from-[#44A1A0] to-[#78CDD7] shadow-[0_0_8px_rgba(120,205,215,0.4)]'
                      : col.heightPct >= 80
                      ? 'bg-[#44A1A0]'
                      : col.heightPct > 0
                      ? 'bg-[#247B7B]'
                      : 'bg-transparent'
                  }`}
                  style={{ height: `${Math.max(col.heightPct, col.heightPct > 0 ? 6 : 0)}%` }}
                >
                  {/* Top glowing cap */}
                  {col.heightPct > 0 && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#78CDD7] rounded-t-sm" />
                  )}
                </div>
              </div>

              {/* Day label */}
              <span
                className={`mt-2 text-xs font-medium tracking-tight ${
                  col.isToday ? 'text-[#78CDD7] font-bold' : 'text-[#FFFFFA]/60'
                }`}
              >
                {col.dayName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-3 pt-3 border-t border-[#247B7B]/40 flex items-center justify-between text-[11px] text-[#FFFFFA]/60">
        <span>Target: 80%+ daily completion</span>
        <span className="text-[#78CDD7] font-medium">Monday — Sunday cycle</span>
      </div>
    </div>
  );
};
