import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldCheck, Award, X } from 'lucide-react';

interface CandidateNameModalProps {
  isOpen: boolean;
  initialName?: string;
  roomCode?: string;
  examTitle?: string;
  onConfirm: (fullName: string) => void;
  onCancel: () => void;
}

export const CandidateNameModal: React.FC<CandidateNameModalProps> = ({
  isOpen,
  initialName = '',
  roomCode = '',
  examTitle = '',
  onConfirm,
  onCancel,
}) => {
  const [fullName, setFullName] = useState(initialName);
  const [error, setError] = useState('');

  useEffect(() => {
    setFullName(initialName);
    setError('');
  }, [initialName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = fullName.trim();
    if (!trimmed) {
      setError('Please enter your Full Legal Name to proceed.');
      return;
    }
    if (trimmed.length < 2) {
      setError('Full Legal Name must be at least 2 characters long.');
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans text-slate-900 animate-in fade-in zoom-in-95 duration-150">
      <div className="bg-white rounded-xl border border-slate-300 max-w-lg w-full overflow-hidden shadow-2xl space-y-0">
        {/* Header */}
        <div className="bg-ntms-navy text-white px-6 py-4 flex justify-between items-center border-b-2 border-ntms-blue">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ntms-blue text-white flex items-center justify-center font-black text-base shadow border border-sky-300">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white tracking-tight">Candidate Identity Verification</h3>
              <p className="text-xs text-sky-200 font-mono">Live Proctored Certification Room Entry</p>
            </div>
          </div>

          <button onClick={onCancel} className="text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-ntms-navy font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-ntms-blue" />
              <span>Exam Verification Details</span>
            </div>
            <div className="text-xs text-slate-700 space-y-1 font-mono">
              {roomCode && (
                <div>
                  <strong>Proctored Room Code:</strong> <span className="font-bold text-ntms-navy">{roomCode}</span>
                </div>
              )}
              {examTitle && (
                <div>
                  <strong>Exam Track:</strong> <span className="font-bold text-slate-900">{examTitle}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Full Legal Candidate Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Sanjay Kumar"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm font-bold text-slate-900 focus:border-ntms-blue focus:ring-2 focus:ring-sky-200 focus:outline-none transition-all shadow-inner"
            />
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              ⚠️ Your name will be recorded on your attempt record and printed exactly as typed above on your{' '}
              <strong className="text-ntms-navy">Official Microsoft Certification Score Report</strong>.
            </p>
            {error && <p className="text-xs font-bold text-rose-600 font-mono">{error}</p>}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">Identity Verification Protocol</span>
            </div>
            <span className="font-mono font-extrabold text-[11px] text-emerald-700">Strictly Enforced</span>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded-lg font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <span>Confirm Identity & Enter Exam ➜</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
