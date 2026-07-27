import React, { createContext, useContext, useState, useEffect } from 'react';
import { Exam, Question } from '../types';

interface QuestionState {
  isMarkedForReview: boolean;
  notes: string;
  answer: any;
  strikeouts: Record<string, boolean>;
}

interface ExamSessionContextType {
  exam: Exam | null;
  attemptId: string | null;
  currentQuestionIndex: number;
  flatQuestions: Question[];
  questionStates: Record<string, QuestionState>;
  timeRemainingSeconds: number;
  isCalculatorOpen: boolean;
  isScratchpadOpen: boolean;
  setExamSession: (exam: Exam, attemptId: string) => void;
  setCurrentQuestionIndex: (idx: number) => void;
  toggleMarkForReview: (qId: string) => void;
  updateQuestionAnswer: (qId: string, answer: any) => void;
  updateQuestionNotes: (qId: string, notes: string) => void;
  toggleStrikeout: (qId: string, optionId: string) => void;
  setCalculatorOpen: (open: boolean) => void;
  setScratchpadOpen: (open: boolean) => void;
}

const ExamSessionContext = createContext<ExamSessionContextType | undefined>(undefined);

export const ExamSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exam, setExam] = useState<Exam | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [flatQuestions, setFlatQuestions] = useState<Question[]>([]);
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(3600);
  const [isCalculatorOpen, setCalculatorOpen] = useState<boolean>(false);
  const [isScratchpadOpen, setScratchpadOpen] = useState<boolean>(false);

  const setExamSession = (examData: Exam, newAttemptId: string) => {
    setExam(examData);
    setAttemptId(newAttemptId);
    setTimeRemainingSeconds(examData.timeLimitMinutes * 60);

    const questionsList: Question[] = [];
    examData.sections?.forEach((section) => {
      section.questions?.forEach((sq) => {
        if (sq.question) questionsList.push(sq.question);
      });
    });

    setFlatQuestions(questionsList);

    const initialStates: Record<string, QuestionState> = {};
    questionsList.forEach((q) => {
      initialStates[q.id] = {
        isMarkedForReview: false,
        notes: '',
        answer: null,
        strikeouts: {},
      };
    });
    setQuestionStates(initialStates);
    setCurrentQuestionIndex(0);
  };

  useEffect(() => {
    if (!exam || timeRemainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [exam, timeRemainingSeconds]);

  const toggleMarkForReview = (qId: string) => {
    setQuestionStates((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        isMarkedForReview: !prev[qId]?.isMarkedForReview,
      },
    }));
  };

  const updateQuestionAnswer = (qId: string, answer: any) => {
    setQuestionStates((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        answer,
      },
    }));
  };

  const updateQuestionNotes = (qId: string, notes: string) => {
    setQuestionStates((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        notes,
      },
    }));
  };

  const toggleStrikeout = (qId: string, optionId: string) => {
    setQuestionStates((prev) => {
      const qState = prev[qId] || { isMarkedForReview: false, notes: '', answer: null, strikeouts: {} };
      const currentVal = qState.strikeouts[optionId];
      return {
        ...prev,
        [qId]: {
          ...qState,
          strikeouts: {
            ...qState.strikeouts,
            [optionId]: !currentVal,
          },
        },
      };
    });
  };

  return (
    <ExamSessionContext.Provider
      value={{
        exam,
        attemptId,
        currentQuestionIndex,
        flatQuestions,
        questionStates,
        timeRemainingSeconds,
        isCalculatorOpen,
        isScratchpadOpen,
        setExamSession,
        setCurrentQuestionIndex,
        toggleMarkForReview,
        updateQuestionAnswer,
        updateQuestionNotes,
        toggleStrikeout,
        setCalculatorOpen,
        setScratchpadOpen,
      }}
    >
      {children}
    </ExamSessionContext.Provider>
  );
};

export const useExamSession = () => {
  const context = useContext(ExamSessionContext);
  if (!context) throw new Error('useExamSession must be used within ExamSessionProvider');
  return context;
};
