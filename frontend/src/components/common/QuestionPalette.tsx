import React from 'react';
import { Bookmark, CheckCircle2 } from 'lucide-react';
import { useExamSession } from '../../context/ExamSessionContext';

export const QuestionPalette: React.FC = () => {
  const { flatQuestions, currentQuestionIndex, setCurrentQuestionIndex, questionStates } = useExamSession();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
        Question Navigator ({flatQuestions.length} Questions)
      </div>

      <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
        {flatQuestions.map((q, idx) => {
          const state = questionStates[q.id];
          const isAnswered = state?.answer !== null && state?.answer !== undefined;
          const isMarked = state?.isMarkedForReview;
          const isCurrent = currentQuestionIndex === idx;

          let btnClass = 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500';
          if (isCurrent) {
            btnClass = 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500/50 font-bold';
          } else if (isMarked && isAnswered) {
            btnClass = 'bg-amber-600/30 text-amber-300 border-amber-500/50';
          } else if (isMarked) {
            btnClass = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
          } else if (isAnswered) {
            btnClass = 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40';
          }

          return (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`relative h-10 rounded-lg text-xs font-mono font-medium border flex items-center justify-center transition-all ${btnClass}`}
            >
              <span>{idx + 1}</span>
              {isMarked && <Bookmark className="w-3 h-3 absolute top-1 right-1 text-amber-400 fill-amber-400" />}
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Bookmark className="w-2 h-2 text-amber-400 fill-amber-400" />
          </div>
          <span>Marked for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-600 border border-blue-400" />
          <span>Current Question</span>
        </div>
      </div>
    </div>
  );
};
