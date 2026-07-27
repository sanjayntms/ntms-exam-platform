import React from 'react';
import { X, FileEdit } from 'lucide-react';
import { useExamSession } from '../../context/ExamSessionContext';

export const ScratchpadModal: React.FC = () => {
  const { isScratchpadOpen, setScratchpadOpen, flatQuestions, currentQuestionIndex, questionStates, updateQuestionNotes } = useExamSession();

  if (!isScratchpadOpen) return null;

  const currentQ = flatQuestions[currentQuestionIndex];
  const qId = currentQ?.id || 'notes';
  const currentNotes = questionStates[qId]?.notes || '';

  return (
    <div className="fixed bottom-12 right-96 z-50 w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden glass-panel">
      <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
        <div className="flex items-center gap-2">
          <FileEdit className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-xs uppercase tracking-wider text-slate-300">Exam Notes Scratchpad</span>
        </div>
        <button onClick={() => setScratchpadOpen(false)} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <textarea
          rows={6}
          value={currentNotes}
          onChange={(e) => updateQuestionNotes(qId, e.target.value)}
          placeholder="Type scratchpad notes or calculation steps for this question..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono resize-none"
        />
        <div className="text-[10px] text-slate-500 text-right">Notes are automatically saved to your session</div>
      </div>
    </div>
  );
};
