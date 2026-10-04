import React, { useState, useEffect } from 'react';
import { PenLine, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDateDisplay } from '../../utils/date';

export const DailyNotesCard: React.FC = () => {
  const { selectedDateStr, selectedDateLog, updateDailyNotes } = useData();
  const [text, setText] = useState(selectedDateLog.notes || '');
  const [savedIndicator, setSavedIndicator] = useState(false);

  useEffect(() => {
    setText(selectedDateLog.notes || '');
  }, [selectedDateLog.notes, selectedDateStr]);

  const handleBlur = () => {
    if (text !== selectedDateLog.notes) {
      updateDailyNotes(text, selectedDateStr);
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 2000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="bg-[#0D5C63]/90 border border-[#247B7B]/70 rounded-xl p-5 backdrop-blur-sm shadow-md flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#082226]/80 border border-[#247B7B]/60 flex items-center justify-center">
            <PenLine className="w-4 h-4 text-[#78CDD7]" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#FFFFFA] tracking-wide">
              Daily Field Log
            </h3>
            <span className="text-[11px] text-[#FFFFFA]/60 font-medium">
              Log insights, weights, mindset, or blockers for {formatDateDisplay(selectedDateStr)}
            </span>
          </div>
        </div>

        {savedIndicator && (
          <span className="inline-flex items-center gap-1 text-[11px] text-[#78CDD7] bg-[#082226] px-2 py-0.5 rounded border border-[#247B7B]">
            <Check className="w-3 h-3" /> Saved
          </span>
        )}
      </div>

      <textarea
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        rows={3}
        placeholder="Type retrospective notes (e.g. 'Completed 5 sets squat at 100kg. Focus sprint 1 was uninterrupted. Resisted digital distraction after 9pm.')..."
        className="w-full bg-[#082226]/90 border border-[#247B7B]/60 rounded-lg p-3 text-sm text-[#FFFFFA] placeholder-[#FFFFFA]/30 focus:outline-none focus:border-[#78CDD7] transition-colors resize-none leading-relaxed"
      />

      <div className="flex items-center justify-between text-[11px] text-[#FFFFFA]/50">
        <span>Auto-saved on blur or date switch</span>
        <button
          onClick={handleBlur}
          className="text-[#78CDD7] hover:underline font-medium"
        >
          Save Log
        </button>
      </div>
    </div>
  );
};
