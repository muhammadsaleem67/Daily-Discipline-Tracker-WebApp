import React from 'react';
import { Flame, Trophy, Award, CheckCircle } from 'lucide-react';

interface MilestoneModalProps {
  days: number | null;
  onClose: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({ days, onClose }) => {
  if (!days) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#082226]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D5C63] border border-[#78CDD7]/80 rounded-2xl w-full max-w-sm p-6 sm:p-7 shadow-2xl relative text-center flex flex-col items-center">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#78CDD7]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-[#082226] border border-[#78CDD7] flex items-center justify-center mb-4 shadow-lg">
          <Flame className="w-10 h-10 text-[#78CDD7] animate-bounce" />
        </div>

        <span className="text-xs uppercase font-extrabold tracking-widest text-[#78CDD7] mb-1">
          Milestone Unlocked
        </span>

        <h2 className="text-3xl font-black text-[#FFFFFA] tracking-tight">
          {days} Days of Discipline
        </h2>

        <p className="mt-2 text-xs text-[#FFFFFA]/80 leading-relaxed max-w-xs">
          Consistency is the rare filter. You showed up regardless of mood, friction, or fatigue.
          The standard has been raised.
        </p>

        <div className="my-4 py-2 px-4 bg-[#082226] border border-[#247B7B] rounded-xl flex items-center gap-3 text-xs text-[#FFFFFA]">
          <Trophy className="w-4 h-4 text-[#78CDD7]" />
          <span>Badge added to permanent record</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#78CDD7] hover:bg-[#44A1A0] text-[#082226] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Continue The Standard</span>
        </button>
      </div>
    </div>
  );
};
