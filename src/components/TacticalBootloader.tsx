'use client';

import { motion } from 'framer-motion';
import { Terminal, AlertTriangle, RotateCcw, ShieldCheck, Radio } from 'lucide-react';

interface TacticalBootloaderProps {
  progress?: number;
  stage?: 'hero' | 'experience' | 'projects' | 'ready';
  error?: string | null;
  onRetry?: () => void;
}

export default function TacticalBootloader({
  progress = 0,
  stage = 'hero',
  error = null,
  onRetry,
}: TacticalBootloaderProps) {
  const steps = [
    {
      id: 'hero',
      label: 'SYNCING HERO_CONFIG & LOADOUT...',
      doneText: 'HERO_CONFIG // MOUNTED',
    },
    {
      id: 'experience',
      label: 'MOUNTING EXPERIENCE_TELEMETRY...',
      doneText: 'EXPERIENCE_METRICS // VERIFIED',
    },
    {
      id: 'projects',
      label: 'INDEXING PROJECT_ARSENAL...',
      doneText: 'PROJECT_ARSENAL // INDEXED',
    },
  ];

  const getStepStatus = (stepId: string) => {
    if (error) return 'HALTED';
    if (stage === 'ready') return 'VERIFIED';
    if (stage === 'projects' && (stepId === 'hero' || stepId === 'experience')) return 'VERIFIED';
    if (stage === 'experience' && stepId === 'hero') return 'VERIFIED';
    if (stage === stepId) return 'STREAMING';
    return 'PENDING';
  };

  return (
    <div
      className="fixed inset-0 z-[999] h-[100dvh] w-full bg-[#07090B] text-[#F8FAFC] flex flex-col justify-between p-4 sm:p-8 md:p-12 font-mono select-none overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 65%),
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 32px 32px, 32px 32px',
      }}
    >
      {/* ── Top Header Strip ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-widest uppercase">
          <Terminal className="w-4 h-4" />
          <span>DEV_OPERATOR // BOOT_SEQUENCE_INIT</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-white/50">
          <span className="hidden sm:inline">[SECURE 256-BIT DISPATCH CHANNEL]</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            STANDBY
          </span>
        </div>
      </div>

      {/* ── Center Stage: Radar Reticle & Telemetry Terminal ─────────────── */}
      <div className="flex flex-col items-center justify-center my-auto py-6 max-w-xl mx-auto w-full">
        {/* Animated Radar Reticle Target */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-6">
          {/* Outer Concentric Ring */}
          <div className="absolute inset-0 rounded-full border border-emerald-500/25" />
          {/* Middle Dashed Ring */}
          <div className="absolute inset-3 rounded-full border border-dashed border-emerald-400/40 animate-[spin_12s_linear_infinite]" />
          {/* Inner Ring */}
          <div className="absolute inset-8 rounded-full border border-emerald-500/30" />

          {/* Crosshair Lines */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-emerald-500/25 pointer-events-none" />
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-emerald-500/25 pointer-events-none" />

          {/* Rotating Radar Sweep Cone */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(16, 185, 129, 0.35) 0deg, rgba(16, 185, 129, 0.0) 65deg, transparent 65deg)',
            }}
          />

          {/* Center Pulsing Beacon */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {error ? (
              <AlertTriangle className="w-8 h-8 text-amber-400 animate-bounce" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_15px_#10B981] animate-ping" />
            )}
          </div>
        </div>

        {/* Diagnostic Status Box */}
        {error ? (
          <div className="w-full p-4 rounded-xl border border-red-500/40 bg-red-950/20 text-center space-y-3 shadow-xl">
            <div className="flex items-center justify-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>TELEMETRY UPLINK FAILURE</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-sans">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-transform active:scale-95 cursor-pointer shadow-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RETRY UPLINK</span>
              </button>
            )}
          </div>
        ) : (
          <div className="w-full space-y-3.5">
            {/* Monospace Telemetry Step Lines */}
            <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2 text-xs">
              {steps.map((step, idx) => {
                const status = getStepStatus(step.id);
                const isCurrent = status === 'STREAMING';
                const isDone = status === 'VERIFIED';

                return (
                  <div
                    key={step.id}
                    className="flex items-center justify-between gap-2 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-white/40">[{String(idx + 1).padStart(2, '0')}]</span>
                      <span
                        className={`truncate ${
                          isDone
                            ? 'text-white/80'
                            : isCurrent
                            ? 'text-emerald-400 font-bold'
                            : 'text-white/40'
                        }`}
                      >
                        {isDone ? step.doneText : step.label}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : isCurrent
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 animate-pulse'
                          : 'bg-white/5 border-white/10 text-white/30'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Emerald Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-white/60">
                <span>BUFFERING ARCHITECTURAL HUD</span>
                <span className="text-emerald-400 font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/15">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(4, Math.min(100, progress))}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_#10B981]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Telemetry Footer Strip ─────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-white/50">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>ZERO_MOCK // DIRECT MONGODB ENRICHMENT</span>
        </span>
        <span className="font-mono text-emerald-400/80">LATENCY &lt; 50MS</span>
      </div>
    </div>
  );
}
