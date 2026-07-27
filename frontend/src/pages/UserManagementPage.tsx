import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { User, Role } from '../types';
import { Users, UserPlus, Shield, CheckCircle2, XCircle, Lock, Unlock, History, Key, Check, X } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<Role>('CANDIDATE');

  // Exam Access & History Modal State
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'ACCESS' | 'HISTORY'>('ACCESS');
  const [accessList, setAccessList] = useState<any[]>([]);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', { name, email, role });
      setShowAddModal(false);
      setName('');
      setEmail('');
      fetchUsers();
    } catch (err: any) {
      alert('Error creating user: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await api.patch(`/users/${id}/toggle-active`);
      fetchUsers();
    } catch (err: any) {
      alert('Error updating user status');
    }
  };

  // Open Exam Access & History modal for candidate student
  const handleOpenStudentModal = async (student: User) => {
    setSelectedStudent(student);
    setActiveTab('ACCESS');
    setModalLoading(true);

    try {
      const [accessRes, historyRes] = await Promise.all([
        api.get(`/users/${student.id}/access`),
        api.get(`/users/${student.id}/attempts`),
      ]);
      setAccessList(accessRes.data);
      setHistoryList(historyRes.data);
    } catch (err) {
      console.error('Error fetching student data', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleSingleExamAccess = async (examId: string, currentUnlocked: boolean) => {
    if (!selectedStudent) return;
    try {
      await api.post(`/users/${selectedStudent.id}/access/toggle`, {
        examId,
        isUnlocked: !currentUnlocked,
      });

      // Refresh access list
      const accessRes = await api.get(`/users/${selectedStudent.id}/access`);
      setAccessList(accessRes.data);
    } catch (err: any) {
      alert('Failed to update exam access: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleUnlockAll = async () => {
    if (!selectedStudent) return;
    try {
      await api.post(`/users/${selectedStudent.id}/access/unlock-all`);
      const accessRes = await api.get(`/users/${selectedStudent.id}/access`);
      setAccessList(accessRes.data);
    } catch (err: any) {
      alert('Error unlocking all exams');
    }
  };

  const handleLockAll = async () => {
    if (!selectedStudent) return;
    try {
      await api.post(`/users/${selectedStudent.id}/access/lock-all`);
      const accessRes = await api.get(`/users/${selectedStudent.id}/access`);
      setAccessList(accessRes.data);
    } catch (err: any) {
      alert('Error locking all exams');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded border border-slate-300 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-ntms-navy tracking-tight">Enterprise User & Exam Access Management</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Admin Portal (sanjay@ntmsentra.onmicrosoft.com) — Manage RBAC roles, candidate exam locks/unlocks & exam history
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded text-xs font-bold shadow transition-all"
        >
          <UserPlus className="w-4 h-4" /> Provision New User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] uppercase border-b border-slate-300">
            <tr>
              <th className="p-4">Candidate / User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Authentication</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Exam Access & History</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-900">{u.name}</td>
                <td className="p-4 text-slate-700 font-mono">{u.email}</td>
                <td className="p-4 font-mono text-[11px]">
                  <span
                    className={`px-2 py-0.5 rounded font-extrabold ${
                      u.role === 'ADMINISTRATOR'
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : u.role === 'EXAM_CREATOR'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-sky-100 text-ntms-navy border border-sky-300'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4 font-mono text-[11px] text-slate-600">
                  {u.entraId ? 'Microsoft Entra ID' : 'Local Auth'}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleActive(u.id)}
                    className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border font-bold transition-all ${
                      u.isActive !== false
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                    }`}
                  >
                    {u.isActive !== false ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-rose-600" />}
                    {u.isActive !== false ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleOpenStudentModal(u)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ntms-blue hover:bg-ntms-hoverBlue text-white rounded font-bold text-xs shadow-xs transition-all"
                  >
                    <Key className="w-3.5 h-3.5" /> Manage Access & History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Provision User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded p-6 w-full max-w-md space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-ntms-navy border-b border-slate-200 pb-3">Provision User Account</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs text-slate-700 font-bold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-900 focus:border-ntms-navy focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700 font-bold block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-900 focus:border-ntms-navy focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700 font-bold block mb-1">Role Assignment</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-900 focus:border-ntms-navy focus:outline-none font-mono"
                >
                  <option value="CANDIDATE">CANDIDATE (Student)</option>
                  <option value="EXAM_CREATOR">EXAM_CREATOR</option>
                  <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                  <option value="GUEST">GUEST</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ntms-navy hover:bg-ntms-hoverBlue text-white rounded text-xs font-bold shadow"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Exam Access & History Management Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-white border border-slate-300 rounded-lg p-6 w-full max-w-3xl space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-ntms-navy border border-sky-300">
                    PER-STUDENT ACCESS CONTROL
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">{selectedStudent.email}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedStudent.name} — Exam Access & History</h3>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-4">
              <button
                onClick={() => setActiveTab('ACCESS')}
                className={`pb-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'ACCESS'
                    ? 'border-ntms-blue text-ntms-navy'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Key className="w-4 h-4" /> Lock / Unlock Exam Matrix
              </button>

              <button
                onClick={() => setActiveTab('HISTORY')}
                className={`pb-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'HISTORY'
                    ? 'border-ntms-blue text-ntms-navy'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <History className="w-4 h-4" /> Exam Attempt History ({historyList.length})
              </button>
            </div>

            {/* Tab Content */}
            {modalLoading ? (
              <div className="py-12 text-center text-xs font-mono font-bold text-slate-500">Loading student details...</div>
            ) : activeTab === 'ACCESS' ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-xs text-slate-600 font-medium">
                    When unlocked, this student can view and take the exam. <br />
                    <span className="font-bold text-rose-700 italic">NOTE: Upon student logout, all exams automatically lock again!</span>
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleUnlockAll}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold shadow-xs flex items-center gap-1"
                    >
                      <Unlock className="w-3.5 h-3.5" /> Unlock All Exams
                    </button>
                    <button
                      onClick={handleLockAll}
                      className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-bold shadow-xs flex items-center gap-1"
                    >
                      <Lock className="w-3.5 h-3.5" /> Lock All Exams
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {accessList.map((item) => (
                    <div
                      key={item.examId}
                      className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded hover:border-slate-300 shadow-xs"
                    >
                      <div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-ntms-navy border border-sky-300">
                          {item.code}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{item.title}</h4>
                      </div>

                      <button
                        onClick={() => handleToggleSingleExamAccess(item.examId, item.isUnlocked)}
                        className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                          item.isUnlocked
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-900 border border-rose-300 hover:bg-rose-200'
                        }`}
                      >
                        {item.isUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-700" /> : <Lock className="w-3.5 h-3.5 text-rose-700" />}
                        {item.isUnlocked ? 'UNLOCKED (Click to Lock)' : 'LOCKED (Click to Unlock)'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {historyList.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded border border-slate-200 text-xs font-semibold text-slate-600">
                    No completed exam attempts found for this candidate.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-left text-xs text-slate-800">
                      <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] uppercase border-b border-slate-200">
                        <tr>
                          <th className="p-3">Exam Track</th>
                          <th className="p-3">Score %</th>
                          <th className="p-3">Correct / Total</th>
                          <th className="p-3">Date Taken</th>
                          <th className="p-3 text-right">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-medium">
                        {historyList.map((att: any) => (
                          <tr key={att.id} className="hover:bg-slate-50">
                            <td className="p-3">
                              <span className="font-mono font-bold text-ntms-navy">{att.exam?.code}</span>
                              <div className="text-[11px] text-slate-600">{att.exam?.title}</div>
                            </td>
                            <td className="p-3 font-extrabold text-sm text-slate-900">{att.scorePercentage}%</td>
                            <td className="p-3 font-mono">
                              {att.correctAnswers} / {att.totalQuestions} Qs
                            </td>
                            <td className="p-3 font-mono text-slate-600">
                              {new Date(att.startedAt).toLocaleString()}
                            </td>
                            <td className="p-3 text-right">
                              <span
                                className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                                  att.passed
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : 'bg-rose-100 text-rose-900 border-rose-300'
                                }`}
                              >
                                {att.passed ? 'PASSED' : 'FAILED'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
