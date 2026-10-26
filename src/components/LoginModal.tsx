import React, { useState } from 'react';
import { 
  ShieldAlert, Lock, Unlock, Key, Flame, ArrowRight, 
  Sparkles, CheckCircle2, AlertCircle, Terminal, UserCheck
} from 'lucide-react';
import { UserAccount } from './AdminAccountManager';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount, token: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState<string>('admin@vortexmark.io');
  const [password, setPassword] = useState<string>('admin');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (overrideEmail?: string, overridePass?: string) => {
    const loginEmail = overrideEmail || email;
    const loginPass = overridePass || password;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user, data.token);
        onClose();
      } else {
        setErrorMessage(data.message || 'Authentication failed. Access denied.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error during authentication challenge.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'analyst' | 'operator') => {
    if (role === 'admin') {
      setEmail('admin@vortexmark.io');
      setPassword('admin');
      handleLogin('admin@vortexmark.io', 'admin');
    } else if (role === 'analyst') {
      setEmail('analyst@vortexmark.io');
      setPassword('analyst');
      handleLogin('analyst@vortexmark.io', 'analyst');
    } else {
      setEmail('operator@vortexmark.io');
      setPassword('operator');
      handleLogin('operator@vortexmark.io', 'operator');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      {/* Outer Glow Card */}
      <div className="relative w-full max-w-md bg-black border-2 border-orange-500/60 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(255,85,0,0.3)] space-y-6">
        {/* Subtle Cyber Grid Background */}
        <div className="absolute inset-0 cyber-grid-dense pointer-events-none opacity-40 rounded-2xl" />

        {/* Brand & Security Header */}
        <div className="relative text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 p-0.5 mx-auto shadow-lg shadow-orange-900/60 glow-orange">
            <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
              <Flame className="w-7 h-7 text-orange-500 animate-pulse-orange" />
            </div>
          </div>
          <h2 className="text-xl font-black text-white font-mono tracking-widest uppercase mt-3">
            VORTEX<span className="text-orange-500">MARK</span> SECURE ACCESS
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Forensic Watermarking & Hardened RTMP Command Console
          </p>
        </div>

        {errorMessage && (
          <div className="relative p-3 rounded-lg bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="relative space-y-4 text-xs font-mono"
        >
          <div>
            <label className="text-zinc-400 block mb-1.5 uppercase tracking-wider text-[11px]">
              Operator Email:
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vortexmark.io"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-white outline-none transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-zinc-400 uppercase tracking-wider text-[11px]">
                Access Key / Password:
              </label>
              <span className="text-[10px] text-orange-400/80">HMAC-SHA256 Encrypted</span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-white outline-none transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,85,0,0.4)] disabled:opacity-50"
          >
            <Lock className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'VERIFYING CREDENTIALS...' : 'AUTHENTICATE & ENTER CONSOLE'}
          </button>
        </form>

        {/* Quick Instant Login Selector */}
        <div className="relative pt-2 border-t border-zinc-900 space-y-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block text-center">
            One-Click Role Demonstration Accounts:
          </span>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-orange-500/30 hover:border-orange-500 text-[10px] font-mono text-orange-400 text-center transition-all group shadow-[0_0_8px_rgba(255,85,0,0.1)]"
            >
              <div className="font-bold flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-400" />
                Super Admin
              </div>
              <span className="text-[9px] text-zinc-500 block">Level 5 Clearance</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('analyst')}
              className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-cyan-500/30 hover:border-cyan-500 text-[10px] font-mono text-cyan-400 text-center transition-all group"
            >
              <div className="font-bold">Analyst</div>
              <span className="text-[9px] text-zinc-500 block">Forensic Lead</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('operator')}
              className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-emerald-500/30 hover:border-emerald-500 text-[10px] font-mono text-emerald-400 text-center transition-all group"
            >
              <div className="font-bold">Operator</div>
              <span className="text-[9px] text-zinc-500 block">RTMP Edge Lead</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
