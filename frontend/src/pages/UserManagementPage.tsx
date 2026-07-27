import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { User, Role } from '../types';
import { Users, UserPlus, Shield, CheckCircle2, XCircle } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<Role>('CANDIDATE');

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

  const handleToggle = async (id: string) => {
    try {
      await api.patch(`/users/${id}/toggle-active`);
      fetchUsers();
    } catch (err: any) {
      alert('Error updating user status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Enterprise User & Role Management</h2>
          <p className="text-xs text-slate-400 mt-1">Manage platform RBAC roles, Entra ID sync & candidate permissions</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20"
        >
          <UserPlus className="w-4 h-4" /> Provision New User
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Auth Provider</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-semibold text-white">{u.name}</td>
                <td className="p-4 text-slate-300 font-mono">{u.email}</td>
                <td className="p-4 font-mono text-[11px]">
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    u.role === 'ADMINISTRATOR' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                    u.role === 'EXAM_CREATOR' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 font-mono text-[11px] text-slate-400">
                  {u.entraId ? 'Microsoft Entra ID' : 'Local Authentication'}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleToggle(u.id)}
                    className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-1 rounded border transition-all ${
                      u.isActive !== false
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                        : 'bg-rose-950 text-rose-400 border-rose-800 hover:bg-rose-900'
                    }`}
                  >
                    {u.isActive !== false ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {u.isActive !== false ? 'Active' : 'Disabled'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Provision User Account</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Role Assignment</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:border-blue-500 focus:outline-none font-mono"
                >
                  <option value="CANDIDATE">CANDIDATE</option>
                  <option value="EXAM_CREATOR">EXAM_CREATOR</option>
                  <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                  <option value="GUEST">GUEST</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-600/20"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
