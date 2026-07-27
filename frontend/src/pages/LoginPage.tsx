import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, Key, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginLocal } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('candidate@ntms.com');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginLocal(email);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const selectQuickUser = async (userEmail: string) => {
    setEmail(userEmail);
    setLoading(true);
    try {
      await loginLocal(userEmail);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 relative z-10 glass-panel">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">NTMS EXAM PLATFORM</h2>
            <p className="text-xs text-slate-400 mt-1">Pearson VUE & Microsoft Certification Portal</p>
          </div>
        </div>

        {/* Microsoft Entra ID Login Button */}
        <button
          onClick={() => selectQuickUser('candidate@ntms.com')}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-3 border border-blue-400/30"
        >
          <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
            <div className="bg-orange-500" />
            <div className="bg-green-500" />
            <div className="bg-blue-400" />
            <div className="bg-yellow-400" />
          </div>
          <span>Sign in with Microsoft Entra ID</span>
        </button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800" />
          <span className="flex-shrink mx-4 text-xs font-mono uppercase text-slate-500">Or Local Persona Login</span>
          <div className="flex-grow border-t border-slate-800" />
        </div>

        {/* Quick Demo Role Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Select Testing Persona</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => selectQuickUser('admin@ntms.com')}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left text-xs transition-all"
            >
              <div className="font-bold text-blue-400">Administrator</div>
              <div className="text-[10px] text-slate-500">admin@ntms.com</div>
            </button>

            <button
              onClick={() => selectQuickUser('creator@ntms.com')}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left text-xs transition-all"
            >
              <div className="font-bold text-amber-400">Exam Creator</div>
              <div className="text-[10px] text-slate-500">creator@ntms.com</div>
            </button>

            <button
              onClick={() => selectQuickUser('candidate@ntms.com')}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left text-xs transition-all"
            >
              <div className="font-bold text-emerald-400">Candidate</div>
              <div className="text-[10px] text-slate-500">candidate@ntms.com</div>
            </button>

            <button
              onClick={() => selectQuickUser('guest@ntms.com')}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left text-xs transition-all"
            >
              <div className="font-bold text-purple-400">Guest User</div>
              <div className="text-[10px] text-slate-500">guest@ntms.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
