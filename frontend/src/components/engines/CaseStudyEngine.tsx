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
    return <div className="text-slate-500 text-sm">Case Study content loading...</div>;
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
      <div className="flex border-b border-slate-300 overflow-x-auto bg-slate-100 rounded-t border-t border-x border-slate-300">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-ntms-navy text-ntms-navy bg-white shadow-sm'
                  : 'border-transparent text-slate-600 hover:text-ntms-navy hover:bg-slate-200/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panel Body */}
      <div className="bg-white p-6 rounded-b border border-slate-300 min-h-[300px] shadow-sm">
        {activeTab !== 'question' ? (
          <div className="prose max-w-none text-slate-900 text-sm leading-relaxed whitespace-pre-wrap">
            <h3 className="text-base font-bold text-ntms-navy mb-2 capitalize">{activeTab} Details</h3>
            {tabs.find((t) => t.id === activeTab)?.content}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-base font-semibold text-slate-900 border-b border-slate-200 pb-3">{content.prompt}</p>

            <div className="space-y-2">
              {content.options?.map((opt: any) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <label
                    key={opt.id}
                    onClick={() => updateQuestionAnswer(question.id, { selectedOptionId: opt.id })}
                    className={`flex items-center gap-3 p-3.5 rounded border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-100/90 border-ntms-navy text-ntms-navy font-bold shadow-sm ring-2 ring-ntms-blue/40'
                        : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-ntms-blue hover:bg-sky-50/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`cs_${question.id}`}
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 text-ntms-navy focus:ring-ntms-blue"
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
