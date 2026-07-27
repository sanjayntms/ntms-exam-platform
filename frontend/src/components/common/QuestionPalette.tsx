import React from 'react';
import { Bookmark } from 'lucide-react';
import { useExamSession } from '../../context/ExamSessionContext';

export const QuestionPalette: React.FC = () => {
  const { flatQuestions, currentQuestionIndex, setCurrentQuestionIndex, questionStates } = useExamSession();

  return (
    <div className="bg-white border border-slate-300 rounded p-4 space-y-4 shadow-sm">
      <div className="font-extrabold text-xs text-pearson-navy uppercase tracking-wider border-b border-slate-200 pb-2">
        Pearson VUE Item Map ({flatQuestions.length} Questions)
      </div>

      <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
        {flatQuestions.map((q, idx) => {
          const state = questionStates[q.id];
          const isAnswered = state?.answer !== null && state?.answer !== undefined;
          const isMarked = state?.isMarkedForReview;
          const isCurrent = currentQuestionIndex === idx;

          let btnClass = 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100';
          if (isCurrent) {
            btnClass = 'bg-pearson-navy text-white border-pearson-navy ring-2 ring-pearson-blue font-extrabold';
          } else if (isMarked && isAnswered) {
            btnClass = 'bg-amber-100 text-amber-900 border-amber-400 font-bold';
          } else if (isMarked) {
            btnClass = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
          } else if (isAnswered) {
            btnClass = 'bg-sky-100 text-pearson-navy border-sky-300 font-bold';
          }

          return (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`relative h-9 rounded text-xs font-mono border flex items-center justify-center transition-all ${btnClass}`}
            >
              <span>{idx + 1}</span>
              {isMarked && <Bookmark className="w-3 h-3 absolute top-0.5 right-0.5 text-amber-600 fill-amber-600" />}
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-200 space-y-1.5 text-[11px] text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-sky-100 border border-sky-300" />
          <span>Answered Item</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-400 flex items-center justify-center">
            <Bookmark className="w-2.5 h-2.5 text-amber-600 fill-amber-600" />
          </div>
          <span>Marked for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-pearson-navy border border-pearson-navy" />
          <span>Current Active Question</span>
        </div>
      </div>
    </div>
  );
};
