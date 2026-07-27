export type Role = 'ADMINISTRATOR' | 'EXAM_CREATOR' | 'CANDIDATE' | 'GUEST';

export type ExamVendor = 'MICROSOFT' | 'AWS' | 'CISCO' | 'VMWARE' | 'LINUX' | 'CUSTOM' | 'UNIVERSITY';

export type QuestionType =
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'DROPDOWN'
  | 'FILL_IN_BLANK'
  | 'MATCHING'
  | 'DRAG_AND_DROP'
  | 'REORDER'
  | 'BUILD_LIST'
  | 'HOTSPOT'
  | 'CASE_STUDY'
  | 'SIMULATION'
  | 'LAB'
  | 'CODE_EDITOR'
  | 'ESSAY';

export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  entraId?: string | null;
  isActive?: boolean;
}

export interface Question {
  id: string;
  code: string;
  title: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  points: number;
  negativePoints?: number;
  explanation?: string;
  content: string; // JSON string
  category?: { id: string; name: string };
  caseStudy?: {
    id: string;
    title: string;
    overview: string;
    businessRequirements: string;
    technicalRequirements: string;
    existingEnvironment: string;
  };
  simulation?: {
    id: string;
    title: string;
    portalType: string;
    instructions: string;
    initialState: string;
    targetState: string;
  };
  lab?: {
    id: string;
    title: string;
    scenario: string;
    checklists: string;
    validation: string;
  };
}

export interface ExamSection {
  id: string;
  title: string;
  instructions?: string;
  orderIndex: number;
  questions: {
    orderIndex: number;
    question: Question;
  }[];
}

export interface Exam {
  id: string;
  code: string;
  title: string;
  vendor: ExamVendor;
  description?: string;
  instructions?: string;
  timeLimitMinutes: number;
  passingScore: number;
  allowCalculator: boolean;
  allowNotes: boolean;
  sections: ExamSection[];
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  status: 'IN_PROGRESS' | 'EVALUATED';
  startedAt: string;
  completedAt?: string;
  timeSpentSeconds: number;
  scorePercentage: number;
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean;
  answers: string; // JSON object mapping questionId -> answer
  exam?: Exam;
}
