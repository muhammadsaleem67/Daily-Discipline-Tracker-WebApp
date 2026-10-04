import React from 'react';
import { Flame, Trophy, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { getTodayDateStr } from '../../utils/date';

export const StreakCard: React.FC = () => {
  const { streak, dailyLogs, effectiveTasks } = useData();

  // Compute last 7 days status for the mini trail
  const today = new Date();
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayStr = getTodayDateStr();

  // Find Monday of current week
  const dayOfWeek = today.getDay(); // 0 is Sunday
  const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mondayDate = new Date(today);
  mondayDate.setDate(today.getDate() + distanceToMonday);

  const trail = weekDays.map((dayLetter, index) => {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + index);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${day}`;

    const isToday = dateKey === todayStr;
    const isFuture = d > today && !isToday;
    const log = dailyLogs[dateKey];

    let status: 'completed' | 'paused' | 'pending' | 'missed' = 'missed';
    if (isFuture) {
      status = 'pending';
    } else if (log?.paused) {
      status = 'paused';
    } else if (log) {
      const applicable = effectiveTasks.filter((t) => !log.naTaskIds.includes(t.id));
      const checked = applicable.filter((t) => log.checkedTaskIds.includes(t.id));
      const pct = applicable.length > 0 ? (checked.length / applicable.length) * 100 : 100;
      if (pct >= 80) status = 'completed';
      else if (isToday) status = 'pending';
    } else if (isToday) {
      status = 'pending';
    }

    return {
      dayLetter,
      dateKey,
      status,
      isToday,
    };
  });

  return (
    <div className="bg-[#0D5C63]/90 border border-[#247B7B]/60 rounded-xl p-5 relative overflow-hidden backdrop-blur-sm shadow-lg flex flex-col justify-between">
      {/* Background glow behind the flame */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#78CDD7]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-[#FFFFFA]/70 font-semibold">
          Discipline Streak
        </span>
        <div className="flex items-center gap-1.5 text-xs text-[#FFFFFA]/80 bg-[#082226]/60 px-2.5 py-1 rounded border border-[#247B7B]/40">
          <Trophy className="w-3.5 h-3.5 text-[#78CDD7]" />
          <span>Longest: <strong className="text-[#FFFFFA] tabular-nums">{streak.bestStreak} Days</strong></span>
        </div>
      </div>

      {/* Main streak figure */}
      <div className="my-4 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-extrabold text-[#FFFFFA] tracking-tight tabular-nums">
              {streak.currentStreak}
            </span>
            <span className="text-xl md:text-2xl font-bold text-[#78CDD7] tracking-wider uppercase">
              Days
            </span>
          </div>
          <p className="text-xs text-[#FFFFFA]/75 mt-1 font-medium">
            {streak.currentStreak >= 7
              ? 'Unshakable momentum. Execute today’s standard.'
              : 'Every repetition compounds. Protect the daily chain.'}
          </p>
        </div>

        {/* Big Flame Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#082226]/80 border border-[#44A1A0]/40 flex items-center justify-center shadow-inner group">
          <Flame
            className="w-10 h-10 text-[#78CDD7] animate-pulse"
            style={{ filter: 'drop-shadow(0 0 10px rgba(120, 205, 215, 0.6))' }}
          />
        </div>
      </div>

      {/* 7-day completion dots trail */}
      <div className="pt-3 border-t border-[#247B7B]/40">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#FFFFFA]/60 font-medium">Current Week</span>
          <div className="flex items-center gap-2">
            {trail.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className={`text-[10px] ${item.isToday ? 'text-[#78CDD7] font-bold' : 'text-[#FFFFFA]/60'}`}>
                  {item.dayLetter}
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    item.status === 'completed'
                      ? 'bg-[#78CDD7] text-[#082226] shadow-sm'
                      : item.status === 'paused'
                      ? 'bg-[#44A1A0] text-[#FFFFFA]'
                      : item.isToday
                      ? 'border border-[#78CDD7] bg-[#082226]'
                      : item.status === 'pending'
                      ? 'bg-[#103b41] border border-[#247B7B]/40'
                      : 'bg-[#103b41]/60 text-[#FFFFFA]/30'
                  }`}
                  title={`${item.dateKey}: ${item.status}`}
                >
                  {item.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                  {item.status === 'paused' && <span className="text-[9px] font-bold">P</span>}
                  {item.isToday && item.status !== 'completed' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#78CDD7] animate-ping" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
