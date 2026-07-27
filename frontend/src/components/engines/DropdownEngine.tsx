import React from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';

export const DropdownEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const qState = questionStates[question.id] || {};
  const content = JSON.parse(question.content || '{}');
  const userDropdowns = qState.answer?.dropdowns || {};

  const handleSelect = (dropdownId: string, val: string) => {
    updateQuestionAnswer(question.id, {
      dropdowns: {
        ...userDropdowns,
        [dropdownId]: val,
      },
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-base font-semibold text-slate-900 leading-relaxed border-b border-slate-200 pb-3">{content.prompt}</p>

      <div className="space-y-4 bg-slate-50 p-6 rounded border border-slate-300">
        {content.dropdowns?.map((d: any) => (
          <div key={d.id} className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-slate-700 font-mono">{d.id}</label>
            <select
              value={userDropdowns[d.id] || ''}
              onChange={(e) => handleSelect(d.id, e.target.value)}
              className="w-full bg-white border border-slate-300 rounded p-2.5 text-sm text-slate-900 font-semibold focus:border-ntms-blue focus:outline-none shadow-sm"
            >
              <option value="">-- Select Choice --</option>
              {d.options?.map((opt: string) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};
