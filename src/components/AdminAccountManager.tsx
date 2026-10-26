import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Shield, ShieldCheck, Key, Lock, Unlock, 
  Trash2, RefreshCw, Check, AlertTriangle, Eye, EyeOff, 
  UserCheck, Terminal, Sparkles, Filter, Search, ChevronRight, UserCog
} from 'lucide-react';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'FORENSIC_ANALYST' | 'STREAM_OPERATOR';
  clearanceLevel: number;
  assignedNode: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  lastLogin: string;
  permissions: {
    canManageUsers: boolean;
    canBurnWatermarks: boolean;
    canIssueRtmpTokens: boolean;
    canExportAffidavits: boolean;
    canAuditCluster: boolean;
  };
}

interface AdminAccountManagerProps {
  currentUser: UserAccount;
  onSwitchUser: (user: UserAccount) => void;
}

export const AdminAccountManager: React.FC<AdminAccountManagerProps> = ({
  currentUser,
  onSwitchUser,
}) => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Form State for creating new user
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newRole, setNewRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'FORENSIC_ANALYST' | 'STREAM_OPERATOR'>('STREAM_OPERATOR');
  const [newPassword, setNewPassword] = useState<string>('Vortex#2026');
  const [newClearance, setNewClearance] = useState<number>(3);
  const [newNode, setNewNode] = useState<string>('All Global Clusters');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Load users from backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error('Failed to fetch users:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;
    setIsSubmitting(true);
    setActionMessage(null);

    const isSuper = newRole === 'SUPER_ADMIN' || newRole === 'ADMIN';

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          name: newName,
          role: newRole,
          password: newPassword,
          clearanceLevel: newClearance,
          assignedNode: newNode,
          permissions: {
            canManageUsers: isSuper,
            canBurnWatermarks: true,
            canIssueRtmpTokens: isSuper || newRole === 'STREAM_OPERATOR',
            canExportAffidavits: isSuper || newRole === 'FORENSIC_ANALYST',
            canAuditCluster: isSuper,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage({ text: `Account for ${newEmail} created successfully!`, type: 'success' });
        setNewEmail('');
        setNewName('');
        setNewPassword('Vortex#2026');
        setShowCreateModal(false);
        fetchUsers();
      } else {
        setActionMessage({ text: data.message || 'Failed to create user', type: 'error' });
      }
    } catch (err: any) {
      setActionMessage({ text: 'Network error creating account', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: UserAccount) => {
    if (user.id === 'usr-001') {
      alert('Root Super Admin cannot be suspended.');
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${user.id}/status`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: data.user.status } : u))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (user: UserAccount) => {
    if (user.id === 'usr-001') {
      alert('Cannot delete primary root administrator account.');
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete account: ${user.email}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        setActionMessage({ text: `Account ${user.email} removed.`, type: 'success' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789!#%';
    let key = 'Vx-';
    for (let i = 0; i < 8; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(key);
  };

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN';

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-orange-500/25 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCog className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
              Identity & Administrative Access Control
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded font-semibold">
              RBAC v3.0
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Provision, assign, and audit administrator and forensic operator credentials. Manage RTMP ingest keys and forensic burn rights.
          </p>
        </div>

        {/* Create Account Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!isSuperAdmin}
            className="px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-black font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,85,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" />
            CREATE NEW ACCOUNT
          </button>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="text-zinc-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Metrics & Current Identity HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-black border border-orange-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(255,85,0,0.05)]">
          <span className="text-[10px] font-mono text-zinc-500 block uppercase">CURRENT AUTHENTICATED USER</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-sm font-bold text-white truncate">{currentUser.name}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
              {currentUser.role}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Clearance Lvl {currentUser.clearanceLevel}</span>
          </div>
        </div>

        <div className="bg-black border border-orange-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(255,85,0,0.05)]">
          <span className="text-[10px] font-mono text-zinc-500 block uppercase">TOTAL ACCOUNTS</span>
          <span className="font-mono text-2xl font-black text-orange-400">{users.length}</span>
          <span className="text-[10px] font-mono text-zinc-400 block mt-1">
            {users.filter((u) => u.status === 'ACTIVE').length} Active // {users.filter((u) => u.status === 'SUSPENDED').length} Suspended
          </span>
        </div>

        <div className="bg-black border border-orange-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(255,85,0,0.05)]">
          <span className="text-[10px] font-mono text-zinc-500 block uppercase">ROLE DISTRIBUTION</span>
          <div className="flex items-center gap-2 mt-1.5 text-xs font-mono text-zinc-300">
            <span className="text-orange-400 font-bold">{users.filter((u) => u.role === 'SUPER_ADMIN').length} Super</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">{users.filter((u) => u.role === 'FORENSIC_ANALYST').length} Analyst</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">{users.filter((u) => u.role === 'STREAM_OPERATOR').length} Op</span>
          </div>
          <span className="text-[10px] text-zinc-500 block mt-1">Full granular privilege enforcement</span>
        </div>

        <div className="bg-black border border-orange-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(255,85,0,0.05)]">
          <span className="text-[10px] font-mono text-zinc-500 block uppercase">HARDENED SECURITY MATRIX</span>
          <span className="font-mono text-xs text-emerald-400 flex items-center gap-1 mt-1 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            256-BIT SESSION TOKENS
          </span>
          <span className="text-[10px] text-zinc-400 block mt-1">Zero-Trust Cluster Node Binding</span>
        </div>
      </div>

      {/* Account Creation Modal / Drawer */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-black border-2 border-orange-500/60 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-[0_0_50px_rgba(255,85,0,0.25)] relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  PROVISION NEW SYSTEM ACCOUNT
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-zinc-400 block mb-1">Full Name / Operator Identity:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Devon Miles"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg p-2.5 text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Corporate Email Address:</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. devon@stream-security.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg p-2.5 text-white outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">System Role:</label>
                  <select
                    value={newRole}
                    onChange={(e: any) => setNewRole(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg p-2.5 text-white outline-none transition-colors"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Full Privileges)</option>
                    <option value="ADMIN">ADMIN (Account & Cluster Ops)</option>
                    <option value="FORENSIC_ANALYST">FORENSIC_ANALYST (Leak Lab)</option>
                    <option value="STREAM_OPERATOR">STREAM_OPERATOR (Kinematics)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Security Clearance:</label>
                  <select
                    value={newClearance}
                    onChange={(e) => setNewClearance(parseInt(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg p-2.5 text-white outline-none transition-colors"
                  >
                    <option value={5}>Level 5 - Unrestricted SecOps</option>
                    <option value={4}>Level 4 - Forensic Lead</option>
                    <option value={3}>Level 3 - Edge Operator</option>
                    <option value={2}>Level 2 - Read-Only Auditor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Assigned Cluster Node:</label>
                <select
                  value={newNode}
                  onChange={(e) => setNewNode(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg p-2.5 text-white outline-none transition-colors"
                >
                  <option value="All Global Clusters">All Global Clusters (Global Broadcast)</option>
                  <option value="fra-01 (Frankfurt Core #1)">fra-01 (Frankfurt Core #1)</option>
                  <option value="iad-02 (US East Virginia #2)">iad-02 (US East Virginia #2)</option>
                  <option value="sin-01 (Singapore Edge #1)">sin-01 (Singapore Edge #1)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-400">Initial Password / Secret Key:</label>
                  <button
                    type="button"
                    onClick={generateRandomKey}
                    className="text-orange-400 hover:text-orange-300 text-[10px] flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Auto-Generate Key
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg p-2.5 text-orange-400 font-bold outline-none transition-colors"
                />
              </div>

              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1.5 text-[11px] text-zinc-400">
                <span className="text-orange-400 font-bold block">Assigned Capabilities:</span>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3-Character Kinematic Watermark Injection</span>
                </div>
                {(newRole === 'SUPER_ADMIN' || newRole === 'ADMIN') && (
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Create and Manage Administrative Accounts</span>
                  </div>
                )}
                {(newRole === 'SUPER_ADMIN' || newRole === 'FORENSIC_ANALYST') && (
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Generate Court-Admissible DMCA 512 Affidavits</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,85,0,0.3)] disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Provision Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Registry Table & Search Filters */}
      <div className="bg-black border border-orange-500/30 rounded-xl p-5 space-y-4 shadow-[0_0_20px_rgba(255,85,0,0.05)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
              ADMINISTRATIVE & OPERATOR ACCOUNT REGISTRY
            </h3>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-60">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search accounts or email..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-white outline-none"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-300 outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admins</option>
              <option value="ADMIN">Admins</option>
              <option value="FORENSIC_ANALYST">Forensic Analysts</option>
              <option value="STREAM_OPERATOR">Stream Operators</option>
            </select>

            <button
              onClick={fetchUsers}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
              title="Refresh Registry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="pb-2.5">IDENTITY</th>
                <th className="pb-2.5">ROLE & CLEARANCE</th>
                <th className="pb-2.5">CLUSTER NODE</th>
                <th className="pb-2.5">STATUS</th>
                <th className="pb-2.5">LAST LOGIN</th>
                <th className="pb-2.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 shadow-[0_0_8px_rgba(255,85,0,0.15)]">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-medium flex items-center gap-1.5">
                          {user.name}
                          {user.id === currentUser.id && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-orange-500/20 text-orange-300 border border-orange-500/40">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-zinc-500 text-[11px]">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3">
                    <div className="space-y-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          user.role === 'SUPER_ADMIN'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_8px_rgba(255,85,0,0.2)]'
                            : user.role === 'ADMIN'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : user.role === 'FORENSIC_ANALYST'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {user.role}
                      </span>
                      <div className="text-[10px] text-zinc-400">Clearance Lvl {user.clearanceLevel}</div>
                    </div>
                  </td>

                  <td className="py-3 text-zinc-300">
                    <div className="truncate max-w-[140px] text-[11px]">{user.assignedNode}</div>
                  </td>

                  <td className="py-3">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      disabled={user.id === 'usr-001' || !isSuperAdmin}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                      }`}
                      title={isSuperAdmin && user.id !== 'usr-001' ? 'Click to toggle Active / Suspended' : ''}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                      {user.status}
                    </button>
                  </td>

                  <td className="py-3 text-zinc-400 text-[11px]">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                  </td>

                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Quick Switch to this account */}
                      <button
                        onClick={() => onSwitchUser(user)}
                        className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-orange-400 border border-zinc-700 text-[10px] transition-colors"
                        title="Simulate / Switch into this session"
                      >
                        Switch Session
                      </button>

                      {/* Delete account */}
                      {user.id !== 'usr-001' && isSuperAdmin && (
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
