import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileQuestion, BarChart3, Users, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Candidate Dashboard', icon: LayoutDashboard },
    { to: '/exams', label: 'Exam Catalog & Tracks', icon: BookOpen },
    { to: '/questions', label: 'Question Bank System', icon: FileQuestion },
    { to: '/analytics', label: 'Analytics & Score Reports', icon: BarChart3 },
  ];

  if (user?.role === Role.ADMINISTRATOR) {
    navItems.push({ to: '/users', label: 'User & Role Controls', icon: Users });
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-300 flex flex-col justify-between p-4 shadow-sm font-sans shrink-0">
      <div className="space-y-6">
        <div className="px-3 pt-2 text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">
          Test Navigation Menu
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded font-semibold text-xs transition-all ${
                    isActive
                      ? 'bg-ntms-navy text-white shadow-sm'
                      : 'text-slate-700 hover:text-ntms-navy hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
        <div className="font-bold text-ntms-navy text-xs">NTMS Exam Engine v1.0</div>
        <div className="text-[11px] text-slate-600">NTMS Certified Runtime</div>
        <div className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1 mt-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Authorized Test Environment
        </div>
      </div>
    </aside>
  );
};
