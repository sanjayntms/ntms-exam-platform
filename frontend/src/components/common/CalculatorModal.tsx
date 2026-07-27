import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';
import { useExamSession } from '../../context/ExamSessionContext';

export const CalculatorModal: React.FC = () => {
  const { isCalculatorOpen, setCalculatorOpen } = useExamSession();
  const [display, setDisplay] = useState<string>('0');

  if (!isCalculatorOpen) return null;

  const handleBtn = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
    } else if (val === '=') {
      try {
        setDisplay(eval(display).toString());
      } catch {
        setDisplay('Error');
      }
    } else {
      setDisplay((prev) => (prev === '0' || prev === 'Error' ? val : prev + val));
    }
  };

  return (
    <div className="fixed bottom-12 right-12 z-50 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden glass-panel">
      <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
        <span className="font-semibold text-xs uppercase tracking-wider text-slate-300">Exam Calculator</span>
        <button onClick={() => setCalculatorOpen(false)} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="bg-slate-950 p-3 rounded-lg text-right font-mono text-xl text-emerald-400 border border-slate-800 overflow-x-auto">
          {display}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map((btn) => (
            <button
              key={btn}
              onClick={() => handleBtn(btn)}
              className={`p-3 rounded-lg font-mono font-bold text-sm transition-colors ${
                btn === '='
                  ? 'bg-blue-600 hover:bg-blue-500 text-white col-span-1'
                  : btn === 'C'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
