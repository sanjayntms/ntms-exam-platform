import React from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';

export const SingleChoiceEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer, toggleStrikeout } = useExamSession();
  const qState = questionStates[question.id] || {};
  const content = JSON.parse(question.content || '{}');
  const selectedOptionId = qState.answer?.selectedOptionId;

  return (
    <div className="space-y-5">
      <p className="text-base font-semibold text-slate-900 leading-relaxed border-b border-slate-200 pb-3">{content.prompt}</p>

      <div className="space-y-2.5">
        {content.options?.map((opt: any) => {
          const isSelected = selectedOptionId === opt.id;
          const isStruck = qState.strikeouts?.[opt.id];

          return (
            <div key={opt.id} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleStrikeout(question.id, opt.id)}
                className="text-[11px] font-bold font-mono px-2 py-1 rounded bg-slate-200 text-slate-600 hover:text-rose-700 hover:bg-rose-100 border border-slate-300 transition-colors"
                title="Strikeout option"
              >
                S
              </button>

              <label
                onClick={() => updateQuestionAnswer(question.id, { selectedOptionId: opt.id })}
                className={`flex-1 flex items-center gap-3.5 p-3.5 rounded border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-sky-100/90 border-pearson-navy text-pearson-navy font-bold shadow-sm ring-2 ring-pearson-blue/40'
                    : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-pearson-blue hover:bg-sky-50/50'
                } ${isStruck ? 'strikeout-text' : ''}`}
              >
                <input
                  type="radio"
                  name={`single_${question.id}`}
                  checked={isSelected}
                  onChange={() => {}}
                  className="w-4 h-4 text-pearson-navy focus:ring-pearson-blue"
                />
                <span className="text-sm leading-snug">{opt.text}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
