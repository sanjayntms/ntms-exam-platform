import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Award, Users, TrendingUp, Monitor, History, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [myAttempts, setMyAttempts] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [res, attRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/attempts/my'),
        ]);
        setData(res.data);
        setMyAttempts(attRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome Banner */}
      <div className="bg-ntms-navy text-white rounded-lg p-6 border-b-4 border-ntms-blue shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-sky-300 font-bold">
              NTMS CERTIFICATION PORTAL
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">Welcome, {user?.name}!</h2>
            <p className="text-xs text-slate-200 mt-1">
              NTMS examination delivery environment initialized with Microsoft Entra ID authentication.
            </p>
          </div>
          <Link
            to="/exams"
            className="px-5 py-2.5 bg-ntms-blue hover:bg-ntms-hoverBlue text-white rounded font-bold text-xs shadow transition-all shrink-0 border border-sky-400"
          >
            Launch Exam Catalog ➜
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider">Active Exams</span>
            <BookOpen className="w-5 h-5 text-ntms-navy" />
          </div>
          <div className="text-3xl font-extrabold text-ntms-navy">{data?.stats?.totalExams || 6}</div>
          <span className="text-[11px] text-slate-500">Selected Exam Tracks</span>
        </div>

        <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider">My Attempt History</span>
            <History className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{myAttempts.length}</div>
          <span className="text-[11px] text-slate-500">Submissions Logged</span>
        </div>

        <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider">Question Bank</span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{data?.stats?.totalQuestions || 338}</div>
          <span className="text-[11px] text-slate-500">16 Item Formats Supported</span>
        </div>

        <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Pass Rate</span>
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">{data?.stats?.overallPassRate || '0%'}</div>
          <span className="text-[11px] text-slate-500">Certification Benchmark</span>
        </div>
      </div>

      {/* Candidate Past Exam Attempt History */}
      <div className="bg-white border border-slate-300 rounded p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-ntms-navy flex items-center gap-2">
          <History className="w-5 h-5 text-ntms-blue" />
          Candidate Student Exam History
        </h3>

        {myAttempts.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded border border-slate-200 text-xs font-semibold text-slate-600">
            You have not taken any exams yet. Go to the <Link to="/exams" className="text-ntms-blue underline font-bold">Exam Catalog</Link> to take an unlocked exam.
          </div>
        ) : (
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Exam Track</th>
                  <th className="p-3">Score %</th>
                  <th className="p-3">Correct / Total</th>
                  <th className="p-3">Date Completed</th>
                  <th className="p-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {myAttempts.map((att: any) => (
                  <tr key={att.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{att.exam?.code || 'Certification Exam'}</td>
                    <td className="p-3 font-extrabold text-sm text-slate-900">{att.scorePercentage}%</td>
                    <td className="p-3 font-mono text-slate-700">
                      {att.correctAnswers} / {att.totalQuestions} Qs
                    </td>
                    <td className="p-3 font-mono text-slate-600">
                      {new Date(att.startedAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
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

      {/* Available Certification Tracks */}
      <div className="bg-white border border-slate-300 rounded p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-ntms-navy flex items-center gap-2">
          <Monitor className="w-5 h-5 text-ntms-blue" />
          Featured Microsoft Certification Tracks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { code: 'SC-200', title: 'Security Operations Analyst', qs: '115 Questions' },
            { code: 'AZ-305', title: 'Azure Solutions Architect', qs: '100 Questions' },
            { code: 'AZ-104', title: 'Azure Administrator', qs: '24 Questions' },
            { code: 'AI-901', title: 'Azure AI Foundry Solutions', qs: '18 Questions' },
            { code: 'AI-900', title: 'Azure AI Fundamentals', qs: '38 Questions' },
            { code: 'AZ-900', title: 'Azure Fundamentals', qs: '43 Questions' },
          ].map((item) => (
            <div key={item.code} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-ntms-navy border border-sky-300">
                  {item.code}
                </span>
                <h4 className="font-bold text-xs text-slate-900 mt-2">{item.title}</h4>
                <p className="text-[11px] text-slate-600 mt-1 font-mono">{item.qs}</p>
              </div>
              <Link
                to="/exams"
                className="w-full text-center py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded text-xs font-bold transition-all shadow"
              >
                Catalog ➜
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
