import React from 'react';
import { Clock } from 'lucide-react';
import { useExamSession } from '../../context/ExamSessionContext';

export const Timer: React.FC = () => {
  const { timeRemainingSeconds } = useExamSession();

  const hours = Math.floor(timeRemainingSeconds / 3600);
  const minutes = Math.floor((timeRemainingSeconds % 3600) / 60);
  const seconds = timeRemainingSeconds % 60;

  const isLowTime = minutes < 10 && hours === 0;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded border font-mono text-xs font-extrabold ${
      isLowTime
        ? 'bg-rose-600 text-white border-rose-700 animate-pulse shadow'
        : 'bg-white/10 text-white border-white/20'
    }`}>
      <Clock className="w-3.5 h-3.5 text-sky-300" />
      <span>
        Time Remaining: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
