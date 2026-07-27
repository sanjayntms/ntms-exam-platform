import React, { useState } from 'react';
import { useExamSession } from '../context/ExamSessionContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Timer } from '../components/common/Timer';
import { QuestionPalette } from '../components/common/QuestionPalette';
import { CalculatorModal } from '../components/common/CalculatorModal';
import { ScratchpadModal } from '../components/common/ScratchpadModal';

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

import { Calculator, FileEdit, Bookmark, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Highlighter } from 'lucide-react';

export const ExamEnginePage: React.FC = () => {
  const navigate = useNavigate();
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

  if (!exam || flatQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-slate-300 gap-4">
        <ShieldCheck className="w-12 h-12 text-blue-500 animate-pulse" />
        <p className="text-sm">Exam session loading...</p>
        <button onClick={() => navigate('/exams')} className="text-xs text-blue-400 underline">
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

      const res = await api.post('/attempts/submit', {
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Pearson VUE / Microsoft Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono font-bold px-2 py-1 bg-blue-950 text-blue-400 border border-blue-800 rounded">
            {exam.code}
          </span>
          <h1 className="font-bold text-sm text-white tracking-tight">{exam.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleMarkForReview(currentQ.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              qState.isMarkedForReview
                ? 'bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${qState.isMarkedForReview ? 'fill-white' : ''}`} />
            <span>Mark for Review</span>
          </button>

          {exam.allowCalculator && (
            <button
              onClick={() => setCalculatorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-400" />
              <span>Calculator</span>
            </button>
          )}

          {exam.allowNotes && (
            <button
              onClick={() => setScratchpadOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
            >
              <FileEdit className="w-3.5 h-3.5 text-emerald-400" />
              <span>Notes</span>
            </button>
          )}

          <Timer />
        </div>
      </header>

      {/* Main Exam Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3 space-y-6">
          {/* Question Banner Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                Question {currentQuestionIndex + 1} of {flatQuestions.length}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Type: <strong className="text-slate-200">{currentQ.type}</strong> | Points: <strong className="text-emerald-400">{currentQ.points}</strong>
              </span>
            </div>

            <h2 className="text-lg font-bold text-white tracking-tight">{currentQ.title}</h2>

            {/* Render Active Engine */}
            <div className="pt-2">{renderQuestionEngine()}</div>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="lg:col-span-1">
          <QuestionPalette />
        </div>
      </main>

      {/* Bottom Fixed Navigation Bar */}
      <footer className="h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6 sticky bottom-0 z-30 shadow-2xl">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold text-xs transition-all border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Question
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFinalSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all border border-emerald-400/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            Finish & Submit Exam
          </button>

          <button
            onClick={() => setCurrentQuestionIndex(Math.min(flatQuestions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === flatQuestions.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 border border-blue-400/30"
          >
            Next Question
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
