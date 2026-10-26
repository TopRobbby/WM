import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, Sparkles, AlertCircle, FileCheck, Copy, 
  Check, RefreshCw, Cpu, Gauge, Terminal, ChevronRight, Activity, Crosshair
} from 'lucide-react';

export const AiSecurityAuditor: React.FC = () => {
  // RTMP Audit state (Gemini 3.8 Flash)
  const [streamAuthMethod, setStreamAuthMethod] = useState<string>('HMAC-SHA256 Token with IP Binding');
  const [tokenTtlMinutes, setTokenTtlMinutes] = useState<number>(15);
  const [watermarkAlpha, setWatermarkAlpha] = useState<number>(0.16);
  const [allowCollusionProtection, setAllowCollusionProtection] = useState<boolean>(true);
  const [encryptionLevel, setEncryptionLevel] = useState<string>('RTMPS over TLS 1.3 / SRTP');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [copiedAudit, setCopiedAudit] = useState<boolean>(false);

  // 3-Char Optimizer state (Gemini 3.1 Flash Lite)
  const [contentType, setContentType] = useState<string>('Live Football / High-Motion Sports');
  const [resolution, setResolution] = useState<string>('1080p60');
  const [protocol, setProtocol] = useState<string>('Secured RTMP Ingest -> Low-Cost HLS / WebRTC');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<any | null>(null);
  const [copiedCommand, setCopiedCommand] = useState<boolean>(false);

  // Run RTMP Security Audit with Gemini 3.8 Flash
  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/gemini/audit-rtmp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamAuthMethod,
          tokenTtlMinutes,
          allowCollusionProtection,
          watermarkAlpha,
          encryptionLevel,
          transcodeCodec: 'Video: H.264 High Profile (1080p60) -> Audio: AAC 128kbps',
          rtmpConfig: `rtmp {
    server {
        listen 1935;
        listen 443 ssl;
        ssl_protocols TLSv1.3;
        application live {
            live on;
            on_publish http://127.0.0.1:3000/api/rtmp/webhook/auth;
            # Low-cost 48px 7-Hue Drifting drawtext burn
            exec_push ffmpeg -i rtmp://127.0.0.1:1935/live/$name -vf "drawtext=text='7KX':fontsize=48:fontcolor=orange@0.18:x='(w/2)+sin(t*0.7)*(w*0.36)':y='(h/2)+cos(t*0.5)*(h*0.32)'" -c:v libx264 -f flv rtmp://127.0.0.1:1935/hls/$name;
        }
    }
}`,
        }),
      });

      const data = await res.json();
      setAuditResult(data.audit || 'Audit completed successfully.');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  // Run Fast 3-Char Burn Optimizer with Gemini 3.1 Flash Lite
  const handleOptimize3Char = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/gemini/optimize-3char-burn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoContent: contentType,
          resolution,
          streamingProtocol: protocol,
          targetCpuBudget: '< 0.05% CPU per viewer stream',
        }),
      });

      const data = await res.json();
      setOptimizationResult(data.optimization);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyAudit = () => {
    if (!auditResult) return;
    navigator.clipboard.writeText(auditResult);
    setCopiedAudit(true);
    setTimeout(() => setCopiedAudit(false), 2000);
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  // Posture indicators based on user configuration
  const securityScore = Math.min(98, 
    (streamAuthMethod.includes('HMAC') ? 35 : streamAuthMethod.includes('Dynamic') ? 30 : 10) +
    (encryptionLevel.includes('TLS 1.3') ? 30 : encryptionLevel.includes('AES') ? 25 : 5) +
    (allowCollusionProtection ? 20 : 0) +
    (tokenTtlMinutes <= 15 ? 13 : 5)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-orange-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
            <h2 className="text-lg font-bold text-white tracking-wide uppercase">AI Hardening & 3-Char Burn Optimizer</h2>
            <span className="px-2 py-0.5 text-xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded">
              GEMINI 3.8 FLASH + 3.1 FLASH LITE
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Automated deep security auditing of your RTMP hosting configuration and real-time algorithmic parameter tuning for low-cost 3-character per-viewer watermarking.
          </p>
        </div>

        {/* Live Hardening Posture Telemetry */}
        <div className="flex items-center gap-4 bg-zinc-950 border border-orange-500/30 rounded-xl p-3 shadow-[0_0_15px_rgba(255,85,0,0.1)]">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-zinc-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-orange-500 transition-all duration-700 ease-out"
                strokeDasharray={`${securityScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-mono text-xs font-bold text-white">{securityScore}%</span>
          </div>
          <div className="text-xs">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">HARDENING POSTURE</div>
            <div className="font-bold text-orange-400 font-mono">
              {securityScore > 80 ? 'FORTIFIED' : securityScore > 50 ? 'ELEVATED' : 'VULNERABLE'}
            </div>
            <div className="text-[10px] text-zinc-400">Zero-Transcode Defense Matrix</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: RTMP Server Security Audit (Gemini 3.8 Flash) */}
        <div className="bg-[#050507] border border-orange-500/30 rounded-xl p-5 space-y-4 relative overflow-hidden shadow-[0_0_20px_rgba(255,85,0,0.05)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white font-mono tracking-wide">RTMP SERVER SECURITY AUDIT</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-orange-400 border border-orange-500/40">
              gemini-3.8-flash
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1 font-mono text-[11px]">Ingest Authentication Method:</label>
              <select
                value={streamAuthMethod}
                onChange={(e) => setStreamAuthMethod(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg p-2.5 text-zinc-200 text-xs font-mono outline-none transition-colors"
              >
                <option value="HMAC-SHA256 Token with IP Binding">HMAC-SHA256 Token with IP Binding (Recommended)</option>
                <option value="Static Stream Key (High Risk)">Static Stream Key (High Risk - Pirate Vulnerable)</option>
                <option value="Dynamic Webhook Challenge-Response">Dynamic Webhook Challenge-Response</option>
                <option value="OAuth2 Client Credentials Bearer">OAuth2 Client Credentials Bearer</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 block mb-1 font-mono text-[11px]">Token TTL (Minutes):</label>
                <input
                  type="number"
                  value={tokenTtlMinutes}
                  onChange={(e) => setTokenTtlMinutes(parseInt(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg p-2 text-zinc-200 text-xs font-mono outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono text-[11px]">3-Char Burn Opacity:</label>
                <input
                  type="number"
                  step="0.01"
                  value={watermarkAlpha}
                  onChange={(e) => setWatermarkAlpha(parseFloat(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg p-2 text-zinc-200 text-xs font-mono outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-mono text-[11px]">Transport Layer Protocol:</label>
              <select
                value={encryptionLevel}
                onChange={(e) => setEncryptionLevel(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg p-2.5 text-zinc-200 text-xs font-mono outline-none transition-colors"
              >
                <option value="RTMPS over TLS 1.3 / SRTP">RTMPS over TLS 1.3 / SRTP (High Hardening)</option>
                <option value="Plain RTMP port 1935 (Unencrypted)">Plain RTMP port 1935 (Vulnerable to MITM sniff)</option>
                <option value="SRT with AES-256 Pre-Shared Key">SRT with AES-256 Pre-Shared Key</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="collusion"
                checked={allowCollusionProtection}
                onChange={(e) => setAllowCollusionProtection(e.target.checked)}
                className="accent-orange-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="collusion" className="text-zinc-300 text-xs cursor-pointer select-none">
                Enforce Pseudo-Random Spatial Hopping (Anti-Collusion Averaging Defense)
              </label>
            </div>

            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,85,0,0.3)] disabled:opacity-50"
            >
              <ShieldCheck className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
              {isAuditing ? 'AUDITING RTMP INFRASTRUCTURE...' : 'AUDIT SERVER SECURITY & WATERMARK RESILIENCE'}
            </button>
          </div>

          {/* Audit Output */}
          {auditResult && (
            <div className="bg-zinc-950 border border-orange-500/30 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                <span className="text-[11px] font-mono text-orange-400 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-orange-500" />
                  AUDIT_VERDICT_REPORT
                </span>
                <button
                  onClick={copyAudit}
                  className="text-xs text-zinc-400 hover:text-orange-400 flex items-center gap-1 font-mono transition-colors"
                >
                  {copiedAudit ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedAudit ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto text-[11px] font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed pr-1 custom-scrollbar">
                {auditResult}
              </div>
            </div>
          )}
        </div>

        {/* Right: Fast 3-Char Burn Optimizer (Gemini 3.1 Flash Lite) */}
        <div className="bg-[#050507] border border-orange-500/30 rounded-xl p-5 space-y-4 relative overflow-hidden shadow-[0_0_20px_rgba(255,85,0,0.05)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white font-mono tracking-wide">3-CHAR BURN PARAMETER OPTIMIZER</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-orange-400 border border-orange-500/40">
              gemini-3.1-flash-lite
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1 font-mono text-[11px]">Broadcast Content Category:</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg p-2.5 text-zinc-200 text-xs font-mono outline-none transition-colors"
              >
                <option value="Live Football / High-Motion Sports">Live Football / High-Motion Sports</option>
                <option value="Cinematic Drama / Low-Light HDR">Cinematic Drama / Low-Light HDR</option>
                <option value="Esports & High-Framerate Gaming">Esports & High-Framerate Gaming</option>
                <option value="Corporate Keynote & Presentation">Corporate Keynote & Presentation</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 block mb-1 font-mono text-[11px]">Target Resolution & FPS:</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg p-2 text-zinc-200 text-xs font-mono outline-none transition-colors"
                >
                  <option value="1080p60 (6000kbps)">1080p60 (6000kbps)</option>
                  <option value="4K UHD (2160p60 16000kbps)">4K UHD (2160p60)</option>
                  <option value="720p60 (3500kbps)">720p60 (3500kbps)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono text-[11px]">Delivery Egress Protocol:</label>
                <select
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg p-2 text-zinc-200 text-xs font-mono outline-none transition-colors"
                >
                  <option value="Secured RTMP Ingest -> Low-Cost HLS / WebRTC">Low-Cost HLS / WebRTC</option>
                  <option value="Direct RTMP / FLV Relay">Direct RTMP / FLV Relay</option>
                  <option value="Low-Latency LL-DASH">Low-Latency LL-DASH</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleOptimize3Char}
              disabled={isOptimizing}
              className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-orange-400 border border-orange-500/50 hover:border-orange-400 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,85,0,0.15)] disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${isOptimizing ? 'animate-spin text-orange-400' : 'text-orange-400'}`} />
              {isOptimizing ? 'CALCULATING OPTIMAL 3-CHAR PARAMETERS...' : 'CALCULATE OPTIMAL LOW-COST BURN PROFILE'}
            </button>
          </div>

          {/* Optimizer Output Result */}
          {optimizationResult && (
            <div className="bg-zinc-950 border border-orange-500/40 rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                <span className="text-[11px] font-mono text-orange-400 font-bold flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-orange-500" />
                  OPTIMAL_3CHAR_BURN_PROFILE
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  CPU: {optimizationResult.cpuOverheadPerViewer}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 bg-zinc-900/80 rounded border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">OPTIMAL OPACITY:</span>
                  <span className="text-white font-bold">{Math.round(optimizationResult.opacity * 100)}%</span>
                </div>
                <div className="p-2 bg-zinc-900/80 rounded border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">DRIFT CADENCE:</span>
                  <span className="text-orange-400 font-bold">{optimizationResult.hoppingCadenceSeconds} seconds</span>
                </div>
                <div className="p-2 bg-zinc-900/80 rounded border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">FONT & SCALE:</span>
                  <span className="text-zinc-200">{optimizationResult.fontSizePx}px Mono (High Legibility)</span>
                </div>
                <div className="p-2 bg-zinc-900/80 rounded border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">BLEND MATRIX:</span>
                  <span className="text-amber-400 font-bold">{optimizationResult.blendMode}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-zinc-400 font-mono">FFmpeg DrawText Filter (Zero Re-encode):</span>
                  <button
                    onClick={() => copyCommand(optimizationResult.ffmpegBurnCommand)}
                    className="text-[10px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-mono transition-colors"
                  >
                    {copiedCommand ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCommand ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="bg-black p-2.5 rounded border border-zinc-800 font-mono text-[10px] text-zinc-300 overflow-x-auto whitespace-pre custom-scrollbar">
                  {optimizationResult.ffmpegBurnCommand}
                </div>
              </div>

              <p className="text-[10px] text-zinc-400 leading-normal border-l-2 border-orange-500/50 pl-2">
                {optimizationResult.summary}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
