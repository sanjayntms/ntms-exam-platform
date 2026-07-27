import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, LogOut, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-ntms-navy text-white flex items-center justify-between px-6 sticky top-0 z-40 shadow-md border-b-2 border-ntms-blue">
      {/* Platform Title */}
      <Link to="/dashboard" className="flex items-center gap-3">
        <div className="w-9 h-9 rounded bg-ntms-blue flex items-center justify-center font-black text-sm text-white tracking-widest shadow border border-sky-400">
          NTMS
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-white tracking-tight">NTMS</span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 font-mono border border-sky-800">
              Test Delivery Engine
            </span>
          </div>
          <span className="text-[11px] text-slate-300 tracking-wide">NTMS Certified Exam Platform</span>
        </div>
      </Link>

      {/* Candidate Session Info */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 bg-ntms-darkNavy px-3.5 py-1.5 rounded border border-slate-700 shadow-inner">
            <div className="w-7 h-7 rounded bg-ntms-blue text-white flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">{user.name}</span>
              <span className="text-[10px] text-slate-300 font-mono">
                ID: NTMS-894201 | <span className="text-emerald-400 font-bold uppercase">{user.role}</span>
              </span>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-800/80 rounded transition-colors"
          title="Sign out session"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
