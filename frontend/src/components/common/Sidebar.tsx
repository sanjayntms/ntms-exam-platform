import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileQuestion, BarChart3, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Candidate Dashboard', icon: LayoutDashboard },
    { to: '/exams', label: 'Exam Catalog & Tracks', icon: BookOpen },
    { to: '/questions', label: 'Question Bank System', icon: FileQuestion },
    { to: '/analytics', label: 'Analytics & Score Reports', icon: BarChart3 },
  ];

  if (user?.role === 'ADMINISTRATOR') {
    navItems.push({ to: '/users', label: 'User & Role Management', icon: Users });
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-300 p-4 flex flex-col justify-between shrink-0 shadow-sm">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 mb-2">
          Test Navigation Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded font-semibold text-xs transition-all ${
                  isActive
                    ? 'bg-pearson-navy text-white shadow-sm'
                    : 'text-slate-700 hover:text-pearson-navy hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </div>

      <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1.5 text-xs">
        <div className="font-bold text-pearson-navy text-xs">NTMS Exam Engine v1.0</div>
        <div className="text-[11px] text-slate-600">Pearson VUE Certified Runtime</div>
        <div className="flex items-center gap-1.5 text-emerald-700 font-mono text-[10px] font-bold pt-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Authorized Test Environment
        </div>
      </div>
    </aside>
  );
};
