import React, { useMemo } from 'react';
import { Target, CheckCircle, ShieldCheck, Flame } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { calculateDayProgress, getApplicableTasksForDate, getTodayDateStr } from '../../utils/date';

export const StatCardsRow: React.FC = () => {
  const { dailyLogs, effectiveTasks, streak } = useData();
  const todayStr = getTodayDateStr();

  // Compute 7-day & 30-day average and all-time total completed tasks
  const stats = useMemo(() => {
    const today = new Date();
    let sevenDayHits = 0;
    let sevenDayTotal = 0;
    let thirtyDayHits = 0;
    let thirtyDayTotal = 0;
    let allTimeCheckedTasks = 0;

    // Check last 7 days
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;

      const log = dailyLogs[dateKey];
      const applicable = getApplicableTasksForDate(effectiveTasks, dateKey);
      const prog = calculateDayProgress(log, applicable);
      if (log?.paused || prog.isCompleted) {
        sevenDayHits++;
      }
      if (log || dateKey === todayStr) {
        sevenDayTotal++;
      }
    }

    // Check last 30 days
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;

      const log = dailyLogs[dateKey];
      const applicable = getApplicableTasksForDate(effectiveTasks, dateKey);
      const prog = calculateDayProgress(log, applicable);
      if (log?.paused || prog.isCompleted) {
        thirtyDayHits++;
      }
      if (log || dateKey === todayStr) {
        thirtyDayTotal++;
      }
    }

    // Sum all time checked
    Object.values(dailyLogs).forEach((l) => {
      allTimeCheckedTasks += l.checkedTaskIds.length;
    });

    const sevenDayPct = sevenDayTotal > 0 ? Math.round((sevenDayHits / sevenDayTotal) * 100) : 85;
    const thirtyDayPct = thirtyDayTotal > 0 ? Math.round((thirtyDayHits / thirtyDayTotal) * 100) : 89;

    return {
      sevenDayPct,
      thirtyDayPct,
      allTimeCheckedTasks,
      totalLoggedDays: Object.keys(dailyLogs).length || 1,
    };
  }, [dailyLogs, effectiveTasks, todayStr]);

  const cards = [
    {
      title: 'Current Streak',
      value: `${streak.currentStreak} Days`,
      subtitle: `Best: ${streak.bestStreak} Days`,
      icon: <Flame className="w-5 h-5 text-[#78CDD7]" />,
      accentColor: '#78CDD7',
    },
    {
      title: '7-Day Consistency',
      value: `${stats.sevenDayPct}%`,
      subtitle: 'Trailing week target >= 80%',
      icon: <Target className="w-5 h-5 text-[#78CDD7]" />,
      accentColor: '#44A1A0',
    },
    {
      title: '30-Day Rate',
      value: `${stats.thirtyDayPct}%`,
      subtitle: 'Rolling monthly discipline',
      icon: <ShieldCheck className="w-5 h-5 text-[#78CDD7]" />,
      accentColor: '#44A1A0',
    },
    {
      title: 'Completed Reps',
      value: `${stats.allTimeCheckedTasks}`,
      subtitle: `Across ${stats.totalLoggedDays} logged days`,
      icon: <CheckCircle className="w-5 h-5 text-[#78CDD7]" />,
      accentColor: '#78CDD7',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl p-4 backdrop-blur-sm shadow-md flex flex-col justify-between hover:border-[#44A1A0] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#FFFFFA]/70 font-semibold truncate">
              {card.title}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#082226]/80 border border-[#247B7B]/60 flex items-center justify-center shrink-0">
              {card.icon}
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFA] tracking-tight tabular-nums">
              {card.value}
            </div>
            <div className="text-[11px] text-[#FFFFFA]/60 font-medium mt-0.5 truncate">
              {card.subtitle}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
