"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Server, Database, Activity, Lock, Cpu } from "lucide-react";

// ─── 1. ChartVisual: Animated Glowing Line / Spike Visualization ────────────

export function ChartVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl border border-white/5 bg-black/20 p-2.5 flex flex-col justify-between"
    >
      {/* Background grid */}
      <svg className="absolute inset-0 h-full w-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="chart-reg-grid" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke="currentColor" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#chart-reg-grid)" />
      </svg>

      {/* Dynamic Animated Line Curve */}
      <svg className="absolute inset-0 h-full w-full p-1" viewBox="0 0 300 110" preserveAspectRatio="none">
        <defs>
          <linearGradient id="themeChartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--theme-primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--theme-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Threshold line */}
        <line
          x1="0"
          y1="40"
          x2="300"
          y2="40"
          stroke="var(--theme-primary)"
          strokeOpacity="0.25"
          strokeDasharray="4 4"
          strokeWidth="1"
        />

        {/* Gradient area */}
        <path
          d="M 0 95 Q 50 90 90 75 T 160 55 T 215 15 T 260 50 T 300 45 L 300 110 L 0 110 Z"
          fill="url(#themeChartGradient)"
        />

        {/* Animated glowing wave line */}
        <motion.path
          d="M 0 95 Q 50 90 90 75 T 160 55 T 215 15 T 260 50 T 300 45"
          fill="none"
          stroke="var(--theme-primary)"
          strokeWidth="2.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Pulsing peak beacon */}
        <circle cx="215" cy="15" r="4" fill="var(--theme-primary)" />
        <motion.circle
          cx="215"
          cy="15"
          r="8"
          fill="none"
          stroke="var(--theme-primary)"
          strokeWidth="1.5"
          animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Overlay status tags */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
        <span className="inline-flex items-center gap-1 rounded bg-[var(--theme-primary)]/10 px-1.5 py-0.5 text-[var(--theme-primary)] border border-[var(--theme-primary)]/20">
          <Activity className="h-3 w-3 animate-pulse" />
          Traffic Burst Active
        </span>
        <span className="text-xs opacity-60 font-mono">
          p99 &lt; 10ms
        </span>
      </div>

      <div className="relative z-10 text-[9px] font-mono opacity-50">
        In-Memory Fast Path &bull; Zero Buffer Saturation
      </div>
    </div>
  );
}

// ─── 2. SecurityVisual: Animated Cryptographic Handshake ────────────────────

export function SecurityVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl border border-white/5 bg-black/20 p-2.5 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="opacity-70">Identity &amp; Handshake</span>
        <span className="rounded bg-[var(--theme-primary)]/10 px-1.5 py-0.5 text-[var(--theme-primary)] border border-[var(--theme-primary)]/20 text-[9px] font-semibold">
          ZERO-TRUST ENFORCED
        </span>
      </div>

      <div className="my-1 flex items-center justify-between gap-2 text-[10px] font-mono">
        {/* Client node */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-center"
        >
          <Lock className="h-3.5 w-3.5 opacity-70 mb-0.5" />
          <span className="text-[8px] opacity-60 uppercase">Client</span>
        </motion.div>

        {/* Animated cryptographic trace line */}
        <div className="relative flex flex-1 items-center justify-center">
          <div className="h-px w-full bg-gradient-to-r from-white/20 via-[var(--theme-primary)] to-white/20" />
          <motion.div
            className="absolute h-1.5 w-1.5 rounded-full bg-[var(--theme-primary)] shadow-[0_0_8px_var(--theme-primary)]"
            animate={{ x: [-30, 30, -30] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Verified Server node */}
        <motion.div
          animate={{
            borderColor: ["rgba(255,255,255,0.1)", "var(--theme-primary)", "rgba(255,255,255,0.1)"],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center rounded-lg border border-[var(--theme-primary)]/30 bg-[var(--theme-primary)]/10 px-2 py-1.5 text-center"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--theme-primary)] mb-0.5" />
          <span className="text-[8px] font-semibold text-[var(--theme-primary)] uppercase">Verified</span>
        </motion.div>
      </div>

      <div className="text-[9px] font-mono opacity-50">
        Cryptographic Proof &bull; Ephemeral Rotation
      </div>
    </div>
  );
}

// ─── 3. ServerVisual: Animated Mesh / Decoupled Pipeline ────────────────────

export function ServerVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl border border-white/5 bg-black/20 p-2.5 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="opacity-70">Architecture Topology</span>
        <span className="rounded bg-[var(--theme-primary)]/10 px-1.5 py-0.5 text-[var(--theme-primary)] border border-[var(--theme-primary)]/20 text-[9px] font-semibold">
          DECOUPLED MESH
        </span>
      </div>

      <div className="my-1 flex flex-col gap-1.5 text-[10px] font-mono">
        {/* Ingestion Engine */}
        <div className="flex items-center justify-between rounded border border-white/5 bg-white/[0.03] px-2 py-0.5">
          <span className="flex items-center gap-1.5 text-[9px] opacity-80">
            <Server className="h-3 w-3 text-[var(--theme-primary)]" />
            Core Ingestion Node
          </span>
          <span className="text-[8px] text-[var(--theme-primary)] font-semibold">0% Contention</span>
        </div>

        {/* Decoupled Read/Storage */}
        <div className="flex items-center justify-between rounded border border-[var(--theme-primary)]/20 bg-[var(--theme-primary)]/[0.05] px-2 py-0.5">
          <span className="flex items-center gap-1.5 text-[9px] text-[var(--theme-primary)]">
            <Database className="h-3 w-3 text-[var(--theme-primary)]" />
            Decoupled Snapshot Bus
          </span>
          <span className="text-[8px] font-semibold text-[var(--theme-primary)]">Sub-10ms Read</span>
        </div>
      </div>

      <div className="text-[9px] font-mono opacity-50">
        Dedicated Event Streaming &bull; Isolated Workloads
      </div>
    </div>
  );
}

// ─── 4. DefaultVisual: Generic System Fallback ──────────────────────────────

export function DefaultVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl border border-white/5 bg-black/20 p-2.5 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="opacity-70">Subsystem Architecture</span>
        <span className="rounded bg-[var(--theme-primary)]/10 px-1.5 py-0.5 text-[var(--theme-primary)] border border-[var(--theme-primary)]/20 text-[9px]">
          ACTIVE
        </span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Cpu className="h-5 w-5 text-[var(--theme-primary)] animate-pulse" />
        <span className="text-xs font-mono font-medium">Distributed Engine</span>
      </div>
      <div className="text-[9px] font-mono opacity-50">
        High-Throughput Operational Reliability
      </div>
    </div>
  );
}

// ─── VisualRegistry: Switch-based Visual Dispatcher ─────────────────────────

export default function VisualRegistry({ visualKey }: { visualKey: string }) {
  switch (visualKey.toLowerCase()) {
    case "chart":
      return <ChartVisual />;
    case "security":
      return <SecurityVisual />;
    case "server":
      return <ServerVisual />;
    default:
      return <DefaultVisual />;
  }
}
