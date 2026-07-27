import React from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';

export const SingleChoiceEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer, toggleStrikeout } = useExamSession();
  const qState = questionStates[question.id] || {};
  const content = JSON.parse(question.content || '{}');
  const selectedOptionId = qState.answer?.selectedOptionId;

  return (
    <div className="space-y-4">
      <p className="text-base text-slate-200 leading-relaxed">{content.prompt}</p>

      <div className="space-y-2">
        {content.options?.map((opt: any) => {
          const isSelected = selectedOptionId === opt.id;
          const isStruck = qState.strikeouts?.[opt.id];

          return (
            <div key={opt.id} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleStrikeout(question.id, opt.id)}
                className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700"
                title="Strikeout option"
              >
                S
              </button>

              <label
                onClick={() => updateQuestionAnswer(question.id, { selectedOptionId: opt.id })}
                className={`flex-1 flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white font-medium shadow-lg shadow-blue-600/10'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                } ${isStruck ? 'strikeout-text' : ''}`}
              >
                <input
                  type="radio"
                  name={`single_${question.id}`}
                  checked={isSelected}
                  onChange={() => {}}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{opt.text}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
