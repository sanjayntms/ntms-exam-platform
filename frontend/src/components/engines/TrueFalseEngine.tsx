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
      <p className="text-base text-slate-200 leading-relaxed">{content.prompt}</p>

      <div className="flex gap-4">
        {[true, false].map((val) => {
          const isSelected = isTrueSelected === val;
          return (
            <button
              key={String(val)}
              type="button"
              onClick={() => updateQuestionAnswer(question.id, { isTrue: val })}
              className={`flex-1 py-4 px-6 rounded-xl border text-center font-bold text-base transition-all ${
                isSelected
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
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
