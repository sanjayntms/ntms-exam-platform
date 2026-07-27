import { z } from 'zod';
import { Role, QuestionType, DifficultyLevel, ExamVendor, ExamType } from '@prisma/client';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const EntraLoginSchema = z.object({
  idToken: z.string(),
  accessToken: z.string(),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.nativeEnum(Role),
  password: z.string().min(6).optional(),
});

export const CreateExamSchema = z.object({
  code: z.string().min(2),
  title: z.string().min(3),
  vendor: z.nativeEnum(ExamVendor),
  examType: z.nativeEnum(ExamType).optional(),
  description: z.string().optional(),
  instructions: z.string().optional(),
  timeLimitMinutes: z.number().positive(),
  passingScore: z.number().min(0).max(100),
  isRandomized: z.boolean().default(true),
  shuffleAnswers: z.boolean().default(true),
  allowCalculator: z.boolean().default(true),
  allowNotes: z.boolean().default(true),
});

export const CreateQuestionSchema = z.object({
  code: z.string().min(2),
  title: z.string().min(3),
  type: z.nativeEnum(QuestionType),
  difficulty: z.nativeEnum(DifficultyLevel),
  points: z.number().default(1.0),
  negativePoints: z.number().default(0.0),
  explanation: z.string().optional(),
  content: z.string(),
  categoryId: z.string().optional(),
});

export const SubmitAnswerSchema = z.object({
  attemptId: z.string(),
  answers: z.record(z.any()), // questionId -> answer structure
  isFinalSubmit: z.boolean().default(false),
});
