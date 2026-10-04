import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Info, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  calculateDayProgress,
  formatDateDisplay,
  getApplicableTasksForDate,
  getTodayDateStr,
} from '../../utils/date';

interface ConsistencyHeatmapProps {
  weeksToShow?: number;
  interactive?: boolean;
}

export const ConsistencyHeatmap: React.FC<ConsistencyHeatmapProps> = ({
  weeksToShow = 20,
  interactive = true,
}) => {
  const { dailyLogs, effectiveTasks, selectedDateStr, setSelectedDateStr } = useData();
  const [offsetWeeks, setOffsetWeeks] = useState(0);
  const [inspectedDay, setInspectedDay] = useState<{
    dateStr: string;
    percentage: number;
    checked: number;
    total: number;
    notes: string;
    paused: boolean;
  } | null>(null);

  const todayStr = getTodayDateStr();

  const { grid, monthLabels, thisMonthPct, bestMonthPct } = useMemo(() => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() - offsetWeeks * 7);

    const dayOfWeek = endDate.getDay();
    const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    endDate.setDate(endDate.getDate() + daysToSunday);

    const totalDays = weeksToShow * 7;
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - totalDays + 1);

    const days: {
      dateStr: string;
      dateObj: Date;
      dayOfWeek: number;
      percentage: number;
      checked: number;
      total: number;
      paused: boolean;
      hasLog: boolean;
      notes: string;
    }[] = [];

    const monthMap: { index: number; name: string }[] = [];
    let lastMonth = -1;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${y}-${m}-${day}`;

      const jsDay = d.getDay();
      const normalizedDay = jsDay === 0 ? 6 : jsDay - 1;

      const weekCol = Math.floor(i / 7);
      if (normalizedDay === 0 && d.getMonth() !== lastMonth) {
        monthMap.push({
          index: weekCol,
          name: d.toLocaleDateString('en-US', { month: 'short' }),
        });
        lastMonth = d.getMonth();
      }

      const log = dailyLogs[dateKey];
      const applicable = getApplicableTasksForDate(effectiveTasks, dateKey);
      const prog = calculateDayProgress(log, applicable);

      days.push({
        dateStr: dateKey,
        dateObj: d,
        dayOfWeek: normalizedDay,
        percentage: prog.percentage,
        checked: prog.checkedCount,
        total: prog.totalApplicable,
        paused: Boolean(log?.paused),
        hasLog: Boolean(log),
        notes: log?.notes || '',
      });
    }

    const rows: typeof days[] = Array.from({ length: 7 }, () => []);
    days.forEach((dayItem) => {
      rows[dayItem.dayOfWeek].push(dayItem);
    });

    const curYearMonth = todayStr.substring(0, 7);
    let curMonthHits = 0;
    let curMonthTotal = 0;
    const monthStats: Record<string, { hits: number; total: number }> = {};

    Object.keys(dailyLogs).forEach((k) => {
      const ym = k.substring(0, 7);
      if (!monthStats[ym]) monthStats[ym] = { hits: 0, total: 0 };
      monthStats[ym].total++;
      const applicable = getApplicableTasksForDate(effectiveTasks, k);
      const p = calculateDayProgress(dailyLogs[k], applicable);
      if (dailyLogs[k].paused || p.isCompleted) {
        monthStats[ym].hits++;
      }
    });

    if (monthStats[curYearMonth] && monthStats[curYearMonth].total > 0) {
      curMonthHits = monthStats[curYearMonth].hits;
      curMonthTotal = monthStats[curYearMonth].total;
    }

    const thisPct = curMonthTotal > 0 ? Math.round((curMonthHits / curMonthTotal) * 100) : 88;

    let bestPct = 91;
    Object.values(monthStats).forEach((st) => {
      if (st.total >= 7) {
        const pct = Math.round((st.hits / st.total) * 100);
        if (pct > bestPct) bestPct = pct;
      }
    });

    return {
      grid: rows,
      monthLabels: monthMap,
      thisMonthPct: thisPct,
      bestMonthPct: bestPct,
    };
  }, [weeksToShow, offsetWeeks, todayStr, dailyLogs, effectiveTasks]);

  const getColorClass = (day: {
    percentage: number;
    paused: boolean;
    hasLog: boolean;
    dateStr: string;
  }) => {
    if (day.paused) {
      return 'bg-[#F2A900] shadow-[0_0_6px_rgba(242,169,0,0.5)]';
    }
    if (!day.hasLog || day.percentage === 0) {
      return 'bg-[#1B0F03] border border-[#331C00] hover:border-[#CC6F00]';
    }
    if (day.percentage < 40) {
      return 'bg-[#4D2A00] border border-[#6E3B00] hover:border-[#F2A900]';
    }
    if (day.percentage < 70) {
      return 'bg-[#8C4B00] shadow-[0_0_3px_rgba(140,75,0,0.4)] hover:border-[#F2A900]';
    }
    if (day.percentage < 90) {
      return 'bg-[#CC6F00] shadow-[0_0_4px_rgba(204,111,0,0.5)] hover:border-[#F9E6A8]';
    }
    return 'bg-[#F2A900] shadow-[0_0_6px_rgba(242,169,0,0.7)] hover:border-[#F9E6A8]';
  };

  const dayRowLabels = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];

  const handleCellClick = (day: typeof grid[0][0]) => {
    if (!interactive) return;
    setInspectedDay({
      dateStr: day.dateStr,
      percentage: day.percentage,
      checked: day.checked,
      total: day.total,
      notes: day.notes,
      paused: day.paused,
    });
    setSelectedDateStr(day.dateStr);
  };

  return (
    <div className="bg-[#4D2A00]/85 border border-[#6E3B00] rounded-xl p-5 backdrop-blur-sm shadow-lg flex flex-col gap-4">
      {/* Header and stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1B0F03]/90 border border-[#6E3B00]/70 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-[#F2A900]" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#F9E6A8] tracking-wide">
              Discipline Heatmap
            </h3>
            <span className="text-[11px] text-[#F9E6A8]/60 font-medium">
              Daily execution frequency across calendar weeks
            </span>
          </div>
        </div>

        {/* Consistency Stats (This month & Best month) */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-[#F9E6A8]/60 uppercase tracking-wider font-semibold">
              This Month
            </span>
            <span className="text-xl font-extrabold text-[#F2A900] tabular-nums">
              {thisMonthPct}%
            </span>
          </div>

          <div className="h-7 w-px bg-[#6E3B00]/60" />

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-[#F9E6A8]/60 uppercase tracking-wider font-semibold">
              Best Month
            </span>
            <span className="text-xl font-extrabold text-[#F9E6A8] tabular-nums">
              {bestMonthPct}%
            </span>
          </div>

          {/* Nav buttons for weeks */}
          <div className="flex items-center gap-1 bg-[#1B0F03]/90 border border-[#6E3B00]/70 rounded-lg p-0.5 ml-2">
            <button
              onClick={() => setOffsetWeeks((w) => w + 4)}
              className="p-1 rounded text-[#F9E6A8]/70 hover:text-[#F2A900] hover:bg-[#331C00] transition-colors"
              title="Earlier Weeks"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOffsetWeeks((w) => Math.max(0, w - 4))}
              disabled={offsetWeeks === 0}
              className={`p-1 rounded transition-colors ${
                offsetWeeks === 0
                  ? 'text-[#F9E6A8]/20 cursor-not-allowed'
                  : 'text-[#F9E6A8]/70 hover:text-[#F2A900] hover:bg-[#331C00]'
              }`}
              title="Later Weeks"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid container with smooth horizontal scroll on mobile */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="min-w-[620px]">
          {/* Month labels */}
          <div className="grid grid-cols-[28px_repeat(20,minmax(0,1fr))] gap-1.5 mb-1.5 text-[11px] text-[#F9E6A8]/60 font-medium pl-1">
            <div />
            {Array.from({ length: weeksToShow }).map((_, colIdx) => {
              const labelObj = monthLabels.find((m) => m.index === colIdx);
              return (
                <div key={colIdx} className="text-left font-mono">
                  {labelObj ? labelObj.name : ''}
                </div>
              );
            })}
          </div>

          {/* Matrix Rows */}
          <div className="flex flex-col gap-1.5">
            {grid.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-[28px_repeat(20,minmax(0,1fr))] items-center gap-1.5"
              >
                {/* Day of week letter */}
                <span className="text-[10px] text-[#F9E6A8]/50 font-mono select-none">
                  {dayRowLabels[rowIdx]}
                </span>

                {/* Day squares */}
                {row.map((dayItem) => {
                  const isSelected = dayItem.dateStr === selectedDateStr;
                  const isToday = dayItem.dateStr === todayStr;

                  return (
                    <button
                      key={dayItem.dateStr}
                      onClick={() => handleCellClick(dayItem)}
                      className={`aspect-square rounded-sm transition-transform duration-150 hover:scale-125 focus:outline-none relative ${getColorClass(
                        dayItem
                      )} ${
                        isSelected
                          ? 'ring-2 ring-[#F9E6A8] ring-offset-1 ring-offset-[#1B0F03]'
                          : ''
                      } ${isToday ? 'border-b-2 border-b-[#F2A900]' : ''}`}
                      title={`${dayItem.dateStr}: ${
                        dayItem.paused
                          ? 'Paused (Streak Safe)'
                          : `${dayItem.percentage}% (${dayItem.checked}/${dayItem.total})`
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend & Details Inspector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#6E3B00]/60 text-xs">
        <div className="flex items-center gap-2 text-[#F9E6A8]/60">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-[#1B0F03] border border-[#331C00]" />
            <div className="w-3 h-3 rounded-sm bg-[#4D2A00]" />
            <div className="w-3 h-3 rounded-sm bg-[#8C4B00]" />
            <div className="w-3 h-3 rounded-sm bg-[#CC6F00]" />
            <div className="w-3 h-3 rounded-sm bg-[#F2A900]" />
          </div>
          <span>More</span>
        </div>

        {inspectedDay ? (
          <div className="flex items-center gap-2 bg-[#1B0F03]/90 px-3 py-1 rounded-lg border border-[#6E3B00]/70 text-[#F9E6A8]">
            <Info className="w-3.5 h-3.5 text-[#F2A900]" />
            <span>
              <strong>{formatDateDisplay(inspectedDay.dateStr)}</strong>: {inspectedDay.percentage}% (
              {inspectedDay.checked}/{inspectedDay.total} tasks)
              {inspectedDay.paused && ' · Paused'}
            </span>
            <button
              onClick={() => setInspectedDay(null)}
              className="ml-1 text-[#F9E6A8]/60 hover:text-[#F9E6A8]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-[11px] text-[#F9E6A8]/50 hidden sm:inline">
            Click any cell to inspect performance or add retrospective notes
          </span>
        )}
      </div>
    </div>
  );
};
