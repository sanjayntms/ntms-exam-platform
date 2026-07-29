import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ShieldCheck, UserCheck, Key, Mail, Fingerprint, Award, X, Menu, LayoutDashboard, BookOpen, FileQuestion, BarChart3, Users } from 'lucide-react';
import { Link, useNavigate, NavLink } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Candidate Dashboard', icon: LayoutDashboard },
    { to: '/exams', label: 'Exam Catalog & Tracks', icon: BookOpen },
    { to: '/questions', label: 'Question Bank System', icon: FileQuestion },
    { to: '/analytics', label: 'Analytics & Score Reports', icon: BarChart3 },
  ];

  if (user?.role === 'ADMINISTRATOR') {
    navItems.push({ to: '/users', label: 'User & Role Controls', icon: Users });
  }

  return (
    <>
      <header className="h-16 bg-ntms-navy text-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 shadow-md border-b-2 border-ntms-blue">
        {/* Mobile Hamburger Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded bg-ntms-blue flex items-center justify-center font-black text-xs md:text-sm text-white tracking-widest shadow border border-sky-400">
              NTMS
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm md:text-base text-white tracking-tight">NTMS</span>
                <span className="text-[9px] md:text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 font-mono border border-sky-800">
                  Test Delivery
                </span>
              </div>
              <span className="text-[10px] md:text-[11px] text-slate-300 tracking-wide hidden sm:inline">NTMS Certified Exam Platform</span>
            </div>
          </Link>
        </div>

        {/* Candidate Session Info Badge */}
        <div className="flex items-center gap-2 md:gap-4">
          {user && (
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2.5 bg-ntms-darkNavy hover:bg-slate-800 px-2.5 md:px-3.5 py-1.5 rounded border border-slate-700 hover:border-sky-400 shadow-inner transition-all text-left cursor-pointer group"
              title="Click to view candidate information"
            >
              <div className="w-6 h-6 md:w-7 md:h-7 rounded bg-ntms-blue text-white flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-tight group-hover:text-sky-300 transition-colors max-w-[100px] sm:max-w-none truncate">
                  {user.name}
                </span>
                <span className="text-[9px] md:text-[10px] text-slate-300 font-mono hidden sm:inline">
                  ID: NTMS-{user.id ? user.id.substring(0, 6).toUpperCase() : '894201'} |{' '}
                  <span className="text-emerald-400 font-bold uppercase">{user.role}</span>
                </span>
              </div>
            </button>
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

      {/* Mobile Slide-Down Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b-2 border-ntms-blue p-4 space-y-2 sticky top-16 z-30 shadow-xl font-sans text-xs">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            Test Navigation Menu
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded font-bold transition-all ${
                      isActive
                        ? 'bg-ntms-blue text-white shadow-sm'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-sky-400" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

      {/* Candidate Complete Profile Modal */}
      {showProfileModal && user && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full overflow-hidden shadow-2xl font-sans text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-ntms-navy text-white px-6 py-4 flex items-center justify-between border-b-2 border-ntms-blue">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-ntms-blue text-white flex items-center justify-center font-black text-lg border border-sky-300">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white tracking-tight">{user.name}</h3>
                  <p className="text-xs text-slate-300 font-mono">Candidate Registration Record</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-600 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-ntms-blue" /> Full Name
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">{user.name}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-600 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-ntms-blue" /> Candidate Email
                  </span>
                  <span className="font-bold text-slate-900 font-mono">{user.email}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-600 flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-ntms-blue" /> Registration ID
                  </span>
                  <span className="font-extrabold text-ntms-navy font-mono">
                    NTMS-{user.id ? user.id.substring(0, 6).toUpperCase() : '894201'}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-600 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-ntms-blue" /> Platform Role
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold uppercase font-mono">
                    {user.role}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-ntms-blue" /> Auth Provider
                  </span>
                  <span className="font-bold text-sky-900 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {user.entraId ? 'Microsoft Entra ID (SSO)' : 'Local Credentials'}
                  </span>
                </div>
              </div>

              {user.entraId && (
                <div className="bg-sky-50 border border-sky-200 rounded p-3 text-slate-800 space-y-1">
                  <span className="font-bold text-ntms-navy block uppercase text-[10px] tracking-wider">
                    Azure Active Directory Details
                  </span>
                  <p className="font-mono text-[11px] break-all">
                    <strong className="text-slate-700">Entra Object ID:</strong> {user.entraId}
                  </p>
                </div>
              )}

              <div className="bg-emerald-50 border border-emerald-200 rounded p-3 flex items-center justify-between text-emerald-900">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">Session Security Status</span>
                </div>
                <span className="font-mono text-[11px] font-extrabold text-emerald-700">Verified & Encrypted</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 border-t border-slate-200 px-6 py-3.5 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  navigate('/analytics');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-ntms-blue text-ntms-navy rounded font-bold text-xs shadow-sm transition-all"
              >
                <Award className="w-4 h-4 text-ntms-blue" />
                <span>View Score Reports</span>
              </button>

              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-1.5 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded font-bold text-xs shadow transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
