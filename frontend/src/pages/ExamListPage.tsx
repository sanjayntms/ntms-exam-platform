import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Exam, ExamRoom } from '../types';
import { useNavigate } from 'react-router-dom';
import { Clock, Award, Play, Search, Lock, Unlock, ShieldAlert, DoorOpen, Plus, Globe, Check, X } from 'lucide-react';
import { useExamSession } from '../context/ExamSessionContext';
import { useAuth } from '../context/AuthContext';

export const ExamListPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [rooms, setRooms] = useState<ExamRoom[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [joinLoading, setJoinLoading] = useState<boolean>(false);

  // Admin Exam Room Modal State
  const [showRoomModal, setShowRoomModal] = useState<boolean>(false);
  const [newRoomCode, setNewRoomCode] = useState<string>('');
  const [newRoomTitle, setNewRoomTitle] = useState<string>('');
  const [selectedExamId, setSelectedExamId] = useState<string>('');

  const navigate = useNavigate();
  const { setExamSession } = useExamSession();
  const { user } = useAuth();

  const fetchExamsAndRooms = async () => {
    try {
      const [examRes, roomRes] = await Promise.all([
        api.get('/exams'),
        api.get('/rooms'),
      ]);
      setExams(examRes.data);
      setRooms(roomRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamsAndRooms();
  }, []);

  const handleStartExam = async (exam: Exam) => {
    if (user?.role === 'CANDIDATE' && !exam.isUnlocked && !exam.isGloballyUnlocked) {
      alert(`⚠️ Exam "${exam.code}" is currently LOCKED for your account.\n\nPlease enter an OPEN Exam Room Code or contact Admin (sanjay@ntmsentra.onmicrosoft.com) to request access unlock.`);
      return;
    }

    try {
      const res = await api.post('/attempts/start', { examId: exam.id });
      setExamSession(res.data.exam, res.data.attemptId);
      navigate(`/exam-session/${res.data.attemptId}`);
    } catch (err: any) {
      alert('Error starting exam attempt: ' + (err.response?.data?.error || err.message));
    }
  };

  // Join Exam Room by Room Code
  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;

    setJoinLoading(true);
    try {
      const res = await api.post('/rooms/join', { roomCode: roomCodeInput });
      alert(`✅ ${res.data.message}`);

      // Automatically launch exam session
      const startRes = await api.post('/attempts/start', { examId: res.data.exam.id });
      setExamSession(startRes.data.exam, startRes.data.attemptId);
      navigate(`/exam-session/${startRes.data.attemptId}`);
    } catch (err: any) {
      alert('⚠️ Exam Room Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setJoinLoading(false);
    }
  };

  // Admin Toggle Global Unlock for ALL 30+ Students
  const handleToggleGlobalUnlock = async (examId: string) => {
    try {
      await api.patch(`/exams/${examId}/global-unlock`);
      fetchExamsAndRooms();
    } catch (err: any) {
      alert('Error toggling global unlock: ' + (err.response?.data?.error || err.message));
    }
  };

  // Admin Create New Exam Room
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/rooms', {
        roomCode: newRoomCode,
        title: newRoomTitle,
        examId: selectedExamId,
        status: 'OPEN',
      });
      setNewRoomCode('');
      setNewRoomTitle('');
      setShowRoomModal(false);
      fetchExamsAndRooms();
    } catch (err: any) {
      alert('Error creating exam room: ' + (err.response?.data?.error || err.message));
    }
  };

  // Admin Toggle Room Status (OPEN <-> CLOSED)
  const handleToggleRoomStatus = async (roomId: string) => {
    try {
      await api.patch(`/rooms/${roomId}/toggle`);
      fetchExamsAndRooms();
    } catch (err: any) {
      alert('Error toggling room status: ' + (err.response?.data?.error || err.message));
    }
  };

  const filteredExams = exams.filter(
    (e) => e.title.toLowerCase().includes(search.toLowerCase()) || e.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Room Code Joining Box */}
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-ntms-navy tracking-tight">NTMS Exam Catalog & Certification Halls</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Enter an Exam Room Code provided by Admin (sanjay@ntmsentra.onmicrosoft.com) or select an unlocked track below.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === 'ADMINISTRATOR' && (
              <button
                onClick={() => setShowRoomModal(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold shadow flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Create Exam Room / Hall
              </button>
            )}

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exam code or title..."
                className="w-full bg-slate-50 border border-slate-300 rounded pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-ntms-blue font-medium"
              />
            </div>
          </div>
        </div>

        {/* Student Exam Room Code Access Form */}
        <form onSubmit={handleJoinRoom} className="bg-slate-50 p-4 rounded border border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-ntms-blue shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Enter Institutional Exam Room Code (e.g. AZ900-HALL-A)</h4>
              <p className="text-[11px] text-slate-600">If the room is OPEN, you can immediately enter and take the exam.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              required
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
              placeholder="ROOM CODE..."
              className="bg-white border border-slate-300 rounded px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-ntms-navy focus:outline-none w-full sm:w-48 tracking-wider uppercase"
            />
            <button
              type="submit"
              disabled={joinLoading}
              className="px-4 py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded text-xs font-bold shadow shrink-0"
            >
              {joinLoading ? 'Joining...' : 'Enter Exam Room ➜'}
            </button>
          </div>
        </form>
      </div>

      {/* Active Exam Rooms Section */}
      {rooms.length > 0 && (
        <div className="bg-white border border-slate-300 rounded p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-emerald-700" /> Active Institutional Exam Rooms & Certification Halls
            </h3>
            <span className="text-[11px] font-mono text-slate-500 font-bold">{rooms.length} Rooms Configured</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((r) => (
              <div key={r.id} className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2 relative">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-black tracking-wider px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
                    {r.roomCode}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      r.status === 'OPEN'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border-rose-300'
                    }`}
                  >
                    {r.status === 'OPEN' ? '🟢 ROOM OPEN' : '🔴 ROOM CLOSED'}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900">{r.title}</h4>
                <p className="text-[11px] text-slate-600 font-mono">Exam: {r.exam?.code} — {r.exam?.title}</p>

                {user?.role === 'ADMINISTRATOR' && (
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-[10px] font-mono text-slate-500">{r._count?.roomSessions || 0} Candidates Joined</span>
                    <button
                      onClick={() => handleToggleRoomStatus(r.id)}
                      className={`px-3 py-1 rounded font-bold text-[11px] border transition-all ${
                        r.status === 'OPEN'
                          ? 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                      }`}
                    >
                      {r.status === 'OPEN' ? 'Close Room' : 'Open Room'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => {
          const isGloballyUnlocked = exam.isGloballyUnlocked;
          const isUserUnlocked = exam.isUnlocked;
          const canAccess = user?.role === 'ADMINISTRATOR' || isGloballyUnlocked || isUserUnlocked;

          return (
            <div
              key={exam.id}
              className={`bg-white border rounded p-6 flex flex-col justify-between transition-all space-y-4 shadow-sm relative ${
                !canAccess ? 'border-slate-300 bg-slate-50/50 opacity-90' : 'border-slate-300 hover:border-ntms-navy'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-ntms-navy border border-sky-300">
                    {exam.vendor}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-600">{exam.code}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 border ${
                        canAccess
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {canAccess ? <Unlock className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-rose-600" />}
                      {canAccess ? (isGloballyUnlocked ? 'GLOBAL UNLOCK' : 'UNLOCKED') : 'LOCKED'}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">{exam.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{exam.description}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-ntms-blue" />
                    <span>{exam.timeLimitMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pass: {exam.passingScore}%</span>
                  </div>
                </div>

                {/* Admin Global Unlock Toggle Button */}
                {user?.role === 'ADMINISTRATOR' && (
                  <button
                    type="button"
                    onClick={() => handleToggleGlobalUnlock(exam.id)}
                    className={`w-full py-1.5 rounded text-xs font-mono font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      isGloballyUnlocked
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                        : 'bg-purple-100 text-purple-900 border-purple-300 hover:bg-purple-200'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {isGloballyUnlocked ? 'Global Unlock Active (Click to Lock)' : 'Globally Unlock for All Students'}
                  </button>
                )}

                {!canAccess ? (
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 bg-slate-300 text-slate-600 cursor-not-allowed rounded font-bold text-xs flex items-center justify-center gap-2 border border-slate-400"
                    >
                      <Lock className="w-4 h-4 text-slate-600" />
                      Locked (Enter Room Code)
                    </button>
                    <p className="text-[10px] font-mono text-center text-rose-700 font-semibold flex items-center justify-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Ask Admin sanjay@ntmsentra.onmicrosoft.com for Room Code
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartExam(exam)}
                    className="w-full py-2.5 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded font-bold text-xs transition-all shadow flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Launch Exam Engine
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Create Exam Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded p-6 w-full max-w-md space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-ntms-navy border-b border-slate-200 pb-3 flex items-center gap-2">
              <DoorOpen className="w-5 h-5 text-emerald-700" /> Create Institutional Exam Room / Hall
            </h3>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="text-xs text-slate-700 font-bold block mb-1">Room Code (e.g. AZ900-HALL-A)</label>
                <input
                  type="text"
                  required
                  value={newRoomCode}
                  onChange={(e) => setNewRoomCode(e.target.value.toUpperCase())}
                  placeholder="AZ900-HALL-A"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-mono font-bold text-slate-900 focus:border-ntms-navy focus:outline-none uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700 font-bold block mb-1">Room Title / Batch Name</label>
                <input
                  type="text"
                  required
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  placeholder="AZ-900 Morning Certification Hall"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-900 focus:border-ntms-navy focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700 font-bold block mb-1">Target Exam Track</label>
                <select
                  required
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-900 focus:border-ntms-navy focus:outline-none font-mono"
                >
                  <option value="">-- Select Exam Track --</option>
                  {exams.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.code} — {e.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold shadow"
                >
                  Create & Open Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
