import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Award, CheckCircle2, XCircle, FileText, Printer, ShieldCheck } from 'lucide-react';
import { ScoreReportModal } from '../components/ScoreReportModal';
import { ExamAttempt } from '../types';

export const AnalyticsPage: React.FC = () => {
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<ExamAttempt | null>(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await api.get('/attempts/history');
        setAttempts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAttempts();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-ntms-navy tracking-tight">
            Candidate Exam Performance & Score Reports
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Official transcript generation, section domain breakdowns & certification verification
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200 rounded text-ntms-navy text-xs font-mono font-bold">
          <ShieldCheck className="w-4 h-4 text-ntms-blue" />
          <span>Official Certification Transcripts</span>
        </div>
      </div>

      {/* Candidate Score Reports Table */}
      <div className="bg-white border border-slate-300 rounded overflow-hidden shadow-sm">
        <div className="bg-slate-100 px-5 py-3 border-b border-slate-300 flex justify-between items-center">
          <h3 className="font-bold text-xs text-ntms-navy uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-ntms-blue" />
            Completed Exam Score Reports
          </h3>
          <span className="text-[11px] font-mono text-slate-500 font-bold">
            {attempts.length} Exam Transcripts Available
          </span>
        </div>

        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-50 text-slate-700 font-mono text-[11px] uppercase border-b border-slate-300">
            <tr>
              <th className="p-3.5">Transcript ID</th>
              <th className="p-3.5">Exam Code & Title</th>
              <th className="p-3.5">Date Completed</th>
              <th className="p-3.5">Scaled Score</th>
              <th className="p-3.5">Result</th>
              <th className="p-3.5 text-right">Official Score Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {attempts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                  No completed exam attempts found. Launch an exam from the catalog to generate score reports!
                </td>
              </tr>
            ) : (
              attempts.map((att) => {
                const scaledScore = Math.round(300 + (att.scorePercentage / 100) * 700);
                return (
                  <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-mono font-extrabold text-ntms-navy">
                      NTMS-{att.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{att.exam?.title || 'Certification Exam'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{att.exam?.code || 'NTMS-EXAM'}</div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">
                      {new Date(att.startedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 font-mono font-extrabold text-slate-900 text-sm">
                      {scaledScore} <span className="text-[10px] text-slate-500 font-normal">/ 1000</span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px]">
                      {att.passed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 font-extrabold">
                          <XCircle className="w-3.5 h-3.5" /> NO PASS
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedAttempt(att)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded font-bold text-xs shadow transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Generate Score Report ➜</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Official Score Report Viewer Modal */}
      <ScoreReportModal attempt={selectedAttempt} onClose={() => setSelectedAttempt(null)} />
    </div>
  );
};
