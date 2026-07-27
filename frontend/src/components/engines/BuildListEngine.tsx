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
      <p className="text-base font-semibold text-slate-900 leading-relaxed border-b border-slate-200 pb-3">{content.prompt}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Answer Pool */}
        <div className="bg-slate-50 p-4 rounded border border-slate-300 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Available Principles Bank</div>
          {content.pool?.map((item: string) => (
            <button
              key={item}
              type="button"
              onClick={() => add(item)}
              className="w-full flex items-center justify-between p-3 rounded bg-white border border-slate-300 text-left text-xs font-semibold text-slate-800 hover:border-pearson-blue hover:bg-sky-50 shadow-sm transition-all"
            >
              <span>{item}</span>
              <Plus className="w-4 h-4 text-pearson-blue" />
            </button>
          ))}
        </div>

        {/* Selected Ordered Sequence */}
        <div className="bg-slate-50 p-4 rounded border border-slate-300 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Constructed Sequence ({targetSequence.length})</div>
          {targetSequence.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 italic border border-dashed border-slate-300 rounded bg-white">
              Click elements from the bank on the left to build sequence
            </div>
          ) : (
            targetSequence.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded bg-sky-100/90 border border-sky-300 text-xs font-bold text-pearson-navy shadow-sm">
                <span className="font-mono font-extrabold mr-2">{idx + 1}.</span>
                <span className="flex-1">{item}</span>
                <button type="button" onClick={() => remove(idx)} className="text-slate-500 hover:text-rose-700">
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
