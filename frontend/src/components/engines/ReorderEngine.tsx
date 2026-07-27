import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const ReorderEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const qState = questionStates[question.id] || {};
  const content = JSON.parse(question.content || '{}');

  const [items, setItems] = useState<any[]>(() => {
    if (qState.answer?.itemOrder) {
      const orderIds: string[] = qState.answer.itemOrder;
      return orderIds.map((id) => content.items?.find((i: any) => i.id === id)).filter(Boolean);
    }
    return content.items || [];
  });

  const move = (idx: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= items.length) return;
    const updated = [...items];
    const temp = updated[idx];
    updated[idx] = updated[newIdx];
    updated[newIdx] = temp;
    setItems(updated);
    updateQuestionAnswer(question.id, { itemOrder: updated.map((i) => i.id) });
  };

  return (
    <div className="space-y-6">
      <p className="text-base text-slate-200 leading-relaxed">{content.prompt}</p>

      <div className="space-y-2 bg-slate-900/60 p-6 rounded-xl border border-slate-800">
        {items.map((item, idx) => (
          <div key={item.id} className="flex items-center justify-between bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 font-mono font-bold text-xs flex items-center justify-center border border-blue-500/30">
                {idx + 1}
              </span>
              <span className="text-sm text-slate-200">{item.text}</span>
            </div>

            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => move(idx, 'up')}
                disabled={idx === 0}
                className="p-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => move(idx, 'down')}
                disabled={idx === items.length - 1}
                className="p-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
