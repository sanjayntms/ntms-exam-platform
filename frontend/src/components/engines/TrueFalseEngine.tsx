import React from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';

export const TrueFalseEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const qState = questionStates[question.id] || {};
  const content = JSON.parse(question.content || '{}');
  const isTrueSelected = qState.answer?.isTrue;

  return (
    <div className="space-y-6">
      <p className="text-base font-semibold text-slate-900 leading-relaxed border-b border-slate-200 pb-3">{content.prompt}</p>

      <div className="flex gap-4">
        {[true, false].map((val) => {
          const isSelected = isTrueSelected === val;
          return (
            <button
              key={String(val)}
              type="button"
              onClick={() => updateQuestionAnswer(question.id, { isTrue: val })}
              className={`flex-1 py-4 px-6 rounded border text-center font-bold text-base transition-all ${
                isSelected
                  ? 'bg-ntms-navy border-ntms-darkNavy text-white shadow-md'
                  : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-sky-50 hover:border-ntms-blue'
              }`}
            >
              {val ? 'TRUE' : 'FALSE'}
            </button>
          );
        })}
      </div>
    </div>
  );
};
