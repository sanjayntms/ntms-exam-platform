import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Award, Users, CheckCircle2, TrendingUp, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setData(res.data);
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
          <div className="text-3xl font-extrabold text-ntms-navy">{data?.stats?.totalExams || 5}</div>
          <span className="text-[11px] text-slate-500">Selected Exam Tracks</span>
        </div>

        <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider">Question Bank</span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{data?.stats?.totalQuestions || 10}</div>
          <span className="text-[11px] text-slate-500">16 Item Formats Supported</span>
        </div>

        <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider">Exam Sessions</span>
            <Users className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{data?.stats?.totalAttempts || 0}</div>
          <span className="text-[11px] text-slate-500">Candidate Test Submissions</span>
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

      {/* Featured Certification Tracks */}
      <div className="bg-white border border-slate-300 rounded p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-ntms-navy flex items-center gap-2">
          <Monitor className="w-5 h-5 text-ntms-blue" />
          Available Exam Tracks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300">
                PRACTICE
              </span>
              <h4 className="font-bold text-xs text-slate-900 mt-2">Interview QA</h4>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                Cloud Architect & Azure DevOps technical interview questions.
              </p>
            </div>
            <Link
              to="/exams"
              className="w-full text-center py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded text-xs font-bold transition-all shadow"
            >
              Start Practice ➜
            </Link>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-300">
                AZURE
              </span>
              <h4 className="font-bold text-xs text-slate-900 mt-2">AZ-900</h4>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                Microsoft Azure Fundamentals certification.
              </p>
            </div>
            <Link
              to="/exams"
              className="w-full text-center py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded text-xs font-bold transition-all shadow"
            >
              Start Exam ➜
            </Link>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-300">
                AZURE
              </span>
              <h4 className="font-bold text-xs text-slate-900 mt-2">AZ-104</h4>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                Microsoft Azure Administrator certification.
              </p>
            </div>
            <Link
              to="/exams"
              className="w-full text-center py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded text-xs font-bold transition-all shadow"
            >
              Start Exam ➜
            </Link>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-300">
                DEVOPS
              </span>
              <h4 className="font-bold text-xs text-slate-900 mt-2">Terraform</h4>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                HashiCorp Certified Terraform Associate.
              </p>
            </div>
            <Link
              to="/exams"
              className="w-full text-center py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded text-xs font-bold transition-all shadow"
            >
              Start Exam ➜
            </Link>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                RESOURCE
              </span>
              <h4 className="font-bold text-xs text-slate-900 mt-2">Azure Specific</h4>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                Storage Accounts & Virtual Networks (VNets).
              </p>
            </div>
            <Link
              to="/exams"
              className="w-full text-center py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded text-xs font-bold transition-all shadow"
            >
              Start Exam ➜
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
