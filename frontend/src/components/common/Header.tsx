import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-tight leading-none">NTMS EXAM PLATFORM</h1>
          <span className="text-xs text-slate-400">Enterprise Certification & Testing Engine</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {user && (
          <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-200 leading-tight">{user.name}</span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-blue-400">{user.role}</span>
            </div>
            <button
              onClick={logout}
              className="ml-2 text-slate-400 hover:text-red-400 transition-colors p-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
