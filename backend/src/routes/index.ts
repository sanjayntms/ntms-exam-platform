import { Router } from 'express';
import { prisma } from '../infrastructure/database.js';
import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';
import { AuthService } from '../services/auth.service.js';
import { ExamEngineService } from '../services/examEngine.service.js';
import { AnalyticsService } from '../services/analytics.service.js';
import { AuthController } from '../controllers/auth.controller.js';
import { ExamController } from '../controllers/exam.controller.js';
import { QuestionController } from '../controllers/question.controller.js';
import { AttemptController } from '../controllers/attempt.controller.js';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { UserController } from '../controllers/user.controller.js';
import { RoomController } from '../controllers/room.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/rbac.middleware.js';
import { Role } from '../domain/types.js';

const router = Router();

const uow = new UnitOfWork(prisma);
const authService = new AuthService(uow);
const engineService = new ExamEngineService(uow);
const analyticsService = new AnalyticsService(uow);

const authCtrl = new AuthController(authService);
const examCtrl = new ExamController(uow);
const questionCtrl = new QuestionController(uow);
const attemptCtrl = new AttemptController(engineService, uow);
const analyticsCtrl = new AnalyticsController(analyticsService);
const userCtrl = new UserController(uow);
const roomCtrl = new RoomController();

// Auth Routes
router.post('/auth/login', (req, res) => authCtrl.loginLocal(req, res));
router.post('/auth/entra', (req, res) => authCtrl.loginEntra(req, res));
router.get('/auth/me', authenticateJWT, (req, res) => authCtrl.me(req, res));
router.post('/auth/logout', authenticateJWT, (req, res) => authCtrl.logout(req, res));

// Exam Routes (Authenticated to attach per-student lock/unlock status)
router.get('/exams', authenticateJWT, (req, res) => examCtrl.list(req, res));
router.get('/exams/:id', (req, res) => examCtrl.getById(req, res));
router.post('/exams', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR, Role.EXAM_CREATOR), (req, res) => examCtrl.create(req, res));
router.put('/exams/:id', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR, Role.EXAM_CREATOR), (req, res) => examCtrl.update(req, res));
router.delete('/exams/:id', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => examCtrl.delete(req, res));
router.patch('/exams/:examId/global-unlock', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => roomCtrl.toggleGlobalExamUnlock(req, res));

// Question Routes (Admin & Exam Creator Only)
router.get('/questions', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR, Role.EXAM_CREATOR), (req, res) => questionCtrl.list(req, res));
router.get('/questions/:id', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR, Role.EXAM_CREATOR), (req, res) => questionCtrl.getById(req, res));
router.post('/questions', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR, Role.EXAM_CREATOR), (req, res) => questionCtrl.create(req, res));
router.put('/questions/:id', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR, Role.EXAM_CREATOR), (req, res) => questionCtrl.update(req, res));
router.delete('/questions/:id', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => questionCtrl.delete(req, res));

// Attempt / Exam Engine Routes
router.post('/attempts/start', authenticateJWT, (req, res) => attemptCtrl.start(req, res));
router.post('/attempts/submit', authenticateJWT, (req, res) => attemptCtrl.submit(req, res));
router.get('/attempts/my', authenticateJWT, (req, res) => attemptCtrl.myAttempts(req, res));
router.get('/attempts/search', authenticateJWT, (req, res) => attemptCtrl.adminSearchAttempts(req, res));
router.get('/attempts/:id', authenticateJWT, (req, res) => attemptCtrl.getById(req, res));
router.delete('/attempts/:id', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => attemptCtrl.deleteAttempt(req, res));

// Exam Room Routes (School/College Exam Hall system)
router.get('/rooms', authenticateJWT, (req, res) => roomCtrl.listRooms(req, res));
router.post('/rooms', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => roomCtrl.createRoom(req, res));
router.patch('/rooms/:roomId/toggle', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => roomCtrl.toggleRoomStatus(req, res));
router.patch('/rooms/:roomId/allow-review', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => roomCtrl.toggleAllowReview(req, res));
router.delete('/rooms/:roomId', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => roomCtrl.deleteRoom(req, res));
router.post('/rooms/join', authenticateJWT, (req, res) => roomCtrl.joinRoom(req, res));

// Analytics Routes
router.get('/analytics/dashboard', authenticateJWT, (req, res) => analyticsCtrl.dashboard(req, res));

// User Management & Exam Access Routes
router.get('/users', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => userCtrl.list(req, res));
router.post('/users', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => userCtrl.create(req, res));
router.patch('/users/:id/toggle-active', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => userCtrl.toggleActive(req, res));

// Admin Exam Lock / Unlock Controls per Student
router.get('/users/:id/access', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => userCtrl.getExamAccess(req, res));
router.post('/users/:id/access/toggle', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => userCtrl.toggleExamAccess(req, res));
router.post('/users/:id/access/unlock-all', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => userCtrl.unlockAllExams(req, res));
router.post('/users/:id/access/lock-all', authenticateJWT, authorizeRoles(Role.ADMINISTRATOR), (req, res) => userCtrl.lockAllExams(req, res));

// Student Attempt History per User
router.get('/users/:id/attempts', authenticateJWT, (req, res) => userCtrl.getUserAttempts(req, res));

export default router;
