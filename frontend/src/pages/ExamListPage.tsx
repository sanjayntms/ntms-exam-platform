import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Exam } from '../types';
import { useNavigate } from 'react-router-dom';
import { Clock, Award, Play, Search, Lock, Unlock, ShieldAlert } from 'lucide-react';
import { useExamSession } from '../context/ExamSessionContext';
import { useAuth } from '../context/AuthContext';

export const ExamListPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { setExamSession } = useExamSession();
  const { user } = useAuth();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get('/exams');
        setExams(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleStartExam = async (exam: Exam) => {
    if (user?.role === 'CANDIDATE' && exam.isUnlocked === false) {
      alert(`⚠️ Exam "${exam.code}" is currently LOCKED for your account.\n\nPlease contact Admin (sanjay@ntmsentra.onmicrosoft.com) to request access unlock.`);
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

  const filteredExams = exams.filter(
    (e) => e.title.toLowerCase().includes(search.toLowerCase()) || e.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded border border-slate-300 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-ntms-navy tracking-tight">NTMS Exam Catalog & Certification Tracks</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {user?.role === 'CANDIDATE'
              ? 'Access unlocked certification exams assigned by Admin (sanjay@ntmsentra.onmicrosoft.com)'
              : 'Select a track below to launch NTMS Test Delivery Engine'}
          </p>
        </div>

        <div className="relative w-full md:w-72">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => {
          const isLocked = user?.role === 'CANDIDATE' && exam.isUnlocked === false;

          return (
            <div
              key={exam.id}
              className={`bg-white border rounded p-6 flex flex-col justify-between transition-all space-y-4 shadow-sm relative ${
                isLocked ? 'border-slate-300 bg-slate-50/50 opacity-90' : 'border-slate-300 hover:border-ntms-navy'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-ntms-navy border border-sky-300">
                    {exam.vendor}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-600">{exam.code}</span>
                    {user?.role === 'CANDIDATE' && (
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 border ${
                          isLocked
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {isLocked ? <Lock className="w-3 h-3 text-rose-600" /> : <Unlock className="w-3 h-3 text-emerald-600" />}
                        {isLocked ? 'LOCKED' : 'UNLOCKED'}
                      </span>
                    )}
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

                {isLocked ? (
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 bg-slate-300 text-slate-600 cursor-not-allowed rounded font-bold text-xs flex items-center justify-center gap-2 border border-slate-400"
                    >
                      <Lock className="w-4 h-4 text-slate-600" />
                      Locked by Admin
                    </button>
                    <p className="text-[10px] font-mono text-center text-rose-700 font-semibold flex items-center justify-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Contact sanjay@ntmsentra.onmicrosoft.com to unlock
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
    </div>
  );
};
