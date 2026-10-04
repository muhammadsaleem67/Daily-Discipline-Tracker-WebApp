import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Sun,
  Brain,
  Dumbbell,
  Moon,
  Layers,
} from 'lucide-react';
import { DailyLog, Task } from '../../types';
import { CircularProgress } from '../common/CircularProgress';
import { DayIndicatorDots } from '../common/DayIndicatorDots';

interface PhaseModuleCardProps {
  phaseName: string;
  tasks: Task[];
  dailyLog: DailyLog;
  allLogs: Record<string, DailyLog>;
  onToggleCheck: (taskId: string) => void;
  onToggleNA: (taskId: string) => void;
}

export const PhaseModuleCard: React.FC<PhaseModuleCardProps> = ({
  phaseName,
  tasks,
  dailyLog,
  allLogs,
  onToggleCheck,
  onToggleNA,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const applicableTasks = tasks.filter((t) => !dailyLog.naTaskIds.includes(t.id));
  const checkedTasks = applicableTasks.filter((t) => dailyLog.checkedTaskIds.includes(t.id));

  const percentage =
    applicableTasks.length === 0
      ? 100
      : Math.round((checkedTasks.length / applicableTasks.length) * 100);

  const getPhaseIcon = () => {
    const lower = phaseName.toLowerCase();
    if (lower.includes('morning')) return <Sun className="w-5 h-5 text-[#F2A900]" />;
    if (lower.includes('deep') || lower.includes('study') || lower.includes('work'))
      return <Brain className="w-5 h-5 text-[#F2A900]" />;
    if (lower.includes('physical') || lower.includes('health') || lower.includes('workout') || lower.includes('gym'))
      return <Dumbbell className="w-5 h-5 text-[#F2A900]" />;
    if (lower.includes('evening') || lower.includes('shutdown') || lower.includes('night'))
      return <Moon className="w-5 h-5 text-[#F2A900]" />;
    return <Layers className="w-5 h-5 text-[#F2A900]" />;
  };

  return (
    <div className="bg-[#4D2A00]/85 border border-[#6E3B00] rounded-xl overflow-hidden backdrop-blur-sm shadow-md transition-all hover:border-[#CC6F00] flex flex-col justify-between">
      {/* Module Header */}
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#1B0F03]/90 border border-[#6E3B00]/70 flex items-center justify-center shadow-inner">
              {getPhaseIcon()}
            </div>
            <div>
              <h3 className="font-bold text-base text-[#F9E6A8] tracking-wide">
                {phaseName}
              </h3>
              <span className="text-[11px] text-[#F9E6A8]/60 font-medium">
                {checkedTasks.length} of {applicableTasks.length} completed
                {dailyLog.naTaskIds.length > 0 && ` (${dailyLog.naTaskIds.length} N/A)`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CircularProgress
              percentage={dailyLog.paused ? 100 : percentage}
              size={56}
              strokeWidth={5}
              showText={true}
            />

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg bg-[#1B0F03]/60 border border-[#6E3B00]/50 hover:bg-[#331C00] text-[#F9E6A8]/70 hover:text-[#F2A900] transition-colors"
              aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 7-Day Dots Indicator Row (M T W T F S S) */}
        <DayIndicatorDots phaseTasks={tasks} dailyLogs={allLogs} />
      </div>

      {/* Task Checklist (Collapsible) */}
      {isExpanded && (
        <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-[#6E3B00]/60 flex flex-col gap-2">
          {tasks.map((task) => {
            const isChecked = dailyLog.checkedTaskIds.includes(task.id);
            const isNA = dailyLog.naTaskIds.includes(task.id);

            return (
              <div
                key={task.id}
                className={`group flex items-center justify-between gap-3 p-2.5 rounded-lg border transition-all ${
                  isNA
                    ? 'bg-[#1B0F03]/30 border-dashed border-[#6E3B00]/30 opacity-60'
                    : isChecked
                    ? 'bg-[#331C00]/80 border-[#CC6F00]/50'
                    : 'bg-[#1B0F03]/75 border-[#6E3B00]/50 hover:border-[#CC6F00]/60'
                }`}
              >
                {/* Left: Checkbox + Title + Meta */}
                <div
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer min-h-[44px]"
                  onClick={() => !isNA && onToggleCheck(task.id)}
                >
                  {/* Custom Checkbox */}
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                      isNA
                        ? 'border-[#6E3B00]/40 bg-transparent text-transparent'
                        : isChecked
                        ? 'bg-[#F2A900] border-[#F2A900] text-[#1B0F03] shadow-sm font-bold'
                        : 'border-[#6E3B00] bg-[#1B0F03] hover:border-[#F2A900]'
                    }`}
                  >
                    {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span
                      className={`text-sm font-medium tracking-tight truncate ${
                        isNA
                          ? 'line-through text-[#F9E6A8]/40 italic'
                          : isChecked
                          ? 'line-through text-[#F9E6A8]/60 font-normal'
                          : 'text-[#F9E6A8]'
                      }`}
                    >
                      {task.name}
                    </span>

                    <div className="flex items-center gap-2 text-[11px] text-[#F9E6A8]/60 mt-0.5">
                      <span className="flex items-center gap-1 font-mono tabular-nums text-[#F2A900]">
                        <Clock className="w-3 h-3" />
                        {task.time}
                      </span>

                      {task.prayerLinked && (
                        <>
                          <span>·</span>
                          <span className="text-[#F9E6A8]/85 flex items-center gap-0.5 capitalize">
                            <Sparkles className="w-2.5 h-2.5 text-[#F2A900]" />
                            {task.prayerLinked} Linked
                          </span>
                        </>
                      )}

                      <span>·</span>
                      <span className="capitalize">
                        {task.days === 'all'
                          ? 'Daily'
                          : task.days === 'weekdays'
                          ? 'Mon–Fri'
                          : 'Weekends'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: N/A Toggle Button */}
                <div className="shrink-0 flex items-center">
                  <button
                    onClick={() => onToggleNA(task.id)}
                    className={`px-2 py-1 text-[11px] font-bold rounded border transition-colors ${
                      isNA
                        ? 'bg-[#CC6F00] text-[#1B0F03] border-[#F2A900]'
                        : 'bg-[#1B0F03] text-[#F9E6A8]/60 border-[#6E3B00]/50 hover:text-[#F9E6A8] hover:border-[#CC6F00]'
                    }`}
                    title={isNA ? 'Remove N/A status' : 'Mark task Not Applicable for today'}
                  >
                    N/A
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
