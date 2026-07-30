import React from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';

export const MultipleChoiceEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer, toggleStrikeout } = useExamSession();
  const qState = questionStates[question.id] || {};
  const content = JSON.parse(question.content || '{}');
  const selectedOptionIds: string[] = qState.answer?.selectedOptionIds || [];

  const handleToggle = (id: string) => {
    const updated = selectedOptionIds.includes(id)
      ? selectedOptionIds.filter((item) => item !== id)
      : [...selectedOptionIds, id];
    updateQuestionAnswer(question.id, { selectedOptionIds: updated });
  };

  return (
    <div className="space-y-5">
      <p className="text-base md:text-lg font-bold text-slate-900 leading-relaxed border-b border-slate-200 pb-3">{content.prompt}</p>

      <div className="space-y-3">
        {content.options?.map((opt: any) => {
          const isSelected = selectedOptionIds.includes(opt.id);
          const isStruck = qState.strikeouts?.[opt.id];

          return (
            <div key={opt.id} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleStrikeout(question.id, opt.id)}
                className="text-xs font-bold font-mono px-2.5 py-1.5 rounded bg-slate-200 text-slate-600 hover:text-rose-700 hover:bg-rose-100 border border-slate-300 transition-colors"
                title="Strikeout option"
              >
                S
              </button>

              <div
                onClick={() => handleToggle(opt.id)}
                className={`flex-1 flex items-center gap-3.5 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-sky-100/90 border-ntms-navy text-ntms-navy font-bold shadow-sm ring-2 ring-ntms-blue/40'
                    : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-ntms-blue hover:bg-sky-50/50'
                } ${isStruck ? 'strikeout-text' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(opt.id)}
                  className="w-4 h-4 md:w-5 md:h-5 rounded text-ntms-navy focus:ring-ntms-blue cursor-pointer shrink-0"
                />
                <span className="text-sm md:text-base leading-snug font-medium">{opt.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
