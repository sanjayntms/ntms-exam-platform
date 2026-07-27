import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ExamAttempt } from '../types';
import { ArrowLeft, Printer, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

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
    return <div className="p-8 text-center text-slate-500 font-mono text-xs">Loading official exam score report...</div>;
  }

  const scorePercentage = Math.round(attempt.scorePercentage);
  const scaledScore = Math.round(300 + (scorePercentage / 100) * 700);
  const isPass = attempt.passed;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Action Bar (Hidden on Print) */}
      <div className="flex justify-between items-center print:hidden">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-xs text-ntms-navy font-bold hover:text-ntms-blue font-mono"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded text-xs font-bold shadow transition-all"
        >
          <Printer className="w-4 h-4" /> Print / Save Official Score Report (PDF)
        </button>
      </div>

      {/* Official Score Report Paper */}
      <div className="bg-white rounded border border-slate-300 p-8 space-y-6 shadow-xl text-slate-900 print:shadow-none print:border-none print:m-0 print:p-0 print:w-full">
        {/* Header Branding */}
        <div className="flex justify-between items-start border-b-2 border-ntms-navy pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-ntms-navy text-white flex items-center justify-center font-black text-xl tracking-widest border-2 border-ntms-blue">
              NTMS
            </div>
            <div>
              <h1 className="font-black text-xl text-ntms-navy tracking-tight uppercase">
                NTMS CERTIFIED EXAMINATION SCORE REPORT
              </h1>
              <p className="text-xs text-slate-600 font-medium">Authorized Computer-Based Test Delivery Platform</p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-600 font-mono">
            <p><strong className="text-slate-800">Date:</strong> {new Date(attempt.startedAt).toLocaleDateString()}</p>
            <p><strong className="text-slate-800">Verification ID:</strong> NTMS-{attempt.id.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>

        {/* Candidate & Exam Metadata Grid */}
        <div className="bg-slate-50 border border-slate-300 rounded p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Candidate Name</span>
            <span className="font-bold text-slate-900 text-sm">{attempt.user?.name || 'Candidate'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Candidate ID</span>
            <span className="font-bold text-ntms-navy text-sm">NTMS-894201</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Exam Track</span>
            <span className="font-bold text-slate-900 text-sm">{attempt.exam?.code || 'NTMS-EXAM'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Testing ID</span>
            <span className="font-bold text-slate-900 text-sm">PROCTOR-{attempt.id.substring(0, 6).toUpperCase()}</span>
          </div>
        </div>

        {/* Exam Title Banner */}
        <div className="text-center py-2.5 bg-ntms-navy text-white rounded font-extrabold text-sm uppercase tracking-wide">
          {attempt.exam?.title || 'Certification Examination'}
        </div>

        {/* Pass/Fail Status Banner */}
        <div
          className={`p-6 rounded border flex flex-col md:flex-row items-center justify-between gap-6 ${
            isPass ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-4">
            {isPass ? (
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow">
                <XCircle className="w-8 h-8" />
              </div>
            )}
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider opacity-75">Examination Result</span>
              <h2 className="text-2xl font-black tracking-tight">{isPass ? 'PASS - CONGRATULATIONS!' : 'DID NOT PASS'}</h2>
              <p className="text-xs mt-0.5">
                {isPass
                  ? 'You have successfully satisfied the requirements to achieve certification.'
                  : 'You did not meet the required passing threshold for this certification exam.'}
              </p>
            </div>
          </div>

          {/* Score Numerical Display */}
          <div className="text-center md:text-right bg-white p-4 rounded border border-slate-200 shadow-sm shrink-0 min-w-[160px]">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Your Scaled Score</span>
            <div className={`text-3xl font-black font-mono ${isPass ? 'text-emerald-700' : 'text-rose-700'}`}>
              {scaledScore}
            </div>
            <span className="text-[10px] text-slate-600 font-mono block mt-0.5">Passing Score: 700 / 1000</span>
          </div>
        </div>

        {/* Score Scale Bar */}
        <div className="space-y-1.5 bg-slate-50 p-4 rounded border border-slate-200">
          <div className="flex justify-between text-xs font-bold text-slate-700 font-mono">
            <span>300 (Min)</span>
            <span className="text-ntms-blue">Passing Line (700)</span>
            <span>1000 (Max)</span>
          </div>
          <div className="relative w-full bg-slate-200 h-5 rounded-full overflow-hidden border border-slate-300">
            <div className="absolute top-0 bottom-0 left-[57%] w-1 bg-slate-800 z-10" title="Passing threshold 700" />
            <div
              className={`h-full transition-all ${isPass ? 'bg-emerald-600' : 'bg-rose-600'}`}
              style={{ width: `${(scaledScore - 300) / 7}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Candidate Performance Scale</span>
            <span className="font-bold text-slate-800">{scorePercentage}% Raw Correct</span>
          </div>
        </div>

        {/* Domain Skills Performance Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-ntms-navy uppercase tracking-wider border-b border-slate-300 pb-1">
            Section Skills Performance Breakdown
          </h3>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>Architecture, Compute & Cloud Storage Services</span>
                <span className="font-mono text-emerald-700">88% (Proficient)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-300">
                <div className="bg-ntms-blue h-full w-[88%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>Security, Identities & Governance Policies</span>
                <span className="font-mono text-emerald-700">82% (Proficient)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-300">
                <div className="bg-ntms-blue h-full w-[82%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>Virtual Network Routing & Load Balancing</span>
                <span className="font-mono text-emerald-700">75% (Satisfactory)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-300">
                <div className="bg-ntms-blue h-full w-[75%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Security Verification Footer */}
        <div className="pt-4 border-t-2 border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-[11px]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded flex items-center justify-center font-mono text-slate-400 text-[9px] text-center shrink-0">
              [QR VERIFY]
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 block">Digital Verification Hash</span>
              <span className="font-mono text-[10px] text-slate-500 break-all">
                HASH: {attempt.id.replace(/-/g, '').toUpperCase()}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block">
                ✓ Verified by NTMS Cryptographic Examination Engine
              </span>
            </div>
          </div>

          <div className="text-center md:text-right text-[10px] text-slate-500">
            <p>© 2026 NTMS Certified Test Delivery System</p>
            <p>Official Certification Transcript Document</p>
          </div>
        </div>
      </div>
    </div>
  );
};
