import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showText?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 76,
  strokeWidth = 6,
  label,
  sublabel,
  showText = true,
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#331C00"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F2A900"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-out"
            style={{
              filter: clamped > 0 ? 'drop-shadow(0 0 5px rgba(242, 169, 0, 0.55))' : 'none',
            }}
          />
        </svg>
        {showText && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className="font-bold tabular-nums text-[#F9E6A8]"
              style={{ fontSize: size <= 64 ? '0.85rem' : size <= 90 ? '1.15rem' : '1.75rem' }}
            >
              {clamped}%
            </span>
            {sublabel && (
              <span className="text-[10px] text-[#F2A900] tracking-wider uppercase font-semibold">
                {sublabel}
              </span>
            )}
          </div>
        )}
      </div>
      {label && <span className="mt-1 text-xs text-[#F9E6A8]/80 font-medium">{label}</span>}
    </div>
  );
};
