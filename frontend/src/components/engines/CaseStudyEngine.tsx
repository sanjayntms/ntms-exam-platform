import React, { useState } from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';
import { FileText, Building2, Cpu, Server, HelpCircle } from 'lucide-react';

export const CaseStudyEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'business' | 'technical' | 'existing' | 'question'>('overview');

  const cs = question.caseStudy;
  const content = JSON.parse(question.content || '{}');
  const qState = questionStates[question.id] || {};
  const selectedOptionId = qState.answer?.selectedOptionId;

  if (!cs) {
    return <div className="text-slate-400 text-sm">Case Study content loading...</div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText, content: cs.overview },
    { id: 'business', label: 'Business Requirements', icon: Building2, content: cs.businessRequirements },
    { id: 'technical', label: 'Technical Requirements', icon: Cpu, content: cs.technicalRequirements },
    { id: 'existing', label: 'Existing Environment', icon: Server, content: cs.existingEnvironment },
    { id: 'question', label: 'Question', icon: HelpCircle, content: null },
  ];

  return (
    <div className="space-y-4">
      {/* Case Study Tab Header */}
      <div className="flex border-b border-slate-800 overflow-x-auto bg-slate-900/80 rounded-t-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-slate-800/80'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panel Body */}
      <div className="bg-slate-900/60 p-6 rounded-b-xl border border-slate-800 min-h-[300px]">
        {activeTab !== 'question' ? (
          <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
            <h3 className="text-base font-bold text-blue-400 mb-2 capitalize">{activeTab} Details</h3>
            {tabs.find((t) => t.id === activeTab)?.content}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-base text-slate-100 font-medium">{content.prompt}</p>

            <div className="space-y-2">
              {content.options?.map((opt: any) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <label
                    key={opt.id}
                    onClick={() => updateQuestionAnswer(question.id, { selectedOptionId: opt.id })}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-white font-medium shadow-lg shadow-blue-600/10'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`cs_${question.id}`}
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{opt.text}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
