import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import {
  Award,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  Search,
  Calendar,
  Filter,
  Download,
  RotateCcw,
  UserCheck,
  TrendingUp,
  Percent,
  Layers,
} from 'lucide-react';
import { ScoreReportModal } from '../components/ScoreReportModal';
import { ExamAttempt, Exam } from '../types';

export const AnalyticsPage: React.FC = () => {
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState<ExamAttempt | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [resultState, setResultState] = useState<'ALL' | 'PASSED' | 'FAILED'>('ALL');
  const [minScore, setMinScore] = useState('');
  const [maxScore, setMaxScore] = useState('');

  // Fetch Exams list for dropdown
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get('/exams');
        setExams(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExams();
  }, []);

  // Fetch Filtered Attempts from Backend
  const fetchFilteredAttempts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (selectedExamId !== 'ALL') params.examId = selectedExamId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (resultState !== 'ALL') params.resultState = resultState;
      if (minScore !== '') params.minScore = minScore;
      if (maxScore !== '') params.maxScore = maxScore;

      const res = await api.get('/attempts/search', { params });
      setAttempts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedExamId, startDate, endDate, resultState, minScore, maxScore]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFilteredAttempts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchFilteredAttempts]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedExamId('ALL');
    setStartDate('');
    setEndDate('');
    setResultState('ALL');
    setMinScore('');
    setMaxScore('');
  };

  // Quick Date Preset Handlers
  const handleSetQuickDate = (preset: 'TODAY' | 'WEEK' | 'MONTH' | 'ALL') => {
    const now = new Date();
    if (preset === 'ALL') {
      setStartDate('');
      setEndDate('');
      return;
    }

    let start = new Date();
    if (preset === 'TODAY') {
      start.setHours(0, 0, 0, 0);
    } else if (preset === 'WEEK') {
      start.setDate(now.getDate() - 7);
    } else if (preset === 'MONTH') {
      start.setDate(now.getDate() - 30);
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(now.toISOString().split('T')[0]);
  };

  // Export Filtered Results to CSV
  const handleExportCSV = () => {
    if (attempts.length === 0) {
      alert('No candidate exam records available to export.');
      return;
    }

    const headers = ['Verification ID', 'Candidate Name', 'Username / Email', 'Exam Track', 'Date Completed', 'Raw Score %', 'Scaled Score (1000)', 'Result'];
    const rows = attempts.map((att) => {
      const candidateName = att.candidateName || att.user?.name || 'Candidate';
      const userEmail = att.user?.email || 'N/A';
      const examCode = att.exam?.code || 'EXAM';
      const dateStr = new Date(att.startedAt).toLocaleString();
      const rawPct = att.scorePercentage || 0;
      const scaled = Math.round(300 + (rawPct / 100) * 700);
      const resultStr = att.passed ? 'PASSED' : 'DID NOT PASS';
      return [
        `NTMS-${att.id.substring(0, 8).toUpperCase()}`,
        `"${candidateName.replace(/"/g, '""')}"`,
        `"${userEmail}"`,
        `"${examCode}"`,
        `"${dateStr}"`,
        `${rawPct}%`,
        scaled,
        resultStr,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Candidate_Exam_Results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics Calculation
  const totalFiltered = attempts.length;
  const passedCount = attempts.filter((a) => a.passed).length;
  const failedCount = totalFiltered - passedCount;
  const passRate = totalFiltered > 0 ? Math.round((passedCount / totalFiltered) * 100) : 0;
  const avgScaledScore =
    totalFiltered > 0
      ? Math.round(attempts.reduce((sum, a) => sum + Math.round(300 + (a.scorePercentage / 100) * 700), 0) / totalFiltered)
      : 0;

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[11px] uppercase font-bold border border-sky-400/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
            <span>Administrator Assessment & Audit Center</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Candidate Examination Audit & Score Search</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Search, filter, and inspect detailed candidate examination records across custom date ranges, full names, usernames, scores, and result states.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-2 shrink-0 border border-emerald-400/30"
        >
          <Download className="w-4 h-4" />
          <span>Export Filtered CSV Report</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase font-mono tracking-wider">Filtered Sessions</span>
            <UserCheck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalFiltered}</div>
          <span className="text-[11px] text-slate-500 font-medium">Matching search criteria</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase font-mono tracking-wider">Pass vs Did Not Pass</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-black text-emerald-700">{passedCount} Pass</span>
            <span className="text-sm font-bold text-rose-700">{failedCount} Fail</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Successful certifications</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase font-mono tracking-wider">Overall Pass Rate</span>
            <Percent className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-900">{passRate}%</div>
          <span className="text-[11px] text-slate-500 font-medium">Cohort qualification rate</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase font-mono tracking-wider">Avg Scaled Score</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {avgScaledScore} <span className="text-xs text-slate-500 font-normal">/ 1000</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Passing threshold: 700 / 1000</span>
        </div>
      </div>

      {/* Comprehensive Search & Filter Control Panel */}
      <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
          <h3 className="font-bold text-xs text-ntms-navy uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-ntms-blue" />
            Customized Record Search & Filters
          </h3>

          {/* Quick Date Presets */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[11px] text-slate-500 mr-1 font-bold">Presets:</span>
            <button
              onClick={() => handleSetQuickDate('ALL')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                !startDate && !endDate ? 'bg-ntms-navy text-white border-ntms-navy' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => handleSetQuickDate('TODAY')}
              className="px-2.5 py-1 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
            >
              Today
            </button>
            <button
              onClick={() => handleSetQuickDate('WEEK')}
              className="px-2.5 py-1 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => handleSetQuickDate('MONTH')}
              className="px-2.5 py-1 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
            >
              This Month
            </button>
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Candidate Name / Username / Email Search */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Candidate Search (Name / Username / ID)</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Full name, email, or ID..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:border-ntms-blue focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Exam Track Dropdown */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Certification Exam Track</label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-bold focus:border-ntms-blue focus:outline-none"
            >
              <option value="ALL">All Certification Tracks</option>
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.code} - {ex.title}
                </option>
              ))}
            </select>
          </div>

          {/* Customized Date Range - Start Date */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Start Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 font-mono focus:border-ntms-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Customized Date Range - End Date */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">End Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 font-mono focus:border-ntms-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Result State Filter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Result State</label>
            <select
              value={resultState}
              onChange={(e) => setResultState(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-bold focus:border-ntms-blue focus:outline-none"
            >
              <option value="ALL">All Results (Pass & Fail)</option>
              <option value="PASSED">✅ PASS (Passed Only)</option>
              <option value="FAILED">❌ DID NOT PASS (Failed Only)</option>
            </select>
          </div>

          {/* Min Score % */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Min Score %</label>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 70%"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono focus:border-ntms-blue focus:outline-none"
            />
          </div>

          {/* Max Score % */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Max Score %</label>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 100%"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono focus:border-ntms-blue focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-2">
            <button
              onClick={handleResetFilters}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold border border-slate-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Score Reports Table */}
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <div className="bg-slate-100 px-5 py-3 border-b border-slate-300 flex justify-between items-center">
          <h3 className="font-bold text-xs text-ntms-navy uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-ntms-blue" />
            Filtered Candidate Exam Records ({attempts.length})
          </h3>
          {loading && <span className="text-xs text-sky-600 font-mono font-bold animate-pulse">Searching records...</span>}
        </div>

        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-50 text-slate-700 font-mono text-[11px] uppercase border-b border-slate-300">
            <tr>
              <th className="p-3.5">Transcript ID</th>
              <th className="p-3.5">Candidate Full Name</th>
              <th className="p-3.5">User Email / Username</th>
              <th className="p-3.5">Exam Track</th>
              <th className="p-3.5">Date Completed</th>
              <th className="p-3.5">Score %</th>
              <th className="p-3.5">Scaled Score</th>
              <th className="p-3.5">Result State</th>
              <th className="p-3.5 text-right">Official Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-500 font-mono">
                  Loading candidate examination records...
                </td>
              </tr>
            ) : attempts.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-10 text-center text-slate-500 font-medium space-y-2">
                  <p className="font-bold text-slate-700">No candidate exam records match your search filters.</p>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ntms-navy text-white text-xs font-bold rounded shadow"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset All Search Filters
                  </button>
                </td>
              </tr>
            ) : (
              attempts.map((att) => {
                const candidateName = att.candidateName || att.user?.name || 'Candidate';
                const userEmail = att.user?.email || 'N/A';
                const rawPct = Math.round(att.scorePercentage || 0);
                const scaledScore = Math.round(300 + (rawPct / 100) * 700);

                return (
                  <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-mono font-extrabold text-ntms-navy">
                      NTMS-{att.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{candidateName}</td>
                    <td className="p-3.5 font-mono text-slate-600">{userEmail}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{att.exam?.code || 'EXAM'}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{att.exam?.title}</div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">
                      {new Date(att.startedAt).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">{rawPct}%</td>
                    <td className="p-3.5 font-mono font-extrabold text-slate-900 text-sm">
                      {scaledScore} <span className="text-[10px] text-slate-500 font-normal">/ 1000</span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px]">
                      {att.passed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 font-extrabold">
                          <XCircle className="w-3.5 h-3.5" /> NO PASS
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedAttempt(att)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded font-bold text-xs shadow transition-all shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Score Report ➜</span>
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
