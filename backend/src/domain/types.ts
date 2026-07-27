export enum Role {
  ADMINISTRATOR = 'ADMINISTRATOR',
  EXAM_CREATOR = 'EXAM_CREATOR',
  CANDIDATE = 'CANDIDATE',
  GUEST = 'GUEST',
}

export enum ExamVendor {
  MICROSOFT = 'MICROSOFT',
  AWS = 'AWS',
  CISCO = 'CISCO',
  VMWARE = 'VMWARE',
  LINUX = 'LINUX',
  CUSTOM = 'CUSTOM',
  UNIVERSITY = 'UNIVERSITY',
}

export enum ExamType {
  CERTIFICATION = 'CERTIFICATION',
  PRACTICE = 'PRACTICE',
  MOCK = 'MOCK',
  LAB = 'LAB',
  SIMULATION = 'SIMULATION',
  CASE_STUDY = 'CASE_STUDY',
}

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  DROPDOWN = 'DROPDOWN',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
  MATCHING = 'MATCHING',
  DRAG_AND_DROP = 'DRAG_AND_DROP',
  REORDER = 'REORDER',
  BUILD_LIST = 'BUILD_LIST',
  HOTSPOT = 'HOTSPOT',
  CASE_STUDY = 'CASE_STUDY',
  SIMULATION = 'SIMULATION',
  LAB = 'LAB',
  CODE_EDITOR = 'CODE_EDITOR',
  ESSAY = 'ESSAY',
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export enum ExamStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  SUBMITTED = 'SUBMITTED',
  EXPIRED = 'EXPIRED',
  EVALUATED = 'EVALUATED',
}

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
  entraId?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
