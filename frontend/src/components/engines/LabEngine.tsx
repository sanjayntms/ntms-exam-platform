import React, { useState } from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';
import { Terminal, CheckSquare, Square } from 'lucide-react';

export const LabEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const lab = question.lab;
  const qState = questionStates[question.id] || {};

  const checklists = JSON.parse(lab?.checklists || '[]');
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(qState.answer?.completedTasks || {});

  if (!lab) {
    return <div className="text-slate-500">Lab environment loading...</div>;
  }

  const toggleTask = (taskId: string) => {
    const updated = {
      ...completedTasks,
      [taskId]: !completedTasks[taskId],
    };
    setCompletedTasks(updated);
    updateQuestionAnswer(question.id, { completedTasks: updated });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded border border-slate-300 space-y-2">
        <h3 className="font-bold text-sm text-pearson-navy flex items-center gap-2">
          <Terminal className="w-4 h-4 text-pearson-blue" />
          {lab.title}
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">{lab.scenario}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lab Task Checklist */}
        <div className="bg-slate-50 p-5 rounded border border-slate-300 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Hands-on Task Checklist</div>
          {checklists.map((item: any) => {
            const isDone = !!completedTasks[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleTask(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded border text-left text-xs transition-all ${
                  isDone
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-sm'
                    : 'bg-white border-slate-300 text-slate-800 hover:border-pearson-blue'
                }`}
              >
                {isDone ? <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                <span>{item.task}</span>
              </button>
            );
          })}
        </div>

        {/* Live Lab Terminal Output */}
        <div className="bg-slate-900 border border-slate-800 rounded p-4 font-mono text-xs text-slate-200 space-y-2 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-[10px] text-slate-400 uppercase">
            <span>Terminal Shell: bash</span>
            <span className="text-emerald-400 font-bold">● Connected</span>
          </div>
          <div className="space-y-1 text-slate-300 py-2">
            <div>$ az group create --name rg-lab-01 --location eastus</div>
            <div className="text-emerald-400">✔ Resource Group rg-lab-01 created successfully.</div>
            <div>$ az appservice plan create --name asp-lab --resource-group rg-lab-01</div>
            <div className="text-emerald-400">✔ App Service Plan deployed.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
