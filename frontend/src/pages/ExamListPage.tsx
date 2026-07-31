import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Exam, ExamRoom } from '../types';
import { useAuth } from '../context/AuthContext';
import { useExamSession } from '../context/ExamSessionContext';
import { Search, Clock, Award, Shield, Lock, Unlock, Plus, DoorOpen, Users, AlertCircle, X, CheckCircle2, Edit3, Trash2 } from 'lucide-react';

import { CandidateNameModal } from '../components/common/CandidateNameModal';

export const ExamListPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinMessage, setJoinMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Name Modal State
  const [nameModalConfig, setNameModalConfig] = useState<{
    isOpen: boolean;
    mode: 'START_EXAM' | 'JOIN_ROOM';
    examId?: string;
    examTitle?: string;
    roomCode?: string;
  }>({ isOpen: false, mode: 'START_EXAM' });

  // Admin Room Creation Modal State
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [newRoomCode, setNewRoomCode] = useState('');
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [newRoomAllowReview, setNewRoomAllowReview] = useState(true);
  const [newRoomQuestionCount, setNewRoomQuestionCount] = useState<number>(0);

  // Admin Edit Exam Track Modal State
  const [showEditExamModal, setShowEditExamModal] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [editExamCode, setEditExamCode] = useState('');
  const [editExamTitle, setEditExamTitle] = useState('');
  const [editExamVendor, setEditExamVendor] = useState('MICROSOFT');
  const [editExamDuration, setEditExamDuration] = useState<number | string>(120);
  const [editExamPassingScore, setEditExamPassingScore] = useState<number | string>(70);
  const [editTotalQuestions, setEditTotalQuestions] = useState<number | string>(50);
  const [editExamDescription, setEditExamDescription] = useState('');

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
      console.error('Error fetching exams and rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamsAndRooms();
  }, []);

  const handleStartExam = async (examId: string) => {
    if (!user) {
      alert('🔒 Authentication Required: Only logged-in candidates can enter an Exam Room. Please log in or register.');
      navigate('/login');
      return;
    }

    const targetExam = exams.find((e) => e.id === examId);
    setNameModalConfig({
      isOpen: true,
      mode: 'START_EXAM',
      examId,
      examTitle: targetExam ? `${targetExam.code} - ${targetExam.title}` : 'Certification Exam',
    });
  };

  // Student Join Room by Code (Requires Authentication & Full Candidate Name)
  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;

    if (!user) {
      alert('🔒 Authentication Required: Only logged-in candidates can enter an Exam Room. Please log in or register.');
      navigate('/login');
      return;
    }

    setNameModalConfig({
      isOpen: true,
      mode: 'JOIN_ROOM',
      roomCode: roomCodeInput.trim().toUpperCase(),
    });
  };

  const handleConfirmNameModal = async (candidateFullName: string, questionCount?: number) => {
    const { mode, examId, roomCode } = nameModalConfig;
    setNameModalConfig({ isOpen: false, mode: 'START_EXAM' });

    if (mode === 'START_EXAM' && examId) {
      try {
        const res = await api.post('/attempts/start', { examId, candidateName: candidateFullName, questionCount });
        if (res.data.exam && res.data.attemptId) {
          setExamSession(res.data.exam, res.data.attemptId);
        }
        navigate(`/exam-session/${res.data.attemptId}`);
      } catch (err: any) {
        alert(err.response?.data?.error || 'Unable to start exam attempt.');
      }
    } else if (mode === 'JOIN_ROOM' && roomCode) {
      setJoinLoading(true);
      setJoinMessage(null);
      try {
        const res = await api.post('/rooms/join', {
          roomCode: roomCode.trim().toUpperCase(),
          candidateName: candidateFullName,
          questionCount,
        });

        setJoinMessage({ type: 'success', text: `Success: ${res.data.message} Launching exam...` });
        fetchExamsAndRooms();
        setTimeout(async () => {
          try {
            const startRes = await api.post('/attempts/start', {
              examId: res.data.exam.id,
              roomId: res.data.room?.id,
              candidateName: candidateFullName,
              questionCount,
            });
            if (startRes.data.exam && startRes.data.attemptId) {
              setExamSession(startRes.data.exam, startRes.data.attemptId);
            }
            navigate(`/exam-session/${startRes.data.attemptId}`);
          } catch (startErr: any) {
            alert('Error starting exam: ' + (startErr.response?.data?.error || startErr.message));
          }
        }, 800);
      } catch (err: any) {
        if (err.response?.status === 401) {
          alert('🔒 Authentication Required: Please log in to enter an Exam Room.');
          navigate('/login');
        } else {
          setJoinMessage({
            type: 'error',
            text: err.response?.data?.error || 'Failed to join Exam Room. Please check code with Admin.',
          });
        }
      } finally {
        setJoinLoading(false);
      }
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
        allowReview: newRoomAllowReview,
        questionCount: newRoomQuestionCount > 0 ? newRoomQuestionCount : undefined,
      });
      alert('✅ Exam Room Created & Exam Unlocked Automatically for Candidates!');
      setShowRoomModal(false);
      setNewRoomCode('');
      setNewRoomTitle('');
      setNewRoomAllowReview(true);
      setNewRoomQuestionCount(0);
      fetchExamsAndRooms();
    } catch (err: any) {
      alert('Error creating room: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleToggleRoomStatus = async (roomId: string) => {
    try {
      await api.patch(`/rooms/${roomId}/toggle`);
      fetchExamsAndRooms();
    } catch (err: any) {
      alert('Error updating room status: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleToggleAllowReview = async (roomId: string) => {
    try {
      await api.patch(`/rooms/${roomId}/allow-review`);
      fetchExamsAndRooms();
    } catch (err: any) {
      alert('Error toggling candidate review: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteRoom = async (roomId: string, roomCode: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete Exam Room "${roomCode}"? All active candidate sessions for this room will be cleared.`)) return;
    try {
      await api.delete(`/rooms/${roomId}`);
      fetchExamsAndRooms();
    } catch (err: any) {
      alert('Error deleting room: ' + (err.response?.data?.error || err.message));
    }
  };

  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null);

  const handleDisconnectCandidate = async (roomId: string, userId: string, userName: string) => {
    if (!window.confirm(`⚡ Force Disconnect Warning:\nAre you sure you want to disconnect candidate "${userName}" from this room?\n\nTheir active exam session will be terminated immediately.`)) return;
    try {
      const res = await api.post(`/rooms/${roomId}/disconnect-candidate`, { userId });
      alert(`⚡ ${res.data.message}`);
      fetchExamsAndRooms();
    } catch (err: any) {
      alert('Error disconnecting candidate: ' + (err.response?.data?.error || err.message));
    }
  };

  const openEditExamModal = (exam: any) => {
    setEditingExamId(exam.id);
    setEditExamCode(exam.code);
    setEditExamTitle(exam.title);
    setEditExamVendor(exam.vendor);
    setEditExamDuration(exam.timeLimitMinutes);
    setEditExamPassingScore(exam.passingScore);
    setEditTotalQuestions(exam.totalQuestionsConfig || 50);
    setEditExamDescription(exam.description || '');
    setShowEditExamModal(true);
  };

  const handleSaveEditExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExamId) return;
    try {
      await api.put(`/exams/${editingExamId}`, {
        code: editExamCode,
        title: editExamTitle,
        vendor: editExamVendor,
        timeLimitMinutes: Number(editExamDuration),
        passingScore: Number(editExamPassingScore),
        totalQuestionsConfig: Number(editTotalQuestions),
        description: editExamDescription,
      });
      alert('✅ Exam Track Details Updated Successfully!');
      setShowEditExamModal(false);
      fetchExamsAndRooms();
    } catch (err: any) {
      alert('Error updating exam track: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteExam = async (examId: string, examCode: string) => {
    if (!window.confirm(`Are you sure you want to delete exam track "${examCode}"?`)) return;
    try {
      await api.delete(`/exams/${examId}`);
      alert('✅ Exam track deleted successfully!');
      fetchExamsAndRooms();
    } catch (err: any) {
      alert('Error deleting exam track: ' + (err.response?.data?.error || err.message));
    }
  };

  const filteredExams = exams.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.code.toLowerCase().includes(search.toLowerCase());
    if (user?.role === 'ADMINISTRATOR') return matchesSearch;
    return matchesSearch && Boolean(e.isUnlocked);
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Exam Room Join Bar */}
      <div className="bg-gradient-to-r from-ntms-navy via-ntms-darkNavy to-slate-900 rounded p-6 text-white shadow-md space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">NTMS Exam Center & Proctoring Portal</h2>
            <p className="text-xs text-sky-200 mt-1">Enterprise & Higher-Ed Assessment Platform with Real-Time Exam Room Access</p>
          </div>

          {user?.role === 'ADMINISTRATOR' && (
            <button
              onClick={() => setShowRoomModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs shadow transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Exam Room</span>
            </button>
          )}
        </div>

        {/* Candidate Exam Room Entrance Box */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded border border-white/20 space-y-3">
          <div className="flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-sky-300" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Enter Live Proctoring Exam Room Code</h3>
          </div>

          <form onSubmit={handleJoinRoom} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
              placeholder="ENTER ROOM CODE (e.g. AZ900-HALL-A)"
              className="flex-1 bg-white border border-slate-300 text-slate-900 px-4 py-2.5 rounded font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-ntms-blue uppercase"
            />
            <button
              type="submit"
              disabled={joinLoading}
              className="w-full sm:w-auto px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-900 font-extrabold text-xs rounded shadow transition-all disabled:opacity-50"
            >
              {joinLoading ? 'Joining...' : 'Enter Exam Room ➜'}
            </button>
          </form>

          {joinMessage && (
            <div
              className={`p-3 rounded text-xs font-bold flex items-center gap-2 ${
                joinMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
              }`}
            >
              {joinMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{joinMessage.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Active Exam Rooms Section for Admins & Candidates */}
      {(() => {
        const displayRooms = user?.role === 'ADMINISTRATOR' ? rooms : rooms.filter((r) => r.status === 'OPEN');
        if (displayRooms.length === 0) return null;

        return (
          <div className="bg-white border border-slate-300 rounded p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-ntms-navy uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" /> Active Exam Halls & Proctor Rooms ({displayRooms.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {displayRooms.map((room) => (
              <div key={room.id} className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-ntms-navy bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                      {room.roomCode}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${room.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                      {room.status}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      room.allowReview !== false ? 'bg-purple-50 text-purple-800 border-purple-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {room.allowReview !== false ? '👁 Review Allowed' : '🔒 Review Locked'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800">{room.title}</p>
                  <span className="text-[11px] font-mono font-extrabold text-ntms-navy bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    👥 {room.roomSessions?.length || room._count?.roomSessions || 0} Active Logins
                  </span>
                </div>

                {user?.role === 'ADMINISTRATOR' && (
                  <div className="space-y-2 pt-1 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleRoomStatus(room.id)}
                        className={`flex-1 px-2 py-1 text-[10px] font-bold rounded border transition-colors ${
                          room.status === 'OPEN' ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-300' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {room.status === 'OPEN' ? '🔴 Close' : '🟢 Re-Open'}
                      </button>

                      <button
                        onClick={() => handleToggleAllowReview(room.id)}
                        className={`flex-1 px-2 py-1 text-[10px] font-bold rounded border transition-colors ${
                          room.allowReview !== false ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300' : 'bg-purple-100 hover:bg-purple-200 text-purple-900 border-purple-300'
                        }`}
                        title="Toggle Candidate Question/Answer Review"
                      >
                        {room.allowReview !== false ? '🔒 Review' : '👁 Review'}
                      </button>

                      <button
                        onClick={() => handleDeleteRoom(room.id, room.roomCode)}
                        className="px-2 py-1 text-[10px] font-bold rounded border bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 border-slate-300 transition-colors"
                        title="Permanently Remove / Delete Room"
                      >
                        🗑 Delete
                      </button>
                    </div>

                    <button
                      onClick={() => setExpandedRoomId(expandedRoomId === room.id ? null : room.id)}
                      className="w-full px-2.5 py-1.5 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded text-[11px] font-bold shadow-xs flex items-center justify-between transition-all"
                    >
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-300" />
                        Live Proctor Monitor ({room.roomSessions?.length || 0} Logins)
                      </span>
                      <span>{expandedRoomId === room.id ? '▲ Close' : '▼ Monitor'}</span>
                    </button>
                  </div>
                )}

                {/* Expanded Live Proctor Candidate List for Room */}
                {user?.role === 'ADMINISTRATOR' && expandedRoomId === room.id && (
                  <div className="mt-2 p-3 bg-white rounded border border-slate-300 space-y-2 shadow-inner">
                    <h4 className="text-[11px] font-extrabold text-ntms-navy uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600" /> Active Candidate Logins in Room {room.roomCode}
                    </h4>

                    {(!room.roomSessions || room.roomSessions.length === 0) ? (
                      <div className="p-4 text-center text-[11px] text-slate-500 font-medium">
                        No candidates currently logged into this room.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-200 text-xs font-sans">
                        {room.roomSessions.map((session: any) => {
                          const candidateAttempt = room.attempts?.find((att: any) => att.userId === session.user?.id);
                          const isAttemptActive = candidateAttempt && !candidateAttempt.completedAt && candidateAttempt.status !== 'CLOSED' && candidateAttempt.status !== 'EXPIRED';

                          return (
                            <div key={session.id || session.user?.id} className="py-2 flex items-center justify-between gap-2">
                              <div className="space-y-0.5">
                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                  <span>{session.user?.name || 'Candidate'}</span>
                                  {isAttemptActive ? (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 font-mono text-[9px] font-bold border border-emerald-300 animate-pulse">
                                      🟢 IN PROGRESS
                                    </span>
                                  ) : candidateAttempt?.completedAt ? (
                                    <span className="px-1.5 py-0.2 rounded bg-sky-100 text-ntms-navy font-mono text-[9px] font-bold border border-sky-300">
                                      🔵 SUBMITTED ({candidateAttempt.scorePercentage}%)
                                    </span>
                                  ) : candidateAttempt?.status === 'CLOSED' ? (
                                    <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-900 font-mono text-[9px] font-bold border border-rose-300">
                                      🔴 DISCONNECTED
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-mono text-[9px] font-bold border border-amber-300">
                                      🟡 JOINED
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {session.user?.email} • Joined {new Date(session.joinedAt).toLocaleTimeString()}
                                </div>
                              </div>

                              <button
                                onClick={() => handleDisconnectCandidate(room.id, session.user?.id, session.user?.name || 'Candidate')}
                                className="px-2.5 py-1 bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-800 border border-rose-300 rounded font-mono text-[10px] font-extrabold transition-all shadow-xs flex items-center gap-1 shrink-0"
                                title="Force Disconnect Candidate & End Active Exam Session"
                              >
                                ⚡ Disconnect
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        );
      })()}

      {/* Main Exam Grid Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Available Certification Tracks ({filteredExams.length})</h3>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exam tracks..."
            className="w-full bg-white border border-slate-300 rounded pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-ntms-blue font-medium shadow-sm"
          />
        </div>
      </div>

      {/* Main Exam Grid */}
      {filteredExams.length === 0 ? (
        <div className="bg-slate-50 border border-slate-300 rounded p-8 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-sky-100 text-ntms-navy mx-auto flex items-center justify-center font-bold">
            <Lock className="w-6 h-6 text-ntms-blue" />
          </div>
          <h4 className="text-sm font-extrabold text-slate-900">No Exam Track Currently Launched for Your Room</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Please enter your live Proctoring Exam Room Code above (provided by your Administrator/Instructor) to unlock and access your assigned examination track.
          </p>
        </div>
      ) : (
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
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => navigate(`/questions?examId=${exam.id}`)}
                          className="text-[10px] font-bold font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded transition-all flex items-center gap-1"
                          title="Manage Questions & Answer Key in Sequence"
                        >
                          <Edit3 className="w-3 h-3 text-emerald-700" />
                          <span>MANAGE Q&A</span>
                        </button>

                        <button
                          onClick={() => openEditExamModal(exam)}
                          className="text-[10px] font-bold font-mono px-2 py-0.5 bg-sky-50 text-ntms-navy border border-sky-300 hover:bg-sky-100 rounded transition-all flex items-center gap-1"
                          title="Edit Exam Track Details"
                        >
                          <Edit3 className="w-3 h-3 text-ntms-blue" />
                          <span>EDIT TRACK</span>
                        </button>
                      </div>
                    )}

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 border ${
                        canAccess ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-300'
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleGlobalUnlock(exam.id)}
                      className={`flex-1 py-1.5 rounded text-[11px] font-mono font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        isGloballyUnlocked ? 'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5 text-purple-700" />
                      <span>{isGloballyUnlocked ? '🌐 Globally Unlocked' : '🔒 Global Unlock'}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteExam(exam.id, exam.code)}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded font-bold text-[11px] transition-colors"
                      title="Delete Exam Track"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleStartExam(exam.id)}
                  disabled={!canAccess}
                  className={`w-full py-2.5 rounded text-xs font-bold shadow flex items-center justify-center gap-2 transition-all ${
                    canAccess ? 'bg-ntms-navy hover:bg-ntms-hoverBlue text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  }`}
                >
                  <span>{canAccess ? 'Launch Exam Engine ➜' : 'Locked by Exam Administrator'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Modal - Admin Create Room */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded border border-slate-300 max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-ntms-navy">Create New Live Exam Room</h3>
              <button onClick={() => setShowRoomModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Exam Track</label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-bold"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.code} - {ex.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Room Code (Students will enter this)</label>
                <input
                  type="text"
                  value={newRoomCode}
                  onChange={(e) => setNewRoomCode(e.target.value.toUpperCase())}
                  required
                  placeholder="e.g. AZ900-HALL-A"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Room Title</label>
                <input
                  type="text"
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  required
                  placeholder="e.g. Exam Hall 101 - Morning Shift"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Limit Number of Questions for Candidates in this Room</label>
                <select
                  value={newRoomQuestionCount}
                  onChange={(e) => setNewRoomQuestionCount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                >
                  <option value={0}>All Available Questions in Question Bank (Default)</option>
                  <option value={10}>10 Questions (Quick Quiz)</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions (Standard Quiz)</option>
                  <option value={25}>25 Questions</option>
                  <option value={30}>30 Questions (30-Min Test)</option>
                  <option value={40}>40 Questions</option>
                  <option value={50}>50 Questions (Comprehensive Test)</option>
                  <option value={60}>60 Questions</option>
                  <option value={70}>70 Questions</option>
                  <option value={80}>80 Questions</option>
                  <option value={90}>90 Questions (Full Bank)</option>
                </select>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-950 text-xs block">Allow Candidate Exam Review</span>
                  <span className="text-[10px] text-purple-700 block">Candidates can view question-by-question answer keys & explanations after submitting exam</span>
                </div>
                <input
                  type="checkbox"
                  checked={newRoomAllowReview}
                  onChange={(e) => setNewRoomAllowReview(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow">
                  Create Room & Unlock Exam ➜
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Admin Edit Exam Details */}
      {showEditExamModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded border border-slate-300 max-w-lg w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-ntms-navy">✏️ Edit Exam Track Details</h3>
              <button onClick={() => setShowEditExamModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditExam} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Exam Code</label>
                  <input
                    type="text"
                    value={editExamCode}
                    onChange={(e) => setEditExamCode(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vendor</label>
                  <select
                    value={editExamVendor}
                    onChange={(e) => setEditExamVendor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-bold"
                  >
                    <option value="MICROSOFT">Microsoft</option>
                    <option value="AWS">Amazon Web Services</option>
                    <option value="CISCO">Cisco</option>
                    <option value="COMPTIA">CompTIA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Exam Title</label>
                <input
                  type="text"
                  value={editExamTitle}
                  onChange={(e) => setEditExamTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={editExamDuration}
                    onChange={(e) => setEditExamDuration(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Passing %</label>
                  <input
                    type="number"
                    value={editExamPassingScore}
                    onChange={(e) => setEditExamPassingScore(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Exam Items Config</label>
                  <select
                    value={editTotalQuestions}
                    onChange={(e) => setEditTotalQuestions(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                  >
                    <option value={50}>50 Items (Standard)</option>
                    <option value={70}>70 Items (Expanded)</option>
                    <option value={90}>90 Items (Full Bank)</option>
                    <option value={0}>All Available Items</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editExamDescription}
                  onChange={(e) => setEditExamDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditExamModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded font-bold shadow">
                  Save Changes ➜
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Name Verification Modal */}
      <CandidateNameModal
        isOpen={nameModalConfig.isOpen}
        initialName={user?.name || ''}
        examTitle={nameModalConfig.examTitle}
        roomCode={nameModalConfig.roomCode}
        onConfirm={handleConfirmNameModal}
        onCancel={() => setNameModalConfig({ ...nameModalConfig, isOpen: false })}
      />
    </div>
  );
};
