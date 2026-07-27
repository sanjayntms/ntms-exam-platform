import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Award, Users, CheckCircle2, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-900 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-blue-400 font-semibold">
              {user?.role} PORTAL
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">Welcome back, {user?.name}!</h2>
            <p className="text-sm text-slate-400 mt-1">
              Enterprise Certification Testing & Assessment Engine configured with Microsoft Entra ID.
            </p>
          </div>
          <Link
            to="/exams"
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all shrink-0"
          >
            Browse Exam Catalog ➜
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Exams</span>
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{data?.stats?.totalExams || 0}</div>
          <span className="text-[11px] text-slate-500">Active Certification Tracks</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Question Bank</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white">{data?.stats?.totalQuestions || 0}</div>
          <span className="text-[11px] text-slate-500">16 Question Types Supported</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Attempts</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{data?.stats?.totalAttempts || 0}</div>
          <span className="text-[11px] text-slate-500">Candidate Session Submissions</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Overall Pass Rate</span>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400">{data?.stats?.overallPassRate || '0%'}</div>
          <span className="text-[11px] text-slate-500">Evaluated Certification Standard</span>
        </div>
      </div>

      {/* Recommended Exams */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          Featured Certification Exams
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                MICROSOFT
              </span>
              <h4 className="font-bold text-base text-white mt-2">AZ-900: Azure Fundamentals</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Covers cloud concepts, core Azure services, security, privacy, pricing, and support.
              </p>
            </div>
            <Link
              to="/exams"
              className="w-full text-center py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg text-xs font-semibold transition-all border border-blue-500/30"
            >
              Start Exam Session ➜
            </Link>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">
                AWS
              </span>
              <h4 className="font-bold text-base text-white mt-2">AWS Solutions Architect</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Demonstrate expertise in designing resilient, high-performing AWS architectures.
              </p>
            </div>
            <Link
              to="/exams"
              className="w-full text-center py-2 bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white rounded-lg text-xs font-semibold transition-all border border-amber-500/30"
            >
              Start Exam Session ➜
            </Link>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-700/50">
                CISCO
              </span>
              <h4 className="font-bold text-base text-white mt-2">200-301 CCNA Certification</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Network access, IP connectivity, security fundamentals, and automation.
              </p>
            </div>
            <Link
              to="/exams"
              className="w-full text-center py-2 bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white rounded-lg text-xs font-semibold transition-all border border-teal-500/30"
            >
              Start Exam Session ➜
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
