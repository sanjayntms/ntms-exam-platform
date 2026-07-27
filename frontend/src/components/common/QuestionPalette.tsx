import React from 'react';
import { useExamSession } from '../../context/ExamSessionContext';

export const QuestionPalette: React.FC = () => {
  const { flatQuestions, currentQuestionIndex, setCurrentQuestionIndex, questionStates } = useExamSession();

  return (
    <div className="space-y-4 font-sans">
      <div className="font-extrabold text-xs text-ntms-navy uppercase tracking-wider border-b border-slate-200 pb-2">
        NTMS Item Map ({flatQuestions.length} Questions)
      </div>

      <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
        {flatQuestions.map((q, idx) => {
          const isCurrent = idx === currentQuestionIndex;
          const qState = questionStates[q.id] || {};
          const isMarked = qState.isMarkedForReview;
          const hasAnswer = qState.answer !== undefined && qState.answer !== null && Object.keys(qState.answer).length > 0;

          let btnClass = 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-sky-50 hover:border-ntms-blue font-semibold';

          if (isCurrent) {
            btnClass = 'bg-ntms-navy text-white border-ntms-navy ring-2 ring-ntms-blue font-extrabold';
          } else if (isMarked) {
            btnClass = 'bg-amber-100 text-amber-900 border-amber-400 font-extrabold';
          } else if (hasAnswer) {
            btnClass = 'bg-sky-100 text-ntms-navy border-sky-300 font-bold';
          }

          return (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`h-9 rounded border text-xs flex items-center justify-center relative transition-all ${btnClass}`}
            >
              <span>{idx + 1}</span>
              {isMarked && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-200 space-y-1.5 text-[11px] text-slate-600 font-semibold">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-ntms-navy border border-ntms-navy" />
          <span>Current Question</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-sky-100 border border-sky-300" />
          <span>Answered Item</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-400" />
          <span>Marked for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300" />
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
};
