import React, { useState } from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';
import { Code2, Play } from 'lucide-react';

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
      <p className="text-base text-slate-200 leading-relaxed">{content.prompt}</p>

      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span className="uppercase text-slate-300 font-bold">{content.language || 'code'}</span>
          </div>
          <span>UTF-8 | Monaco Syntax Highlighted</span>
        </div>

        <textarea
          rows={12}
          value={code}
          onChange={(e) => handleChange(e.target.value)}
          spellCheck={false}
          className="w-full bg-slate-950 p-4 text-xs font-mono text-emerald-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
        />
      </div>
    </div>
  );
};
