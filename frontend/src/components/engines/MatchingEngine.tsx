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
      <p className="text-base text-slate-200 leading-relaxed">{content.prompt}</p>

      <div className="space-y-3 bg-slate-900/60 p-6 rounded-xl border border-slate-800">
        {content.pairs?.map((pair: any) => (
          <div key={pair.item} className="grid grid-cols-12 gap-4 items-center bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            <div className="col-span-5 text-sm font-semibold text-slate-200">{pair.item}</div>
            <div className="col-span-2 text-center text-xs font-mono text-slate-500">➜</div>
            <div className="col-span-5">
              <select
                value={userPairs[pair.item] || ''}
                onChange={(e) => handleMatch(pair.item, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
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
