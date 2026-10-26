import React, { useState } from 'react';
import { 
  Radio, Shield, Server, Sparkles, Terminal, ShieldAlert, 
  Activity, Lock, Zap, Cpu, Key, HelpCircle, Flame, Eye,
  Target, Layers, UserCog, LogIn, LogOut, CheckCircle2
} from 'lucide-react';
import { LiveStreamStudio } from './components/LiveStreamStudio';
import { ForensicLeakLab } from './components/ForensicLeakLab';
import { RtmpHostingCluster } from './components/RtmpHostingCluster';
import { AiSecurityAuditor } from './components/AiSecurityAuditor';
import { ExpertConsultant } from './components/ExpertConsultant';
import { AdminAccountManager, UserAccount } from './components/AdminAccountManager';
import { LoginModal } from './components/LoginModal';

const INITIAL_SUPER_ADMIN: UserAccount = {
  id: 'usr-001',
  email: 'admin@vortexmark.io',
  name: 'Chief SecOps Director',
  role: 'SUPER_ADMIN',
  clearanceLevel: 5,
  assignedNode: 'All Global Clusters',
  status: 'ACTIVE',
  createdAt: '2026-01-10T08:00:00.000Z',
  lastLogin: new Date().toISOString(),
  permissions: {
    canManageUsers: true,
    canBurnWatermarks: true,
    canIssueRtmpTokens: true,
    canExportAffidavits: true,
    canAuditCluster: true,
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'leak_lab' | 'cluster' | 'ai_audit' | 'expert' | 'admin_users'>('studio');
  const [current3CharCode, setCurrent3CharCode] = useState<string>('7KX');
  const [selectedLeakCode, setSelectedLeakCode] = useState<string>('7KX');

  // Auth & Admin State
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_SUPER_ADMIN);
  const [authToken, setAuthToken] = useState<string>('vm-root-session-2026');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const handleInspectLeak = (code: string) => {
    setSelectedLeakCode(code);
    setActiveTab('leak_lab');
  };

  const handleLoginSuccess = (user: UserAccount, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
  };

  const handleSwitchUser = (user: UserAccount) => {
    setCurrentUser(user);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200 cyber-grid">
      {/* Top Futuristic Command Header */}
      <header className="border-b border-orange-500/30 bg-black/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Futuristic Cyber Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 p-0.5 shadow-lg shadow-orange-900/60 glow-orange-sm">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500 animate-pulse-orange" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-white tracking-widest font-mono uppercase">
                  VORTEX<span className="text-orange-500">MARK</span>
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/40 font-bold tracking-wider">
                  OPS-RTMP v4.2
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
                Forensic Steganography & Hardened RTMP Ingest Cluster
              </p>
            </div>
          </div>

          {/* Center Telemetry Status Readouts */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-950 border border-orange-500/30 shadow-[0_0_10px_rgba(255,85,0,0.1)]">
              <Activity className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span className="text-zinc-500">INGEST:</span>
              <strong className="text-orange-400">RTMPS TLS 1.3</strong>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-950 border border-orange-500/30">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-500">CPU COST:</span>
              <strong className="text-emerald-400">&lt; 0.04%</strong>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-950 border border-orange-500/40 glow-orange-sm">
              <Key className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-zinc-500">ACTIVE TOKEN:</span>
              <strong className="text-orange-400 tracking-widest font-black text-sm">{current3CharCode}</strong>
            </div>
          </div>

          {/* User Account / Identity Portal Trigger */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-zinc-950 border border-orange-500/40 hover:border-orange-500 rounded-xl p-1.5 pl-3 transition-colors shadow-[0_0_15px_rgba(255,85,0,0.15)]">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold font-mono text-white flex items-center gap-1 justify-end">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-[10px] font-mono px-1 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/60 flex items-center justify-center font-mono font-bold text-orange-400 text-xs">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>

              <button
                onClick={() => setShowLoginModal(true)}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-orange-600 hover:text-black text-zinc-300 font-mono text-xs flex items-center gap-1.5 transition-all border border-zinc-700"
                title="Switch User Account or Login"
              >
                <LogIn className="w-3 h-3" />
                <span className="hidden md:inline">Switch / Sign In</span>
              </button>
            </div>
          </div>
        </div>

        {/* Futuristic Orange Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 overflow-x-auto py-1.5 border-t border-zinc-900 custom-scrollbar">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50 font-bold shadow-lg shadow-orange-950/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-orange-500" />
            Live Stream & 3-Char Kinematics
          </button>

          <button
            onClick={() => setActiveTab('leak_lab')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'leak_lab'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50 font-bold shadow-lg shadow-orange-950/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
            Forensic Leak Extractor & Attribution
          </button>

          <button
            onClick={() => setActiveTab('cluster')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'cluster'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50 font-bold shadow-lg shadow-orange-950/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-orange-500" />
            Secured RTMP Cluster & VM Deploy
          </button>

          <button
            onClick={() => setActiveTab('ai_audit')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'ai_audit'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50 font-bold shadow-lg shadow-orange-950/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Gemini AI Auditor & Optimizer
          </button>

          <button
            onClick={() => setActiveTab('expert')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'expert'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50 font-bold shadow-lg shadow-orange-950/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-orange-500" />
            Expert Terminal Console
          </button>

          {/* Admin & Accounts Manager Tab */}
          <button
            onClick={() => setActiveTab('admin_users')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'admin_users'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50 font-bold shadow-lg shadow-orange-950/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
            }`}
          >
            <UserCog className="w-3.5 h-3.5 text-orange-400" />
            Identity & Admin Access
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-500/30 text-orange-300 font-bold border border-orange-500/40">
              ADMIN
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'studio' && (
          <LiveStreamStudio
            current3CharCode={current3CharCode}
            onCodeChange={setCurrent3CharCode}
            onInspectLeak={handleInspectLeak}
          />
        )}

        {activeTab === 'leak_lab' && (
          <ForensicLeakLab initialCode={selectedLeakCode || current3CharCode} />
        )}

        {activeTab === 'cluster' && <RtmpHostingCluster />}

        {activeTab === 'ai_audit' && <AiSecurityAuditor />}

        {activeTab === 'expert' && <ExpertConsultant />}

        {activeTab === 'admin_users' && (
          <AdminAccountManager
            currentUser={currentUser}
            onSwitchUser={handleSwitchUser}
          />
        )}
      </main>

      {/* Login / Identity Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Futuristic Cyber Footer */}
      <footer className="border-t border-orange-500/25 bg-black py-4 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-zinc-300 font-bold">VortexMark Secured RTMP Telemetry</span>
            <span className="text-orange-500/80 font-mono">// True Black & Neon Orange Edition</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-zinc-500">
            <span>Role: <strong className="text-orange-400 font-mono">{currentUser.role}</strong></span>
            <span>Zero-Transcode Watermark</span>
            <span className="text-orange-400/90 font-semibold">Gemini 3.8 Flash Neural Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

