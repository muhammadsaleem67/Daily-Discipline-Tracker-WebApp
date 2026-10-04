import React, { useMemo } from 'react';
import { HeaderBanner } from './HeaderBanner';
import { StreakCard } from '../common/StreakCard';
import { StatCardsRow } from './StatCardsRow';
import { PhaseModuleCard } from './PhaseModuleCard';
import { ConsistencyHeatmap } from './ConsistencyHeatmap';
import { WeeklyBarChart } from './WeeklyBarChart';
import { DailyNotesCard } from './DailyNotesCard';
import { useData } from '../../context/DataContext';
import { getApplicableTasksForDate } from '../../utils/date';
import { Task } from '../../types';

export const TodayView: React.FC = () => {
  const {
    effectiveTasks,
    selectedDateStr,
    selectedDateLog,
    dailyLogs,
    toggleTaskCheck,
    toggleTaskNA,
  } = useData();

  // Filter tasks applicable to selected date
  const applicableTasks = useMemo(() => {
    return getApplicableTasksForDate(effectiveTasks, selectedDateStr);
  }, [effectiveTasks, selectedDateStr]);

  // Group by routine phases preserving order
  const groupedPhases = useMemo(() => {
    const map: Record<string, Task[]> = {};
    applicableTasks.forEach((t) => {
      if (!map[t.phase]) {
        map[t.phase] = [];
      }
      map[t.phase].push(t);
    });
    return map;
  }, [applicableTasks]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Hero Dashboard Header */}
      <HeaderBanner />

      {/* 2. Top Stats: Streak Card & Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          <StreakCard />
        </div>
        <div className="lg:col-span-2">
          <StatCardsRow />
        </div>
      </div>

      {/* 3. Routine Phases Module Cards (The Core Daily Checklist) */}
      <div id="daily-tasks-grid" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F9E6A8] tracking-tight uppercase">
            Daily Execution Modules
          </h2>
          <span className="text-xs text-[#F2A900] font-medium">
            {applicableTasks.length} Scheduled Blocks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(groupedPhases).map(([phaseName, phaseTasks]) => (
            <PhaseModuleCard
              key={phaseName}
              phaseName={phaseName}
              tasks={phaseTasks}
              dailyLog={selectedDateLog}
              allLogs={dailyLogs}
              onToggleCheck={(id) => toggleTaskCheck(id, selectedDateStr)}
              onToggleNA={(id) => toggleTaskNA(id, selectedDateStr)}
            />
          ))}
        </div>
      </div>

      {/* 4. GitHub-Style Consistency Heatmap */}
      <ConsistencyHeatmap weeksToShow={20} interactive={true} />

      {/* 5. Weekly Bar Chart & Daily Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyBarChart />
        <DailyNotesCard />
      </div>
    </div>
  );
};
