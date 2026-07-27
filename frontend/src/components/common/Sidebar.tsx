import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileQuestion, BarChart3, Users, PlaySquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMINISTRATOR' || user?.role === 'EXAM_CREATOR';

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/exams', label: 'Exams & Certifications', icon: BookOpen },
    { to: '/questions', label: 'Question Bank', icon: FileQuestion },
    { to: '/analytics', label: 'Analytics & Reports', icon: BarChart3 },
  ];

  if (user?.role === 'ADMINISTRATOR') {
    navItems.push({ to: '/users', label: 'User Management', icon: Users });
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
        <div className="font-semibold text-slate-300">NTMS Engine v1.0</div>
        <div>Azure Entra ID Authentication</div>
        <div className="text-emerald-400 font-mono text-[10px]">● System Operational</div>
      </div>
    </aside>
  );
};
