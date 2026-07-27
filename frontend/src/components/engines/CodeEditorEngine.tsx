import React, { useState } from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';
import { Code2 } from 'lucide-react';

export const CodeEditorEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const qState = questionStates[question.id] || {};
  const content = JSON.parse(question.content || '{}');

  const [code, setCode] = useState<string>(qState.answer?.code || content.initialCode || '');

  const handleChange = (newCode: string) => {
    setCode(newCode);
    updateQuestionAnswer(question.id, { code: newCode });
  };

  return (
    <div className="space-y-4">
      <p className="text-base font-semibold text-slate-900 leading-relaxed border-b border-slate-200 pb-3">{content.prompt}</p>

      <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden shadow-sm">
        <div className="bg-ntms-navy px-4 py-2 border-b border-slate-800 flex justify-between items-center text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-sky-300" />
            <span className="uppercase text-white font-bold">{content.language || 'code'}</span>
          </div>
          <span>UTF-8 | Code Editor</span>
        </div>

        <textarea
          rows={12}
          value={code}
          onChange={(e) => handleChange(e.target.value)}
          spellCheck={false}
          className="w-full bg-slate-950 p-4 text-xs font-mono text-emerald-400 focus:outline-none focus:ring-1 focus:ring-ntms-blue resize-none leading-relaxed"
        />
      </div>
    </div>
  );
};
