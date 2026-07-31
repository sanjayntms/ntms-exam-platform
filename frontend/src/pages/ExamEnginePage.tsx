import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { attemptId: urlAttemptId } = useParams();
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
    setExamSession,
  } = useExamSession();

  const [loadingAttempt, setLoadingAttempt] = useState(!exam);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [roomClosedModalMessage, setRoomClosedModalMessage] = useState<string | null>(null);
  const [showPalette, setShowPalette] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Auto-fetch exam attempt from backend if not already loaded in context (e.g. direct link or refresh)
  useEffect(() => {
    const fetchAttemptData = async () => {
      const targetAttemptId = urlAttemptId || attemptId;
      if (!targetAttemptId) {
        setLoadError('No active exam attempt ID provided.');
        setLoadingAttempt(false);
        return;
      }

      if (!exam || attemptId !== targetAttemptId) {
        try {
          setLoadingAttempt(true);
          const res = await api.get(`/attempts/${targetAttemptId}`);
          if (res.data && res.data.exam) {
            setExamSession(res.data.exam, res.data.id, res.data.answers, res.data.startedAt);
            setLoadError(null);
          } else {
            setLoadError('Failed to load exam details from attempt record.');
          }
        } catch (err: any) {
          console.error(err);
          const errMsg = err.response?.data?.error || 'Unable to load exam session from server.';
          if (err.response?.status === 403 || errMsg.includes('Closed') || errMsg.includes('Removed')) {
            setExamSession(null);
            setRoomClosedModalMessage(errMsg);
          } else {
            setLoadError(errMsg);
          }
        } finally {
          setLoadingAttempt(false);
        }
      } else {
        setLoadingAttempt(false);
      }
    };

    fetchAttemptData();
  }, [urlAttemptId, attemptId, exam]);

  // Periodic 5-second background room status check & answer autosave
  useEffect(() => {
    const targetAttemptId = urlAttemptId || attemptId;
    if (!targetAttemptId || !exam) return;

    const interval = setInterval(async () => {
      try {
        // Heartbeat check room open status
        const checkRes = await api.get(`/attempts/${targetAttemptId}`);
        if (checkRes.data && (checkRes.data.status === 'CLOSED' || checkRes.data.status === 'EXPIRED')) {
          setExamSession(null);
          setRoomClosedModalMessage('🔒 Exam Room Closed: The Administrator has closed or removed this exam room. Active exam session terminated.');
          return;
        }

        // Autosave answers
        const answersMap: Record<string, any> = {};
        let hasAnswers = false;
        Object.keys(questionStates).forEach((qId) => {
          if (questionStates[qId]?.answer !== null && questionStates[qId]?.answer !== undefined) {
            answersMap[qId] = questionStates[qId].answer;
            hasAnswers = true;
          }
        });

        if (hasAnswers) {
          await api.post('/attempts/submit', {
            attemptId: targetAttemptId,
            answers: answersMap,
            isFinalSubmit: false,
          });
        }
      } catch (err: any) {
        if (err.response?.status === 403 || err.response?.data?.error?.includes('Closed') || err.response?.data?.error?.includes('Removed')) {
          setExamSession(null);
          setRoomClosedModalMessage(err.response?.data?.error || '🔒 Exam Room Closed: This proctored exam room was closed or removed by the Administrator.');
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [urlAttemptId, attemptId, exam, questionStates]);

  if (roomClosedModalMessage) {
    return (
      <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-6 font-sans text-slate-900">
        <div className="bg-white rounded-xl border border-slate-300 max-w-lg w-full p-8 shadow-2xl space-y-5 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <AlertTriangle className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Exam Session Terminated</h2>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {roomClosedModalMessage}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setExamSession(null);
                navigate('/dashboard');
              }}
              className="w-full py-3 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded-lg font-bold text-xs shadow-lg transition-all"
            >
              Return to Candidate Dashboard ➜
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loadingAttempt) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center font-mono text-xs text-slate-700 space-y-3">
        <div className="w-8 h-8 border-4 border-ntms-navy border-t-transparent rounded-full animate-spin" />
        <span>Loading NTMS Secure Computer-Based Test Delivery Engine...</span>
      </div>
    );
  }

  if (loadError || !exam) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center font-sans p-6 text-center space-y-4">
        <div className="p-6 bg-white rounded border border-slate-300 max-w-md shadow-lg space-y-3 text-slate-900">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold">Exam Session Load Warning</h3>
          <p className="text-xs text-slate-600">{loadError || 'No active NTMS exam session loaded.'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-ntms-navy text-white rounded text-xs font-bold shadow hover:bg-ntms-hoverBlue"
          >
            Return to Candidate Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = flatQuestions[currentQuestionIndex];
  const qState = currentQuestion ? questionStates[currentQuestion.id] || { isMarkedForReview: false, notes: '', answer: null, strikeouts: {} } : { isMarkedForReview: false, notes: '', answer: null, strikeouts: {} };

  const handleFinish = async () => {
    const targetAttemptId = urlAttemptId || attemptId;
    if (!targetAttemptId) return;
    setIsSubmitting(true);
    try {
      const answersMap: Record<string, any> = {};
      Object.keys(questionStates).forEach((qId) => {
        if (questionStates[qId]?.answer) {
          answersMap[qId] = questionStates[qId].answer;
        }
      });

      await api.post('/attempts/submit', {
        attemptId: targetAttemptId,
        answers: answersMap,
        isFinalSubmit: true,
      });

      navigate(`/results/${targetAttemptId}`);
    } catch (err) {
      console.error('Error submitting exam attempt:', err);
      navigate(`/results/${targetAttemptId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEngine = () => {
    if (!currentQuestion) return null;
    if (currentQuestion.caseStudy || (currentQuestion as any).caseStudyId || (currentQuestion.type as any) === 'CASE_STUDY') {
      return <CaseStudyEngine question={currentQuestion} />;
    }
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
      case 'CASE_STUDY' as any:
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
      <header className="bg-ntms-navy text-white px-3 md:px-6 py-2.5 md:py-3 border-b-2 border-ntms-blue flex items-center justify-between shadow">
        <div className="flex items-center gap-2.5 md:gap-4">
          <span className="font-black tracking-wider text-sm md:text-base text-sky-300">NTMS</span>
          <div className="h-4 w-px bg-slate-600 hidden sm:block" />
          <div>
            <h1 className="font-bold text-xs md:text-sm leading-tight text-white line-clamp-1">{exam.title}</h1>
            <span className="text-[10px] md:text-[11px] text-slate-300 font-mono hidden sm:inline">
              Candidate Examination Hall Session
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Timer />
        </div>
      </header>

      {/* Action Toolbar */}
      <div className="bg-slate-200 border-b border-slate-300 px-3 md:px-6 py-2 flex flex-wrap justify-between items-center text-xs font-semibold gap-2">
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={() => currentQuestion && toggleMarkForReview(currentQuestion.id)}
            className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded border transition-all text-xs ${
              qState.isMarkedForReview
                ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mark for Review</span>
            <span className="sm:hidden">Flag</span>
          </button>

          <button
            type="button"
            onClick={() => setCalculatorOpen(true)}
            className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all text-xs"
          >
            <Calculator className="w-3.5 h-3.5 text-ntms-blue" />
            <span>Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setScratchpadOpen(true)}
            className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all text-xs"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Scratchpad</span>
            <span className="sm:hidden">Notes</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPalette(!showPalette)}
            className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all text-xs"
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
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 relative">
        {/* Main Item Canvas */}
        <main className="flex-1 bg-white border border-slate-300 rounded shadow-sm p-4 sm:p-6 md:p-8 flex flex-col justify-between min-h-[380px] md:min-h-[520px]">
          <div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4 md:mb-6">
              <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">
                QUESTION {currentQuestionIndex + 1} (CODE: {currentQuestion?.code})
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span>Type: <strong className="text-slate-800 font-extrabold">{currentQuestion?.type}</strong></span>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <h2 className="text-sm md:text-base font-extrabold text-slate-900 tracking-tight">Question {currentQuestionIndex + 1}</h2>
              {renderEngine()}
            </div>
          </div>
        </main>

        {/* Question Item Map Drawer */}
        {showPalette && (
          <aside className="w-full md:w-80 bg-white border border-slate-300 rounded p-4 shadow-xl shrink-0 z-20">
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
