import React from 'react';
import { Flame, Trophy, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { getTodayDateStr } from '../../utils/date';

export const StreakCard: React.FC = () => {
  const { streak, dailyLogs, effectiveTasks } = useData();

  const today = new Date();
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayStr = getTodayDateStr();

  const dayOfWeek = today.getDay();
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
    <div className="bg-[#4D2A00]/85 border border-[#6E3B00] rounded-xl p-5 relative overflow-hidden backdrop-blur-sm shadow-xl flex flex-col justify-between">
      {/* Background glow behind the flame */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#F2A900]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-[#F9E6A8]/70 font-semibold">
          Discipline Streak
        </span>
        <div className="flex items-center gap-1.5 text-xs text-[#F9E6A8]/85 bg-[#1B0F03]/70 px-2.5 py-1 rounded border border-[#6E3B00]/60">
          <Trophy className="w-3.5 h-3.5 text-[#F2A900]" />
          <span>Longest: <strong className="text-[#F9E6A8] tabular-nums">{streak.bestStreak} Days</strong></span>
        </div>
      </div>

      {/* Main streak figure */}
      <div className="my-4 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-extrabold text-[#F9E6A8] tracking-tight tabular-nums">
              {streak.currentStreak}
            </span>
            <span className="text-xl md:text-2xl font-bold text-[#F2A900] tracking-wider uppercase">
              Days
            </span>
          </div>
          <p className="text-xs text-[#F9E6A8]/75 mt-1 font-medium">
            {streak.currentStreak >= 7
              ? 'Unshakable momentum. Execute today’s standard.'
              : 'Every repetition compounds. Protect the daily chain.'}
          </p>
        </div>

        {/* Big Flame Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#1B0F03]/90 border border-[#CC6F00]/50 flex items-center justify-center shadow-inner group">
          <Flame
            className="w-10 h-10 text-[#F2A900] animate-pulse"
            style={{ filter: 'drop-shadow(0 0 12px rgba(242, 169, 0, 0.7))' }}
          />
        </div>
      </div>

      {/* 7-day completion dots trail */}
      <div className="pt-3 border-t border-[#6E3B00]/60">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#F9E6A8]/60 font-medium">Current Week</span>
          <div className="flex items-center gap-2">
            {trail.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className={`text-[10px] ${item.isToday ? 'text-[#F2A900] font-bold' : 'text-[#F9E6A8]/60'}`}>
                  {item.dayLetter}
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    item.status === 'completed'
                      ? 'bg-[#F2A900] text-[#1B0F03] shadow-sm font-bold'
                      : item.status === 'paused'
                      ? 'bg-[#CC6F00] text-[#F9E6A8]'
                      : item.isToday
                      ? 'border border-[#F2A900] bg-[#1B0F03]'
                      : item.status === 'pending'
                      ? 'bg-[#331C00] border border-[#6E3B00]/40'
                      : 'bg-[#261502] text-[#F9E6A8]/30'
                  }`}
                  title={`${item.dateKey}: ${item.status}`}
                >
                  {item.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                  {item.status === 'paused' && <span className="text-[9px] font-bold">P</span>}
                  {item.isToday && item.status !== 'completed' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F2A900] animate-ping" />
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
