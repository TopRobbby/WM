import React, { useState, useEffect, useRef } from 'react';
import { Activity, Radio, Cpu, TrendingUp, Zap, Target } from 'lucide-react';

// 1. Live Bitrate & Ingest Waveform Graph
export const LiveBitrateGraph: React.FC<{ currentBitrate?: number }> = ({ currentBitrate = 6240 }) => {
  const [dataPoints, setDataPoints] = useState<number[]>(() => 
    Array.from({ length: 32 }, () => 6100 + Math.random() * 280)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints((prev) => {
        const nextVal = Math.min(6500, Math.max(5900, prev[prev.length - 1] + (Math.random() - 0.48) * 90));
        return [...prev.slice(1), Math.round(nextVal)];
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const min = 5800;
  const max = 6600;
  const range = max - min;
  const height = 75;
  const width = 280;

  const pointsStr = dataPoints.map((val, idx) => {
    const x = (idx / (dataPoints.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 12) - 6;
    return `${x},${y}`;
  }).join(' ');

  const latestVal = dataPoints[dataPoints.length - 1];

  return (
    <div className="bg-black/80 border border-orange-500/30 rounded-xl p-3.5 space-y-2 relative overflow-hidden group shadow-lg shadow-black/80">
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-orange-400">
          <Activity className="w-3.5 h-3.5 animate-pulse text-orange-500" />
          <span className="font-bold tracking-wider uppercase text-[11px]">Ingest Telemetry Waveform</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500">AVG: 6,218 kbps</span>
          <span className="text-xs font-bold text-orange-400 font-mono">
            {latestVal.toLocaleString()} <span className="text-[9px] text-orange-500 font-normal">kbps</span>
          </span>
        </div>
      </div>

      {/* SVG Waveform Graph */}
      <div className="relative h-[75px] w-full cyber-grid-dense rounded border border-zinc-900 overflow-hidden bg-zinc-950/90">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <defs>
            <linearGradient id="orangeGraphGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
              <stop offset="85%" stopColor="#f97316" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid reference lines */}
          <line x1="0" y1="20" x2={width} y2="20" stroke="#27272a" strokeDasharray="3,3" strokeWidth="0.8" />
          <line x1="0" y1="45" x2={width} y2="45" stroke="#27272a" strokeDasharray="3,3" strokeWidth="0.8" />

          {/* Area fill */}
          <polygon
            points={`0,${height} ${pointsStr} ${width},${height}`}
            fill="url(#orangeGraphGrad)"
          />

          {/* Waveform line */}
          <polyline
            points={pointsStr}
            fill="none"
            stroke="#ff6a00"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Real-time pulse point at the leading edge */}
          {dataPoints.length > 0 && (
            <circle
              cx={width}
              cy={height - ((latestVal - min) / range) * (height - 12) - 6}
              r="3.5"
              fill="#ff6a00"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Graph HUD Indicators */}
        <div className="absolute bottom-1 left-2 text-[9px] font-mono text-zinc-500">60.0 FPS // H.264 HIGH PROFILE</div>
        <div className="absolute top-1 right-2 text-[9px] font-mono text-emerald-400">JITTER: 1.2ms</div>
      </div>
    </div>
  );
};

// 2. Lissajous Drift Trajectory Radar / Oscilloscope
export const LissajousTrajectoryRadar: React.FC<{ 
  code: string; 
  driftSpeed?: number;
  mode?: string;
}> = ({ code, driftSpeed = 1.2, mode = 'Lissajous' }) => {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [trail, setTrail] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.08 * driftSpeed;
      const x = 50 + Math.sin(t * 0.7) * 36;
      const y = 50 + Math.cos(t * 0.5) * 32;

      setPos({ x, y });
      setTrail((prev) => [...prev.slice(-14), { x, y }]);
    }, 50);

    return () => clearInterval(interval);
  }, [driftSpeed]);

  return (
    <div className="bg-black/80 border border-orange-500/30 rounded-xl p-3.5 space-y-2 relative overflow-hidden shadow-lg shadow-black/80">
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-orange-400">
          <Target className="w-3.5 h-3.5 text-orange-500" />
          <span className="font-bold tracking-wider uppercase text-[11px]">Kinematic Trajectory Radar</span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-300 border border-orange-500/30">
          {code} // {mode.toUpperCase()}
        </span>
      </div>

      <div className="relative h-[110px] w-full bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden flex items-center justify-center">
        {/* Radar concentric rings */}
        <div className="absolute w-20 h-20 rounded-full border border-orange-500/15"></div>
        <div className="absolute w-12 h-12 rounded-full border border-orange-500/20"></div>
        <div className="absolute w-4 h-4 rounded-full border border-orange-500/30"></div>

        {/* Crosshairs */}
        <div className="absolute inset-x-0 h-[1px] bg-orange-500/15"></div>
        <div className="absolute inset-y-0 w-[1px] bg-orange-500/15"></div>

        {/* Rotating sweep line */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent animate-radar origin-center"></div>
        </div>

        {/* Trail points */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {trail.map((p, idx) => (
            <circle
              key={idx}
              cx={`${p.x}%`}
              cy={`${p.y}%`}
              r={1 + (idx / trail.length) * 1.5}
              fill="#f97316"
              opacity={(idx / trail.length) * 0.45}
            />
          ))}
        </svg>

        {/* Active Target Blip */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-75"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <div className="w-5 h-5 rounded-full border border-orange-400 bg-orange-500/30 flex items-center justify-center animate-ping absolute"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#ff6a00]"></div>
          <span className="absolute -top-3.5 left-3 text-[9px] font-mono font-black text-orange-300 whitespace-nowrap bg-black/80 px-1 rounded border border-orange-500/30">
            {code} [{Math.round(pos.x)},{Math.round(pos.y)}]
          </span>
        </div>

        {/* Corner coordinates HUD */}
        <div className="absolute bottom-1 left-2 text-[9px] font-mono text-zinc-600">QUAD_A1 // ORBIT_ACTIVE</div>
        <div className="absolute top-1 right-2 text-[9px] font-mono text-orange-400/80">DELTA: &lt; 0.04% CPU</div>
      </div>
    </div>
  );
};

// 3. Steganographic Frequency Spectrum / FFT Graph
export const FrequencySpectrumGraph: React.FC = () => {
  const [bars, setBars] = useState<number[]>(() => [
    35, 48, 62, 85, 92, 78, 65, 88, 95, 74, 52, 68, 82, 90, 60, 42, 30, 22
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((val) => Math.min(100, Math.max(15, val + (Math.random() - 0.5) * 16)))
      );
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/80 border border-orange-500/30 rounded-xl p-3.5 space-y-2 relative overflow-hidden shadow-lg shadow-black/80">
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-orange-400">
          <Zap className="w-3.5 h-3.5 text-orange-500" />
          <span className="font-bold tracking-wider uppercase text-[11px]">Steganographic FFT Spectrum</span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">DWT LEVEL 2 // MID-BAND</span>
      </div>

      <div className="h-[75px] w-full bg-zinc-950 border border-zinc-900 rounded p-1.5 flex items-end gap-1 overflow-hidden cyber-grid-dense">
        {bars.map((val, idx) => {
          const isMidBand = idx >= 4 && idx <= 12; // Mid frequency steganographic carrier
          return (
            <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center group relative">
              <div
                className={`w-full rounded-t transition-all duration-100 ${
                  isMidBand
                    ? 'bg-gradient-to-t from-orange-600 to-amber-400 shadow-[0_0_6px_rgba(249,115,22,0.4)]'
                    : 'bg-zinc-800'
                }`}
                style={{ height: `${val}%` }}
              ></div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 pt-0.5">
        <span>Low Freq (Luma)</span>
        <span className="text-orange-400 font-bold">Mid-Band (Watermark Carrier)</span>
        <span>High Freq (Noise)</span>
      </div>
    </div>
  );
};

// 4. Interactive Cost Comparison Bar Chart (VortexMark vs Full GPU Transcoding)
export const CostComparisonGraph: React.FC = () => {
  const [viewers, setViewers] = useState<number>(25000);

  const traditionalCost = viewers * 0.035; // $0.035 per viewer per hour
  const vortexMarkCost = 0.00; // Zero additional cost

  return (
    <div className="bg-black/90 border border-orange-500/30 rounded-xl p-4 space-y-3 relative overflow-hidden shadow-lg shadow-black/90">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Infrastructure Cost vs Viewers Analysis
          </h4>
        </div>
        <span className="text-[10px] font-mono text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-500/30">
          99.9% CLOUD SAVINGS
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
          <span>Concurrent Viewer Scale:</span>
          <span className="text-orange-400 font-bold">{viewers.toLocaleString()} viewers</span>
        </div>
        <input
          type="range"
          min="1000"
          max="100000"
          step="1000"
          value={viewers}
          onChange={(e) => setViewers(parseInt(e.target.value))}
          className="w-full accent-orange-500 h-1.5 bg-zinc-800 rounded cursor-pointer"
        />
        <div className="flex justify-between text-[9px] font-mono text-zinc-600 mt-0.5">
          <span>1,000</span>
          <span>25,000</span>
          <span>50,000</span>
          <span>100,000</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-zinc-950 border border-rose-500/30 space-y-1">
          <div className="text-[10px] text-rose-400 uppercase font-bold">Traditional Per-Viewer Re-Encode</div>
          <div className="text-lg font-black text-rose-400">
            ${traditionalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-[10px] text-zinc-500 font-normal"> / hour</span>
          </div>
          <p className="text-[9px] text-zinc-500 leading-tight">
            Requires {Math.round(viewers / 12)} dedicated NVENC GPU instances.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-950 border border-orange-500/50 space-y-1 glow-orange-sm">
          <div className="text-[10px] text-orange-400 uppercase font-bold">VortexMark 3-Char Burn Engine</div>
          <div className="text-lg font-black text-emerald-400">
            $0.00
            <span className="text-[10px] text-zinc-500 font-normal"> extra compute</span>
          </div>
          <p className="text-[9px] text-zinc-500 leading-tight">
            1 master stream + client DRM/hardware compositing.
          </p>
        </div>
      </div>
    </div>
  );
};
