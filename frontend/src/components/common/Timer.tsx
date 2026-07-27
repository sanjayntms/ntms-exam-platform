import React from 'react';
import { Clock } from 'lucide-react';
import { useExamSession } from '../../context/ExamSessionContext';

export const Timer: React.FC = () => {
  const { timeRemainingSeconds } = useExamSession();

  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;

  const isLowTime = minutes < 10;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold ${
      isLowTime ? 'bg-rose-950/80 border-rose-600/60 text-rose-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-emerald-400'
    }`}>
      <Clock className="w-4 h-4" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
