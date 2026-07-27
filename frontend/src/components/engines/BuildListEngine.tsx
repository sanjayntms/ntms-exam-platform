import React, { useState } from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';
import { Plus, Trash2 } from 'lucide-react';

export const BuildListEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const qState = questionStates[question.id] || {};
  const content = JSON.parse(question.content || '{}');
  const [targetSequence, setTargetSequence] = useState<string[]>(qState.answer?.sequence || []);

  const add = (item: string) => {
    const updated = [...targetSequence, item];
    setTargetSequence(updated);
    updateQuestionAnswer(question.id, { sequence: updated });
  };

  const remove = (idx: number) => {
    const updated = targetSequence.filter((_, i) => i !== idx);
    setTargetSequence(updated);
    updateQuestionAnswer(question.id, { sequence: updated });
  };

  return (
    <div className="space-y-6">
      <p className="text-base text-slate-200 leading-relaxed">{content.prompt}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Answer Pool */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Available Principles Bank</div>
          {content.pool?.map((item: string) => (
            <button
              key={item}
              type="button"
              onClick={() => add(item)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-left text-xs font-medium text-slate-300 hover:border-blue-500 hover:text-white transition-all"
            >
              <span>{item}</span>
              <Plus className="w-4 h-4 text-blue-400" />
            </button>
          ))}
        </div>

        {/* Selected Ordered Sequence */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Constructed Sequence ({targetSequence.length})</div>
          {targetSequence.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 italic border border-dashed border-slate-800 rounded-lg">
              Click elements from the bank on the left to build sequence
            </div>
          ) : (
            targetSequence.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-blue-950/40 border border-blue-600/40 text-xs text-blue-200">
                <span className="font-mono font-bold mr-2">{idx + 1}.</span>
                <span className="flex-1">{item}</span>
                <button type="button" onClick={() => remove(idx)} className="text-slate-400 hover:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
