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

  // Filter tasks applicable excluding N/A
  const totalTasks = tasks.length;
  const applicableTasks = tasks.filter((t) => !dailyLog.naTaskIds.includes(t.id));
  const checkedTasks = applicableTasks.filter((t) => dailyLog.checkedTaskIds.includes(t.id));

  const percentage =
    applicableTasks.length === 0
      ? 100
      : Math.round((checkedTasks.length / applicableTasks.length) * 100);

  // Icon mapping based on phase name
  const getPhaseIcon = () => {
    const lower = phaseName.toLowerCase();
    if (lower.includes('morning')) return <Sun className="w-5 h-5 text-[#78CDD7]" />;
    if (lower.includes('deep') || lower.includes('study') || lower.includes('work'))
      return <Brain className="w-5 h-5 text-[#78CDD7]" />;
    if (lower.includes('physical') || lower.includes('health') || lower.includes('workout') || lower.includes('gym'))
      return <Dumbbell className="w-5 h-5 text-[#78CDD7]" />;
    if (lower.includes('evening') || lower.includes('shutdown') || lower.includes('night'))
      return <Moon className="w-5 h-5 text-[#78CDD7]" />;
    return <Layers className="w-5 h-5 text-[#78CDD7]" />;
  };

  return (
    <div className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl overflow-hidden backdrop-blur-sm shadow-md transition-all hover:border-[#44A1A0]/80 flex flex-col justify-between">
      {/* Module Header */}
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#082226]/80 border border-[#247B7B]/60 flex items-center justify-center shadow-inner">
              {getPhaseIcon()}
            </div>
            <div>
              <h3 className="font-bold text-base text-[#FFFFFA] tracking-wide">
                {phaseName}
              </h3>
              <span className="text-[11px] text-[#FFFFFA]/60 font-medium">
                {checkedTasks.length} of {applicableTasks.length} completed
                {dailyLog.naTaskIds.length > 0 && ` (${dailyLog.naTaskIds.length} N/A)`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Circular Ring */}
            <CircularProgress
              percentage={dailyLog.paused ? 100 : percentage}
              size={56}
              strokeWidth={5}
              showText={true}
            />

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg bg-[#082226]/50 border border-[#247B7B]/40 hover:bg-[#103b41] text-[#FFFFFA]/70 hover:text-[#78CDD7] transition-colors"
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
        <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-[#247B7B]/40 flex flex-col gap-2">
          {tasks.map((task) => {
            const isChecked = dailyLog.checkedTaskIds.includes(task.id);
            const isNA = dailyLog.naTaskIds.includes(task.id);

            return (
              <div
                key={task.id}
                className={`group flex items-center justify-between gap-3 p-2.5 rounded-lg border transition-all ${
                  isNA
                    ? 'bg-[#082226]/30 border-dashed border-[#247B7B]/30 opacity-60'
                    : isChecked
                    ? 'bg-[#113E43]/60 border-[#44A1A0]/50'
                    : 'bg-[#082226]/60 border-[#247B7B]/40 hover:border-[#44A1A0]/50'
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
                        ? 'border-[#247B7B]/40 bg-transparent text-transparent'
                        : isChecked
                        ? 'bg-[#78CDD7] border-[#78CDD7] text-[#082226] shadow-sm'
                        : 'border-[#247B7B] bg-[#082226] hover:border-[#78CDD7]'
                    }`}
                  >
                    {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span
                      className={`text-sm font-medium tracking-tight truncate ${
                        isNA
                          ? 'line-through text-[#FFFFFA]/40 italic'
                          : isChecked
                          ? 'line-through text-[#FFFFFA]/60 font-normal'
                          : 'text-[#FFFFFA]'
                      }`}
                    >
                      {task.name}
                    </span>

                    <div className="flex items-center gap-2 text-[11px] text-[#FFFFFA]/60 mt-0.5">
                      <span className="flex items-center gap-1 font-mono tabular-nums text-[#78CDD7]">
                        <Clock className="w-3 h-3" />
                        {task.time}
                      </span>

                      {task.prayerLinked && (
                        <>
                          <span>·</span>
                          <span className="text-[#FFFFFA]/80 flex items-center gap-0.5 capitalize">
                            <Sparkles className="w-2.5 h-2.5 text-[#78CDD7]" />
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
                        ? 'bg-[#44A1A0] text-[#082226] border-[#78CDD7]'
                        : 'bg-[#082226] text-[#FFFFFA]/60 border-[#247B7B]/40 hover:text-[#FFFFFA] hover:border-[#44A1A0]'
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
