import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ShieldCheck, UserCheck, Key, Mail, Fingerprint, Award, X, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <>
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

        {/* Candidate Session Info Badge */}
        <div className="flex items-center gap-4">
          {user && (
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 bg-ntms-darkNavy hover:bg-slate-800 px-3.5 py-1.5 rounded border border-slate-700 hover:border-sky-400 shadow-inner transition-all text-left cursor-pointer group"
              title="Click to view candidate information"
            >
              <div className="w-7 h-7 rounded bg-ntms-blue text-white flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-tight group-hover:text-sky-300 transition-colors">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-300 font-mono">
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
