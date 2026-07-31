import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Award, Users, TrendingUp, Monitor, History, CheckCircle2, DoorOpen, ShieldCheck, Sparkles, Play, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CandidateNameModal } from '../components/common/CandidateNameModal';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [myAttempts, setMyAttempts] = useState<any[]>([]);
  const [activeExams, setActiveExams] = useState<any[]>([]);
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [joinLoading, setJoinLoading] = useState<boolean>(false);
  const [showNameModal, setShowNameModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [res, attRes, examsRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/attempts/my'),
          api.get('/exams'),
        ]);
        setData(res.data);
        setMyAttempts(attRes.data);
        const unlocked = (examsRes.data || []).filter((e: any) => user?.role === 'ADMINISTRATOR' || e.isUnlocked);
        setActiveExams(unlocked);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, [user]);

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;

    if (!user) {
      alert('🔒 Authentication Required: Only logged-in candidates can enter an Exam Room. Please log in or register.');
      navigate('/login');
      return;
    }

    setShowNameModal(true);
  };

  const handleConfirmNameAndJoin = async (candidateFullName: string, questionCount?: number) => {
    setShowNameModal(false);
    setJoinLoading(true);
    try {
      const res = await api.post('/rooms/join', {
        roomCode: roomCodeInput.trim(),
        candidateName: candidateFullName,
        questionCount,
      });

      alert(`✅ ${res.data.message}`);

      // Launch exam session
      const startRes = await api.post('/attempts/start', {
        examId: res.data.exam.id,
        roomId: res.data.room?.id,
        candidateName: candidateFullName,
        questionCount,
      });
      navigate(`/exam-session/${startRes.data.attemptId}`);
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert('🔒 Authentication Required: Please log in to enter an Exam Room.');
        navigate('/login');
      } else {
        alert('⚠️ Exam Room Error: ' + (err.response?.data?.error || err.message));
      }
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-8">
      {/* Hero Cinematic Section */}
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/cinematic_exam_hall.jpg"
            alt="Cinematic Examination Hall with Teacher Proctor and Students"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-8 md:p-12 lg:p-14 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>NTMS Proctored Exam Hall & Engine v2.0</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Enterprise Examination Center <br />
              <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                & Certification Halls
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
              State-of-the-art proctored testing environment for Microsoft Certification tracks. Experience official exam simulations with Answer Area Dropdowns, Drag-and-Drop, Case Studies, and Live Interactive Terminals.
            </p>
          </div>

          {/* Quick Room Code Entry Box */}
          <form onSubmit={handleJoinRoom} className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-xl backdrop-blur-md shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-ntms-blue/20 rounded-lg border border-sky-500/30">
                <DoorOpen className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">Enter Exam Room Code</h4>
                <p className="text-[11px] text-slate-400">Join a live hall session (e.g. HALL-AZ900)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                required
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                placeholder="ROOM CODE..."
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white focus:border-sky-400 focus:outline-none w-full sm:w-44 uppercase tracking-widest text-center shadow-inner"
              />
              <button
                type="submit"
                disabled={joinLoading}
                className="px-5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-lg text-xs font-bold shadow-md transition-all shrink-0 flex items-center gap-1.5"
              >
                <span>{joinLoading ? 'Joining...' : 'Enter Hall'}</span>
                <Play className="w-3.5 h-3.5 fill-white" />
              </button>
            </div>
          </form>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/exams"
              className="px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 rounded-lg text-xs font-extrabold shadow-lg transition-all flex items-center gap-2"
            >
              <Monitor className="w-4 h-4 text-ntms-blue" />
              Browse Exam Catalog & Tracks
            </Link>
            <Link
              to="/analytics"
              className="px-6 py-3 bg-slate-800/80 hover:bg-slate-800 text-white rounded-lg text-xs font-bold border border-slate-700 transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              View Score Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* In-Progress Exam Resume Banner for VM Restore / Recovery */}
      {(() => {
        const inProgress = myAttempts.find(
          (att: any) => !att.completedAt && att.status !== 'EVALUATED' && att.status !== 'CLOSED' && att.status !== 'EXPIRED'
        );
        if (!inProgress) return null;

        return (
          <div className="bg-amber-50 border-2 border-amber-400 p-5 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-slate-900 animate-pulse">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-200 text-amber-900 font-mono text-[11px] font-bold uppercase">
                <Play className="w-3.5 h-3.5 text-amber-800" /> Active Exam Session In Progress
              </div>
              <h3 className="text-base font-extrabold text-amber-950">
                Resume Active Exam: {inProgress.exam?.code || 'Certification Exam'} - {inProgress.exam?.title}
              </h3>
              <p className="text-xs text-amber-800 font-medium">
                Started on {new Date(inProgress.startedAt).toLocaleString()}. All previous answer selections & timer progress have been restored.
              </p>
            </div>

            <button
              onClick={() => navigate(`/exam-session/${inProgress.id}`)}
              className="px-6 py-3 bg-ntms-navy hover:bg-ntms-hoverBlue text-white font-extrabold rounded-lg text-xs shadow-lg transition-all flex items-center gap-2 shrink-0 border border-sky-400/40"
            >
              <span>Resume Active Exam Engine ➜</span>
            </button>
          </div>
        );
      })()}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-all">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Certification Tracks</span>
            <div className="p-2 bg-sky-50 rounded-lg text-ntms-blue">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{data?.stats?.totalExams || 6}</div>
          <span className="text-[11px] text-slate-500 font-medium">SC-200, AZ-305, AZ-104, AI-900...</span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-all">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Attempts Logged</span>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <History className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{myAttempts.length}</div>
          <span className="text-[11px] text-slate-500 font-medium">Recorded Candidate Sessions</span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-all">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Question Item Bank</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">338+</div>
          <span className="text-[11px] text-slate-500 font-medium">Answer Area, Drag/Drop, KQL</span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-all">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Proctored Security</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-700">100%</div>
          <span className="text-[11px] text-slate-500 font-medium">Auto Lock on Logout</span>
        </div>
      </div>

      {/* Candidate Student Exam History Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-ntms-blue" />
            My Candidate Student Exam History
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500">{myAttempts.length} Submissions Logged</span>
        </div>

        {myAttempts.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 space-y-2">
            <p>You have not taken any exams yet.</p>
            <Link to="/exams" className="inline-block px-4 py-2 bg-ntms-navy text-white rounded font-bold text-xs shadow">
              Go to Exam Catalog ➜
            </Link>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] uppercase border-b border-slate-200">
                <tr>
                  <th className="p-4">Exam Track</th>
                  <th className="p-4">Score %</th>
                  <th className="p-4">Correct Answers</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {myAttempts.map((att: any) => (
                  <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{att.exam?.code || 'Certification Exam'}</td>
                    <td className="p-4 font-extrabold text-sm text-slate-900">{att.scorePercentage}%</td>
                    <td className="p-4 font-mono text-slate-700">
                      {att.correctAnswers} / {att.totalQuestions} Questions
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      {new Date(att.startedAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`px-3 py-1 rounded font-mono font-bold text-[10px] border ${
                          att.passed
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border-rose-300'
                        }`}
                      >
                        {att.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Launched Certification Tracks */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-ntms-blue" />
          Active Launched Certification Tracks ({activeExams.length})
        </h3>

        {activeExams.length === 0 ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2 text-xs font-semibold text-slate-600">
            <p>No active exam track currently launched for your session.</p>
            <p className="text-[11px] text-slate-500">Please enter your Exam Room Code above to launch your assigned room exam.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {activeExams.map((item) => (
              <div key={item.id || item.code} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between hover:border-ntms-navy transition-all">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-ntms-navy border border-sky-300">
                    {item.code}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-2 line-clamp-2">{item.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 font-mono">{item.vendor || 'MICROSOFT'}</p>
                </div>
                <Link
                  to="/exams"
                  className="w-full text-center py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded-lg text-xs font-bold transition-all shadow"
                >
                  Enter Exam ➜
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Candidate Name Verification Modal */}
      <CandidateNameModal
        isOpen={showNameModal}
        initialName={user?.name || ''}
        roomCode={roomCodeInput}
        onConfirm={handleConfirmNameAndJoin}
        onCancel={() => setShowNameModal(false)}
      />
    </div>
  );
};
