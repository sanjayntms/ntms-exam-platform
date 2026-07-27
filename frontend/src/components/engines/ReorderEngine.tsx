import React, { useState } from 'react';
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
      <p className="text-base font-semibold text-slate-900 leading-relaxed border-b border-slate-200 pb-3">{content.prompt}</p>

      <div className="space-y-2 bg-slate-50 p-6 rounded border border-slate-300">
        {items.map((item, idx) => (
          <div key={item.id} className="flex items-center justify-between bg-white p-3.5 rounded border border-slate-300 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded bg-pearson-navy text-white font-mono font-bold text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="text-sm font-semibold text-slate-800">{item.text}</span>
            </div>

            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => move(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 rounded bg-slate-100 border border-slate-300 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => move(idx, 'down')}
                disabled={idx === items.length - 1}
                className="p-1.5 rounded bg-slate-100 border border-slate-300 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
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
