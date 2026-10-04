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

  // Day progress computation
  const applicableTasks = useMemo(() => {
    return getApplicableTasksForDate(effectiveTasks, selectedDateStr);
  }, [effectiveTasks, selectedDateStr]);

  const progress = useMemo(() => {
    return calculateDayProgress(selectedDateLog, applicableTasks);
  }, [selectedDateLog, applicableTasks]);

  // Evening warning check: if viewing today, local hour >= 18, and completion < 75%
  const showEveningWarning = useMemo(() => {
    if (!isToday || selectedDateLog.paused) return false;
    const currentHour = new Date().getHours();
    return currentHour >= 18 && progress.percentage < 75;
  }, [isToday, selectedDateLog.paused, progress.percentage]);

  // Motivational quote based on date hash
  const quote = useMemo(() => {
    const sum = selectedDateStr
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return MOTIVATIONAL_QUOTES[sum % MOTIVATIONAL_QUOTES.length];
  }, [selectedDateStr]);

  // Date navigation handlers
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
      <div className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden shadow-xl">
        {/* Subtle decorative radial gradient */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#44A1A0]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Left Column: Greeting, Title, Motivation */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs text-[#78CDD7] font-semibold tracking-wider uppercase">
              <span>{user ? `Officer / ${user.name}` : 'Operator'}</span>
              <span>·</span>
              <span>{formatDateDisplay(selectedDateStr)}</span>
              {!isToday && (
                <button
                  onClick={() => setSelectedDateStr(todayDateStr)}
                  className="inline-flex items-center gap-1 text-[11px] text-[#FFFFFA] bg-[#082226] px-2 py-0.5 rounded border border-[#247B7B] hover:bg-[#103b41] transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-[#78CDD7]" />
                  Return to Today
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FFFFFA] tracking-tight leading-tight">
              Command the routine. <br className="hidden sm:inline" />
              <span className="text-[#78CDD7]">Own the outcome.</span>
            </h1>

            <p className="mt-2 text-sm text-[#FFFFFA]/80 max-w-xl font-normal leading-relaxed">
              "{quote}"
            </p>

            {/* Date Controller & Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {/* Prev / Next Date Stepper */}
              <div className="inline-flex items-center bg-[#082226]/80 border border-[#247B7B]/60 rounded-lg p-1">
                <button
                  onClick={() => handleShiftDate(-1)}
                  className="p-1.5 rounded hover:bg-[#103b41] text-[#FFFFFA]/80 hover:text-[#78CDD7] transition-colors"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="px-3 text-xs font-semibold text-[#FFFFFA] tabular-nums flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#78CDD7]" />
                  <span>{isToday ? 'Today' : selectedDateStr}</span>
                </div>
                <button
                  onClick={() => handleShiftDate(1)}
                  className="p-1.5 rounded hover:bg-[#103b41] text-[#FFFFFA]/80 hover:text-[#78CDD7] transition-colors"
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
                    ? 'bg-[#44A1A0] text-[#082226] border-[#78CDD7] shadow-md'
                    : 'bg-[#082226]/80 text-[#FFFFFA]/90 border-[#247B7B]/60 hover:bg-[#103b41] hover:text-[#FFFFFA]'
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
          <div className="flex items-center gap-5 sm:gap-7 bg-[#082226]/60 border border-[#247B7B]/50 rounded-xl p-4 sm:p-5 w-full sm:w-auto justify-between sm:justify-start">
            <CircularProgress
              percentage={selectedDateLog.paused ? 100 : progress.percentage}
              size={96}
              strokeWidth={8}
              sublabel={selectedDateLog.paused ? 'PAUSED' : 'DONE'}
            />

            <div className="flex flex-col justify-center">
              <span className="text-xs uppercase tracking-wider text-[#FFFFFA]/70 font-semibold">
                Daily Completion
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#FFFFFA] tabular-nums">
                  {selectedDateLog.paused ? 'Safe' : `${progress.checkedCount}/${progress.totalApplicable}`}
                </span>
                <span className="text-xs text-[#78CDD7] font-medium">Tasks</span>
              </div>

              <div className="mt-2 text-xs text-[#FFFFFA]/70 font-medium">
                {selectedDateLog.paused ? (
                  <span className="text-[#78CDD7]">Protected status enabled</span>
                ) : remainingTasks === 0 ? (
                  <span className="text-[#78CDD7] font-semibold">All targets secured!</span>
                ) : (
                  <span>
                    <strong className="text-[#FFFFFA]">{remainingTasks}</strong> targets remaining
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evening Warning (Coach Nudge) */}
      {showEveningWarning && (
        <div className="bg-[#113E43] border border-[#78CDD7]/50 rounded-xl p-3.5 flex items-center justify-between gap-3 text-sm text-[#FFFFFA] shadow-md animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#082226] border border-[#78CDD7]/60 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-[#78CDD7]" />
            </div>
            <div>
              <p className="font-semibold text-xs md:text-sm text-[#FFFFFA]">
                Evening Retrospective Alert: <span className="text-[#78CDD7] font-normal">{remainingTasks} tasks left to lock in today’s streak.</span>
              </p>
              <p className="text-[11px] text-[#FFFFFA]/70 hidden sm:block">
                Night shutdown commences soon. Execute your priority physical or reading blocks.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('daily-tasks-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-1.5 bg-[#44A1A0] hover:bg-[#78CDD7] text-[#082226] text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Review Tasks
          </button>
        </div>
      )}
    </div>
  );
};
