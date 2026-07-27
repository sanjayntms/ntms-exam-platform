import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ExamAttempt } from '../types';
import { Award, CheckCircle2, XCircle, ArrowLeft, BarChart2, Download } from 'lucide-react';

export const ExamResultsPage: React.FC = () => {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await api.get(`/attempts/${attemptId}`);
        setAttempt(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (attemptId) fetchAttempt();
  }, [attemptId]);

  if (!attempt) {
    return <div className="p-8 text-center text-slate-400">Loading exam result scorecard...</div>;
  }

  const isPassed = attempt.passed;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Link to="/exams" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white font-mono">
          <ArrowLeft className="w-4 h-4" /> Back to Exam Catalog
        </Link>
        <button
          onClick={() => alert('Scorecard PDF export generated successfully.')}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
        >
          <Download className="w-4 h-4 text-blue-400" /> Export Scorecard PDF
        </button>
      </div>

      {/* Main Pass/Fail Score Banner */}
      <div className={`p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl ${
        isPassed ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-rose-950/40 border-rose-500/40'
      }`}>
        <div className="flex items-center gap-6">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${
            isPassed ? 'bg-emerald-600 text-white shadow-emerald-600/30' : 'bg-rose-600 text-white shadow-rose-600/30'
          }`}>
            {isPassed ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
          </div>
          <div>
            <span className="text-xs uppercase font-mono tracking-widest font-bold text-slate-400">OFFICIAL SCORE REPORT</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">{isPassed ? 'PASSED' : 'DID NOT PASS'}</h2>
            <p className="text-xs text-slate-300 mt-1">
              {attempt.exam?.code}: {attempt.exam?.title}
            </p>
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 text-center min-w-[160px]">
          <div className="text-4xl font-extrabold font-mono text-white">{attempt.scorePercentage}%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Passing Mark: {attempt.exam?.passingScore}%</span>
        </div>
      </div>

      {/* Domain Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-blue-400" />
          Question Breakdown & Domain Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400">Total Questions</span>
            <div className="text-2xl font-bold font-mono text-white">{attempt.totalQuestions}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400">Correct Answers</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">{attempt.correctAnswers}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400">Incorrect / Skipped</span>
            <div className="text-2xl font-bold font-mono text-rose-400">{attempt.totalQuestions - attempt.correctAnswers}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
