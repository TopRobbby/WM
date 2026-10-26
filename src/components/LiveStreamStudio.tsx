import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Eye, Shield, Radio, Server, Copy, Check, 
  RefreshCw, Cpu, Zap, Activity, Sliders, AlertTriangle, Key, 
  Terminal, Palette, Move, Sparkles, HelpCircle, ShieldCheck, 
  Users, Layers, Monitor, Lock, EyeOff, Flame, Crosshair
} from 'lucide-react';
import { 
  LiveBitrateGraph, 
  LissajousTrajectoryRadar, 
  FrequencySpectrumGraph, 
  CostComparisonGraph 
} from './TelemetryGraphs';

interface LiveStreamStudioProps {
  current3CharCode: string;
  onCodeChange: (code: string) => void;
  onInspectLeak: (code: string) => void;
}

export const HUE_COLORS_7 = [
  { id: 'orange', name: 'Cyber Neon Orange', hex: '#ff5500', glow: 'rgba(255, 85, 0, 0.45)', hsl: '16, 100%, 50%' },
  { id: 'cyan', name: 'Spectral Cyan', hex: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)', hsl: '190, 95%, 60%' },
  { id: 'emerald', name: 'Acid Emerald', hex: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', hsl: '150, 85%, 55%' },
  { id: 'amber', name: 'Solar Amber', hex: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', hsl: '42, 95%, 55%' },
  { id: 'crimson', name: 'Neon Crimson', hex: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)', hsl: '350, 90%, 60%' },
  { id: 'magenta', name: 'Ultraviolet Magenta', hex: '#d946ef', glow: 'rgba(217, 70, 239, 0.4)', hsl: '290, 90%, 65%' },
  { id: 'diamond', name: 'Diamond White (Luma)', hex: '#ffffff', glow: 'rgba(255, 255, 255, 0.4)', hsl: '0, 0%, 100%' },
];

const MULTI_VIEWER_DEMO_SUBSCRIBERS = [
  { code: '7KX', user: 'Alex Turner', ip: '198.51.100.74', device: 'Apple TV 4K / tvOS', driftOffset: 0.0, color: '#ff6a00' },
  { code: '9B2', user: 'Marcus Vance', ip: '82.165.197.12', device: 'Chrome 131 / Windows', driftOffset: 1.6, color: '#06b6d4' },
  { code: 'Z4P', user: 'Elena Rostova', ip: '194.39.218.44', device: 'LG webOS Smart TV', driftOffset: 3.1, color: '#10b981' },
  { code: '3M8', user: 'Daniel Okafor', ip: '102.89.44.150', device: 'Samsung Tizen UHD', driftOffset: 4.7, color: '#f59e0b' },
];

export const LiveStreamStudio: React.FC<LiveStreamStudioProps> = ({
  current3CharCode,
  onCodeChange,
  onInspectLeak,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const multiCanvasRefs = [
    useRef<HTMLCanvasElement | null>(null),
    useRef<HTMLCanvasElement | null>(null),
    useRef<HTMLCanvasElement | null>(null),
    useRef<HTMLCanvasElement | null>(null),
  ];

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [displayLayout, setDisplayLayout] = useState<'single' | 'multi_split'>('single');
  
  // Customization: Bigger Size & Ultra-Low Opacity
  const [fontSize, setFontSize] = useState<number>(54); // Bigger default 54px
  const [burnOpacity, setBurnOpacity] = useState<number>(0.07); // Low stealth default (7%)!
  
  // 7 Hue Colors
  const [selectedHueIndex, setSelectedHueIndex] = useState<number>(0);
  const [isChromaCycling, setIsChromaCycling] = useState<boolean>(true);
  
  // Drifting Movement
  const [movementMode, setMovementMode] = useState<'lissajous' | 'physics_bounce' | 'step_hop'>('lissajous');
  const [driftSpeed, setDriftSpeed] = useState<number>(1.2);
  const [hasTrailGlow, setHasTrailGlow] = useState<boolean>(true);
  
  const [viewMode, setViewMode] = useState<'normal' | 'forensic_boost' | 'spectral_diff'>('normal');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedFfmpeg, setCopiedFfmpeg] = useState<boolean>(false);
  const [showArchitectureExplainer, setShowArchitectureExplainer] = useState<boolean>(false);

  // Position coordinates state for physics rebound
  const posRef = useRef({ x: 400, y: 240, vx: 1.6, vy: 1.2 });
  const trailRef = useRef<Array<{ x: number; y: number; alpha: number; color: string }>>([]);

  // Shared scene drawing helper (drawn on canvas)
  const drawSportsScene = (ctx: CanvasRenderingContext2D, width: number, height: number, t: number) => {
    // Dark Futuristic Cyber Stadium Pitch
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#020504');
    grad.addColorStop(0.5, '#04160d');
    grad.addColorStop(1, '#010804');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // High-tech pitch line markings
    ctx.strokeStyle = 'rgba(255, 106, 0, 0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 20, width - 60, height - 40);

    // Center circle with sci-fi reticle
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width * 0.12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 4, 0, Math.PI * 2);
    ctx.stroke();

    // Dividing line
    ctx.beginPath();
    ctx.moveTo(width / 2, 20);
    ctx.lineTo(width / 2, height - 20);
    ctx.stroke();

    // Moving players / cyber entities
    for (let i = 0; i < 10; i++) {
      const px = (width / 2) + Math.cos(t * 0.8 + i * 1.3) * (width * 0.38);
      const py = (height / 2) + Math.sin(t * 0.9 + i * 0.9) * (height * 0.32);
      ctx.fillStyle = i % 2 === 0 ? '#ff6a00' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Moving soccer ball
    const bx = (width / 2) + Math.sin(t * 1.5) * (width * 0.25);
    const by = (height / 2) + Math.cos(t * 1.8) * (height * 0.2);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bx, by, 6, 0, Math.PI * 2);
    ctx.fill();

    // Futuristic Orange Scoreboard Header
    ctx.fillStyle = 'rgba(5, 5, 7, 0.92)';
    ctx.fillRect(25, 25, 220, 40);
    ctx.strokeStyle = '#ff6a00';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(25, 25, 220, 40);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('⚡ LIVE BROADCAST FEED', 35, 43);
    ctx.fillStyle = '#ff6a00';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    const mins = Math.floor((t * 2) % 90);
    const secs = Math.floor((t * 30) % 60);
    ctx.fillText(`MCI 2 - 1 RMA  [${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}]`, 35, 56);
  };

  // Main Canvas Render Loop
  useEffect(() => {
    let animationFrameId: number;
    let t = 0;

    const render = () => {
      t += 0.02 * driftSpeed;

      // 1. RENDER SINGLE PLAYER VIEW
      if (displayLayout === 'single' && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;

          drawSportsScene(ctx, width, height, t);

          // Calculate Drifting Coordinates
          let posX = width / 2;
          let posY = height / 2;

          if (movementMode === 'lissajous') {
            const marginX = width * 0.36;
            const marginY = height * 0.32;
            posX = (width / 2) + Math.sin(t * 0.7) * marginX;
            posY = (height / 2) + Math.cos(t * 0.5) * marginY;
          } else if (movementMode === 'physics_bounce') {
            posRef.current.x += posRef.current.vx * driftSpeed;
            posRef.current.y += posRef.current.vy * driftSpeed;
            const padX = 100;
            const padY = 60;
            if (posRef.current.x < padX || posRef.current.x > width - padX) posRef.current.vx *= -1;
            if (posRef.current.y < padY || posRef.current.y > height - padY) posRef.current.vy *= -1;
            posX = posRef.current.x;
            posY = posRef.current.y;
          } else {
            const step = Math.floor(t * 0.8) % 4;
            const corners = [
              { x: width * 0.18, y: height * 0.22 },
              { x: width * 0.82, y: height * 0.22 },
              { x: width * 0.82, y: height * 0.78 },
              { x: width * 0.18, y: height * 0.78 },
            ];
            posX = corners[step].x;
            posY = corners[step].y;
          }

          // Calculate 7-Hue Color
          let activeColor = HUE_COLORS_7[selectedHueIndex].hex;
          let activeGlow = HUE_COLORS_7[selectedHueIndex].glow;

          if (isChromaCycling) {
            const hueProgress = (t * 28) % 360;
            activeColor = `hsl(${hueProgress}, 95%, 60%)`;
            activeGlow = `hsla(${hueProgress}, 95%, 60%, 0.4)`;
          }

          // Anti-Inpainting Trail Ghosting
          if (hasTrailGlow) {
            trailRef.current.push({ x: posX, y: posY, alpha: burnOpacity * 0.5, color: activeColor });
            if (trailRef.current.length > 8) trailRef.current.shift();

            for (let i = 0; i < trailRef.current.length - 1; i++) {
              const point = trailRef.current[i];
              const trailAlpha = (i / trailRef.current.length) * (burnOpacity * 0.4);
              ctx.save();
              ctx.globalAlpha = trailAlpha;
              ctx.font = `900 ${fontSize - 4}px "JetBrains Mono", monospace`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = point.color;
              ctx.fillText(current3CharCode, point.x, point.y);
              ctx.restore();
            }
          }

          // Render Main Watermark depending on inspection mode
          if (viewMode === 'forensic_boost') {
            ctx.save();
            ctx.strokeStyle = '#ff6a00';
            ctx.lineWidth = 2;
            ctx.strokeRect(posX - (fontSize * 1.1), posY - (fontSize * 0.65), fontSize * 2.2, fontSize * 1.3);
            ctx.fillStyle = 'rgba(255, 106, 0, 0.25)';
            ctx.fillRect(posX - (fontSize * 1.1), posY - (fontSize * 0.65), fontSize * 2.2, fontSize * 1.3);
            ctx.fillStyle = '#ff6a00';
            ctx.font = '10px "JetBrains Mono", monospace';
            ctx.fillText(`TARGET [${Math.round(posX)}, ${Math.round(posY)}]`, posX - (fontSize * 1.1), posY - (fontSize * 0.72));
            ctx.font = `900 ${fontSize}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(current3CharCode, posX, posY);
            ctx.restore();
          } else if (viewMode === 'spectral_diff') {
            ctx.save();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.94)';
            ctx.fillRect(0, 0, width, height);
            ctx.strokeStyle = '#ff6a00';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(posX - (fontSize * 1.2), posY - (fontSize * 0.7), fontSize * 2.4, fontSize * 1.4);
            ctx.font = `900 ${fontSize}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ff6a00';
            ctx.fillText(current3CharCode, posX, posY);
            ctx.restore();
          } else {
            // Normal Low-Opacity Drifting Burn with Neon Orange / 7-Hue
            ctx.save();
            ctx.globalAlpha = burnOpacity;
            ctx.font = `900 ${fontSize}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // High-contrast drop shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
            ctx.shadowBlur = 5;
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 3;
            ctx.strokeText(current3CharCode, posX, posY);

            ctx.fillStyle = activeColor;
            ctx.fillText(current3CharCode, posX, posY);
            ctx.restore();
          }
        }
      }

      // 2. RENDER MULTI-VIEWER SPLIT
      if (displayLayout === 'multi_split') {
        MULTI_VIEWER_DEMO_SUBSCRIBERS.forEach((sub, idx) => {
          const canvas = multiCanvasRefs[idx].current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const width = canvas.width;
          const height = canvas.height;

          drawSportsScene(ctx, width, height, t);

          const subT = t + sub.driftOffset;
          const posX = (width / 2) + Math.sin(subT * 0.7) * (width * 0.32);
          const posY = (height / 2) + Math.cos(subT * 0.5) * (height * 0.28);

          ctx.save();
          ctx.globalAlpha = Math.max(0.14, burnOpacity * 1.5);
          ctx.font = `900 34px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0,0,0,0.85)';
          ctx.shadowBlur = 4;
          ctx.fillStyle = sub.color;
          ctx.fillText(sub.code, posX, posY);
          ctx.restore();
        });
      }

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    isPlaying, displayLayout, current3CharCode, burnOpacity, fontSize, 
    selectedHueIndex, isChromaCycling, movementMode, driftSpeed, hasTrailGlow, viewMode
  ]);

  const copyToClipboard = (text: string, type: 'key' | 'ffmpeg') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedFfmpeg(true);
      setTimeout(() => setCopiedFfmpeg(false), 2000);
    }
  };

  const sampleCodes = ['7KX', '9B2', 'Z4P', '3M8', 'V1Q', '5RW'];
  const rtmpStreamKey = `live_stream_ch1?hmac=9e4a81b2e&uid=${current3CharCode}&ttl=900`;
  const ffmpegDriftCommand = `ffmpeg -re -i source.mp4 -vf "drawtext=text='${current3CharCode}':fontfile=/fonts/JetBrainsMono.ttf:fontsize=${fontSize}:fontcolor=orange@${burnOpacity}:box=1:boxcolor=black@0.05:x='(w/2-text_w/2)+sin(t*0.7)*(w*0.36)':y='(h/2-text_h/2)+cos(t*0.5)*(h*0.32)'" -c:v libx264 -b:v 6000k -c:a aac -f flv rtmps://fra01.vortexmark.io:443/live/${rtmpStreamKey}`;

  return (
    <div className="space-y-6">
      {/* Top Banner: Futuristic Orange Theme */}
      <div className="bg-gradient-to-r from-orange-950/40 via-black to-zinc-950 border border-orange-500/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glow-orange-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 p-0.5 shadow-lg shadow-orange-900/50">
            <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center font-mono font-black text-orange-400 text-lg">
              3C
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-black text-white font-mono uppercase tracking-wide">
                Kinematic 3-Character Forensic Burn
              </h2>
              <span className="px-2 py-0.5 text-xs font-mono bg-orange-500/20 border border-orange-500/50 text-orange-300 rounded font-bold">
                SCALE: {fontSize}px
              </span>
              <span className="px-2 py-0.5 text-xs font-mono bg-zinc-900 border border-orange-500/30 text-orange-400 rounded font-bold">
                STEALTH: {Math.round(burnOpacity * 100)}%
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              Continuous Lissajous orbital drift across 7-hue chrominance spectrums with zero extra transcode GPU compute.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowArchitectureExplainer(!showArchitectureExplainer)}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-orange-500/40 text-orange-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
            {showArchitectureExplainer ? 'Hide Architecture' : 'Architecture Proof'}
          </button>
          <button
            onClick={() => setDisplayLayout(displayLayout === 'single' ? 'multi_split' : 'single')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              displayLayout === 'multi_split'
                ? 'bg-orange-500 text-black shadow-lg shadow-orange-950/50'
                : 'bg-black hover:bg-zinc-900 text-orange-400 border border-orange-500/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            {displayLayout === 'multi_split' ? 'Single Monitor' : '4-Viewer Multi-Split'}
          </button>
        </div>
      </div>

      {/* Architecture Explainer Card */}
      {showArchitectureExplainer && (
        <div className="bg-black/95 border border-orange-500/40 rounded-xl p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wide">
              <Layers className="w-4 h-4 text-orange-400" />
              Per-Viewer DRM Hardware Surface Pipeline Architecture
            </h3>
            <span className="text-xs font-mono text-orange-300 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-500/30">
              ZERO TRANSCODE COST
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-orange-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px] text-orange-400 border border-orange-500/30">1</span>
                Single RTMP Transcode
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                The broadcast stream is ingested and transcoded exactly once into standard HLS/DASH ladders. 100,000 viewers consume the same master chunks.
              </p>
            </div>

            <div className="p-3.5 bg-zinc-950 rounded-lg border border-orange-500/30 space-y-2">
              <div className="flex items-center gap-2 text-orange-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px] text-orange-400 border border-orange-500/30">2</span>
                Hardware Framebuffer Burn
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Subscriber player (Smart TV, Apple TV, Web DRM) renders their unique 3-char code directly on the video hardware compositor before HDMI output.
              </p>
            </div>

            <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-orange-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px] text-orange-400 border border-orange-500/30">3</span>
                Instant Leak De-anonymization
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                If the stream is pirated, the 3 characters survive camera recordings and re-encoding, resolving the subscriber's account and IP instantly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main View: Single Player + Real-Time Telemetry Graphs */}
      {displayLayout === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Player + Live Waveform Graphs */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-black/90 border border-orange-500/30 rounded-xl overflow-hidden shadow-2xl relative">
              {/* Player Header Bar */}
              <div className="px-4 py-3 bg-black border-b border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
                  <span className="text-xs font-mono font-bold text-zinc-200">
                    rtmps://fra01.vortexmark.io:443/live/ch1
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-orange-400 border border-zinc-800">
                    1080p60 H.264
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-zinc-950 p-0.5 rounded-lg flex items-center text-xs font-mono border border-zinc-800">
                    <button
                      onClick={() => setViewMode('normal')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        viewMode === 'normal'
                          ? 'bg-orange-500 text-black font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Viewer
                    </button>
                    <button
                      onClick={() => setViewMode('forensic_boost')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        viewMode === 'forensic_boost'
                          ? 'bg-orange-500 text-black font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Target Reticle
                    </button>
                    <button
                      onClick={() => setViewMode('spectral_diff')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        viewMode === 'spectral_diff'
                          ? 'bg-orange-500 text-black font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Spectral Residual
                    </button>
                  </div>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-orange-400 transition-colors border border-zinc-800"
                    title={isPlaying ? 'Pause Feed' : 'Resume Feed'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Video Canvas Container */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={854}
                  height={480}
                  className="w-full h-full object-contain"
                />

                {/* Real-time Drifting HUD Badge */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/85 backdrop-blur border border-orange-500/40 text-[10px] font-mono text-orange-300 flex items-center gap-1.5">
                  <Move className="w-3 h-3 text-orange-400 animate-spin" />
                  Drift: {movementMode.toUpperCase()} | Scale: {fontSize}px | Stealth: {Math.round(burnOpacity * 100)}%
                </div>
              </div>

              {/* Bottom Stream Telemetry Bar */}
              <div className="px-4 py-2.5 bg-black border-t border-zinc-900 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400 gap-3">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <Activity className="w-3.5 h-3.5 text-orange-500" />
                    Bitrate: <strong className="text-white">6,240 kbps</strong>
                  </span>
                  <span>FPS: <strong className="text-white">60.0</strong></span>
                  <span>GOP: <strong className="text-white">120 (2.0s)</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    Per-Viewer Overhead: &lt; 0.04% CPU
                  </span>
                </div>
              </div>
            </div>

            {/* LIVE TELEMETRY GRAPHS SECTION (Waveform + Lissajous Radar + FFT Spectrum) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LiveBitrateGraph currentBitrate={6240} />
              <LissajousTrajectoryRadar code={current3CharCode} driftSpeed={driftSpeed} mode={movementMode} />
              <FrequencySpectrumGraph />
            </div>

            {/* Interactive Infrastructure Cost Graph */}
            <CostComparisonGraph />
          </div>

          {/* Right Column (4 cols): Tactical Watermark Engine & Controls */}
          <div className="lg:col-span-4 space-y-4">
            {/* Active 3-Character Viewer Profile */}
            <div className="bg-black/90 border border-orange-500/30 rounded-xl p-4 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-white font-mono uppercase">Viewer Burn Profile</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/40">
                  PER-SUBSCRIBER
                </span>
              </div>

              {/* 3-Character Token Display */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1.5 font-mono">
                  Assigned 3-Character Identifier:
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-zinc-950 border border-orange-500/50 rounded-lg py-2 px-3 flex items-center justify-center glow-orange-sm">
                    <span className="font-mono text-3xl font-black text-orange-400 tracking-widest">
                      {current3CharCode}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const pool = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
                      let c = '';
                      for (let i = 0; i < 3; i++) c += pool.charAt(Math.floor(Math.random() * pool.length));
                      onCodeChange(c);
                    }}
                    className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-orange-400 rounded-lg text-xs font-mono transition-colors border border-zinc-800"
                    title="Generate Random Token"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-zinc-500 font-mono">Presets:</span>
                  {sampleCodes.map((code) => (
                    <button
                      key={code}
                      onClick={() => onCodeChange(code)}
                      className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                        current3CharCode === code
                          ? 'bg-orange-500 text-black font-bold'
                          : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size & Opacity Controls */}
              <div className="space-y-3 pt-2 border-t border-zinc-900 font-mono">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-300 mb-1">
                    <span className="text-white font-bold">Scale (Font Size):</span>
                    <span className="text-orange-400 font-bold text-sm">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="28"
                    max="72"
                    step="2"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-orange-500 h-2 bg-zinc-800 rounded cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-0.5">
                    <span>28px</span>
                    <span>54px (Optimal)</span>
                    <span>72px (Huge)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-300 mb-1">
                    <span className="text-white font-bold">Burn Opacity:</span>
                    <span className="text-orange-400 font-bold text-sm">{Math.round(burnOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.50"
                    step="0.01"
                    value={burnOpacity}
                    onChange={(e) => setBurnOpacity(parseFloat(e.target.value))}
                    className="w-full accent-orange-500 h-2 bg-zinc-800 rounded cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-0.5">
                    <span>1%</span>
                    <span>7% (Stealth)</span>
                    <span>20%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Quick Opacity Presets */}
                <div className="grid grid-cols-4 gap-1 pt-1">
                  <button
                    onClick={() => setBurnOpacity(0.03)}
                    className={`py-1 text-[10px] rounded border transition-colors ${
                      Math.round(burnOpacity * 100) === 3
                        ? 'bg-orange-500 text-black font-bold border-orange-400'
                        : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900'
                    }`}
                  >
                    3% Stealth
                  </button>
                  <button
                    onClick={() => setBurnOpacity(0.07)}
                    className={`py-1 text-[10px] rounded border transition-colors ${
                      Math.round(burnOpacity * 100) === 7
                        ? 'bg-orange-500 text-black font-bold border-orange-400'
                        : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900'
                    }`}
                  >
                    7% Subtle
                  </button>
                  <button
                    onClick={() => setBurnOpacity(0.18)}
                    className={`py-1 text-[10px] rounded border transition-colors ${
                      Math.round(burnOpacity * 100) === 18
                        ? 'bg-orange-500 text-black font-bold border-orange-400'
                        : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900'
                    }`}
                  >
                    18% Mid
                  </button>
                  <button
                    onClick={() => setBurnOpacity(0.35)}
                    className={`py-1 text-[10px] rounded border transition-colors ${
                      Math.round(burnOpacity * 100) === 35
                        ? 'bg-orange-500 text-black font-bold border-orange-400'
                        : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900'
                    }`}
                  >
                    35% Screener
                  </button>
                </div>
              </div>

              {/* 7-Hue Color Palette Swatches */}
              <div className="space-y-2 pt-2 border-t border-zinc-900 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">7-Hue Spectrum:</span>
                  <button
                    onClick={() => setIsChromaCycling(!isChromaCycling)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      isChromaCycling
                        ? 'bg-gradient-to-r from-orange-500 via-amber-400 to-rose-500 text-black font-black'
                        : 'bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {isChromaCycling ? '🌈 AUTO 7-HUE CYCLE' : 'SINGLE HUE'}
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1.5 pt-1">
                  {HUE_COLORS_7.map((hue, idx) => (
                    <button
                      key={hue.id}
                      onClick={() => {
                        setSelectedHueIndex(idx);
                        setIsChromaCycling(false);
                      }}
                      className={`h-7 rounded flex items-center justify-center border transition-all ${
                        !isChromaCycling && selectedHueIndex === idx
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-zinc-800 hover:scale-105 opacity-80'
                      }`}
                      style={{ backgroundColor: hue.hex }}
                      title={hue.name}
                    >
                      {!isChromaCycling && selectedHueIndex === idx && (
                        <Check className="w-3 h-3 text-black stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kinematic Drift Mode Selector */}
              <div className="space-y-2 pt-2 border-t border-zinc-900 font-mono">
                <label className="text-xs text-zinc-400 font-medium block">Trajectory Kinematics:</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setMovementMode('lissajous')}
                    className={`py-1 text-[11px] rounded border transition-colors ${
                      movementMode === 'lissajous'
                        ? 'bg-orange-500 text-black font-bold border-orange-400'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                    }`}
                  >
                    Lissajous
                  </button>
                  <button
                    onClick={() => setMovementMode('physics_bounce')}
                    className={`py-1 text-[11px] rounded border transition-colors ${
                      movementMode === 'physics_bounce'
                        ? 'bg-orange-500 text-black font-bold border-orange-400'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                    }`}
                  >
                    Rebound
                  </button>
                  <button
                    onClick={() => setMovementMode('step_hop')}
                    className={`py-1 text-[11px] rounded border transition-colors ${
                      movementMode === 'step_hop'
                        ? 'bg-orange-500 text-black font-bold border-orange-400'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                    }`}
                  >
                    Corner Hop
                  </button>
                </div>
              </div>
            </div>

            {/* RTMPS Endpoint & FFmpeg Dynamic Filter */}
            <div className="bg-black/90 border border-orange-500/30 rounded-xl p-4 space-y-3 shadow-xl font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-white uppercase">RTMPS Ingest Server</h3>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  TLS 1.3
                </span>
              </div>

              <div>
                <span className="text-zinc-500 block mb-1">RTMPS Server URL:</span>
                <div className="bg-zinc-950 p-2 rounded border border-zinc-900 text-[11px] text-zinc-200 select-all">
                  rtmps://fra01.vortexmark.io:443/live
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-zinc-500">Stream Key (Per-Subscriber):</span>
                  <button
                    onClick={() => copyToClipboard(rtmpStreamKey, 'key')}
                    className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-mono"
                  >
                    {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedKey ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-zinc-900 text-[11px] text-orange-300 truncate select-all">
                  {rtmpStreamKey}
                </div>
              </div>

              {/* Dynamic Drifting FFmpeg Command */}
              <div className="pt-2 border-t border-zinc-900">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-orange-500" />
                    FFmpeg Stealth DrawText Filter:
                  </span>
                  <button
                    onClick={() => copyToClipboard(ffmpegDriftCommand, 'ffmpeg')}
                    className="text-[10px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-mono"
                  >
                    {copiedFfmpeg ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedFfmpeg ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-zinc-900 text-[10px] text-zinc-400 overflow-x-auto whitespace-pre">
                  {`ffmpeg -re -i in.mp4 -vf "drawtext=text='${current3CharCode}':fontsize=${fontSize}:fontcolor=orange@${burnOpacity}:x='(w/2)+sin(t*0.7)*(w*0.36)':y='(h/2)+cos(t*0.5)*(h*0.32)'" ...`}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MULTI-VIEWER LIVE 4-SPLIT DEMO SCREEN */
        <div className="space-y-4">
          <div className="bg-black/90 border border-orange-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                  Live Multi-Subscriber Per-Viewer Telemetry
                </h3>
                <span className="px-2 py-0.5 text-xs font-mono bg-orange-500/20 text-orange-300 rounded border border-orange-500/30">
                  4 CONCURRENT VIEWERS
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                Single broadcast stream ingested once. Every subscriber receives their distinct 3-character burned token drifting at different trajectories.
              </p>
            </div>
            <button
              onClick={() => setDisplayLayout('single')}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-orange-400 border border-orange-500/30 font-mono font-bold shrink-0"
            >
              Back to Single Monitor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MULTI_VIEWER_DEMO_SUBSCRIBERS.map((sub, idx) => (
              <div
                key={sub.code}
                className="bg-black border border-orange-500/30 rounded-xl overflow-hidden shadow-xl"
              >
                <div className="px-3 py-2 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="text-white font-bold">{sub.user}</span>
                    <span className="text-zinc-500">({sub.device})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400">BURN:</span>
                    <span
                      className="px-2 py-0.5 rounded font-black tracking-widest text-xs"
                      style={{ backgroundColor: `${sub.color}20`, color: sub.color, border: `1px solid ${sub.color}50` }}
                    >
                      {sub.code}
                    </span>
                  </div>
                </div>

                <div className="relative aspect-video bg-black flex items-center justify-center">
                  <canvas
                    ref={multiCanvasRefs[idx]}
                    width={480}
                    height={270}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="px-3 py-2 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>IP: {sub.ip}</span>
                  <button
                    onClick={() => {
                      onCodeChange(sub.code);
                      onInspectLeak(sub.code);
                    }}
                    className="text-orange-400 hover:text-orange-300 font-bold"
                  >
                    Audit Forensic Leak &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
