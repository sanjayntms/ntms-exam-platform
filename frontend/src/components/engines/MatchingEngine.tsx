import React from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';

export const MatchingEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const qState = questionStates[question.id] || {};
  const content = JSON.parse(question.content || '{}');
  const userPairs = qState.answer?.pairs || {};

  const handleMatch = (item: string, target: string) => {
    updateQuestionAnswer(question.id, {
      pairs: {
        ...userPairs,
        [item]: target,
      },
    });
  };

  const targets = Array.from(new Set(content.pairs?.map((p: any) => p.target)));

  return (
    <div className="space-y-6">
      <p className="text-base font-semibold text-slate-900 leading-relaxed border-b border-slate-200 pb-3">{content.prompt}</p>

      <div className="space-y-3 bg-slate-50 p-6 rounded border border-slate-300">
        {content.pairs?.map((pair: any) => (
          <div key={pair.item} className="grid grid-cols-12 gap-4 items-center bg-white p-3.5 rounded border border-slate-300 shadow-sm">
            <div className="col-span-5 text-sm font-bold text-slate-800">{pair.item}</div>
            <div className="col-span-2 text-center text-xs font-mono text-slate-500">➜</div>
            <div className="col-span-5">
              <select
                value={userPairs[pair.item] || ''}
                onChange={(e) => handleMatch(pair.item, e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-semibold text-slate-900 focus:border-ntms-blue focus:outline-none"
              >
                <option value="">-- Select Target Match --</option>
                {targets.map((t: any) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
