import React, { useState } from 'react';
import {
  Settings,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Download,
  Upload,
  RotateCcw,
  Check,
  Database,
  UserCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { PrayerLink, Task, TaskDays } from '../../types';

export const SettingsView: React.FC = () => {
  const { user, logout, switchUser, allUsers } = useAuth();
  const {
    tasks,
    effectiveTasks,
    settings,
    updatePrayerTimes,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    seedSampleData,
    resetToDefaults,
    exportDataJson,
    importDataJson,
  } = useData();

  // Local state for prayer times editing
  const [fajr, setFajr] = useState(settings.prayerTimes.fajr);
  const [maghrib, setMaghrib] = useState(settings.prayerTimes.maghrib);
  const [isha, setIsha] = useState(settings.prayerTimes.isha);
  const [prayerSaved, setPrayerSaved] = useState(false);

  // New task form state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState('Morning Routine');
  const [newTaskTime, setNewTaskTime] = useState('07:00');
  const [newTaskDays, setNewTaskDays] = useState<TaskDays>('all');
  const [newTaskPrayer, setNewTaskPrayer] = useState<PrayerLink>(null);

  // Import / Export notification
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSavePrayerTimes = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrayerTimes({
      fajr,
      maghrib,
      isha,
    });
    setPrayerSaved(true);
    setTimeout(() => setPrayerSaved(false), 2500);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    addTask({
      name: newTaskName.trim(),
      phase: newTaskPhase,
      time: newTaskTime,
      days: newTaskDays,
      prayerLinked: newTaskPrayer,
    });

    setNewTaskName('');
    setIsAddingTask(false);
  };

  const handleMoveTask = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tasks.length) return;

    const list = [...tasks];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    reorderTasks(list);
  };

  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-discipline-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJson(content);
      if (success) {
        setImportStatus('Backup restored successfully!');
      } else {
        setImportStatus('Failed to parse backup JSON.');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  const existingPhases = Array.from(new Set(tasks.map((t) => t.phase)));
  if (!existingPhases.includes('Morning Routine')) existingPhases.push('Morning Routine');
  if (!existingPhases.includes('Deep Work & Study')) existingPhases.push('Deep Work & Study');
  if (!existingPhases.includes('Physical & Health')) existingPhases.push('Physical & Health');
  if (!existingPhases.includes('Evening Shutdown')) existingPhases.push('Evening Shutdown');

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl p-5 backdrop-blur-md shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#78CDD7]" />
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FFFFFA] tracking-tight">
              Settings & Routine Architecture
            </h1>
            <p className="text-xs sm:text-sm text-[#FFFFFA]/75 font-normal">
              Customize dynamic prayer sync, habit schedules, database backups, and account privacy.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Prayer Times + Account */}
        <div className="flex flex-col gap-6">
          {/* Dynamic Prayer Times */}
          <div className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl p-5 backdrop-blur-sm shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#78CDD7]" />
                <h3 className="font-bold text-sm text-[#FFFFFA] uppercase tracking-wider">
                  Dynamic Prayer Times
                </h3>
              </div>
              {prayerSaved && (
                <span className="text-[11px] text-[#78CDD7] flex items-center gap-1">
                  <Check className="w-3 h-3" /> Updated
                </span>
              )}
            </div>

            <p className="text-xs text-[#FFFFFA]/70 leading-relaxed">
              Any habit linked to Fajr, Maghrib, or Isha will immediately synchronize its scheduled
              time on the dashboard.
            </p>

            <form onSubmit={handleSavePrayerTimes} className="flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[#FFFFFA]/80 block mb-1">
                    Fajr
                  </label>
                  <input
                    type="time"
                    value={fajr}
                    onChange={(e) => setFajr(e.target.value)}
                    className="w-full bg-[#082226] border border-[#247B7B] rounded-lg px-2 py-1.5 text-xs text-[#FFFFFA] font-mono focus:outline-none focus:border-[#78CDD7]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#FFFFFA]/80 block mb-1">
                    Maghrib
                  </label>
                  <input
                    type="time"
                    value={maghrib}
                    onChange={(e) => setMaghrib(e.target.value)}
                    className="w-full bg-[#082226] border border-[#247B7B] rounded-lg px-2 py-1.5 text-xs text-[#FFFFFA] font-mono focus:outline-none focus:border-[#78CDD7]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#FFFFFA]/80 block mb-1">
                    Isha
                  </label>
                  <input
                    type="time"
                    value={isha}
                    onChange={(e) => setIsha(e.target.value)}
                    className="w-full bg-[#082226] border border-[#247B7B] rounded-lg px-2 py-1.5 text-xs text-[#FFFFFA] font-mono focus:outline-none focus:border-[#78CDD7]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-1 w-full py-2 bg-[#44A1A0] hover:bg-[#78CDD7] text-[#082226] font-bold text-xs rounded-lg transition-colors"
              >
                Apply Dynamic Prayer Schedule
              </button>
            </form>
          </div>

          {/* Account & Profile Switcher */}
          <div className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl p-5 backdrop-blur-sm shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#78CDD7]" />
              <h3 className="font-bold text-sm text-[#FFFFFA] uppercase tracking-wider">
                User Account & Privacy
              </h3>
            </div>

            <div className="bg-[#082226]/80 border border-[#247B7B]/50 rounded-lg p-3 text-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#FFFFFA]/60">Active Profile:</span>
                <strong className="text-[#FFFFFA]">{user?.name}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#FFFFFA]/60">Email:</span>
                <span className="text-[#78CDD7] font-mono">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#FFFFFA]/60">Data Partition:</span>
                <span className="text-[#FFFFFA]/80 font-mono">Isolated (Private)</span>
              </div>
            </div>

            {/* Switch User dropdown */}
            <div>
              <label className="text-[11px] font-semibold text-[#FFFFFA]/70 block mb-1">
                Switch Registered Account
              </label>
              <select
                value={user?.id}
                onChange={(e) => switchUser(e.target.value)}
                className="w-full bg-[#082226] border border-[#247B7B] rounded-lg px-3 py-2 text-xs text-[#FFFFFA] focus:outline-none focus:border-[#78CDD7]"
              >
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={logout}
              className="py-2 bg-[#082226] hover:bg-[#103b41] border border-[#247B7B] rounded-lg text-xs font-semibold text-[#FFFFFA]/80 hover:text-[#FFFFFA] transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Database Backup & Demo Tools */}
          <div className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl p-5 backdrop-blur-sm shadow-md flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#78CDD7]" />
              <h3 className="font-bold text-sm text-[#FFFFFA] uppercase tracking-wider">
                Data Management
              </h3>
            </div>

            {importStatus && (
              <div className="p-2 bg-[#103b41] text-[#78CDD7] text-xs rounded border border-[#247B7B]">
                {importStatus}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-1.5 py-2 bg-[#082226] hover:bg-[#103b41] border border-[#247B7B] rounded-lg text-xs font-semibold text-[#FFFFFA] transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#78CDD7]" />
                Export JSON
              </button>

              <label className="flex items-center justify-center gap-1.5 py-2 bg-[#082226] hover:bg-[#103b41] border border-[#247B7B] rounded-lg text-xs font-semibold text-[#FFFFFA] transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#78CDD7]" />
                Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={seedSampleData}
              className="mt-1 py-2 bg-[#103b41] hover:bg-[#247B7B] text-[#FFFFFA] font-medium text-xs rounded-lg transition-colors border border-[#247B7B]"
            >
              Seed 60-Day Discipline History (Demo)
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all routines to starter defaults?')) {
                  resetToDefaults();
                }
              }}
              className="py-1.5 text-xs text-[#FFFFFA]/50 hover:text-red-400 transition-colors flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Routines to Default
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Full Task Architect / Editor */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl p-5 backdrop-blur-sm shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#FFFFFA] tracking-wide">
                  Routine Architect (Task Editor)
                </h3>
                <span className="text-[11px] text-[#FFFFFA]/60 font-medium">
                  {tasks.length} total routine tasks · Add, reorder, adjust schedules & prayer links
                </span>
              </div>

              <button
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#44A1A0] hover:bg-[#78CDD7] text-[#082226] font-bold text-xs rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                Add Habit
              </button>
            </div>

            {/* Add Task Form Drawer */}
            {isAddingTask && (
              <form
                onSubmit={handleCreateTask}
                className="bg-[#082226]/90 border border-[#44A1A0]/60 rounded-xl p-4 flex flex-col gap-3"
              >
                <div className="text-xs font-bold text-[#78CDD7] uppercase tracking-wider">
                  New Routine Element
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-[#FFFFFA]/70 block mb-1">
                      Habit / Task Description
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Read 20 pages of technical literature"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      className="w-full bg-[#0D5C63] border border-[#247B7B] rounded-lg px-3 py-2 text-xs text-[#FFFFFA] focus:outline-none focus:border-[#78CDD7]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#FFFFFA]/70 block mb-1">
                      Routine Phase
                    </label>
                    <input
                      type="text"
                      list="phases-list"
                      value={newTaskPhase}
                      onChange={(e) => setNewTaskPhase(e.target.value)}
                      className="w-full bg-[#0D5C63] border border-[#247B7B] rounded-lg px-3 py-2 text-xs text-[#FFFFFA] focus:outline-none focus:border-[#78CDD7]"
                    />
                    <datalist id="phases-list">
                      {existingPhases.map((p) => (
                        <option key={p} value={p} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#FFFFFA]/70 block mb-1">
                      Scheduled Time
                    </label>
                    <input
                      type="time"
                      value={newTaskTime}
                      onChange={(e) => setNewTaskTime(e.target.value)}
                      className="w-full bg-[#0D5C63] border border-[#247B7B] rounded-lg px-3 py-2 text-xs text-[#FFFFFA] font-mono focus:outline-none focus:border-[#78CDD7]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#FFFFFA]/70 block mb-1">
                      Recurrence Days
                    </label>
                    <select
                      value={newTaskDays}
                      onChange={(e) => setNewTaskDays(e.target.value as TaskDays)}
                      className="w-full bg-[#0D5C63] border border-[#247B7B] rounded-lg px-3 py-2 text-xs text-[#FFFFFA] focus:outline-none focus:border-[#78CDD7]"
                    >
                      <option value="all">Every Single Day</option>
                      <option value="weekdays">Weekdays Only (Mon–Fri)</option>
                      <option value="weekends">Weekends Only (Sat–Sun)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#FFFFFA]/70 block mb-1">
                      Link to Prayer Time
                    </label>
                    <select
                      value={newTaskPrayer || ''}
                      onChange={(e) =>
                        setNewTaskPrayer((e.target.value as PrayerLink) || null)
                      }
                      className="w-full bg-[#0D5C63] border border-[#247B7B] rounded-lg px-3 py-2 text-xs text-[#FFFFFA] focus:outline-none focus:border-[#78CDD7]"
                    >
                      <option value="">None (Fixed Clock Time)</option>
                      <option value="fajr">Fajr</option>
                      <option value="maghrib">Maghrib</option>
                      <option value="isha">Isha</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-[#247B7B]/40">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-3 py-1.5 text-xs text-[#FFFFFA]/70 hover:text-[#FFFFFA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#44A1A0] text-[#082226] font-bold text-xs rounded-lg hover:bg-[#78CDD7]"
                  >
                    Add to Routine
                  </button>
                </div>
              </form>
            )}

            {/* List of existing tasks */}
            <div className="flex flex-col gap-2 max-h-[580px] overflow-y-auto pr-1">
              {effectiveTasks.map((t, idx) => (
                <div
                  key={t.id}
                  className="bg-[#082226]/80 border border-[#247B7B]/50 rounded-lg p-3 flex items-center justify-between gap-3 hover:border-[#44A1A0]/60 transition-colors"
                >
                  {/* Left: Reorder arrows + Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleMoveTask(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-[#FFFFFA]/40 hover:text-[#FFFFFA] disabled:opacity-20 transition-colors"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveTask(idx, 'down')}
                        disabled={idx === tasks.length - 1}
                        className="p-1 rounded text-[#FFFFFA]/40 hover:text-[#FFFFFA] disabled:opacity-20 transition-colors"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-[#FFFFFA] truncate">
                        {t.name}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-[#FFFFFA]/60 mt-0.5">
                        <span className="text-[#78CDD7] font-medium">{t.phase}</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums text-[#FFFFFA]/80">
                          {t.time}
                        </span>
                        {t.prayerLinked && (
                          <>
                            <span>·</span>
                            <span className="capitalize text-[#78CDD7]">
                              Linked to {t.prayerLinked}
                            </span>
                          </>
                        )}
                        <span>·</span>
                        <span className="capitalize">
                          {t.days === 'all'
                            ? 'Daily'
                            : t.days === 'weekdays'
                            ? 'Weekdays'
                            : 'Weekends'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-2 rounded hover:bg-[#103b41] text-[#FFFFFA]/50 hover:text-red-400 transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
