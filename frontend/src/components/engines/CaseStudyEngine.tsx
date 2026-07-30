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
      <div className="bg-slate-900 text-white p-4 md:p-5 rounded-t border border-slate-800 flex justify-between items-center shadow-md">
        <div>
          <span className="text-xs font-mono uppercase text-sky-400 font-extrabold tracking-widest">Case Study Scenario</span>
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white leading-tight mt-0.5">{cs.title}</h2>
        </div>
        <span className="text-xs md:text-sm font-mono bg-sky-500/20 text-sky-300 border border-sky-400/40 px-3 py-1.5 rounded-full font-bold">
          {question.type.replace('_', ' ')}
        </span>
      </div>

      {/* Case Study Tab Header */}
      <div className="flex border-b-2 border-slate-300 overflow-x-auto bg-slate-100 border-x border-slate-300">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-6 py-3.5 text-sm md:text-base font-extrabold tracking-wide transition-all border-b-4 whitespace-nowrap ${
                isActive
                  ? 'border-ntms-navy text-ntms-navy bg-white shadow-sm'
                  : 'border-transparent text-slate-600 hover:text-ntms-navy hover:bg-slate-200/70'
              }`}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panel Body */}
      <div className="bg-white p-6 md:p-8 rounded-b border border-slate-300 min-h-[350px] shadow-sm">
        {activeTab !== 'question' ? (
          <div className="max-w-none text-slate-900 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-medium">
            <h3 className="text-lg md:text-xl font-extrabold text-ntms-navy border-b border-slate-200 pb-2 mb-4 capitalize">
              {activeTab} Details
            </h3>
            {tabs.find((t) => t.id === activeTab)?.content}
          </div>
        ) : (
          renderQuestionEngine()
        )}
      </div>
    </div>
  );
};
