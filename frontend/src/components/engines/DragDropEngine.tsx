import React, { useState } from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';
import { Move, CheckCircle2, RotateCcw } from 'lucide-react';

export const DragDropEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const qState = questionStates[question.id] || {};
  const content = JSON.parse(question.content || '{}');
  const userTargets: Record<string, string> = qState.answer?.targets || {};

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const handleAssign = (targetId: string, itemId: string) => {
    updateQuestionAnswer(question.id, {
      targets: {
        ...userTargets,
        [targetId]: itemId,
      },
    });
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItemId(itemId);
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (itemId) {
      handleAssign(targetId, itemId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleResetTarget = (targetId: string) => {
    const updated = { ...userTargets };
    delete updated[targetId];
    updateQuestionAnswer(question.id, { targets: updated });
  };

  return (
    <div className="space-y-6">
      <p className="text-base font-semibold text-slate-900 leading-relaxed border-b border-slate-200 pb-3">{content.prompt}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Drag Pool */}
        <div className="bg-slate-50 p-4 rounded border border-slate-300 space-y-3 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-pearson-navy font-mono flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-pearson-blue" /> Drag Items Pool
            </span>
            <span className="text-[10px] text-slate-500">Drag to target target on right</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {content.items?.map((item: any) => {
              const isAssigned = Object.values(userTargets).includes(item.id);
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  className={`p-3 rounded border text-xs font-bold font-mono cursor-grab active:cursor-grabbing transition-all flex items-center justify-between shadow-sm ${
                    isAssigned
                      ? 'bg-slate-200 border-slate-300 text-slate-500 opacity-60'
                      : 'bg-white border-sky-300 text-pearson-navy hover:border-pearson-blue hover:shadow'
                  }`}
                >
                  <span>{item.label}</span>
                  <Move className="w-3.5 h-3.5 text-slate-400" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Target Drop Zone */}
        <div className="bg-slate-50 p-4 rounded border border-slate-300 space-y-3 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-pearson-navy font-mono border-b border-slate-200 pb-2">
            Target Drop Placeholders
          </div>

          <div className="space-y-3">
            {content.targets?.map((target: any) => {
              const assignedItemId = userTargets[target.id];
              const assignedItem = content.items?.find((i: any) => i.id === assignedItemId);

              return (
                <div
                  key={target.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, target.id)}
                  className={`p-3 rounded border transition-all ${
                    assignedItem
                      ? 'bg-sky-100/90 border-pearson-navy shadow-sm'
                      : 'bg-white border-dashed border-slate-400 hover:border-pearson-blue'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-800 mb-1 flex justify-between items-center">
                    <span>{target.label}</span>
                    {assignedItem && (
                      <button
                        type="button"
                        onClick={() => handleResetTarget(target.id)}
                        className="text-slate-500 hover:text-rose-700"
                        title="Clear target assignment"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {assignedItem ? (
                    <div className="p-2 bg-white rounded border border-pearson-blue text-xs font-bold font-mono text-pearson-navy flex items-center justify-between">
                      <span>{assignedItem.label}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  ) : (
                    <select
                      value={userTargets[target.id] || ''}
                      onChange={(e) => handleAssign(target.id, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-bold text-slate-700 focus:border-pearson-blue focus:outline-none font-mono"
                    >
                      <option value="">-- Drag item here or select --</option>
                      {content.items?.map((item: any) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
