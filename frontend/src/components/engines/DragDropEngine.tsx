import React from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';

export const DragDropEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const qState = questionStates[question.id] || {};
  const content = JSON.parse(question.content || '{}');
  const userTargets = qState.answer?.targets || {};

  const handleAssign = (targetId: string, itemId: string) => {
    updateQuestionAnswer(question.id, {
      targets: {
        ...userTargets,
        [targetId]: itemId,
      },
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-base font-semibold text-slate-900 leading-relaxed border-b border-slate-200 pb-3">{content.prompt}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Pool */}
        <div className="bg-slate-50 p-4 rounded border border-slate-300 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Available Options Pool</div>
          <div className="flex flex-wrap gap-2">
            {content.items?.map((item: any) => (
              <div key={item.id} className="bg-sky-100 border border-sky-300 text-pearson-navy px-3 py-2 rounded text-xs font-bold font-mono shadow-sm">
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Targets Drop Area */}
        <div className="bg-slate-50 p-4 rounded border border-slate-300 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Target Placeholders</div>
          {content.targets?.map((target: any) => (
            <div key={target.id} className="p-3 bg-white rounded border border-slate-300 shadow-sm space-y-2">
              <div className="text-xs font-bold text-slate-800">{target.label}</div>
              <select
                value={userTargets[target.id] || ''}
                onChange={(e) => handleAssign(target.id, e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-bold text-slate-900 focus:border-pearson-blue focus:outline-none font-mono"
              >
                <option value="">-- Select Item --</option>
                {content.items?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
