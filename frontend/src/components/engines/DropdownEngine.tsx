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

  const list = content.dropdowns || content.questions || content.items || [];

  return (
    <div className="space-y-6">
      {content.prompt && (
        <div className="text-base font-semibold text-slate-900 leading-relaxed border-b border-slate-200 pb-3 space-y-2">
          <p>{content.prompt}</p>
          <div className="text-xs font-semibold text-slate-500 font-mono italic">
            NOTE: Each correct selection is worth one point. Select options in the Answer Area below.
          </div>
        </div>
      )}

      {/* Official Answer Area Banner */}
      <div className="space-y-3">
        <div className="text-xs font-black uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-ntms-blue" />
          <span>Answer Area</span>
        </div>

        <div className="space-y-4 bg-slate-50 p-6 rounded border border-slate-300 shadow-sm">
          {list.map((d: any, index: number) => {
            const id = d.id || `drop_${index}`;
            const labelText = d.text || d.label || d.prompt || `Statement ${index + 1}`;
            const optionsList = d.options || d.choices || [];

            return (
              <div key={id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded border border-slate-200 shadow-xs">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2.5 md:w-1/2">
                  <span className="w-5 h-5 rounded bg-slate-800 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span>{labelText}</span>
                </label>

                <select
                  value={userDropdowns[id] || ''}
                  onChange={(e) => handleSelect(id, e.target.value)}
                  className="md:w-1/2 bg-slate-50 hover:bg-white border border-slate-300 rounded p-2.5 text-sm text-slate-900 font-semibold focus:border-ntms-navy focus:ring-2 focus:ring-ntms-blue/30 focus:outline-none shadow-sm transition-all cursor-pointer font-mono"
                >
                  <option value="" className="text-slate-400">
                    [ Select Option ]
                  </option>
                  {optionsList.map((opt: any) => {
                    const optVal = typeof opt === 'string' ? opt : opt.text || opt.label || opt.id;
                    const optText = typeof opt === 'string' ? opt : opt.text || opt.label;
                    return (
                      <option key={optVal} value={optVal}>
                        {optText}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
