import React, { useState } from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';
import { LayoutGrid, Server, Shield, CheckCircle2, Play } from 'lucide-react';

export const SimulationEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const sim = question.simulation;
  const qState = questionStates[question.id] || {};

  const [vmName, setVmName] = useState<string>(qState.answer?.vmName || '');
  const [resourceGroup, setResourceGroup] = useState<string>(qState.answer?.rg || '');
  const [openPort80, setOpenPort80] = useState<boolean>(qState.answer?.port80 || false);
  const [openPort443, setOpenPort443] = useState<boolean>(qState.answer?.port443 || false);

  if (!sim) {
    return <div className="text-slate-400">Simulation environment loading...</div>;
  }

  const handleApply = () => {
    updateQuestionAnswer(question.id, {
      vmName,
      rg: resourceGroup,
      port80: openPort80,
      port443: openPort443,
      inboundPorts: [openPort80 ? 80 : null, openPort443 ? 443 : null].filter(Boolean),
    });
  };

  return (
    <div className="space-y-4">
      {/* Simulation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-600/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs font-mono">
            AZ
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">{sim.title}</h3>
            <span className="text-xs text-sky-400 font-mono">Interactive Azure Portal Simulation Mode</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleApply}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/20"
        >
          <CheckCircle2 className="w-4 h-4" />
          Apply & Save Portal State
        </button>
      </div>

      {/* Interactive Mock Azure Portal Interface */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-4">
            <span className="font-bold text-blue-400">Microsoft Azure</span>
            <span className="text-slate-500">|</span>
            <span>Virtual Machine Creation Wizard</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
            <Play className="w-3 h-3 fill-emerald-400" /> Interactive Mode
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Instance Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Virtual Machine Name</label>
                <input
                  type="text"
                  value={vmName}
                  onChange={(e) => setVmName(e.target.value)}
                  placeholder="e.g. vm-app-01"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-100 font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Resource Group</label>
                <select
                  value={resourceGroup}
                  onChange={(e) => setResourceGroup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-100 font-mono focus:border-blue-500 focus:outline-none"
                >
                  <option value="">-- Select Resource Group --</option>
                  <option value="rg-prod">rg-prod</option>
                  <option value="rg-dev">rg-dev</option>
                  <option value="rg-staging">rg-staging</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Inbound Port Rules (NSG)</h4>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={openPort80}
                  onChange={(e) => setOpenPort80(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>HTTP (Port 80)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={openPort443}
                  onChange={(e) => setOpenPort443(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>HTTPS (Port 443)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
