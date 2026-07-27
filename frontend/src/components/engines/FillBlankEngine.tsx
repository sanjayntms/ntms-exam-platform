import React from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';

export const FillBlankEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const qState = questionStates[question.id] || {};
  const content = JSON.parse(question.content || '{}');
  const userBlanks = qState.answer?.blanks || {};

  const handleInput = (blankId: string, val: string) => {
    updateQuestionAnswer(question.id, {
      blanks: {
        ...userBlanks,
        [blankId]: val,
      },
    });
  };

  return (
    <div className="space-y-6">
      <pre className="text-base font-semibold text-slate-900 whitespace-pre-wrap font-sans leading-relaxed border-b border-slate-200 pb-3">{content.prompt}</pre>

      <div className="space-y-4 bg-slate-50 p-6 rounded border border-slate-300">
        {content.blanks?.map((b: any) => (
          <div key={b.id} className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-slate-700 font-mono">{b.id}</label>
            <input
              type="text"
              value={userBlanks[b.id] || ''}
              onChange={(e) => handleInput(b.id, e.target.value)}
              placeholder="Type answer here..."
              className="w-full bg-white border border-slate-300 rounded p-2.5 text-sm text-slate-900 font-mono font-semibold focus:border-pearson-blue focus:outline-none shadow-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
