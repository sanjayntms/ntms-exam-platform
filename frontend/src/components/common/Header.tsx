import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, LogOut, User as UserIcon, Monitor, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 bg-pearson-navy text-white flex items-center justify-between px-6 sticky top-0 z-40 shadow-md border-b-2 border-pearson-blue">
      {/* Brand & System Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white shadow-sm">
            <Monitor className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-white tracking-wider leading-none">NTMS</h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded font-semibold">
                Test Delivery Engine
              </span>
            </div>
            <span className="text-[11px] text-slate-300 tracking-wide">Pearson VUE Certified Exam Platform</span>
          </div>
        </div>
      </div>

      {/* Candidate / User Session Badge */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 bg-white/10 px-3.5 py-1.5 rounded border border-white/15">
            <div className="w-7 h-7 rounded bg-pearson-blue text-white flex items-center justify-center font-bold text-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">{user.name}</span>
              <span className="text-[10px] uppercase font-mono text-sky-300 tracking-wider">
                ID: NTMS-894201 | {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="ml-2 text-slate-300 hover:text-rose-300 transition-colors p-1"
              title="Sign Out of NTMS"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
