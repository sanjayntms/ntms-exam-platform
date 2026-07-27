import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamSession } from '../context/ExamSessionContext';
import api from '../services/api';
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
import { QuestionPalette } from '../components/common/QuestionPalette';
import { Timer } from '../components/common/Timer';
import { CalculatorModal } from '../components/common/CalculatorModal';
import { ScratchpadModal } from '../components/common/ScratchpadModal';
import { Flag, HelpCircle, Calculator, FileText, LayoutGrid, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

export const ExamEnginePage: React.FC = () => {
  const {
    exam,
    attemptId,
    flatQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    questionStates,
    toggleMarkForReview,
    setCalculatorOpen,
    setScratchpadOpen,
  } = useExamSession();

  const [showPalette, setShowPalette] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  if (!exam) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center font-mono text-xs text-slate-600">
        No active NTMS exam session loaded.
      </div>
    );
  }

  const currentQuestion = flatQuestions[currentQuestionIndex];
  const qState = currentQuestion ? questionStates[currentQuestion.id] || { isMarkedForReview: false, notes: '', answer: null, strikeouts: {} } : { isMarkedForReview: false, notes: '', answer: null, strikeouts: {} };

  const handleFinish = async () => {
    if (!attemptId) return;
    setIsSubmitting(true);
    try {
      // Build answers dictionary from questionStates
      const answersMap: Record<string, any> = {};
      Object.keys(questionStates).forEach((qId) => {
        if (questionStates[qId]?.answer) {
          answersMap[qId] = questionStates[qId].answer;
        }
      });

      // Submit attempt for final evaluation in backend ExamEngineService
      await api.post('/attempts/submit', {
        attemptId,
        answers: answersMap,
        isFinalSubmit: true,
      });

      navigate(`/results/${attemptId}`);
    } catch (err) {
      console.error('Error submitting exam attempt:', err);
      navigate(`/results/${attemptId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEngine = () => {
    if (!currentQuestion) return null;
    switch (currentQuestion.type) {
      case 'SINGLE_CHOICE':
        return <SingleChoiceEngine question={currentQuestion} />;
      case 'MULTIPLE_CHOICE':
        return <MultipleChoiceEngine question={currentQuestion} />;
      case 'TRUE_FALSE':
        return <TrueFalseEngine question={currentQuestion} />;
      case 'DROPDOWN':
        return <DropdownEngine question={currentQuestion} />;
      case 'FILL_IN_BLANK':
        return <FillBlankEngine question={currentQuestion} />;
      case 'MATCHING':
        return <MatchingEngine question={currentQuestion} />;
      case 'DRAG_AND_DROP':
        return <DragDropEngine question={currentQuestion} />;
      case 'REORDER':
        return <ReorderEngine question={currentQuestion} />;
      case 'BUILD_LIST':
        return <BuildListEngine question={currentQuestion} />;
      case 'HOTSPOT':
        return <HotspotEngine question={currentQuestion} />;
      case 'CASE_STUDY':
        return <CaseStudyEngine question={currentQuestion} />;
      case 'SIMULATION':
        return <SimulationEngine question={currentQuestion} />;
      case 'LAB':
        return <LabEngine question={currentQuestion} />;
      case 'CODE_EDITOR':
        return <CodeEditorEngine question={currentQuestion} />;
      case 'ESSAY':
        return <EssayEngine question={currentQuestion} />;
      default:
        return <SingleChoiceEngine question={currentQuestion} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans text-slate-900 select-none">
      {/* Top Header Bar */}
      <header className="bg-ntms-navy text-white px-6 py-3 border-b-2 border-ntms-blue flex items-center justify-between shadow">
        <div className="flex items-center gap-4">
          <span className="font-black tracking-wider text-base text-sky-300">NTMS</span>
          <div className="h-4 w-px bg-slate-600" />
          <div>
            <h1 className="font-bold text-sm leading-tight text-white">{exam.title}</h1>
            <span className="text-[11px] text-slate-300 font-mono">
              Candidate: Alex Mercer (Candidate) | ID: NTMS-894210
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="text-xs text-slate-300 hover:text-white flex items-center gap-1">
            <HelpCircle className="w-4 h-4" /> Help
          </button>
          <Timer />
        </div>
      </header>

      {/* Action Toolbar */}
      <div className="bg-slate-200 border-b border-slate-300 px-6 py-2 flex justify-between items-center text-xs font-semibold">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => currentQuestion && toggleMarkForReview(currentQuestion.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border transition-all ${
              qState.isMarkedForReview
                ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Mark for Review</span>
          </button>

          <button
            type="button"
            onClick={() => setCalculatorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all"
          >
            <Calculator className="w-3.5 h-3.5 text-ntms-blue" />
            <span>Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setScratchpadOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>Scratchpad</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPalette(!showPalette)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-ntms-navy" />
            <span>Question Map</span>
          </button>
        </div>

        <div className="font-mono text-xs text-slate-700 font-bold">
          Question <strong className="text-ntms-navy">{currentQuestionIndex + 1}</strong> of {flatQuestions.length}
        </div>
      </div>

      {/* Main Question Display Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 flex gap-6 relative">
        {/* Main Item Canvas */}
        <main className="flex-1 bg-white border border-slate-300 rounded shadow-sm p-8 flex flex-col justify-between min-h-[520px]">
          <div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-6">
              <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">
                QUESTION {currentQuestionIndex + 1} (CODE: {currentQuestion?.code})
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span>Type: <strong className="text-slate-800 font-extrabold">{currentQuestion?.type}</strong></span>
                <span>Points: <strong className="text-slate-800 font-extrabold">{currentQuestion?.points}</strong></span>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">{currentQuestion?.title}</h2>
              {renderEngine()}
            </div>
          </div>
        </main>

        {/* Slide-out Question Item Map */}
        {showPalette && (
          <aside className="w-80 bg-white border border-slate-300 rounded p-4 shadow-lg shrink-0">
            <QuestionPalette />
          </aside>
        )}
      </div>

      {/* Footer Navigation Controls */}
      <footer className="bg-ntms-navy text-white px-6 py-3 border-t-2 border-ntms-blue flex items-center justify-between shadow">
        <button
          type="button"
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-1.5 px-5 py-2 rounded bg-ntms-blue hover:bg-ntms-hoverBlue disabled:opacity-30 disabled:hover:bg-ntms-blue text-white font-bold text-xs shadow transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowPalette(!showPalette)}
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 transition-all"
          >
            Item Map
          </button>

          {currentQuestionIndex < flatQuestions.length - 1 && (
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex(Math.min(flatQuestions.length - 1, currentQuestionIndex + 1))}
              className="flex items-center gap-1.5 px-5 py-2 rounded bg-ntms-blue hover:bg-ntms-hoverBlue text-white font-bold text-xs shadow transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowEndConfirm(true)}
            className="px-5 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow transition-all"
          >
            End Exam / Submit
          </button>
        </div>
      </footer>

      {/* Calculator & Scratchpad Modals */}
      <CalculatorModal />
      <ScratchpadModal />

      {/* End Exam Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded border border-slate-300 max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center gap-3 text-amber-600 border-b border-slate-200 pb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold">Submit NTMS Exam Attempt?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to finish and submit your exam attempt? Your submitted answers will be evaluated to generate your official certification score report.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEndConfirm(false)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs"
              >
                Return to Exam
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={isSubmitting}
                className="px-5 py-2 bg-ntms-navy hover:bg-ntms-hoverBlue disabled:opacity-50 text-white rounded font-bold text-xs shadow flex items-center gap-2"
              >
                {isSubmitting ? 'Evaluating Score...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
