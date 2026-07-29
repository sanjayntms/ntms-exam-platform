import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Key, DoorOpen, Play, Award, Sparkles, BookOpen, Monitor } from 'lucide-react';
import { getEntraIDAuthUrl } from '../config/msalConfig';
import api from '../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [isEntraLoading, setIsEntraLoading] = useState(false);
  const [roomLoading, setRoomLoading] = useState(false);
  const { loginLocal } = useAuth();
  const navigate = useNavigate();

  // Parse Entra ID OAuth Redirect response token or code from URL
  useEffect(() => {
    const handleEntraRedirect = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      const hash = window.location.hash;

      if (code) {
        setIsEntraLoading(true);
        try {
          const redirectUri = window.location.origin + '/login';
          const res = await api.post('/auth/entra', { code, redirectUri });
          localStorage.setItem('ntms_token', res.data.token);
          window.history.replaceState(null, '', window.location.pathname);
          window.location.href = '/dashboard';
        } catch (err: any) {
          alert('Microsoft Entra ID Authentication Error: ' + (err.response?.data?.error || err.message));
        } finally {
          setIsEntraLoading(false);
        }
      } else if (hash.includes('id_token=')) {
        setIsEntraLoading(true);
        try {
          const params = new URLSearchParams(hash.substring(1));
          const idToken = params.get('id_token') || '';
          const accessToken = params.get('access_token') || '';

          const res = await api.post('/auth/entra', { idToken, accessToken });
          localStorage.setItem('ntms_token', res.data.token);
          window.history.replaceState(null, '', window.location.pathname);
          window.location.href = '/dashboard';
        } catch (err: any) {
          alert('Microsoft Entra ID Authentication Error: ' + (err.response?.data?.error || err.message));
        } finally {
          setIsEntraLoading(false);
        }
      }
    };
    handleEntraRedirect();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginLocal(email);
      navigate('/dashboard');
    } catch (err: any) {
      alert('Login failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleQuickLogin = async (roleEmail: string) => {
    try {
      await loginLocal(roleEmail);
      navigate('/dashboard');
    } catch (err: any) {
      alert('Quick login failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEntraSSO = () => {
    setIsEntraLoading(true);
    window.location.href = getEntraIDAuthUrl();
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;

    // Strict Auth Check - Do NOT allow unauthenticated guest room entry
    const token = localStorage.getItem('ntms_token');
    if (!token || !user) {
      alert(
        '🔒 Authentication Required: You must log in to your Candidate Account before entering a Proctored Exam Room.\n\nPlease sign in with your email or Microsoft Entra ID (SSO) on the right first.'
      );
      return;
    }

    const candidateName = window.prompt(
      '🔑 Live Exam Room Verification:\nPlease confirm/enter your Full Legal Name to display on your Official Certification Score Report:',
      user.name || ''
    );

    if (candidateName === null) return; // User cancelled
    const finalName = candidateName.trim() || user.name;

    setRoomLoading(true);
    try {
      const res = await api.post('/rooms/join', {
        roomCode: roomCodeInput.trim().toUpperCase(),
        candidateName: finalName,
      });
      alert(`✅ ${res.data.message}`);

      // Start exam session with candidateName
      const startRes = await api.post('/attempts/start', {
        examId: res.data.exam.id,
        roomId: res.data.room?.id,
        candidateName: finalName,
      });
      navigate(`/exam-session/${startRes.data.attemptId}`);
    } catch (err: any) {
      alert('⚠️ Exam Room Entry Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setRoomLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between font-sans text-slate-100">
      {/* Top Navigation Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-8 py-4 flex items-center justify-between shadow-lg backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center font-black text-base text-white tracking-widest border border-sky-400/30 shadow-md">
            NTMS
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight text-white leading-tight">NTMS Certified Exam Platform</h1>
            <p className="text-[11px] text-slate-400 font-mono">Enterprise Test Delivery Runtime Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SSL 256-Bit Encrypted Portal</span>
          </div>
        </div>
      </header>

      {/* Hero Showcase & Login Split View */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Cinematic Exam Hall Banner & Room Access */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cinematic Image Card */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
            <img
              src="/images/cinematic_exam_hall.jpg"
              alt="Cinematic Examination Room with Teacher Proctor and Students"
              className="w-full h-80 md:h-[420px] object-cover object-center transform group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Proctored Certification Hall</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                Enterprise Microsoft Examination Center
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
                Complete practice question banks for SC-200, AZ-305, AZ-104, AI-900, AI-901, and AZ-900 with official Answer Area Dropdowns and Case Studies.
              </p>
            </div>
          </div>

          {/* Quick Room Entry Box */}
          <form onSubmit={handleJoinRoom} className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl backdrop-blur-md shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/20 rounded-lg border border-sky-400/30">
                <DoorOpen className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">Have a Proctored Room Code?</h4>
                <p className="text-[11px] text-slate-400">Join a live exam session immediately (e.g. HALL-AZ900)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                required
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                placeholder="ROOM CODE..."
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white focus:border-sky-400 focus:outline-none w-full sm:w-40 uppercase tracking-widest text-center shadow-inner"
              />
              <button
                type="submit"
                disabled={roomLoading}
                className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-lg text-xs font-bold shadow-md transition-all shrink-0 flex items-center gap-1"
              >
                <span>{roomLoading ? 'Joining...' : 'Enter Hall'}</span>
                <Play className="w-3.5 h-3.5 fill-white" />
              </button>
            </div>
          </form>

          {/* Certification Track Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { code: 'SC-200', title: '115 Questions' },
              { code: 'AZ-305', title: '100 Questions' },
              { code: 'AZ-104', title: '24 Questions' },
              { code: 'AI-900', title: '38 Questions' },
              { code: 'AI-901', title: '18 Questions' },
              { code: 'AZ-900', title: '43 Questions' },
            ].map((t) => (
              <span key={t.code} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5">
                <strong className="text-sky-400">{t.code}</strong> ({t.title})
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Authentication Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl relative">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">Candidate Portal Access</h2>
            <p className="text-xs text-slate-400">Sign in with Microsoft Entra ID or local candidate credentials</p>
          </div>

          {/* Microsoft Entra ID SSO Button */}
          <button
            type="button"
            onClick={handleEntraSSO}
            disabled={isEntraLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-all shadow-md border border-slate-700 disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            <span>{isEntraLoading ? 'Connecting to Microsoft Entra ID...' : 'Sign in with Microsoft Entra ID (SSO)'}</span>
          </button>

          <div className="relative flex items-center justify-center text-xs text-slate-500 uppercase font-mono my-4">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-slate-400 font-bold shrink-0">or local candidate login</span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          {/* Local Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Candidate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="candidate@ntms.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-medium focus:outline-none focus:border-sky-400 shadow-inner"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-medium focus:outline-none focus:border-sky-400 shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl font-bold text-xs shadow-lg transition-all"
            >
              Sign In to NTMS Engine ➜
            </button>
          </form>

          {/* Quick Demo Persona Profiles */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Quick Demo Sign-In:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleQuickLogin('candidate@ntms.com')}
                className="p-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 rounded-xl text-sky-300 font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <UserCheck className="w-4 h-4 text-sky-400" />
                <span>Candidate</span>
              </button>
              <button
                onClick={() => handleQuickLogin('admin@ntms.com')}
                className="p-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-slate-200 font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Key className="w-4 h-4 text-slate-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 px-8 text-center text-xs text-slate-500">
        © 2026 NTMS Examination Platform (exam.ntmscloud.in). All Rights Reserved. Authorized Certification Runtime Environment.
      </footer>
    </div>
  );
};
