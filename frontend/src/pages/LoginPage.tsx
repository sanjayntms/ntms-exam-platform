import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Key } from 'lucide-react';
import { getEntraIDAuthUrl } from '../config/msalConfig';
import api from '../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEntraLoading, setIsEntraLoading] = useState(false);
  const { loginLocal } = useAuth();
  const navigate = useNavigate();

  // Parse Entra ID OAuth Redirect response token from URL Hash
  useEffect(() => {
    const handleEntraRedirect = async () => {
      const hash = window.location.hash;
      if (hash.includes('id_token=')) {
        setIsEntraLoading(true);
        try {
          const params = new URLSearchParams(hash.substring(1));
          const idToken = params.get('id_token') || '';
          const accessToken = params.get('access_token') || '';

          const res = await api.post('/auth/entra', { idToken, accessToken });
          localStorage.setItem('ntms_token', res.data.token);
          // Clear hash
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
    // Redirect to Microsoft Entra ID Login Authorization Page
    window.location.href = getEntraIDAuthUrl();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans text-slate-900">
      {/* Top Navy Banner */}
      <header className="bg-ntms-navy text-white px-8 py-4 border-b-4 border-ntms-blue flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-ntms-blue flex items-center justify-center font-black text-base text-white tracking-widest border border-sky-300">
            NTMS
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white leading-tight">NTMS Certification Portal</h1>
            <p className="text-xs text-slate-300">Secure Online Test Delivery System</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>SSL 256-Bit Encrypted Session</span>
        </div>
      </header>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-300 rounded shadow-lg max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-ntms-navy">Candidate Authentication</h2>
            <p className="text-xs text-slate-600">Enter your credentials or use Microsoft Entra ID SSO</p>
          </div>

          {/* Microsoft Entra ID SSO Button */}
          <button
            type="button"
            onClick={handleEntraSSO}
            disabled={isEntraLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-xs transition-all shadow border border-slate-700 disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            <span>{isEntraLoading ? 'Connecting to Microsoft Entra ID...' : 'Sign in with Microsoft Entra ID (SSO)'}</span>
          </button>

          <div className="relative flex items-center justify-center text-xs text-slate-400 uppercase font-mono my-4">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-slate-500 font-bold shrink-0">or local login</span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Local Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Candidate Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="candidate@ntms.com"
                className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-ntms-blue"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Access Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-ntms-blue"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded font-bold text-xs shadow transition-all"
            >
              Sign In to NTMS Engine ➜
            </button>
          </form>

          {/* Quick Demo Persona Profiles */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider">Quick Persona Sign-In:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleQuickLogin('candidate@ntms.com')}
                className="p-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded text-ntms-navy font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-ntms-blue" />
                <span>Candidate</span>
              </button>
              <button
                onClick={() => handleQuickLogin('admin@ntms.com')}
                className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-800 font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Key className="w-3.5 h-3.5 text-slate-700" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-300 py-3 px-8 text-center text-xs text-slate-600">
        © 2026 NTMS Examination Platform. All Rights Reserved. Authorized Certification Runtime Environment.
      </footer>
    </div>
  );
};
