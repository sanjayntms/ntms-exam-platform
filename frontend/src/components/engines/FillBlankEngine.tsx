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
      <pre className="text-base text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">{content.prompt}</pre>

      <div className="space-y-4 bg-slate-900/60 p-6 rounded-xl border border-slate-800">
        {content.blanks?.map((b: any) => (
          <div key={b.id} className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase text-slate-400 font-mono">{b.id}</label>
            <input
              type="text"
              value={userBlanks[b.id] || ''}
              onChange={(e) => handleInput(b.id, e.target.value)}
              placeholder="Type answer here..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
