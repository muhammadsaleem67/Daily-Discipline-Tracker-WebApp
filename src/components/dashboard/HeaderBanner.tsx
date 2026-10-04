import React, { useMemo } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress } from '../common/CircularProgress';
import {
  calculateDayProgress,
  formatDateDisplay,
  getApplicableTasksForDate,
  getTodayDateStr,
} from '../../utils/date';
import { MOTIVATIONAL_QUOTES } from '../../utils/constants';

export const HeaderBanner: React.FC = () => {
  const { user } = useAuth();
  const {
    effectiveTasks,
    selectedDateStr,
    setSelectedDateStr,
    todayDateStr,
    selectedDateLog,
    togglePauseDay,
  } = useData();

  const isToday = selectedDateStr === todayDateStr;

  const applicableTasks = useMemo(() => {
    return getApplicableTasksForDate(effectiveTasks, selectedDateStr);
  }, [effectiveTasks, selectedDateStr]);

  const progress = useMemo(() => {
    return calculateDayProgress(selectedDateLog, applicableTasks);
  }, [selectedDateLog, applicableTasks]);

  const showEveningWarning = useMemo(() => {
    if (!isToday || selectedDateLog.paused) return false;
    const currentHour = new Date().getHours();
    return currentHour >= 18 && progress.percentage < 75;
  }, [isToday, selectedDateLog.paused, progress.percentage]);

  const quote = useMemo(() => {
    const sum = selectedDateStr
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return MOTIVATIONAL_QUOTES[sum % MOTIVATIONAL_QUOTES.length];
  }, [selectedDateStr]);

  const handleShiftDate = (days: number) => {
    const [y, m, d] = selectedDateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + days);
    const nextY = dateObj.getFullYear();
    const nextM = String(dateObj.getMonth() + 1).padStart(2, '0');
    const nextD = String(dateObj.getDate()).padStart(2, '0');
    setSelectedDateStr(`${nextY}-${nextM}-${nextD}`);
  };

  const remainingTasks = progress.totalApplicable - progress.checkedCount;

  return (
    <div className="flex flex-col gap-3">
      {/* Top Banner Box */}
      <div className="bg-[#4D2A00]/85 border border-[#6E3B00] rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden shadow-xl">
        {/* Subtle decorative warm golden gradient */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#F2A900]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Left Column: Greeting, Title, Motivation */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs text-[#F2A900] font-semibold tracking-wider uppercase">
              <span>{user ? `Officer / ${user.name}` : 'Operator'}</span>
              <span>·</span>
              <span>{formatDateDisplay(selectedDateStr)}</span>
              {!isToday && (
                <button
                  onClick={() => setSelectedDateStr(todayDateStr)}
                  className="inline-flex items-center gap-1 text-[11px] text-[#F9E6A8] bg-[#1B0F03] px-2 py-0.5 rounded border border-[#6E3B00] hover:bg-[#331C00] transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-[#F2A900]" />
                  Return to Today
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F9E6A8] tracking-tight leading-tight">
              Command the routine. <br className="hidden sm:inline" />
              <span className="text-[#F2A900]">Own the outcome.</span>
            </h1>

            <p className="mt-2 text-sm text-[#F9E6A8]/80 max-w-xl font-normal leading-relaxed">
              "{quote}"
            </p>

            {/* Date Controller & Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center bg-[#1B0F03]/90 border border-[#6E3B00]/70 rounded-lg p-1">
                <button
                  onClick={() => handleShiftDate(-1)}
                  className="p-1.5 rounded hover:bg-[#331C00] text-[#F9E6A8]/80 hover:text-[#F2A900] transition-colors"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="px-3 text-xs font-semibold text-[#F9E6A8] tabular-nums flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#F2A900]" />
                  <span>{isToday ? 'Today' : selectedDateStr}</span>
                </div>
                <button
                  onClick={() => handleShiftDate(1)}
                  className="p-1.5 rounded hover:bg-[#331C00] text-[#F9E6A8]/80 hover:text-[#F2A900] transition-colors"
                  title="Next Day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Pause Today Button */}
              <button
                onClick={() => togglePauseDay(selectedDateStr)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border ${
                  selectedDateLog.paused
                    ? 'bg-[#CC6F00] text-[#1B0F03] border-[#F2A900] shadow-md font-bold'
                    : 'bg-[#1B0F03]/90 text-[#F9E6A8]/90 border-[#6E3B00]/70 hover:bg-[#331C00] hover:text-[#F9E6A8]'
                }`}
                title="Pause tracking for sick day, travel, or planned recovery without breaking streak"
              >
                {selectedDateLog.paused ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Paused (Streak Protected) · Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Day (Rest / Sick)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Hero Ring Progress */}
          <div className="flex items-center gap-5 sm:gap-7 bg-[#1B0F03]/75 border border-[#6E3B00]/60 rounded-xl p-4 sm:p-5 w-full sm:w-auto justify-between sm:justify-start">
            <CircularProgress
              percentage={selectedDateLog.paused ? 100 : progress.percentage}
              size={96}
              strokeWidth={8}
              sublabel={selectedDateLog.paused ? 'PAUSED' : 'DONE'}
            />

            <div className="flex flex-col justify-center">
              <span className="text-xs uppercase tracking-wider text-[#F9E6A8]/70 font-semibold">
                Daily Completion
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#F9E6A8] tabular-nums">
                  {selectedDateLog.paused ? 'Safe' : `${progress.checkedCount}/${progress.totalApplicable}`}
                </span>
                <span className="text-xs text-[#F2A900] font-medium">Tasks</span>
              </div>

              <div className="mt-2 text-xs text-[#F9E6A8]/70 font-medium">
                {selectedDateLog.paused ? (
                  <span className="text-[#F2A900]">Protected status enabled</span>
                ) : remainingTasks === 0 ? (
                  <span className="text-[#F2A900] font-semibold">All targets secured!</span>
                ) : (
                  <span>
                    <strong className="text-[#F9E6A8]">{remainingTasks}</strong> targets remaining
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evening Warning (Coach Nudge) */}
      {showEveningWarning && (
        <div className="bg-[#331C00] border border-[#F2A900]/60 rounded-xl p-3.5 flex items-center justify-between gap-3 text-sm text-[#F9E6A8] shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1B0F03] border border-[#F2A900]/70 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-[#F2A900]" />
            </div>
            <div>
              <p className="font-semibold text-xs md:text-sm text-[#F9E6A8]">
                Evening Retrospective Alert: <span className="text-[#F2A900] font-normal">{remainingTasks} tasks left to lock in today’s streak.</span>
              </p>
              <p className="text-[11px] text-[#F9E6A8]/70 hidden sm:block">
                Night shutdown commences soon. Execute your priority physical or reading blocks.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('daily-tasks-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-1.5 bg-[#CC6F00] hover:bg-[#F2A900] text-[#1B0F03] text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Review Tasks
          </button>
        </div>
      )}
    </div>
  );
};
