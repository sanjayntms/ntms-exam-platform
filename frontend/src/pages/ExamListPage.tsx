import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Exam } from '../types';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, Play, Filter, Search } from 'lucide-react';
import { useExamSession } from '../context/ExamSessionContext';

export const ExamListPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { setExamSession } = useExamSession();

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

  const handleStartExam = async (examId: string) => {
    try {
      const res = await api.post('/attempts/start', { examId });
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Exam Catalog & Certification Tracks</h2>
          <p className="text-xs text-slate-400 mt-1">Select an active certification track to launch Pearson VUE Exam Engine</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exam code or title..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                  {exam.vendor}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-400">{exam.code}</span>
              </div>

              <h3 className="font-bold text-base text-white leading-snug">{exam.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{exam.description}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{exam.timeLimitMinutes} mins</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pass: {exam.passingScore}%</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartExam(exam.id)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                Launch Exam Engine
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
