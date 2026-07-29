import { Request, Response } from 'express';
import { prisma } from '../infrastructure/database.js';

export class RoomController {
  // List all exam rooms
  async listRooms(req: Request, res: Response) {
    try {
      const rooms = await prisma.examRoom.findMany({
        include: {
          exam: { select: { id: true, code: true, title: true, vendor: true, timeLimitMinutes: true } },
          _count: { select: { roomSessions: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return res.json(rooms);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Create a new proctor exam room
  async createRoom(req: Request, res: Response) {
    try {
      const { roomCode, title, examId, status, allowReview } = req.body;
      const createdBy = req.user?.email || 'admin';

      const existing = await prisma.examRoom.findUnique({ where: { roomCode } });
      if (existing) {
        return res.status(400).json({ error: `Exam Room Code "${roomCode}" already exists. Please use a unique room code.` });
      }

      const room = await prisma.examRoom.create({
        data: {
          roomCode: roomCode.trim().toUpperCase(),
          title,
          examId,
          status: status || 'OPEN',
          allowReview: allowReview !== undefined ? Boolean(allowReview) : true,
          createdBy,
        },
        include: { exam: { select: { id: true, code: true, title: true } } },
      });

      return res.status(201).json(room);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Toggle Room Status (OPEN <-> CLOSED)
  async toggleRoomStatus(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const room = await prisma.examRoom.findUnique({ where: { id: roomId } });
      if (!room) return res.status(404).json({ error: 'Exam Room not found' });

      const newStatus = room.status === 'OPEN' ? 'CLOSED' : 'OPEN';
      const updated = await prisma.examRoom.update({
        where: { id: roomId },
        data: { status: newStatus },
        include: { exam: { select: { id: true, code: true, title: true } } },
      });

      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Toggle Allow Candidate Answer Review for Room
  async toggleAllowReview(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const room = await prisma.examRoom.findUnique({ where: { id: roomId } });
      if (!room) return res.status(404).json({ error: 'Exam Room not found' });

      const updated = await prisma.examRoom.update({
        where: { id: roomId },
        data: { allowReview: !room.allowReview },
        include: { exam: { select: { id: true, code: true, title: true } } },
      });

      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Student joins Exam Room by Room Code (Strictly authenticated candidates only)
  async joinRoom(req: Request, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Authentication required. Only registered/logged-in candidates can enter an Exam Room.' });
      }

      const { roomCode, candidateName } = req.body;
      const tokenUserId = req.user.id;
      const userEmail = req.user.email;

      if (!roomCode) {
        return res.status(400).json({ error: 'Exam Room Code is required' });
      }

      const room = await prisma.examRoom.findUnique({
        where: { roomCode: roomCode.trim().toUpperCase() },
        include: { exam: true },
      });

      if (!room) {
        return res.status(404).json({ error: `Invalid Exam Room Code "${roomCode}". Please verify with Admin (sanjay@ntmsentra.onmicrosoft.com).` });
      }

      if (room.status !== 'OPEN') {
        return res.status(403).json({ error: `Exam Room "${room.title}" (${room.roomCode}) is currently CLOSED by Admin (sanjay@ntmsentra.onmicrosoft.com).` });
      }

      let validUser = await prisma.user.findUnique({ where: { id: tokenUserId } });
      if (!validUser && userEmail) {
        validUser = await prisma.user.findUnique({ where: { email: userEmail } });
      }

      if (!validUser) {
        return res.status(401).json({ error: 'Authenticated user profile not found. Please log in again.' });
      }

      // Update candidate full name if provided
      const trimmedName = candidateName?.trim();
      if (trimmedName && trimmedName !== validUser.name) {
        validUser = await prisma.user.update({
          where: { id: validUser.id },
          data: { name: trimmedName },
        });
      }

      try {
        // Log student room session
        await prisma.roomSession.upsert({
          where: { roomId_userId: { roomId: room.id, userId: validUser.id } },
          update: { joinedAt: new Date() },
          create: { roomId: room.id, userId: validUser.id },
        });

        // Grant per-student unlock for this exam while room is open
        await prisma.studentExamAccess.upsert({
          where: { userId_examId: { userId: validUser.id, examId: room.examId } },
          update: { isUnlocked: true, unlockedBy: `ROOM:${room.roomCode}` },
          create: { userId: validUser.id, examId: room.examId, isUnlocked: true, unlockedBy: `ROOM:${room.roomCode}` },
        });
      } catch (dbErr) {
        console.warn('Non-fatal roomSession upsert warning:', dbErr);
      }

      return res.json({
        message: `Welcome ${validUser.name}! Successfully joined Exam Room "${room.title}".`,
        room,
        exam: room.exam,
        candidateName: validUser.name,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Admin Toggle Global Exam Unlock for ALL Students
  async toggleGlobalExamUnlock(req: Request, res: Response) {
    try {
      const { examId } = req.params;
      const exam = await prisma.exam.findUnique({ where: { id: examId } });
      if (!exam) return res.status(404).json({ error: 'Exam track not found' });

      const updated = await prisma.exam.update({
        where: { id: examId },
        data: { isGloballyUnlocked: !exam.isGloballyUnlocked },
      });

      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
