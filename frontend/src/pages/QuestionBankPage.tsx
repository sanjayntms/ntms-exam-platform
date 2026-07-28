import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Question, Exam } from '../types';
import { Plus, Search, CheckCircle2, X, Edit3, Trash2, BookOpen, Layers, Filter, Check } from 'lucide-react';

export const QuestionBankPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialExamId = searchParams.get('examId') || '';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>(initialExamId);
  const [filterType, setFilterType] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State - Question Authoring / Editing
  const [showQModal, setShowQModal] = useState<boolean>(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [code, setCode] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<string>('SINGLE_CHOICE');
  const [difficulty, setDifficulty] = useState<string>('INTERMEDIATE');
  const [points, setPoints] = useState<number>(1);
  const [prompt, setPrompt] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [modalExamId, setModalExamId] = useState<string>('');

  // Options State
  const [optA, setOptA] = useState<string>('');
  const [optB, setOptB] = useState<string>('');
  const [optC, setOptC] = useState<string>('');
  const [optD, setOptD] = useState<string>('');
  const [correctOpt, setCorrectOpt] = useState<string>('optA');

  // Modal State - Exam Builder
  const [showExamModal, setShowExamModal] = useState<boolean>(false);
  const [examCode, setExamCode] = useState<string>('');
  const [examTitle, setExamTitle] = useState<string>('');
  const [examVendor, setExamVendor] = useState<string>('MICROSOFT');
  const [examDuration, setExamDuration] = useState<number>(120);
  const [examPassingScore, setExamPassingScore] = useState<number>(700);
  const [examDescription, setExamDescription] = useState<string>('');

  const fetchExams = async () => {
    try {
      const res = await api.get('/exams');
      setExams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuestions = async (examIdFilter?: string) => {
    setLoading(true);
    try {
      const url = examIdFilter ? `/questions?examId=${examIdFilter}` : '/questions';
      const res = await api.get(url);
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    fetchQuestions(selectedExamId);
    if (selectedExamId) {
      setSearchParams({ examId: selectedExamId });
    } else {
      setSearchParams({});
    }
  }, [selectedExamId]);

  const selectedExam = exams.find((e) => e.id === selectedExamId);

  // Parse natural question number from code (e.g. AZ900-Q005 -> 5) or title (e.g. Question 5 -> 5)
  const extractQuestionNumber = (q: Question & { orderIndex?: number }) => {
    if (q.orderIndex && q.orderIndex < 900) return q.orderIndex;
    const codeMatch = q.code?.match(/Q(\d+)/i);
    if (codeMatch) return parseInt(codeMatch[1], 10);
    const titleMatch = q.title?.match(/Question\s*(\d+)/i);
    if (titleMatch) return parseInt(titleMatch[1], 10);
    return 9999;
  };

  const openCreateQuestionModal = () => {
    setEditingQuestionId(null);
    setCode(`Q-${Math.floor(1000 + Math.random() * 9000)}`);
    setTitle('');
    setType('SINGLE_CHOICE');
    setDifficulty('INTERMEDIATE');
    setPoints(1);
    setPrompt('');
    setExplanation('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrectOpt('optA');
    setModalExamId(selectedExamId || exams[0]?.id || '');
    setShowQModal(true);
  };

  const openEditQuestionModal = (q: Question & { examId?: string }) => {
    setEditingQuestionId(q.id);
    setCode(q.code);
    setTitle(q.title);
    setType(q.type);
    setDifficulty(q.difficulty);
    setPoints(q.points);
    setExplanation(q.explanation || '');
    setModalExamId((q as any).examId || selectedExamId || '');

    let contentObj: any = {};
    try {
      contentObj = JSON.parse(q.content || '{}');
    } catch (e) {
      contentObj = {};
    }

    setPrompt(contentObj.prompt || q.title);
    const opts = contentObj.options || [];

    setOptA(opts[0]?.text || '');
    setOptB(opts[1]?.text || '');
    setOptC(opts[2]?.text || '');
    setOptD(opts[3]?.text || '');

    const correctIndex = opts.findIndex((o: any) => o.isCorrect);
    if (correctIndex === 1) setCorrectOpt('optB');
    else if (correctIndex === 2) setCorrectOpt('optC');
    else if (correctIndex === 3) setCorrectOpt('optD');
    else setCorrectOpt('optA');

    setShowQModal(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const optionsList = [
        { id: 'optA', text: optA, isCorrect: correctOpt === 'optA' },
        { id: 'optB', text: optB, isCorrect: correctOpt === 'optB' },
        { id: 'optC', text: optC, isCorrect: correctOpt === 'optC' },
        { id: 'optD', text: optD, isCorrect: correctOpt === 'optD' },
      ].filter((o) => o.text.trim().length > 0);

      const contentPayload = JSON.stringify({
        prompt,
        options: optionsList,
      });

      const payload = {
        code,
        title: title || prompt.substring(0, 40) + '...',
        type,
        difficulty,
        points: Number(points),
        explanation,
        content: contentPayload,
        examId: modalExamId || undefined,
      };

      if (editingQuestionId) {
        await api.put(`/questions/${editingQuestionId}`, payload);
        alert('✅ Question & Answers Updated Successfully!');
      } else {
        await api.post('/questions', payload);
        alert('✅ New Question Created & Added to Exam!');
      }

      setShowQModal(false);
      fetchQuestions(selectedExamId);
    } catch (err: any) {
      alert('Error saving question: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteQuestion = async (id: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete question "${code}"?`)) return;
    try {
      await api.delete(`/questions/${id}`);
      alert('✅ Question deleted successfully!');
      fetchQuestions(selectedExamId);
    } catch (err: any) {
      alert('Error deleting question: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/exams', {
        code: examCode,
        title: examTitle,
        vendor: examVendor,
        type: 'PRACTICE',
        status: 'PUBLISHED',
        durationMinutes: Number(examDuration),
        passingScore: Number(examPassingScore),
        description: examDescription,
      });
      alert('✅ New Exam Track Built & Published Successfully!');
      setShowExamModal(false);
      setExamCode('');
      setExamTitle('');
      setExamDescription('');
      fetchExams();
      setSelectedExamId(res.data.id);
    } catch (err: any) {
      alert('Error building exam: ' + (err.response?.data?.error || err.message));
    }
  };

  // Filter and sort questions sequentially (Question 1, Question 2, Question 3...)
  const filteredAndSorted = questions
    .filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.code.toLowerCase().includes(search.toLowerCase()) ||
        (q.content && q.content.toLowerCase().includes(search.toLowerCase()));
      const matchesType = filterType ? q.type === filterType : true;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => extractQuestionNumber(a) - extractQuestionNumber(b));

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded border border-slate-300 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-ntms-navy tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-ntms-blue" />
            Exam Question Bank & Q&A Authoring System
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">Author new exam tracks, edit questions & answer keys, and manage certification banks in sequential order</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setShowExamModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-xs shadow transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Build New Exam Track</span>
          </button>

          <button
            type="button"
            onClick={openCreateQuestionModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded font-bold text-xs shadow transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question to Exam</span>
          </button>
        </div>
      </div>

      {/* Exam Selection Tabs & Filter Bar */}
      <div className="bg-white border border-slate-300 rounded p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ntms-blue" />
            <h3 className="text-xs font-bold text-ntms-navy uppercase tracking-wider">Select Certification Exam Track:</h3>
          </div>
          {selectedExam && (
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-sky-100 text-ntms-navy border border-sky-300 rounded">
              {filteredAndSorted.length} Questions in {selectedExam.code}
            </span>
          )}
        </div>

        {/* Tab Buttons for Quick Exam Selection */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setSelectedExamId('')}
            className={`px-3.5 py-1.5 rounded font-mono font-bold text-xs transition-all border ${
              selectedExamId === ''
                ? 'bg-ntms-navy text-white border-ntms-darkNavy shadow-sm ring-2 ring-ntms-blue/30'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            ALL EXAMS
          </button>

          {exams.map((ex) => {
            const isSelected = selectedExamId === ex.id;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => setSelectedExamId(ex.id)}
                className={`px-3.5 py-1.5 rounded font-mono font-bold text-xs transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-ntms-navy text-white border-ntms-darkNavy shadow-sm ring-2 ring-ntms-blue/30'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-sky-50 hover:border-ntms-blue'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-sky-300" />}
                <span>{ex.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-slate-50 p-4 rounded border border-slate-300">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by question code, title, or prompt..."
            className="w-full bg-white border border-slate-300 rounded pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-ntms-blue font-medium"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-ntms-blue w-full md:w-48"
        >
          <option value="">All Question Types</option>
          <option value="SINGLE_CHOICE">Single Choice</option>
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="TRUE_FALSE">True / False</option>
          <option value="DRAG_AND_DROP">Drag & Drop</option>
          <option value="CASE_STUDY">Case Study</option>
        </select>
      </div>

      {/* Sequence Header Info */}
      {selectedExam && (
        <div className="bg-sky-50 border border-sky-200 p-3 rounded text-xs text-sky-900 font-medium flex items-center justify-between">
          <span>
            📋 Managing Q&A for <strong>{selectedExam.code} - {selectedExam.title}</strong> in strict sequential order (1 to {filteredAndSorted.length}).
          </span>
          <span className="font-mono text-[11px] font-bold text-sky-800 bg-sky-200/60 px-2 py-0.5 rounded">
            Sequential View Enabled
          </span>
        </div>
      )}

      {/* Question Table */}
      <div className="bg-white border border-slate-300 rounded overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] uppercase border-b border-slate-300">
            <tr>
              <th className="p-3.5 w-16 text-center">Seq #</th>
              <th className="p-3.5">Code</th>
              <th className="p-3.5">Question Title / Prompt</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Difficulty</th>
              <th className="p-3.5">Points</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">
                  Loading exam questions in sequence...
                </td>
              </tr>
            ) : filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                  No questions found for this selection. Click <strong>"Add Question to Exam"</strong> above to author new questions!
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((q, idx) => {
                const seqNum = extractQuestionNumber(q) !== 9999 ? extractQuestionNumber(q) : idx + 1;
                return (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 text-center font-mono font-extrabold text-ntms-blue bg-slate-50 border-r border-slate-200">
                      #{seqNum}
                    </td>
                    <td className="p-3.5 font-mono font-extrabold text-ntms-navy">{q.code}</td>
                    <td className="p-3.5 font-bold text-slate-900 max-w-md truncate">
                      {q.title || `Question ${seqNum}`}
                    </td>
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
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditQuestionModal(q)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-100 hover:bg-sky-200 text-ntms-navy border border-sky-300 rounded font-bold text-[11px] transition-colors"
                        title="Edit Question & Answer Key"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Q&A
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id, q.code)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 rounded font-bold text-[11px] transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - Author / Edit Question & Answers */}
      {showQModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded border border-slate-300 max-w-2xl w-full p-6 space-y-4 shadow-xl text-slate-900 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-ntms-navy">
                {editingQuestionId ? '✏️ Edit Question & Answer Key' : '➕ Author New Exam Question'}
              </h3>
              <button onClick={() => setShowQModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Exam Track</label>
                  <select
                    value={modalExamId}
                    onChange={(e) => setModalExamId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-bold"
                  >
                    <option value="">-- General Question Bank --</option>
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.code} - {ex.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Question Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="e.g. AZ900-Q005"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Question Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-semibold"
                  >
                    <option value="SINGLE_CHOICE">Single Choice</option>
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="TRUE_FALSE">True / False</option>
                    <option value="DRAG_AND_DROP">Drag & Drop</option>
                    <option value="CASE_STUDY">Case Study</option>
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
                  placeholder="Type the full scenario or question prompt here..."
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-medium resize-none"
                />
              </div>

              {/* Options & Correct Answer Selector */}
              <div className="space-y-2 border-t border-slate-200 pt-3">
                <label className="font-bold text-slate-700 block">Answer Options & Correct Key (Select Radio Button for Correct Answer)</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctChoice"
                      checked={correctOpt === 'optA'}
                      onChange={() => setCorrectOpt('optA')}
                      className="w-4 h-4 text-ntms-navy cursor-pointer"
                    />
                    <span className="font-mono font-bold text-slate-700 w-6">A.</span>
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
                      name="correctChoice"
                      checked={correctOpt === 'optB'}
                      onChange={() => setCorrectOpt('optB')}
                      className="w-4 h-4 text-ntms-navy cursor-pointer"
                    />
                    <span className="font-mono font-bold text-slate-700 w-6">B.</span>
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
                      name="correctChoice"
                      checked={correctOpt === 'optC'}
                      onChange={() => setCorrectOpt('optC')}
                      className="w-4 h-4 text-ntms-navy cursor-pointer"
                    />
                    <span className="font-mono font-bold text-slate-700 w-6">C.</span>
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
                      name="correctChoice"
                      checked={correctOpt === 'optD'}
                      onChange={() => setCorrectOpt('optD')}
                      className="w-4 h-4 text-ntms-navy cursor-pointer"
                    />
                    <span className="font-mono font-bold text-slate-700 w-6">D.</span>
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

              <div>
                <label className="font-bold text-slate-700 block mb-1">Answer Explanation & Official Rationale</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Provide explanation or documentation references..."
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-3">
                <button
                  type="button"
                  onClick={() => setShowQModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded font-bold shadow"
                >
                  Save Question & Key ➜
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Build New Exam Track */}
      {showExamModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded border border-slate-300 max-w-lg w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-ntms-navy">Build & Publish New Exam Track</h3>
              <button onClick={() => setShowExamModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Exam Code</label>
                  <input
                    type="text"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    required
                    placeholder="e.g. DP-900"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vendor</label>
                  <select
                    value={examVendor}
                    onChange={(e) => setExamVendor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-bold"
                  >
                    <option value="MICROSOFT">Microsoft</option>
                    <option value="AWS">Amazon Web Services</option>
                    <option value="CISCO">Cisco</option>
                    <option value="COMPTIA">CompTIA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Exam Title</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  required
                  placeholder="e.g. Microsoft Azure Data Fundamentals"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={examDuration}
                    onChange={(e) => setExamDuration(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Passing Score (Scale 1000)</label>
                  <input
                    type="number"
                    value={examPassingScore}
                    onChange={(e) => setExamPassingScore(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={examDescription}
                  onChange={(e) => setExamDescription(e.target.value)}
                  placeholder="Describe certification objectives and audience..."
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-3">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold shadow"
                >
                  Build & Publish Exam Track ➜
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
