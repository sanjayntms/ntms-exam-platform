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
      <p className="text-base text-slate-200 leading-relaxed">{content.prompt}</p>

      <div className="space-y-4 bg-slate-900/60 p-6 rounded-xl border border-slate-800">
        {content.dropdowns?.map((d: any) => (
          <div key={d.id} className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase text-slate-400 font-mono">{d.id}</label>
            <select
              value={userDropdowns[d.id] || ''}
              onChange={(e) => handleSelect(d.id, e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 focus:border-blue-500 focus:outline-none font-medium"
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
