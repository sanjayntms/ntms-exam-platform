import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Question } from '../types';
import { FileQuestion, Plus, Filter, Search, Tag, CheckCircle2 } from 'lucide-react';

export const QuestionBankPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filterType, setFilterType] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get('/questions');
        setQuestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, []);

  const filtered = questions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) || q.code.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType ? q.type === filterType : true;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded border border-slate-300 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-pearson-navy tracking-tight">Question Bank Management</h2>
          <p className="text-xs text-slate-600 mt-0.5">Authoring system supporting 16 item formats including Case Studies, Simulations & Labs</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code or title..."
              className="w-full bg-slate-50 border border-slate-300 rounded pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-pearson-blue font-medium"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-pearson-blue"
          >
            <option value="">All Question Types</option>
            <option value="SINGLE_CHOICE">Single Choice</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="CASE_STUDY">Case Study</option>
            <option value="SIMULATION">Simulation</option>
            <option value="LAB">Lab</option>
            <option value="HOTSPOT">Hotspot</option>
            <option value="CODE_EDITOR">Code Editor</option>
          </select>
        </div>
      </div>

      {/* Question Table */}
      <div className="bg-white border border-slate-300 rounded overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] uppercase border-b border-slate-300">
            <tr>
              <th className="p-3.5">Code</th>
              <th className="p-3.5">Title</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Difficulty</th>
              <th className="p-3.5">Points</th>
              <th className="p-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-mono font-extrabold text-pearson-navy">{q.code}</td>
                <td className="p-3.5 font-bold text-slate-900">{q.title}</td>
                <td className="p-3.5 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700 font-semibold">
                    {q.type}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-[11px] uppercase">
                  <span className={`px-2 py-0.5 rounded font-extrabold ${
                    q.difficulty === 'EXPERT' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                    q.difficulty === 'ADVANCED' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}>
                    {q.difficulty}
                  </span>
                </td>
                <td className="p-3.5 font-mono font-bold text-slate-900">{q.points} pts</td>
                <td className="p-3.5 text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-mono text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
