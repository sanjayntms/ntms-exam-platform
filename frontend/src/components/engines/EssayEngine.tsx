import React, { useState } from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';

export const EssayEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const qState = questionStates[question.id] || {};
  const content = JSON.parse(question.content || '{}');

  const [essayText, setEssayText] = useState<string>(qState.answer?.essayText || '');

  const wordsCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;

  const handleChange = (text: string) => {
    setEssayText(text);
    updateQuestionAnswer(question.id, { essayText: text });
  };

  return (
    <div className="space-y-4">
      <p className="text-base font-semibold text-slate-900 leading-relaxed border-b border-slate-200 pb-3">{content.prompt}</p>

      <div className="space-y-2">
        <textarea
          rows={10}
          value={essayText}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write your comprehensive essay response here..."
          className="w-full bg-white border border-slate-300 rounded p-4 text-sm text-slate-900 font-medium focus:outline-none focus:border-pearson-blue resize-none leading-relaxed shadow-sm"
        />

        <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-700 px-1">
          <span>Word Count: <strong className="text-pearson-navy">{wordsCount}</strong> words</span>
          {content.minWords && <span>Required Range: {content.minWords} - {content.maxWords || '500'} words</span>}
        </div>
      </div>
    </div>
  );
};
