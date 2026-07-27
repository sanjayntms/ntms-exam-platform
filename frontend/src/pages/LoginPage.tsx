import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, Monitor, ArrowRight, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between items-center p-6 relative font-sans">
      {/* Top Banner */}
      <div className="w-full max-w-4xl bg-pearson-navy text-white p-4 rounded-t-xl shadow-md flex justify-between items-center border-b-4 border-pearson-blue">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white">
            <Monitor className="w-6 h-6 text-sky-300" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wider leading-none">NTMS ASSESSMENT PLATFORM</h1>
            <p className="text-xs text-sky-200 mt-1">Pearson VUE Certified Candidate Portal</p>
          </div>
        </div>

        <div className="text-right text-xs text-slate-300 hidden md:block">
          <div>Authorized Test Delivery Center</div>
          <div className="text-emerald-400 font-mono text-[11px] font-bold">● Environment Ready</div>
        </div>
      </div>

      {/* Main Login Form Card */}
      <div className="w-full max-w-4xl bg-white border border-slate-300 rounded-b-xl p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Sign In */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-pearson-navy">Candidate & Test Administrator Sign In</h2>
            <p className="text-xs text-slate-600 mt-1">Enter your credentials or use Microsoft Entra ID Single Sign-On.</p>
          </div>

          <button
            onClick={() => selectQuickUser('candidate@ntms.com')}
            className="w-full py-3.5 px-4 bg-pearson-navy hover:bg-pearson-hoverBlue text-white font-bold text-xs rounded transition-all shadow flex items-center justify-center gap-3 border border-pearson-darkNavy"
          >
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
              <div className="bg-orange-500" />
              <div className="bg-green-500" />
              <div className="bg-blue-400" />
              <div className="bg-yellow-400" />
            </div>
            <span>Sign in with Microsoft Entra ID (SSO)</span>
          </button>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address / Candidate ID</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. candidate@ntms.com"
                className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs text-slate-800 focus:border-pearson-blue focus:outline-none font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-pearson-blue hover:bg-pearson-hoverBlue text-white font-bold text-xs rounded transition-all shadow"
            >
              {loading ? 'Authenticating...' : 'Sign In to Exam System ➜'}
            </button>
          </form>
        </div>

        {/* Right Column: Persona Selection */}
        <div className="bg-slate-50 p-6 rounded border border-slate-200 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-pearson-navy font-mono">Quick Testing Personas</h3>
            <span className="text-[11px] text-slate-500">Select any role to test system functionality instantly</span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => selectQuickUser('candidate@ntms.com')}
              className="w-full p-3 bg-white hover:bg-sky-50 border border-slate-300 hover:border-pearson-blue rounded text-left transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-pearson-navy">Alex Mercer (Candidate)</div>
                <div className="text-[10px] text-slate-500">candidate@ntms.com | Pearson Exam Engine</div>
              </div>
              <ArrowRight className="w-4 h-4 text-pearson-blue" />
            </button>

            <button
              onClick={() => selectQuickUser('creator@ntms.com')}
              className="w-full p-3 bg-white hover:bg-amber-50 border border-slate-300 hover:border-amber-500 rounded text-left transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-amber-900">Sarah Connor (Exam Author)</div>
                <div className="text-[10px] text-slate-500">creator@ntms.com | Question Bank Builder</div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-600" />
            </button>

            <button
              onClick={() => selectQuickUser('admin@ntms.com')}
              className="w-full p-3 bg-white hover:bg-purple-50 border border-slate-300 hover:border-purple-500 rounded text-left transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-purple-900">System Administrator</div>
                <div className="text-[10px] text-slate-500">admin@ntms.com | User Management & Analytics</div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-600" />
            </button>
          </div>
        </div>
      </div>

      <footer className="text-xs text-slate-500 text-center py-4">
        NTMS Test Delivery Engine © 2026. Pearson VUE Style Assessment Architecture.
      </footer>
    </div>
  );
};
