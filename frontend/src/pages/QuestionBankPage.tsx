import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Question } from '../types';
import { Plus, Search, CheckCircle2, X } from 'lucide-react';

export const QuestionBankPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filterType, setFilterType] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<string>('SINGLE_CHOICE');
  const [difficulty, setDifficulty] = useState<string>('INTERMEDIATE');
  const [points, setPoints] = useState<number>(1);
  const [prompt, setPrompt] = useState<string>('');
  const [optA, setOptA] = useState<string>('');
  const [optB, setOptB] = useState<string>('');
  const [optC, setOptC] = useState<string>('');
  const [optD, setOptD] = useState<string>('');
  const [correctOpt, setCorrectOpt] = useState<string>('optA');

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/questions');
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const contentPayload = JSON.stringify({
        prompt,
        options: [
          { id: 'optA', text: optA, isCorrect: correctOpt === 'optA' },
          { id: 'optB', text: optB, isCorrect: correctOpt === 'optB' },
          { id: 'optC', text: optC, isCorrect: correctOpt === 'optC' },
          { id: 'optD', text: optD, isCorrect: correctOpt === 'optD' },
        ].filter((o) => o.text.trim().length > 0),
      });

      await api.post('/questions', {
        code,
        title,
        type,
        difficulty,
        points: Number(points),
        content: contentPayload,
      });

      alert('✅ New Question Created Successfully!');
      setShowModal(false);
      // Reset form
      setCode('');
      setTitle('');
      setPrompt('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      fetchQuestions();
    } catch (err: any) {
      alert('Error creating question: ' + (err.response?.data?.error || err.message));
    }
  };

  const filtered = questions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) || q.code.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType ? q.type === filterType : true;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded border border-slate-300 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-ntms-navy tracking-tight">Question Bank System</h2>
          <p className="text-xs text-slate-600 mt-0.5">Authoring system supporting 16 item formats including Case Studies, Simulations & Labs</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code or title..."
              className="w-full bg-slate-50 border border-slate-300 rounded pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-ntms-blue font-medium"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-ntms-blue"
          >
            <option value="">All Question Types</option>
            <option value="SINGLE_CHOICE">Single Choice</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="DRAG_AND_DROP">Drag & Drop</option>
            <option value="CASE_STUDY">Case Study</option>
            <option value="SIMULATION">Simulation</option>
            <option value="LAB">Lab</option>
          </select>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded font-bold text-xs shadow transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Question</span>
          </button>
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
                <td className="p-3.5 font-mono font-extrabold text-ntms-navy">{q.code}</td>
                <td className="p-3.5 font-bold text-slate-900">{q.title}</td>
                <td className="p-3.5 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700 font-semibold">
                    {q.type}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-[11px] uppercase">
                  <span
                    className={`px-2 py-0.5 rounded font-extrabold ${
                      q.difficulty === 'EXPERT'
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : q.difficulty === 'ADVANCED'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
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

      {/* Create New Question Authoring Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded border border-slate-300 max-w-xl w-full p-6 space-y-4 shadow-xl text-slate-900 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-ntms-navy">Author New Exam Question</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Question Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="e.g. AZ104-Q005"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Question Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Azure VNet Peering Routing"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-semibold"
                  >
                    <option value="SINGLE_CHOICE">Single Choice</option>
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="TRUE_FALSE">True / False</option>
                    <option value="DRAG_AND_DROP">Drag & Drop</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-semibold"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                    <option value="EXPERT">EXPERT</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Points</label>
                  <input
                    type="number"
                    step="0.5"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Question Prompt Text</label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                  placeholder="Type the full question prompt here..."
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-semibold resize-none"
                />
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-3">
                <label className="font-bold text-slate-700 block">Answer Choices & Correct Answer</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={correctOpt === 'optA'}
                      onChange={() => setCorrectOpt('optA')}
                    />
                    <input
                      type="text"
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      placeholder="Option A text..."
                      required
                      className="flex-1 bg-slate-50 border border-slate-300 rounded p-2 font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={correctOpt === 'optB'}
                      onChange={() => setCorrectOpt('optB')}
                    />
                    <input
                      type="text"
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      placeholder="Option B text..."
                      required
                      className="flex-1 bg-slate-50 border border-slate-300 rounded p-2 font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={correctOpt === 'optC'}
                      onChange={() => setCorrectOpt('optC')}
                    />
                    <input
                      type="text"
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      placeholder="Option C text..."
                      className="flex-1 bg-slate-50 border border-slate-300 rounded p-2 font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={correctOpt === 'optD'}
                      onChange={() => setCorrectOpt('optD')}
                    />
                    <input
                      type="text"
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      placeholder="Option D text..."
                      className="flex-1 bg-slate-50 border border-slate-300 rounded p-2 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded font-bold shadow"
                >
                  Save Question ➜
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
