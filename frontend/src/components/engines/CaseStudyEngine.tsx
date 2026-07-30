import React, { useState } from 'react';
import { Question } from '../../types';
import { FileText, Building2, Cpu, Server, HelpCircle } from 'lucide-react';
import { SingleChoiceEngine } from './SingleChoiceEngine';
import { MultipleChoiceEngine } from './MultipleChoiceEngine';
import { DragDropEngine } from './DragDropEngine';
import { TrueFalseEngine } from './TrueFalseEngine';

export const CaseStudyEngine: React.FC<{ question: Question }> = ({ question }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'business' | 'technical' | 'existing' | 'question'>('question');

  const cs = question.caseStudy;
  if (!cs) {
    // If case study object is missing, fallback to rendering the question engine directly
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return <MultipleChoiceEngine question={question} />;
      case 'DRAG_AND_DROP':
        return <DragDropEngine question={question} />;
      case 'TRUE_FALSE':
        return <TrueFalseEngine question={question} />;
      default:
        return <SingleChoiceEngine question={question} />;
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText, content: cs.overview },
    { id: 'business', label: 'Business Requirements', icon: Building2, content: cs.businessRequirements },
    { id: 'technical', label: 'Technical Requirements', icon: Cpu, content: cs.technicalRequirements },
    { id: 'existing', label: 'Existing Environment', icon: Server, content: cs.existingEnvironment },
    { id: 'question', label: 'Case Question', icon: HelpCircle, content: null },
  ];

  const renderQuestionEngine = () => {
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return <MultipleChoiceEngine question={question} />;
      case 'DRAG_AND_DROP':
        return <DragDropEngine question={question} />;
      case 'TRUE_FALSE':
        return <TrueFalseEngine question={question} />;
      default:
        return <SingleChoiceEngine question={question} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Case Study Header Banner */}
      <div className="bg-slate-900 text-white p-4 rounded border border-slate-700 flex justify-between items-center shadow">
        <div>
          <span className="text-[10px] font-mono uppercase text-sky-400 font-bold tracking-wider">Case Study Scenario</span>
          <h2 className="text-base font-bold text-white leading-tight">{cs.title}</h2>
        </div>
        <span className="text-xs font-mono bg-sky-500/20 text-sky-300 border border-sky-400/40 px-2.5 py-1 rounded">
          {question.type.replace('_', ' ')}
        </span>
      </div>

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
          renderQuestionEngine()
        )}
      </div>
    </div>
  );
};
