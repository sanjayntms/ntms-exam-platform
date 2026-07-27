import React, { useState } from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';
import { Terminal, CheckSquare, Square, RefreshCw } from 'lucide-react';

export const LabEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const lab = question.lab;
  const qState = questionStates[question.id] || {};

  const checklists = JSON.parse(lab?.checklists || '[]');
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(qState.answer?.completedTasks || {});

  if (!lab) {
    return <div className="text-slate-400">Lab environment loading...</div>;
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
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
        <h3 className="font-bold text-sm text-blue-400 flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          {lab.title}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">{lab.scenario}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lab Task Checklist */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Hands-on Task Checklist</div>
          {checklists.map((item: any) => {
            const isDone = !!completedTasks[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleTask(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left text-xs transition-all ${
                  isDone
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-medium'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {isDone ? <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-500 shrink-0" />}
                <span>{item.task}</span>
              </button>
            );
          })}
        </div>

        {/* Live Lab Terminal Output */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-[10px] text-slate-500 uppercase">
            <span>Terminal Shell: bash</span>
            <span className="text-emerald-400">● Connected</span>
          </div>
          <div className="space-y-1 text-slate-400 py-2">
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
