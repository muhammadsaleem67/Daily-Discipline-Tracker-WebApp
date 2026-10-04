import React, { useState, useMemo } from 'react';
import {
  Activity,
  Calendar,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Search,
  Clock,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ConsistencyHeatmap } from '../dashboard/ConsistencyHeatmap';
import { WeeklyBarChart } from '../dashboard/WeeklyBarChart';
import {
  calculateDayProgress,
  formatDateDisplay,
  getApplicableTasksForDate,
  getTodayDateStr,
} from '../../utils/date';

export const InsightsView: React.FC = () => {
  const { dailyLogs, effectiveTasks, selectedDateStr, setSelectedDateStr, updateDailyNotes } =
    useData();
  const [searchDate, setSearchDate] = useState(selectedDateStr);

  const todayStr = getTodayDateStr();

  // Task Consistency Ranking & Most Skipped Tasks Analysis
  const { rankedTasks, mostSkippedTasks, stats } = useMemo(() => {
    const taskOccurrenceCount: Record<string, number> = {};
    const taskCompletedCount: Record<string, number> = {};
    const taskSkippedCount: Record<string, number> = {};

    let totalDaysLogged = 0;
    let completedDays = 0;
    let sumCompletionRates = 0;

    const dates = Object.keys(dailyLogs);

    dates.forEach((dateKey) => {
      const log = dailyLogs[dateKey];
      if (!log) return;
      totalDaysLogged++;

      const applicable = getApplicableTasksForDate(effectiveTasks, dateKey);
      const prog = calculateDayProgress(log, applicable);
      sumCompletionRates += prog.percentage;
      if (log.paused || prog.isCompleted) {
        completedDays++;
      }

      applicable.forEach((t) => {
        taskOccurrenceCount[t.id] = (taskOccurrenceCount[t.id] || 0) + 1;
        if (log.checkedTaskIds.includes(t.id)) {
          taskCompletedCount[t.id] = (taskCompletedCount[t.id] || 0) + 1;
        } else if (!log.naTaskIds.includes(t.id) && !log.paused) {
          taskSkippedCount[t.id] = (taskSkippedCount[t.id] || 0) + 1;
        }
      });
    });

    const ranked = effectiveTasks.map((t) => {
      const occurrences = taskOccurrenceCount[t.id] || 0;
      const completed = taskCompletedCount[t.id] || 0;
      const skipped = taskSkippedCount[t.id] || 0;
      const pct = occurrences > 0 ? Math.round((completed / occurrences) * 100) : 100;
      return {
        ...t,
        occurrences,
        completed,
        skipped,
        consistencyPct: pct,
      };
    });

    // Most skipped (sorted descending by skipped count)
    const skippedSorted = [...ranked]
      .filter((t) => t.skipped > 0)
      .sort((a, b) => b.skipped - a.skipped)
      .slice(0, 5);

    // Consistency score (sorted descending by pct)
    const consistencySorted = [...ranked].sort((a, b) => b.consistencyPct - a.consistencyPct);

    // Rolling 7 and 30 day rates
    const today = new Date();
    let hit7 = 0;
    let total7 = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
      const log = dailyLogs[key];
      const applicable = getApplicableTasksForDate(effectiveTasks, key);
      const prog = calculateDayProgress(log, applicable);
      if (log?.paused || prog.isCompleted) hit7++;
      if (log || key === todayStr) total7++;
    }

    let hit30 = 0;
    let total30 = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
      const log = dailyLogs[key];
      const applicable = getApplicableTasksForDate(effectiveTasks, key);
      const prog = calculateDayProgress(log, applicable);
      if (log?.paused || prog.isCompleted) hit30++;
      if (log || key === todayStr) total30++;
    }

    return {
      rankedTasks: consistencySorted,
      mostSkippedTasks: skippedSorted,
      stats: {
        totalDaysLogged,
        overallAvg: totalDaysLogged > 0 ? Math.round(sumCompletionRates / totalDaysLogged) : 88,
        sevenDayAvg: total7 > 0 ? Math.round((hit7 / total7) * 100) : 85,
        thirtyDayAvg: total30 > 0 ? Math.round((hit30 / total30) * 100) : 89,
      },
    };
  }, [dailyLogs, effectiveTasks, todayStr]);

  // Inspect searched date details
  const inspectedLog = dailyLogs[searchDate];
  const inspectedTasks = getApplicableTasksForDate(effectiveTasks, searchDate);
  const inspectedProg = calculateDayProgress(inspectedLog, inspectedTasks);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl p-5 backdrop-blur-md shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-[#78CDD7]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FFFFFA] tracking-tight">
              Performance Insights & Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#FFFFFA]/75 font-normal">
            Objective data on your routine consistency, resistance points, and habit durability.
          </p>
        </div>

        {/* Rolling Averages Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-[#082226]/80 border border-[#247B7B]/50 px-3 py-1.5 rounded-lg text-right">
            <span className="text-[10px] uppercase text-[#FFFFFA]/60 font-semibold block">
              7-Day Rolling
            </span>
            <span className="text-lg font-bold text-[#78CDD7] tabular-nums">
              {stats.sevenDayAvg}%
            </span>
          </div>

          <div className="bg-[#082226]/80 border border-[#247B7B]/50 px-3 py-1.5 rounded-lg text-right">
            <span className="text-[10px] uppercase text-[#FFFFFA]/60 font-semibold block">
              30-Day Rolling
            </span>
            <span className="text-lg font-bold text-[#FFFFFA] tabular-nums">
              {stats.thirtyDayAvg}%
            </span>
          </div>
        </div>
      </div>

      {/* Full Size Consistency Heatmap */}
      <ConsistencyHeatmap weeksToShow={26} interactive={true} />

      {/* Grid: Weekly Bar Chart + Date Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyBarChart />

        {/* Date Lookup Inspector */}
        <div className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl p-5 backdrop-blur-sm shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#082226]/80 border border-[#247B7B]/60 flex items-center justify-center">
                  <Search className="w-4 h-4 text-[#78CDD7]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#FFFFFA] tracking-wide">
                    Historical Date Inspector
                  </h3>
                  <span className="text-[11px] text-[#FFFFFA]/60 font-medium">
                    Look up logs, notes, and task records for any day
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div className="relative flex-1">
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => {
                    setSearchDate(e.target.value);
                    setSelectedDateStr(e.target.value);
                  }}
                  className="w-full bg-[#082226] border border-[#247B7B] rounded-lg px-3 py-2 text-sm text-[#FFFFFA] focus:outline-none focus:border-[#78CDD7]"
                />
              </div>
              <button
                onClick={() => {
                  setSearchDate(todayStr);
                  setSelectedDateStr(todayStr);
                }}
                className="px-3 py-2 bg-[#082226] hover:bg-[#103b41] border border-[#247B7B] rounded-lg text-xs font-semibold text-[#FFFFFA] transition-colors"
              >
                Today
              </button>
            </div>

            {/* Inspected Record Details */}
            <div className="mt-4 bg-[#082226]/80 border border-[#247B7B]/50 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-[#247B7B]/40 pb-2">
                <span className="text-xs font-bold text-[#FFFFFA]">
                  {formatDateDisplay(searchDate)}
                </span>
                <span className="text-xs font-bold text-[#78CDD7] tabular-nums">
                  {inspectedLog?.paused
                    ? 'Paused (Streak Safe)'
                    : `${inspectedProg.percentage}% Completed`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#FFFFFA]/80">
                <div>
                  Completed:{' '}
                  <strong className="text-[#FFFFFA]">
                    {inspectedProg.checkedCount}/{inspectedProg.totalApplicable}
                  </strong>{' '}
                  tasks
                </div>
                <div>
                  Status:{' '}
                  <strong className="text-[#78CDD7]">
                    {inspectedLog?.paused ? 'Protected Rest' : inspectedProg.isCompleted ? 'Standard Met' : 'Incomplete'}
                  </strong>
                </div>
              </div>

              {inspectedLog?.notes ? (
                <div className="text-xs bg-[#103b41]/60 p-2.5 rounded border border-[#247B7B]/40 text-[#FFFFFA]/90">
                  <span className="text-[10px] uppercase font-bold text-[#78CDD7] block mb-1">
                    Retrospective Note:
                  </span>
                  "{inspectedLog.notes}"
                </div>
              ) : (
                <div className="text-xs text-[#FFFFFA]/50 italic">
                  No note logged for this date.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#247B7B]/40 flex items-center justify-between text-[11px] text-[#FFFFFA]/60">
            <span>Audit trail stored permanently</span>
            <span className="text-[#78CDD7]">Total logged: {stats.totalDaysLogged} days</span>
          </div>
        </div>
      </div>

      {/* Ranked Task Performance lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Skipped Tasks (Resistance Points) */}
        <div className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl p-5 backdrop-blur-sm shadow-lg flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#082226]/80 border border-[#247B7B]/60 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-[#78CDD7]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#FFFFFA] tracking-wide">
                Primary Resistance Points (Most Skipped)
              </h3>
              <span className="text-[11px] text-[#FFFFFA]/60 font-medium">
                Habits with the highest missed rate across history
              </span>
            </div>
          </div>

          {mostSkippedTasks.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#FFFFFA]/60">
              No skipped tasks recorded yet. Your discipline is immaculate.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {mostSkippedTasks.map((t, idx) => {
                const skipRate =
                  t.occurrences > 0 ? Math.round((t.skipped / t.occurrences) * 100) : 0;
                return (
                  <div
                    key={t.id}
                    className="bg-[#082226]/70 border border-[#247B7B]/40 rounded-lg p-3 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#FFFFFA] truncate max-w-[240px]">
                        {idx + 1}. {t.name}
                      </span>
                      <span className="font-bold text-[#78CDD7] tabular-nums">
                        {t.skipped} missed ({skipRate}%)
                      </span>
                    </div>

                    {/* Progress track */}
                    <div className="w-full h-1.5 bg-[#103b41] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#44A1A0] rounded-full"
                        style={{ width: `${Math.min(100, skipRate * 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Task Consistency Scores */}
        <div className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl p-5 backdrop-blur-sm shadow-lg flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#082226]/80 border border-[#247B7B]/60 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#78CDD7]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#FFFFFA] tracking-wide">
                Habit Reliability Score
              </h3>
              <span className="text-[11px] text-[#FFFFFA]/60 font-medium">
                Ranked completion rate across all routine elements
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[340px] overflow-y-auto pr-1">
            {rankedTasks.map((t, idx) => (
              <div
                key={t.id}
                className="bg-[#082226]/70 border border-[#247B7B]/40 rounded-lg p-3 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#FFFFFA] truncate max-w-[260px]">
                    {idx + 1}. {t.name}
                  </span>
                  <span className="font-bold text-[#FFFFFA] tabular-nums">
                    {t.consistencyPct}%
                  </span>
                </div>

                <div className="w-full h-1.5 bg-[#103b41] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      t.consistencyPct >= 85
                        ? 'bg-[#78CDD7]'
                        : t.consistencyPct >= 70
                        ? 'bg-[#44A1A0]'
                        : 'bg-[#247B7B]'
                    }`}
                    style={{ width: `${t.consistencyPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
