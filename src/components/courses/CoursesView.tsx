import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Minus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  BookOpen,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Course } from '../../types';
import { CircularProgress } from '../common/CircularProgress';

export const CoursesView: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse, incrementCourse } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Skill & Study');
  const [totalUnits, setTotalUnits] = useState(20);
  const [completedUnits, setCompletedUnits] = useState(0);
  const [unitName, setUnitName] = useState('Modules');

  const openAddModal = () => {
    setTitle('');
    setCategory('Skill & Study');
    setTotalUnits(20);
    setCompletedUnits(0);
    setUnitName('Modules');
    setIsAdding(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setCategory(course.category);
    setTotalUnits(course.totalUnits);
    setCompletedUnits(course.completedUnits);
    setUnitName(course.unitName);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingCourse) {
      updateCourse({
        ...editingCourse,
        title: title.trim(),
        category: category.trim(),
        totalUnits: Number(totalUnits) || 1,
        completedUnits: Math.min(Number(completedUnits) || 0, Number(totalUnits) || 1),
        unitName: unitName.trim() || 'Units',
      });
      setEditingCourse(null);
    } else {
      addCourse({
        title: title.trim(),
        category: category.trim(),
        totalUnits: Number(totalUnits) || 1,
        completedUnits: Math.min(Number(completedUnits) || 0, Number(totalUnits) || 1),
        unitName: unitName.trim() || 'Units',
      });
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl p-5 backdrop-blur-md shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-[#78CDD7]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FFFFFA] tracking-tight">
              Long-Term Courses & Disciplines
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#FFFFFA]/75 font-normal">
            Track multi-week macro goals, certifications, book volumes, and marathon progressions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#44A1A0] hover:bg-[#78CDD7] text-[#082226] text-xs font-bold transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Course</span>
        </button>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="bg-[#0D5C63]/50 border border-dashed border-[#247B7B]/60 rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <BookOpen className="w-10 h-10 text-[#78CDD7]/50" />
          <h3 className="font-bold text-base text-[#FFFFFA]">No Active Courses</h3>
          <p className="text-xs text-[#FFFFFA]/60 max-w-sm">
            Add a textbook, multi-week training cycle, or certification curriculum to track progress.
          </p>
          <button
            onClick={openAddModal}
            className="mt-2 px-4 py-2 bg-[#44A1A0] text-[#082226] font-bold text-xs rounded-lg"
          >
            Create Your First Tracker
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const pct = Math.round((course.completedUnits / (course.totalUnits || 1)) * 100);
            const isCompleted = course.completedUnits >= course.totalUnits;

            return (
              <div
                key={course.id}
                className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl p-5 backdrop-blur-sm shadow-md flex flex-col justify-between hover:border-[#44A1A0]/80 transition-all group"
              >
                {/* Course Header */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#78CDD7] bg-[#082226]/80 px-2 py-0.5 rounded border border-[#247B7B]/50">
                      {course.category}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(course)}
                        className="p-1.5 rounded hover:bg-[#103b41] text-[#FFFFFA]/60 hover:text-[#FFFFFA]"
                        title="Edit course"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="p-1.5 rounded hover:bg-[#103b41] text-[#FFFFFA]/60 hover:text-red-400"
                        title="Delete course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-[#FFFFFA] mt-2 leading-snug">
                    {course.title}
                  </h3>
                </div>

                {/* Progress Ring and Units Counter */}
                <div className="my-5 flex items-center justify-between gap-4 bg-[#082226]/60 border border-[#247B7B]/40 rounded-xl p-4">
                  <CircularProgress
                    percentage={pct}
                    size={72}
                    strokeWidth={6}
                    sublabel={isCompleted ? 'DONE' : undefined}
                  />

                  <div className="flex flex-col items-end">
                    <span className="text-xs uppercase tracking-wider text-[#FFFFFA]/60 font-semibold">
                      Milestone Count
                    </span>
                    <div className="text-2xl font-black text-[#FFFFFA] tabular-nums mt-0.5">
                      {course.completedUnits} <span className="text-sm font-normal text-[#FFFFFA]/60">/ {course.totalUnits}</span>
                    </div>
                    <span className="text-xs text-[#78CDD7] font-medium mt-0.5">
                      {course.unitName}
                    </span>
                  </div>
                </div>

                {/* Increment / Decrement Controls */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#247B7B]/40">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => incrementCourse(course.id, -1)}
                      disabled={course.completedUnits <= 0}
                      className="w-8 h-8 rounded-lg bg-[#082226] border border-[#247B7B]/60 flex items-center justify-center text-[#FFFFFA]/80 hover:text-[#FFFFFA] hover:border-[#78CDD7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Decrement 1"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => incrementCourse(course.id, 1)}
                      disabled={course.completedUnits >= course.totalUnits}
                      className="w-8 h-8 rounded-lg bg-[#082226] border border-[#247B7B]/60 flex items-center justify-center text-[#FFFFFA]/80 hover:text-[#FFFFFA] hover:border-[#78CDD7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Increment 1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-xs text-[#78CDD7] font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Mastery Reached
                    </span>
                  ) : (
                    <span className="text-xs text-[#FFFFFA]/60 tabular-nums">
                      {course.totalUnits - course.completedUnits} {course.unitName.toLowerCase()} remaining
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {(isAdding || editingCourse) && (
        <div className="fixed inset-0 z-50 bg-[#082226]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D5C63] border border-[#247B7B] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingCourse(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-[#FFFFFA]/60 hover:text-[#FFFFFA] hover:bg-[#103b41]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-[#FFFFFA] mb-4">
              {editingCourse ? 'Edit Long-Term Tracker' : 'Add New Tracker'}
            </h2>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-[#FFFFFA]/80 uppercase tracking-wider block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems Masterclass"
                  className="w-full bg-[#082226] border border-[#247B7B] rounded-lg px-3 py-2 text-sm text-[#FFFFFA] focus:outline-none focus:border-[#78CDD7]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#FFFFFA]/80 uppercase tracking-wider block mb-1">
                  Category
                </label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Engineering, Athletics, Stoicism"
                  className="w-full bg-[#082226] border border-[#247B7B] rounded-lg px-3 py-2 text-sm text-[#FFFFFA] focus:outline-none focus:border-[#78CDD7]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#FFFFFA]/80 uppercase tracking-wider block mb-1">
                    Done
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={completedUnits}
                    onChange={(e) => setCompletedUnits(Number(e.target.value))}
                    className="w-full bg-[#082226] border border-[#247B7B] rounded-lg px-3 py-2 text-sm text-[#FFFFFA] focus:outline-none focus:border-[#78CDD7]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#FFFFFA]/80 uppercase tracking-wider block mb-1">
                    Total
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={totalUnits}
                    onChange={(e) => setTotalUnits(Number(e.target.value))}
                    className="w-full bg-[#082226] border border-[#247B7B] rounded-lg px-3 py-2 text-sm text-[#FFFFFA] focus:outline-none focus:border-[#78CDD7]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#FFFFFA]/80 uppercase tracking-wider block mb-1">
                    Unit Name
                  </label>
                  <input
                    type="text"
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    placeholder="Modules"
                    className="w-full bg-[#082226] border border-[#247B7B] rounded-lg px-3 py-2 text-sm text-[#FFFFFA] focus:outline-none focus:border-[#78CDD7]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#247B7B]/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingCourse(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#FFFFFA]/70 hover:text-[#FFFFFA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#44A1A0] hover:bg-[#78CDD7] text-[#082226] font-bold text-xs rounded-lg transition-colors"
                >
                  {editingCourse ? 'Save Changes' : 'Create Tracker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
