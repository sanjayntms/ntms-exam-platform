import React, { useState } from 'react';
import { Question } from '../../types';
import { useExamSession } from '../../context/ExamSessionContext';

export const HotspotEngine: React.FC<{ question: Question }> = ({ question }) => {
  const { questionStates, updateQuestionAnswer } = useExamSession();
  const qState = questionStates[question.id] || {};
  const content = JSON.parse(question.content || '{}');
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(qState.answer?.clickCoords || null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    const newCoords = { x, y };
    setCoords(newCoords);
    updateQuestionAnswer(question.id, { clickCoords: newCoords });
  };

  return (
    <div className="space-y-6">
      <p className="text-base text-slate-200 leading-relaxed">{content.prompt}</p>

      <div className="relative border border-slate-700 rounded-xl overflow-hidden cursor-crosshair group max-w-2xl mx-auto" onClick={handleClick}>
        <img src={content.imageUrl} alt="Hotspot Target" className="w-full h-auto object-cover" />

        {coords && (
          <div
            className="absolute w-8 h-8 rounded-full border-2 border-rose-500 bg-rose-500/30 -translate-x-1/2 -translate-y-1/2 animate-ping"
            style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
          />
        )}

        {coords && (
          <div
            className="absolute w-6 h-6 rounded-full border-2 border-amber-400 bg-amber-500/80 -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-amber-500/50 flex items-center justify-center font-bold text-[10px] text-black"
            style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
          >
            ✕
          </div>
        )}
      </div>

      <div className="text-center text-xs font-mono text-slate-400">
        {coords ? `Selected Coordinates: X: ${coords.x}%, Y: ${coords.y}%` : 'Click anywhere on the image above to set your hotspot target.'}
      </div>
    </div>
  );
};
