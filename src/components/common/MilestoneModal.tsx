import React from 'react';
import { Flame, Trophy, CheckCircle } from 'lucide-react';

interface MilestoneModalProps {
  days: number | null;
  onClose: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({ days, onClose }) => {
  if (!days) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1B0F03]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#4D2A00] border border-[#F2A900]/80 rounded-2xl w-full max-w-sm p-6 sm:p-7 shadow-2xl relative text-center flex flex-col items-center">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#F2A900]/25 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-[#1B0F03] border border-[#F2A900] flex items-center justify-center mb-4 shadow-lg">
          <Flame className="w-10 h-10 text-[#F2A900] animate-bounce" />
        </div>

        <span className="text-xs uppercase font-extrabold tracking-widest text-[#F2A900] mb-1">
          Milestone Unlocked
        </span>

        <h2 className="text-3xl font-black text-[#F9E6A8] tracking-tight">
          {days} Days of Discipline
        </h2>

        <p className="mt-2 text-xs text-[#F9E6A8]/80 leading-relaxed max-w-xs">
          Consistency is the rare filter. You showed up regardless of mood, friction, or fatigue.
          The standard has been raised.
        </p>

        <div className="my-4 py-2 px-4 bg-[#1B0F03] border border-[#6E3B00] rounded-xl flex items-center gap-3 text-xs text-[#F9E6A8]">
          <Trophy className="w-4 h-4 text-[#F2A900]" />
          <span>Badge added to permanent record</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#F2A900] hover:bg-[#CC6F00] text-[#1B0F03] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Continue The Standard</span>
        </button>
      </div>
    </div>
  );
};
