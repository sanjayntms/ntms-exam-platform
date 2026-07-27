import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Exam, ExamRoom } from '../types';
import { useAuth } from '../context/AuthContext';
import { useExamSession } from '../context/ExamSessionContext';
import { Search, Clock, Award, Shield, Lock, Unlock, Plus, DoorOpen, Users, AlertCircle, X, CheckCircle2 } from 'lucide-react';

export const ExamListPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [rooms, setRooms] = useState<ExamRoom[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinMessage, setJoinMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Admin Room Creation Modal State
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [newRoomCode, setNewRoomCode] = useState('');
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');

  const { user } = useAuth();
  const { setExamSession } = useExamSession();
  const navigate = useNavigate();

  const fetchExamsAndRooms = async () => {
    try {
      const [examsRes, roomsRes] = await Promise.all([api.get('/exams'), api.get('/rooms')]);
      setExams(examsRes.data);
      setRooms(roomsRes.data);
      if (examsRes.data.length > 0 && !selectedExamId) {
        setSelectedExamId(examsRes.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamsAndRooms();
  }, []);

  const handleStartExam = async (examId: string) => {
    try {
      const res = await api.post('/attempts/start', { examId });
      if (res.data.exam && res.data.attemptId) {
        setExamSession(res.data.exam, res.data.attemptId);
      }
      navigate(`/exam-session/${res.data.attemptId}`);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Unable to start exam attempt.');
    }
  };

  // Student Join Room by Code
  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;
    setJoinLoading(true);
    setJoinMessage(null);
    try {
      const res = await api.post('/rooms/join', { roomCode: roomCodeInput.trim() });
      setJoinMessage({ type: 'success', text: `Success: ${res.data.message} Launching exam...` });
      fetchExamsAndRooms();
      setTimeout(() => {
        handleStartExam(res.data.exam.id);
      }, 1200);
    } catch (err: any) {
      setJoinMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to join Exam Room. Please check code with Admin.',
      });
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

  // Admin Create New Exam Room (Remains OPEN until manually closed by Admin)
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

  // Admin Toggle Room Status (OPEN <-> CLOSED Manually)
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

        {joinMessage && (
          <div
            className={`p-3 rounded border text-xs font-mono flex items-center gap-2 ${
              joinMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}
          >
            {joinMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{joinMessage.text}</span>
          </div>
        )}
      </div>

      {/* Active Exam Rooms Section */}
      {rooms.length > 0 && (
        <div className="bg-white border border-slate-300 rounded p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-emerald-700" /> Institutional Exam Rooms (Closed Manually by Admin Only)
            </h3>
            <span className="text-[11px] font-mono text-slate-500 font-bold">{rooms.length} Rooms Active</span>
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
                    {r.status === 'OPEN' ? '🟢 OPEN (Candidates Can Enter)' : '🔴 MANUALLY CLOSED'}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900">{r.title}</h4>
                <p className="text-[11px] text-slate-600 font-mono">Exam: {r.exam?.code} — {r.exam?.title}</p>
                <p className="text-[10px] text-slate-500 italic">
                  {r.status === 'OPEN'
                    ? 'Room will stay OPEN continuously until Admin manually closes it.'
                    : 'Room is currently locked. Admin must click Re-Open to grant access.'}
                </p>

                {user?.role === 'ADMINISTRATOR' && (
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-[10px] font-mono text-slate-500">{r._count?.roomSessions || 0} Candidates Joined</span>
                    <button
                      onClick={() => handleToggleRoomStatus(r.id)}
                      className={`px-3 py-1 rounded font-bold text-[11px] border transition-all ${
                        r.status === 'OPEN'
                          ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700 shadow-sm'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-800 shadow-sm'
                      }`}
                    >
                      {r.status === 'OPEN' ? '🔴 Close Room Manually' : '🟢 Re-Open Room'}
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
                    {user?.role === 'ADMINISTRATOR' && (
                      <button
                        onClick={() => handleToggleGlobalUnlock(exam.id)}
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border transition-all flex items-center gap-1 ${
                          isGloballyUnlocked
                            ? 'bg-purple-100 text-purple-900 border-purple-300 hover:bg-purple-200'
                            : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
                        }`}
                        title="Toggle 1-Click Global Unlock for all 30+ students"
                      >
                        {isGloballyUnlocked ? <Unlock className="w-3 h-3 text-purple-700" /> : <Lock className="w-3 h-3 text-slate-500" />}
                        <span>{isGloballyUnlocked ? 'GLOBALLY UNLOCKED' : 'LOCK TRACK'}</span>
                      </button>
                    )}

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 border ${
                        canAccess
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-300'
                      }`}
                    >
                      {canAccess ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {canAccess ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-ntms-blue transition-colors">
                    {exam.title}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 font-semibold">{exam.code}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{exam.description}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-ntms-blue" />
                    <span>{exam.timeLimitMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span>Pass: {exam.passingScore}%</span>
                  </div>
                </div>

                {user?.role === 'ADMINISTRATOR' && (
                  <button
                    onClick={() => handleToggleGlobalUnlock(exam.id)}
                    className={`w-full py-1.5 rounded text-[11px] font-mono font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      isGloballyUnlocked
                        ? 'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-700" />
                    <span>{isGloballyUnlocked ? '🌐 Globally Unlocked for All Students' : '🔒 Globally Unlock for All Students'}</span>
                  </button>
                )}

                <button
                  onClick={() => handleStartExam(exam.id)}
                  disabled={!canAccess}
                  className={`w-full py-2.5 rounded text-xs font-bold shadow flex items-center justify-center gap-2 transition-all ${
                    canAccess
                      ? 'bg-ntms-navy hover:bg-ntms-hoverBlue text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  }`}
                >
                  {canAccess ? (
                    <>
                      <span>Launch Exam Engine</span>
                      <Shield className="w-4 h-4" />
                    </>
                  ) : (
                    <span>Locked — Enter Room Code Above</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Create Exam Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded border border-slate-300 max-w-md w-full p-6 space-y-5 shadow-2xl text-slate-900">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-ntms-navy">
                <DoorOpen className="w-6 h-6 text-emerald-700" />
                <h3 className="text-base font-bold">Create Institutional Exam Room / Hall</h3>
              </div>
              <button onClick={() => setShowRoomModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Room Code (e.g. AZ900-HALL-A)</label>
                <input
                  type="text"
                  required
                  value={newRoomCode}
                  onChange={(e) => setNewRoomCode(e.target.value.toUpperCase())}
                  placeholder="e.g. AZ900-BATCH-1"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono font-bold uppercase focus:outline-none focus:border-ntms-navy"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Room Title / Batch Name</label>
                <input
                  type="text"
                  required
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  placeholder="e.g. Morning Batch - 30 Students Testing Hall"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-ntms-navy"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Exam Track</label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-ntms-navy"
                >
                  {exams.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.code} — {e.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-sky-50 border border-sky-200 rounded text-slate-700 space-y-1">
                <p className="font-bold text-[11px] text-ntms-navy">📌 Manual Admin Control Policy:</p>
                <p className="text-[10px] leading-relaxed">
                  Once created, this exam room will remain <strong>OPEN</strong> continuously for all students entering the room code until you manually click <strong>"🔴 Close Room Manually"</strong>.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold shadow"
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
