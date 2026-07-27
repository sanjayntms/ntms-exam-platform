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
      <p className="text-base text-slate-200 leading-relaxed">{content.prompt}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Pool */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Available Options Pool</div>
          <div className="flex flex-wrap gap-2">
            {content.items?.map((item: any) => (
              <div key={item.id} className="bg-blue-600/20 border border-blue-500/40 text-blue-300 px-3 py-2 rounded-lg text-xs font-medium font-mono">
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Targets Drop Area */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Target Placeholders</div>
          {content.targets?.map((target: any) => (
            <div key={target.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="text-xs font-medium text-slate-300">{target.label}</div>
              <select
                value={userTargets[target.id] || ''}
                onChange={(e) => handleAssign(target.id, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-blue-500 focus:outline-none font-mono"
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
