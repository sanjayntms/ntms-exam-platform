import React, { useState } from 'react';
import { Question } from '../../types';
import { FileText, Building2, Cpu, Server, Layers } from 'lucide-react';
import { SingleChoiceEngine } from './SingleChoiceEngine';
import { MultipleChoiceEngine } from './MultipleChoiceEngine';
import { DragDropEngine } from './DragDropEngine';
import { TrueFalseEngine } from './TrueFalseEngine';

export const CaseStudyEngine: React.FC<{ question: Question }> = ({ question }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'business' | 'technical' | 'existing' | 'all'>('overview');

  const cs = question.caseStudy;
  if (!cs) {
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
    { id: 'overview', label: 'Overview', icon: FileText, title: 'Overview', content: cs.overview },
    { id: 'business', label: 'Business Requirements', icon: Building2, title: 'Business Requirements', content: cs.businessRequirements },
    { id: 'technical', label: 'Technical Requirements', icon: Cpu, title: 'Technical Requirements', content: cs.technicalRequirements },
    { id: 'existing', label: 'Existing Environment', icon: Server, title: 'Existing Environment', content: cs.existingEnvironment },
    { id: 'all', label: 'All Info', icon: Layers, title: 'Complete Case Study Specification', content: null },
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
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white p-4 md:p-5 rounded border border-slate-800 flex flex-wrap justify-between items-center gap-3 shadow-md">
        <div>
          <span className="text-xs font-mono uppercase text-sky-400 font-extrabold tracking-widest block">
            Microsoft Exam Case Study Layout
          </span>
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white leading-tight mt-0.5">
            {cs.title}
          </h2>
        </div>
        <span className="text-xs md:text-sm font-mono bg-sky-500/20 text-sky-300 border border-sky-400/40 px-3 py-1.5 rounded-full font-bold">
          {question.type.replace('_', ' ')}
        </span>
      </div>

      {/* 2-Column Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN: Case Study Scenario & Requirements */}
        <div className="bg-white rounded border border-slate-300 shadow-sm flex flex-col min-h-[500px]">
          <div className="bg-slate-100 border-b border-slate-300 flex overflow-x-auto rounded-t">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs md:text-sm font-bold tracking-wide border-b-2 whitespace-nowrap transition-all ${
                    isActive
                      ? 'border-ntms-navy text-ntms-navy bg-white shadow-sm font-extrabold'
                      : 'border-transparent text-slate-600 hover:text-ntms-navy hover:bg-slate-200/70'
                  }`}
                >
                  <Icon className="w-4 h-4 text-sky-600" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-5 md:p-6 flex-1 overflow-y-auto max-h-[550px] bg-slate-50/50">
            {activeTab === 'all' ? (
              <div className="space-y-6 text-slate-900 text-base md:text-lg leading-relaxed font-medium">
                <div>
                  <h4 className="text-lg font-extrabold text-ntms-navy border-b border-slate-200 pb-1 mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-sky-600" /> Overview
                  </h4>
                  <p className="whitespace-pre-wrap">{cs.overview}</p>
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-ntms-navy border-b border-slate-200 pb-1 mb-2 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-sky-600" /> Business Requirements
                  </h4>
                  <p className="whitespace-pre-wrap">{cs.businessRequirements}</p>
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-ntms-navy border-b border-slate-200 pb-1 mb-2 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-sky-600" /> Technical Requirements
                  </h4>
                  <p className="whitespace-pre-wrap">{cs.technicalRequirements}</p>
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-ntms-navy border-b border-slate-200 pb-1 mb-2 flex items-center gap-2">
                    <Server className="w-5 h-5 text-sky-600" /> Existing Environment
                  </h4>
                  <p className="whitespace-pre-wrap">{cs.existingEnvironment}</p>
                </div>
              </div>
            ) : (
              <div className="text-slate-900 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-medium">
                <h4 className="text-lg md:text-xl font-extrabold text-ntms-navy border-b border-slate-200 pb-2 mb-4">
                  {tabs.find((t) => t.id === activeTab)?.title}
                </h4>
                {tabs.find((t) => t.id === activeTab)?.content}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Case Question & Options */}
        <div className="bg-white p-5 md:p-6 rounded border border-slate-300 shadow-sm min-h-[500px]">
          <div className="bg-sky-50 border border-sky-200 text-sky-950 p-3 rounded mb-4 font-mono text-xs font-bold flex justify-between items-center">
            <span>ACTIVE CASE QUESTION ITEM</span>
            <span className="text-ntms-navy font-extrabold">{question.code}</span>
          </div>
          {renderQuestionEngine()}
        </div>
      </div>
    </div>
  );
};
};
