import React, { useState } from 'react';
import { useExamSession } from '../context/ExamSessionContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Timer } from '../components/common/Timer';
import { QuestionPalette } from '../components/common/QuestionPalette';
import { CalculatorModal } from '../components/common/CalculatorModal';
import { ScratchpadModal } from '../components/common/ScratchpadModal';
import { useAuth } from '../context/AuthContext';

// Question Type Engines
import { SingleChoiceEngine } from '../components/engines/SingleChoiceEngine';
import { MultipleChoiceEngine } from '../components/engines/MultipleChoiceEngine';
import { TrueFalseEngine } from '../components/engines/TrueFalseEngine';
import { DropdownEngine } from '../components/engines/DropdownEngine';
import { FillBlankEngine } from '../components/engines/FillBlankEngine';
import { MatchingEngine } from '../components/engines/MatchingEngine';
import { DragDropEngine } from '../components/engines/DragDropEngine';
import { ReorderEngine } from '../components/engines/ReorderEngine';
import { BuildListEngine } from '../components/engines/BuildListEngine';
import { HotspotEngine } from '../components/engines/HotspotEngine';
import { CaseStudyEngine } from '../components/engines/CaseStudyEngine';
import { SimulationEngine } from '../components/engines/SimulationEngine';
import { LabEngine } from '../components/engines/LabEngine';
import { CodeEditorEngine } from '../components/engines/CodeEditorEngine';
import { EssayEngine } from '../components/engines/EssayEngine';

import {
  Calculator,
  FileEdit,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Monitor,
  HelpCircle,
  Grid,
  Highlighter,
} from 'lucide-react';

export const ExamEnginePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    exam,
    attemptId,
    currentQuestionIndex,
    flatQuestions,
    questionStates,
    setCurrentQuestionIndex,
    toggleMarkForReview,
    setCalculatorOpen,
    setScratchpadOpen,
  } = useExamSession();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showItemMap, setShowItemMap] = useState<boolean>(false);

  if (!exam || flatQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center text-slate-700 gap-4">
        <Monitor className="w-12 h-12 text-pearson-navy animate-pulse" />
        <p className="text-sm font-semibold">Initializing NTMS Exam Session...</p>
        <button onClick={() => navigate('/exams')} className="text-xs text-pearson-blue underline">
          Return to Exam Catalog
        </button>
      </div>
    );
  }

  const currentQ = flatQuestions[currentQuestionIndex];
  const qState = questionStates[currentQ.id] || {};

  const handleFinalSubmit = async () => {
    if (!confirm('Are you sure you want to finish and submit your exam?')) return;
    setSubmitting(true);
    try {
      const allAnswers: Record<string, any> = {};
      Object.keys(questionStates).forEach((k) => {
        if (questionStates[k]?.answer) {
          allAnswers[k] = questionStates[k].answer;
        }
      });

      await api.post('/attempts/submit', {
        attemptId,
        answers: allAnswers,
        isFinalSubmit: true,
      });

      navigate(`/results/${attemptId}`);
    } catch (err: any) {
      alert('Error submitting exam: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionEngine = () => {
    switch (currentQ.type) {
      case 'SINGLE_CHOICE':
        return <SingleChoiceEngine question={currentQ} />;
      case 'MULTIPLE_CHOICE':
        return <MultipleChoiceEngine question={currentQ} />;
      case 'TRUE_FALSE':
        return <TrueFalseEngine question={currentQ} />;
      case 'DROPDOWN':
        return <DropdownEngine question={currentQ} />;
      case 'FILL_IN_BLANK':
        return <FillBlankEngine question={currentQ} />;
      case 'MATCHING':
        return <MatchingEngine question={currentQ} />;
      case 'DRAG_AND_DROP':
        return <DragDropEngine question={currentQ} />;
      case 'REORDER':
        return <ReorderEngine question={currentQ} />;
      case 'BUILD_LIST':
        return <BuildListEngine question={currentQ} />;
      case 'HOTSPOT':
        return <HotspotEngine question={currentQ} />;
      case 'CASE_STUDY':
        return <CaseStudyEngine question={currentQ} />;
      case 'SIMULATION':
        return <SimulationEngine question={currentQ} />;
      case 'LAB':
        return <LabEngine question={currentQ} />;
      case 'CODE_EDITOR':
        return <CodeEditorEngine question={currentQ} />;
      case 'ESSAY':
        return <EssayEngine question={currentQ} />;
      default:
        return <SingleChoiceEngine question={currentQ} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-800 font-sans selection:bg-pearson-navy selection:text-white">
      {/* Pearson VUE Top Primary Header */}
      <header className="bg-pearson-navy text-white px-6 py-2.5 flex items-center justify-between border-b-2 border-pearson-blue shadow-md">
        <div className="flex items-center gap-4">
          <div className="font-extrabold text-lg tracking-wider">NTMS</div>
          <div className="h-6 w-px bg-white/20" />
          <div className="flex flex-col">
            <span className="font-bold text-sm text-white">{exam.title} ({exam.code})</span>
            <span className="text-[11px] text-slate-300">Candidate: {user?.name || 'Candidate'} | ID: NTMS-894210</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => alert('Instructions: Click Next to navigate. Mark questions for review if needed.')}
            className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white"
          >
            <HelpCircle className="w-4 h-4 text-sky-300" />
            <span>Help</span>
          </button>
          <Timer />
        </div>
      </header>

      {/* Pearson VUE Exam Action Toolbar */}
      <div className="bg-slate-200 border-b border-slate-300 px-6 py-2 flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleMarkForReview(currentQ.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-bold transition-all ${
              qState.isMarkedForReview
                ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${qState.isMarkedForReview ? 'fill-white text-white' : 'text-amber-600'}`} />
            <span>{qState.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}</span>
          </button>

          {exam.allowCalculator && (
            <button
              onClick={() => setCalculatorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
            >
              <Calculator className="w-4 h-4 text-pearson-blue" />
              <span>Calculator</span>
            </button>
          )}

          {exam.allowNotes && (
            <button
              onClick={() => setScratchpadOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
            >
              <FileEdit className="w-4 h-4 text-emerald-600" />
              <span>Scratchpad</span>
            </button>
          )}

          <button
            onClick={() => setShowItemMap(!showItemMap)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
          >
            <Grid className="w-4 h-4 text-pearson-navy" />
            <span>Question Map</span>
          </button>
        </div>

        <div className="font-mono text-xs font-bold text-slate-700">
          Question <span className="text-pearson-navy text-sm font-extrabold">{currentQuestionIndex + 1}</span> of {flatQuestions.length}
        </div>
      </div>

      {/* Main Pearson Exam Canvas Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className={showItemMap ? 'lg:col-span-3 space-y-6' : 'lg:col-span-4 space-y-6'}>
          {/* Main Question Panel */}
          <div className="bg-white border border-slate-300 rounded-md p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="text-xs font-mono font-bold text-pearson-navy uppercase tracking-wider">
                Question {currentQuestionIndex + 1} (Code: {currentQ.code})
              </span>
              <span className="text-xs font-mono text-slate-600">
                Type: <strong className="text-slate-900">{currentQ.type}</strong> | Points: <strong className="text-emerald-700">{currentQ.points}</strong>
              </span>
            </div>

            <h2 className="text-base font-bold text-slate-900 tracking-tight">{currentQ.title}</h2>

            {/* Active Question Engine */}
            <div className="pt-2">{renderQuestionEngine()}</div>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        {showItemMap && (
          <div className="lg:col-span-1">
            <QuestionPalette />
          </div>
        )}
      </main>

      {/* Pearson VUE Navigation Control Footer */}
      <footer className="bg-pearson-navy text-white px-6 py-3 flex items-center justify-between border-t-2 border-pearson-blue shadow-lg sticky bottom-0 z-30">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-5 py-2 rounded bg-white text-pearson-navy hover:bg-slate-100 disabled:opacity-40 font-bold text-xs shadow transition-all border border-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFinalSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow transition-all border border-amber-600"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            End Exam / Submit
          </button>

          <button
            onClick={() => setCurrentQuestionIndex(Math.min(flatQuestions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === flatQuestions.length - 1}
            className="flex items-center gap-2 px-6 py-2 rounded bg-pearson-blue hover:bg-pearson-hoverBlue disabled:opacity-40 text-white font-bold text-xs shadow transition-all border border-sky-400"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Modals */}
      <CalculatorModal />
      <ScratchpadModal />
    </div>
  );
};
