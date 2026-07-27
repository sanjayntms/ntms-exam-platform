import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Question, QuestionType } from '../types';
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Question Bank Management</h2>
          <p className="text-xs text-slate-400 mt-1">Full support for all 16 item formats including Case Studies, Simulations & Labs</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code or title..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
            <tr>
              <th className="p-4">Code</th>
              <th className="p-4">Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Difficulty</th>
              <th className="p-4">Points</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((q) => (
              <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-mono font-bold text-blue-400">{q.code}</td>
                <td className="p-4 font-semibold text-white">{q.title}</td>
                <td className="p-4 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                    {q.type}
                  </span>
                </td>
                <td className="p-4 font-mono text-[11px] uppercase">
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    q.difficulty === 'EXPERT' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    q.difficulty === 'ADVANCED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {q.difficulty}
                  </span>
                </td>
                <td className="p-4 font-mono font-bold text-slate-200">{q.points} pts</td>
                <td className="p-4 text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                    <CheckCircle2 className="w-3 h-3" /> Approved
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
