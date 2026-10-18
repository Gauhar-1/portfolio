"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Server,
  Database,
  Activity,
  Lock,
  Cpu,
  Network,
  Radio,
  Share2,
  CheckCircle2,
  ShieldAlert,
  Timer,
  Gamepad2,
  Coins,
  Check,
  Box,
  Layers,
  Search,
  Zap,
  Terminal,
  Filter,
  RefreshCw,
  FileCode,
  Key,
  AlertTriangle,
  Workflow,
  ArrowRight,
  X,
} from "lucide-react";

// ─── Adaptive Strict 3-Token Mathematical Style Tokens ──────────────────────

const outerContainerStyle: React.CSSProperties = {
  backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 88%, var(--theme-text, #f8fafc) 6%)",
  border: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 16%, transparent)",
  boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--theme-text, #f8fafc) 10%, transparent)",
};

const inactiveSlotStyle: React.CSSProperties = {
  backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 96%, var(--theme-text, #f8fafc) 4%)",
  border: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 18%, transparent)",
};

const activeHighlightStyle: React.CSSProperties = {
  backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 15%, var(--theme-bg, #0a0a0c))",
  border: "1px solid var(--theme-primary, #10B981)",
  color: "var(--theme-primary, #10B981)",
};

const textSecondaryStyle: React.CSSProperties = {
  color: "color-mix(in srgb, var(--theme-text, #f8fafc) 85%, var(--theme-bg, #0a0a0c))",
};

const textMutedStyle: React.CSSProperties = {
  color: "color-mix(in srgb, var(--theme-text, #f8fafc) 60%, var(--theme-bg, #0a0a0c))",
};

// ─── 1. ChartVisual: Animated Glowing Line / Spike Visualization ────────────

export function ChartVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      {/* Background grid */}
      <svg className="absolute inset-0 h-full w-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="chart-reg-grid" width="18" height="18" patternUnits="userSpaceOnUse">
            <path
              d="M 18 0 L 0 0 0 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              style={{ stroke: "color-mix(in srgb, var(--theme-text, #f8fafc) 18%, transparent)" }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#chart-reg-grid)" />
      </svg>

      {/* Dynamic Animated Line Curve */}
      <svg className="absolute inset-0 h-full w-full p-1" viewBox="0 0 300 110" preserveAspectRatio="none">
        <defs>
          <linearGradient id="themeChartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--theme-primary, #10B981)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--theme-primary, #10B981)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Threshold line */}
        <line
          x1="0"
          y1="40"
          x2="300"
          y2="40"
          stroke="var(--theme-primary, #10B981)"
          strokeOpacity="0.3"
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
          stroke="var(--theme-primary, #10B981)"
          strokeWidth="2.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Pulsing peak beacon */}
        <circle cx="215" cy="15" r="4" fill="var(--theme-primary, #10B981)" />
        <motion.circle
          cx="215"
          cy="15"
          r="8"
          fill="none"
          stroke="var(--theme-primary, #10B981)"
          strokeWidth="1.5"
          animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Overlay status tags */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
        <span
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold"
          style={activeHighlightStyle}
        >
          <Activity className="h-3 w-3 animate-pulse" />
          Traffic Burst Active
        </span>
        <span className="text-xs font-mono font-semibold" style={textSecondaryStyle}>
          p99 &lt; 10ms
        </span>
      </div>

      <div className="relative z-10 text-[9px] font-mono" style={textMutedStyle}>
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
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>Identity &amp; Handshake</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          ZERO-TRUST ENFORCED
        </span>
      </div>

      <div className="my-1 flex items-center justify-between gap-2 text-[10px] font-mono">
        {/* Client node */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center rounded-lg px-2 py-1.5 text-center"
          style={inactiveSlotStyle}
        >
          <Lock className="h-3.5 w-3.5 mb-0.5" style={textSecondaryStyle} />
          <span className="text-[8px] uppercase font-bold" style={textSecondaryStyle}>Client</span>
        </motion.div>

        {/* Animated cryptographic trace line */}
        <div className="relative flex flex-1 items-center justify-center">
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(to right, color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent), var(--theme-primary, #10B981), color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent))",
            }}
          />
          <motion.div
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--theme-primary, #10B981)",
              boxShadow: "0 0 8px var(--theme-primary, #10B981)",
            }}
            animate={{ x: [-28, 28, -28] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Verified Server node */}
        <motion.div
          animate={{
            borderColor: [
              "color-mix(in srgb, var(--theme-text, #f8fafc) 18%, transparent)",
              "var(--theme-primary, #10B981)",
              "color-mix(in srgb, var(--theme-text, #f8fafc) 18%, transparent)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center rounded-lg px-2 py-1.5 text-center"
          style={activeHighlightStyle}
        >
          <ShieldCheck className="h-3.5 w-3.5 mb-0.5" />
          <span className="text-[8px] font-bold uppercase">Verified</span>
        </motion.div>
      </div>

      <div className="text-[9px] font-mono" style={textMutedStyle}>
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
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>Architecture Topology</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          DECOUPLED MESH
        </span>
      </div>

      <div className="my-1 flex flex-col gap-1.5 text-[10px] font-mono">
        {/* Ingestion Engine */}
        <div
          className="flex items-center justify-between rounded px-2 py-0.5"
          style={inactiveSlotStyle}
        >
          <span className="flex items-center gap-1.5 text-[9px] font-medium" style={textSecondaryStyle}>
            <Server className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
            Core Ingestion Node
          </span>
          <span className="text-[8px] font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
            0% Contention
          </span>
        </div>

        {/* Decoupled Read/Storage */}
        <div
          className="flex items-center justify-between rounded px-2 py-0.5"
          style={activeHighlightStyle}
        >
          <span className="flex items-center gap-1.5 text-[9px] font-bold">
            <Database className="h-3 w-3" />
            Decoupled Snapshot Bus
          </span>
          <span className="text-[8px] font-bold">Sub-10ms Read</span>
        </div>
      </div>

      <div className="text-[9px] font-mono" style={textMutedStyle}>
        Dedicated Event Streaming &bull; Isolated Workloads
      </div>
    </div>
  );
}

// ─── 4. LayoutOrchestratorVisual: Zero-Deploy Storefront Orchestration ────────

export function LayoutOrchestratorVisual() {
  const [variant, setVariant] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVariant((v) => (v === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      {/* Top Browser Header */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 25%, transparent)" }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 25%, transparent)" }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 25%, transparent)" }}
            />
          </div>
          <span className="text-[8px] font-mono ml-1" style={textMutedStyle}>
            slot-runtime.cms
          </span>
        </div>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider flex items-center gap-1"
          style={activeHighlightStyle}
        >
          <span
            className="h-1.5 w-1.5 rounded-full animate-ping"
            style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
          />
          LIVE SLOT ENGINE // 0 DEPLOYS
        </span>
      </div>

      {/* Dynamic Mini-Storefront Wireframe Slots */}
      <div className="my-1 flex-1 flex flex-col justify-center">
        {variant === 0 ? (
          <div className="grid grid-cols-3 gap-1.5">
            {/* Hero Slot (Span 2) */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="col-span-2 rounded p-1.5 flex flex-col justify-between"
              style={activeHighlightStyle}
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-bold uppercase">
                  SLOT: HERO_SPLIT
                </span>
                <span
                  className="h-1 w-6 rounded"
                  style={{ backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 45%, transparent)" }}
                />
              </div>
              <div
                className="h-1 w-16 rounded mt-1"
                style={{ backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 35%, transparent)" }}
              />
            </motion.div>

            {/* Side Bento Slot */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="col-span-1 rounded p-1.5 flex flex-col justify-between"
              style={inactiveSlotStyle}
            >
              <span className="text-[7px] font-mono font-semibold uppercase" style={textSecondaryStyle}>
                SLOT: BENTO_A
              </span>
              <div
                className="h-1 w-8 rounded mt-1"
                style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 22%, transparent)" }}
              />
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {/* Bento Slot Left */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="col-span-1 rounded p-1.5 flex flex-col justify-between"
              style={inactiveSlotStyle}
            >
              <span className="text-[7px] font-mono font-semibold uppercase" style={textSecondaryStyle}>
                SLOT: BENTO_A
              </span>
              <div
                className="h-1 w-8 rounded mt-1"
                style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 22%, transparent)" }}
              />
            </motion.div>

            {/* Hero Slot (Span 2) Moved Right */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="col-span-2 rounded p-1.5 flex flex-col justify-between"
              style={activeHighlightStyle}
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-bold uppercase">
                  SLOT: HERO_REORCHESTRATED
                </span>
                <span
                  className="h-1 w-6 rounded"
                  style={{ backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 45%, transparent)" }}
                />
              </div>
              <div
                className="h-1 w-20 rounded mt-1"
                style={{ backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 35%, transparent)" }}
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-[9px] font-mono flex justify-between items-center" style={textMutedStyle}>
        <span>Dynamic Slot Mutation</span>
        <span>Hot Reload: 0ms</span>
      </div>
    </div>
  );
}

// ─── 5. BlockAstVisual: Polymorphic Block Editorial Studio ───────────────────

export function BlockAstVisual() {
  const blocks = [
    { tag: "TXT_NODE", label: "Executive Lead Paragraph" },
    { tag: "MEDIA_GALLERY", label: "Responsive Mesh Asset" },
    { tag: "METRIC_CALLOUT", label: "Realtime KPI Counter" },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>Editorial AST Pipeline</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          POLYMORPHIC NODES
        </span>
      </div>

      {/* 3 Stacked Modular Blocks */}
      <div className="my-0.5 space-y-1">
        {blocks.map((b, idx) => (
          <motion.div
            key={b.tag}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.1 }}
            className="flex items-center justify-between rounded-md px-2 py-0.5"
            style={{
              ...inactiveSlotStyle,
              borderLeft: "2px solid var(--theme-primary, #10B981)",
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-mono font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
                [{b.tag}]
              </span>
              <span className="text-[8px] font-mono truncate max-w-[130px] font-medium" style={textSecondaryStyle}>
                {b.label}
              </span>
            </div>
            <span className="text-[7.5px] font-mono" style={textMutedStyle}>
              L{idx + 1}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Pulsing + ADD AST BLOCK Indicator */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center justify-center gap-1 rounded py-0.5 text-[8px] font-mono font-bold tracking-wider"
        style={{
          ...activeHighlightStyle,
          borderStyle: "dashed",
        }}
      >
        <span>+</span>
        <span>ADD AST BLOCK</span>
      </motion.div>
    </div>
  );
}

// ─── 6. SchemaCompilerVisual: Schema-Driven Form Engine ─────────────────────

export function SchemaCompilerVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>Schema Form Engine</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          ZOD &bull; JSON AST
        </span>
      </div>

      {/* Two-Column Micro-Diagram */}
      <div className="my-0.5 grid grid-cols-5 items-center gap-1.5 text-[9px] font-mono">
        {/* Left: JSON Schema Pill */}
        <div className="col-span-2 rounded p-1.5 space-y-0.5" style={inactiveSlotStyle}>
          <div className="text-[7px] uppercase tracking-wider font-bold" style={textMutedStyle}>
            JSON_SCHEMA
          </div>
          <div className="text-[8px] font-bold truncate" style={{ color: "var(--theme-primary, #10B981)" }}>
            {`{ field: "arr" }`}
          </div>
          <div className="text-[7.5px]" style={textSecondaryStyle}>
            {`req: true, min: 2`}
          </div>
        </div>

        {/* Center: Animated Compiler Beam */}
        <div className="col-span-1 relative flex items-center justify-center">
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(to right, color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent), var(--theme-primary, #10B981), color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent))",
            }}
          />
          <motion.div
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--theme-primary, #10B981)",
              boxShadow: "0 0 8px var(--theme-primary, #10B981)",
            }}
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Right: Compiled UI Form Input */}
        <div className="col-span-2 rounded p-1.5 space-y-0.5" style={activeHighlightStyle}>
          <div className="flex items-center justify-between">
            <span className="text-[7.5px] font-bold uppercase">
              RENDERED_UI
            </span>
            <span className="text-[8px] font-bold">✓</span>
          </div>
          <div
            className="rounded px-1.5 py-0.5 text-[8px] flex items-center justify-between"
            style={inactiveSlotStyle}
          >
            <span className="truncate font-medium" style={textSecondaryStyle}>valid_input</span>
            <span
              className="h-1 w-1 rounded-full"
              style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
            />
          </div>
        </div>
      </div>

      <div className="text-[9px] font-mono flex items-center justify-between" style={textMutedStyle}>
        <span>Zero Client Glue</span>
        <span>Instant Compilation</span>
      </div>
    </div>
  );
}

// ─── 7. ServiceMeshVisual: Decoupled Microservices & Regional Partitioning ──

export function ServiceMeshVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>API_GATEWAY // MESH</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          100% ISOLATED
        </span>
      </div>

      <div className="my-0.5 flex items-center justify-between gap-1.5">
        {/* Ingress Edge Gateway */}
        <div
          className="flex flex-col items-center justify-center rounded px-2 py-1 text-center shrink-0 min-w-[68px]"
          style={inactiveSlotStyle}
        >
          <Network className="h-3.5 w-3.5 mb-0.5" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span className="text-[7px] font-mono font-bold tracking-tight" style={textSecondaryStyle}>
            [EDGE_GATEWAY]
          </span>
          <span className="text-[6px] font-mono" style={{ color: "var(--theme-primary, #10B981)" }}>
            INGRESS :443
          </span>
        </div>

        {/* Animated Connector Splitting Lines */}
        <div className="relative flex-1 h-10 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 50 36" fill="none" preserveAspectRatio="none">
            {/* Top Branch */}
            <path
              d="M 2 18 C 20 18, 25 8, 48 8"
              stroke="color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent)"
              strokeWidth="1.25"
            />
            <motion.path
              d="M 2 18 C 20 18, 25 8, 48 8"
              stroke="var(--theme-primary, #10B981)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              animate={{ strokeDashoffset: [-20, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            />
            {/* Bottom Branch */}
            <path
              d="M 2 18 C 20 18, 25 28, 48 28"
              stroke="color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent)"
              strokeWidth="1.25"
            />
            <motion.path
              d="M 2 18 C 20 18, 25 28, 48 28"
              stroke="var(--theme-primary, #10B981)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              animate={{ strokeDashoffset: [-20, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: 0.7 }}
            />
          </svg>
        </div>

        {/* Isolated Service Boxes */}
        <div className="flex flex-col gap-1 min-w-[105px]">
          <div
            className="flex items-center justify-between rounded px-1.5 py-0.5 text-[7px] font-mono"
            style={inactiveSlotStyle}
          >
            <div className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full animate-pulse" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
              <span className="font-bold truncate" style={textSecondaryStyle}>[PUBLIC_FEED_REPLICA]</span>
            </div>
            <span className="text-[6px] font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>RO</span>
          </div>

          <div
            className="flex items-center justify-between rounded px-1.5 py-0.5 text-[7px] font-mono"
            style={activeHighlightStyle}
          >
            <div className="flex items-center gap-1">
              <Lock className="h-2 w-2 shrink-0" />
              <span className="font-bold truncate">[PRIVATE_ADMIN_SUBNET]</span>
            </div>
            <span className="text-[6px] font-bold">AIRGAP</span>
          </div>
        </div>
      </div>

      <div className="text-[9px] font-mono flex items-center justify-between" style={textMutedStyle}>
        <span>Regional Partitioning</span>
        <span>Zero Shared State</span>
      </div>
    </div>
  );
}

// ─── 8. PubSubStreamVisual: Real-Time Campaign Messaging Pipeline ────────────

export function PubSubStreamVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>REDIS_PUBSUB // WS</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          &lt; 45MS BROADCAST
        </span>
      </div>

      <div className="my-0.5 flex items-center justify-between gap-1 text-[7px] font-mono">
        {/* Event Publisher */}
        <div
          className="flex flex-col items-center justify-center rounded px-1.5 py-1 text-center shrink-0 min-w-[62px]"
          style={inactiveSlotStyle}
        >
          <Radio className="h-3 w-3 mb-0.5" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span className="font-bold tracking-tight truncate max-w-[60px]" style={textSecondaryStyle}>
            [ISSUE_MUTATION]
          </span>
          <span className="text-[6px]" style={{ color: "var(--theme-primary, #10B981)" }}>PUB_EVENT</span>
        </div>

        {/* Pulse Connector to Exchange */}
        <div className="relative w-5 flex items-center justify-center">
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(to right, color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent), var(--theme-primary, #10B981))",
            }}
          />
          <motion.div
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--theme-primary, #10B981)",
              boxShadow: "0 0 6px var(--theme-primary, #10B981)",
            }}
            animate={{ x: [-8, 8] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Central Regional Exchange Hub */}
        <div
          className="flex flex-col items-center justify-center rounded px-1.5 py-0.5 text-center shrink-0"
          style={activeHighlightStyle}
        >
          <Share2 className="h-2.5 w-2.5 mb-0.5 animate-spin" style={{ animationDuration: "10s" }} />
          <span className="font-bold text-[6.5px] leading-tight">[REGIONAL_EXCHANGE]</span>
          <span className="text-[5.5px] opacity-80">HUB</span>
        </div>

        {/* Fanout Connectors to 3 Subscribers */}
        <div className="relative flex-1 h-9 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 30 36" fill="none" preserveAspectRatio="none">
            <path d="M 2 18 C 12 18, 16 6, 28 6" stroke="color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent)" strokeWidth="1" />
            <path d="M 2 18 L 28 18" stroke="color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent)" strokeWidth="1" />
            <path d="M 2 18 C 12 18, 16 30, 28 30" stroke="color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent)" strokeWidth="1" />

            <motion.circle
              r="1.2"
              fill="var(--theme-primary, #10B981)"
              animate={{ cx: [2, 28], cy: [18, 6] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.circle
              r="1.2"
              fill="var(--theme-primary, #10B981)"
              animate={{ cx: [2, 28], cy: [18, 18] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
            />
            <motion.circle
              r="1.2"
              fill="var(--theme-primary, #10B981)"
              animate={{ cx: [2, 28], cy: [18, 30] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
            />
          </svg>
        </div>

        {/* 3 Live Subscribers */}
        <div className="flex flex-col gap-0.5 min-w-[56px]">
          <div className="flex items-center justify-between rounded px-1 py-0.2 text-[6.5px]" style={inactiveSlotStyle}>
            <span style={textSecondaryStyle}>VOTER_1</span>
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          </div>
          <div className="flex items-center justify-between rounded px-1 py-0.2 text-[6.5px]" style={inactiveSlotStyle}>
            <span style={textSecondaryStyle}>VOTER_2</span>
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          </div>
          <div className="flex items-center justify-between rounded px-1 py-0.2 text-[6.5px]" style={inactiveSlotStyle}>
            <span style={textSecondaryStyle}>AGENT_HQ</span>
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          </div>
        </div>
      </div>

      <div className="text-[9px] font-mono flex items-center justify-between" style={textMutedStyle}>
        <span>Redis Broker Fanout</span>
        <span>Sub-45ms Broadcast</span>
      </div>
    </div>
  );
}

// ─── 9. RlsShieldVisual: Granular RBAC & Region-Confined Security ───────────

export function RlsShieldVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>POSTGRES_RLS // RBAC</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          JURISDICTION LOCKED
        </span>
      </div>

      {/* 2-Row Database Table Preview */}
      <div className="my-0.5 flex flex-col gap-1.5">
        {/* Row 1: Authorized Tenant */}
        <div
          className="flex items-center justify-between rounded px-2 py-1 text-[8px] font-mono"
          style={activeHighlightStyle}
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 shrink-0" />
            <span className="font-bold">REGION_A [AUTHORIZED]</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[7px] font-bold px-1 py-0.2 rounded" style={inactiveSlotStyle}>
              ✓ 200 OK
            </span>
          </div>
        </div>

        {/* Row 2: Blocked by RLS */}
        <div
          className="flex items-center justify-between rounded px-2 py-1 text-[8px] font-mono opacity-65"
          style={{
            ...inactiveSlotStyle,
            borderStyle: "dashed",
          }}
        >
          <div className="flex items-center gap-1.5">
            <Lock className="h-3 w-3 shrink-0" style={{ color: "var(--theme-primary, #10B981)" }} />
            <span className="line-through font-medium" style={textMutedStyle}>
              REGION_B [BLOCKED BY RLS]
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="text-[7px] font-bold px-1 py-0.2 rounded flex items-center gap-0.5"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
                color: "color-mix(in srgb, var(--theme-text, #f8fafc) 65%, transparent)",
              }}
            >
              <ShieldAlert className="h-2.5 w-2.5" />
              0 ROWS
            </span>
          </div>
        </div>
      </div>

      <div className="text-[9px] font-mono flex items-center justify-between" style={textMutedStyle}>
        <span>Kernel-Level Tenant Policy</span>
        <span>Zero Cross-Ward Leakage</span>
      </div>
    </div>
  );
}

// ─── 10. StateLoopVisual: Real-Time Deterministic Game State Synchronization ─

export function StateLoopVisual() {
  const [turnSeconds, setTurnSeconds] = useState(14.8);

  useEffect(() => {
    const timer = setInterval(() => {
      setTurnSeconds((prev) => (prev <= 0.2 ? 15.0 : +(prev - 0.1).toFixed(1)));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>SOCKET_IO // GAME_LOOP</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          &lt; 50MS DELTA SYNC
        </span>
      </div>

      {/* Peer 1 -> Authoritative State Engine <- Peer 2 */}
      <div className="my-0.5 flex items-center justify-between gap-1 text-[7.5px] font-mono">
        {/* Peer 1 */}
        <div
          className="flex flex-col items-center justify-center rounded px-1.5 py-1 text-center shrink-0 min-w-[50px]"
          style={inactiveSlotStyle}
        >
          <Gamepad2 className="h-3 w-3 mb-0.5" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span className="font-bold" style={textSecondaryStyle}>PEER_1</span>
          <span className="text-[6px]" style={{ color: "var(--theme-primary, #10B981)" }}>&lt;18ms</span>
        </div>

        {/* Pulse Connector Left */}
        <div className="relative flex-1 flex items-center justify-center">
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(to right, color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent), var(--theme-primary, #10B981))",
            }}
          />
          <motion.div
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--theme-primary, #10B981)",
              boxShadow: "0 0 6px var(--theme-primary, #10B981)",
            }}
            animate={{ x: [-12, 12, -12] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Authoritative State Engine */}
        <div
          className="flex flex-col items-center justify-center rounded px-2 py-1 text-center shrink-0"
          style={activeHighlightStyle}
        >
          <div className="flex items-center gap-1">
            <Timer className="h-2.5 w-2.5 animate-pulse" />
            <span className="font-bold uppercase text-[7.5px]">
              TURN_LOCK: {turnSeconds.toFixed(1)}s
            </span>
          </div>
          <div className="text-[6px] font-mono mt-0.5 flex items-center gap-1">
            <span className="h-1 w-1 rounded-full animate-ping" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
            <span>[AUTHORITATIVE_STATE_ENGINE]</span>
          </div>
          <span className="text-[5.5px] opacity-80 mt-0.5">STATE_VERIFIED // 0x8F2A</span>
        </div>

        {/* Pulse Connector Right */}
        <div className="relative flex-1 flex items-center justify-center">
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(to right, var(--theme-primary, #10B981), color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent))",
            }}
          />
          <motion.div
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--theme-primary, #10B981)",
              boxShadow: "0 0 6px var(--theme-primary, #10B981)",
            }}
            animate={{ x: [12, -12, 12] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Peer 2 */}
        <div
          className="flex flex-col items-center justify-center rounded px-1.5 py-1 text-center shrink-0 min-w-[50px]"
          style={inactiveSlotStyle}
        >
          <Gamepad2 className="h-3 w-3 mb-0.5" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span className="font-bold" style={textSecondaryStyle}>PEER_2</span>
          <span className="text-[6px]" style={{ color: "var(--theme-primary, #10B981)" }}>&lt;24ms</span>
        </div>
      </div>

      <div className="text-[9px] font-mono flex items-center justify-between" style={textMutedStyle}>
        <span>Lockstep Sync</span>
        <span>Deterministic Hash Verification</span>
      </div>
    </div>
  );
}

// ─── 11. EscrowLedgerVisual: Manual Wager Selection & KYC Ledger ─────────────

export function EscrowLedgerVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>ATOMIC_WAGER_LEDGER</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          ZERO DOUBLE-SPEND
        </span>
      </div>

      {/* 3-Step Pipeline: WAGER -> KYC -> ESCROW */}
      <div className="my-0.5 space-y-1">
        <div className="flex items-center justify-between gap-1 text-[7.5px] font-mono">
          {/* Step 1 */}
          <div
            className="flex-1 flex flex-col items-center justify-center rounded px-1 py-0.5 text-center"
            style={inactiveSlotStyle}
          >
            <Coins className="h-2.5 w-2.5 mb-0.5" style={{ color: "var(--theme-primary, #10B981)" }} />
            <span className="font-bold truncate" style={textSecondaryStyle}>[MANUAL_WAGER_LOCK]</span>
          </div>

          <span className="text-[8px]" style={{ color: "var(--theme-primary, #10B981)" }}>→</span>

          {/* Step 2 */}
          <div
            className="flex-1 flex flex-col items-center justify-center rounded px-1 py-0.5 text-center"
            style={inactiveSlotStyle}
          >
            <ShieldCheck className="h-2.5 w-2.5 mb-0.5" style={{ color: "var(--theme-primary, #10B981)" }} />
            <span className="font-bold truncate" style={textSecondaryStyle}>[UTR_KYC_VERIFIER]</span>
          </div>

          <span className="text-[8px]" style={{ color: "var(--theme-primary, #10B981)" }}>→</span>

          {/* Step 3 */}
          <div
            className="flex-1 flex flex-col items-center justify-center rounded px-1 py-0.5 text-center"
            style={activeHighlightStyle}
          >
            <Check className="h-2.5 w-2.5 mb-0.5 stroke-[2.5]" />
            <span className="font-bold truncate">[ESCROW_SETTLED]</span>
          </div>
        </div>

        {/* Row Lock Status Indicator */}
        <div
          className="flex items-center justify-between rounded px-2 py-0.5 text-[7px] font-mono"
          style={inactiveSlotStyle}
        >
          <div className="flex items-center gap-1">
            <Lock className="h-2 w-2" style={{ color: "var(--theme-primary, #10B981)" }} />
            <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
              ROW_LOCK: ACQUIRED
            </span>
          </div>
          <span style={textSecondaryStyle}>ISOLATION: SERIALIZABLE</span>
        </div>
      </div>

      <div className="text-[9px] font-mono flex items-center justify-between" style={textMutedStyle}>
        <span>ACID Transaction Isolation</span>
        <span>Cryptographic Audit Proof</span>
      </div>
    </div>
  );
}

// ─── 12. WebGlPipelineVisual: Three.js / React Three Fiber 3D Experience ──────

export function WebGlPipelineVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>R3F_WEBGL_SHADER</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          LOCKED 60 FPS
        </span>
      </div>

      {/* 3D Wireframe Cube Node + Parallel Thread Bars */}
      <div className="my-0.5 flex items-center gap-2.5">
        {/* Animated Wireframe Cube */}
        <div className="relative h-11 w-11 flex items-center justify-center shrink-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="relative h-8 w-8 rounded border flex items-center justify-center"
            style={{
              borderColor: "var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, transparent)",
              boxShadow: "0 0 10px color-mix(in srgb, var(--theme-primary, #10B981) 30%, transparent)",
            }}
          >
            <Box className="h-4 w-4 animate-pulse" style={{ color: "var(--theme-primary, #10B981)" }} />
            <span
              className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
            />
            <span
              className="absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 40%, transparent)" }}
            />
          </motion.div>
        </div>

        {/* Parallel Thread Bars */}
        <div className="flex-1 flex flex-col justify-center gap-1 text-[7.5px] font-mono">
          {/* Thread 1: GPU Shader */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1" style={textSecondaryStyle}>
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
                GPU_SHADER_THREAD
              </span>
              <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
                [60 FPS]
              </span>
            </div>
            <div className="h-1 w-full rounded-full overflow-hidden" style={inactiveSlotStyle}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
                animate={{ width: ["96%", "100%", "98%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Thread 2: Main UI */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1" style={textSecondaryStyle}>
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 40%, transparent)" }} />
                MAIN_UI_THREAD
              </span>
              <span className="font-medium text-[6.5px]" style={textMutedStyle}>
                [UNBLOCKED &lt; 1.2s]
              </span>
            </div>
            <div className="h-1 w-full rounded-full overflow-hidden" style={inactiveSlotStyle}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 60%, var(--theme-text, #f8fafc))" }}
                animate={{ width: ["16%", "22%", "14%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-[9px] font-mono flex items-center justify-between" style={textMutedStyle}>
        <span>Off-Thread WebGL Shaders</span>
        <span>Zero Frame Drops (60fps)</span>
      </div>
    </div>
  );
}

// ─── 13. DefaultVisual: Generic System Fallback ─────────────────────────────

export function DefaultVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>Subsystem Architecture</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          ACTIVE
        </span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Cpu className="h-5 w-5 animate-pulse" style={{ color: "var(--theme-primary, #10B981)" }} />
        <span className="text-xs font-mono font-bold" style={textSecondaryStyle}>
          Distributed Engine
        </span>
      </div>
      <div className="text-[9px] font-mono" style={textMutedStyle}>
        High-Throughput Operational Reliability
      </div>
    </div>
  );
}

// ─── 14. TwoTierCacheVisual: 3-Stage Cache Waterfall Schematic ──────────────

export function TwoTierCacheVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between gap-1.5"
      style={{
        ...outerContainerStyle,
        minHeight: "140px",
      }}
    >
      {/* Header telemetry status */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <Layers className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>CACHE_WATERFALL // DUAL-TIER</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase flex items-center gap-1"
          style={activeHighlightStyle}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          P95: &lt;35ms
        </span>
      </div>

      {/* 3-Stage Cache Waterfall Rows */}
      <div className="flex flex-col gap-1 font-mono text-[9px]">
        {/* Stage 01: L1 Redis Exact SHA-256 */}
        <div
          className="flex items-center justify-between rounded px-2 py-1"
          style={{
            ...inactiveSlotStyle,
            borderColor: "color-mix(in srgb, var(--theme-primary, #10B981) 35%, transparent)",
            backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 8%, var(--theme-bg, #0a0a0c))",
          }}
        >
          <div className="flex items-center gap-1.5">
            <motion.span
              animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="h-2 w-2 rounded-full shrink-0"
              style={{
                backgroundColor: "var(--theme-primary, #10B981)",
                boxShadow: "0 0 8px var(--theme-primary, #10B981)",
              }}
            />
            <span className="font-bold text-[8.5px] tracking-tight" style={textSecondaryStyle}>
              L1: REDIS EXACT SHA-256
            </span>
          </div>
          <span
            className="rounded px-1.5 py-0.5 text-[8px] font-bold"
            style={{
              color: "var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 16%, transparent)",
              border: "1px solid color-mix(in srgb, var(--theme-primary, #10B981) 35%, transparent)",
            }}
          >
            [HIT: ~8ms • $0.00 Token Cost]
          </span>
        </div>

        {/* Stage 02: L2 Vector Cosine Similarity */}
        <div
          className="flex items-center justify-between rounded px-2 py-1"
          style={{
            ...inactiveSlotStyle,
            borderColor: "color-mix(in srgb, var(--theme-primary, #10B981) 22%, transparent)",
            backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 4%, var(--theme-bg, #0a0a0c))",
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
            <span className="font-bold text-[8.5px] tracking-tight" style={textSecondaryStyle}>
              L2: VECTOR COSINE &gt;= 0.92
            </span>
            {/* Meter Bar: 0.94 >= 0.92 */}
            <div
              className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[7.5px]"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 90%, var(--theme-text, #f8fafc) 10%)",
                border: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
              }}
            >
              <div className="w-10 h-1 rounded-full overflow-hidden" style={inactiveSlotStyle}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
                  initial={{ width: "40%" }}
                  animate={{ width: ["82%", "94%", "88%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <span style={{ color: "var(--theme-primary, #10B981)" }}>0.94 &gt;= 0.92</span>
            </div>
          </div>
          <span
            className="rounded px-1.5 py-0.5 text-[8px] font-bold"
            style={{
              color: "var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, transparent)",
            }}
          >
            [SEMANTIC HIT: &lt;35ms • LLM Bypassed]
          </span>
        </div>

        {/* Stage 03: L3 Full RAG + LLM Stream (Muted Fallback) */}
        <div
          className="flex items-center justify-between rounded px-2 py-0.5 opacity-65"
          style={inactiveSlotStyle}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 40%, transparent)" }} />
            <span className="text-[8px]" style={textMutedStyle}>
              L3: FULL RAG + LLM STREAM
            </span>
            <span className="text-[7.5px]" style={textMutedStyle}>
              (Only 25.8% of traffic)
            </span>
          </div>
          <span className="flex items-center gap-1 text-[7.5px] italic" style={textMutedStyle}>
            <span>Async Write-Back to L1/L2</span>
            <span className="font-bold">↺</span>
          </span>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div
        className="flex items-center justify-between pt-1 text-[8.5px] font-mono tracking-tight"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
        }}
      >
        <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
          74.2% LLM CALLS ELIMINATED
        </span>
        <span style={textMutedStyle}>
          P95 LATENCY: 1,400ms → 35ms
        </span>
      </div>
    </div>
  );
}

// ─── 15. HybridRrfFusionVisual: Dual-Lane RRF Convergence Schematic ─────────

export function HybridRrfFusionVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between gap-1.5"
      style={{
        ...outerContainerStyle,
        minHeight: "140px",
      }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <Search className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>HYBRID_RRF_FUSION // SCHEMATIC</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          0 HALLUCINATIONS
        </span>
      </div>

      {/* Dual Lane to Center RRF Convergence */}
      <div className="relative flex items-center justify-between gap-1.5 my-0.5 font-mono">
        {/* Left: Input Lanes (Lexical + Dense) */}
        <div className="flex flex-col gap-1 flex-1">
          {/* Top Input Lane: Lexical BM25 */}
          <div
            className="flex items-center justify-between rounded px-2 py-1 text-[8px]"
            style={{
              ...inactiveSlotStyle,
              borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 18%, transparent)",
            }}
          >
            <div className="flex items-center gap-1">
              <span className="font-bold text-[8.5px]" style={textSecondaryStyle}>LEXICAL BM25</span>
              <span
                className="rounded px-1 py-0.2 text-[7px]"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 8%, transparent)",
                  color: "var(--theme-text, #f8fafc)",
                }}
              >
                Exact SKU &amp; Serial Match
              </span>
            </div>
            <span className="font-bold text-[7.5px]" style={{ color: "var(--theme-primary, #10B981)" }}>
              Rank #1, #4
            </span>
          </div>

          {/* Bottom Input Lane: Dense Vector */}
          <div
            className="flex items-center justify-between rounded px-2 py-1 text-[8px]"
            style={{
              ...inactiveSlotStyle,
              borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 18%, transparent)",
            }}
          >
            <div className="flex items-center gap-1">
              <span className="font-bold text-[8.5px]" style={textSecondaryStyle}>DENSE VECTOR</span>
              <span
                className="rounded px-1 py-0.2 text-[7px]"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, transparent)",
                  color: "var(--theme-primary, #10B981)",
                }}
              >
                Semantic Vibe &amp; Intent
              </span>
            </div>
            <span className="font-bold text-[7.5px]" style={{ color: "var(--theme-primary, #10B981)" }}>
              Rank #2, #1
            </span>
          </div>
        </div>

        {/* Converging Connector with animated dots */}
        <div className="relative flex flex-col items-center justify-center px-1 shrink-0">
          <motion.div
            animate={{ x: [-2, 4, -2], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="text-[12px] font-bold"
            style={{ color: "var(--theme-primary, #10B981)" }}
          >
            ➔
          </motion.div>
        </div>

        {/* Center Convergence Node: RRF MERGE ENGINE */}
        <div
          className="flex flex-col items-center justify-center rounded-lg p-1.5 text-center shrink-0 border"
          style={{
            borderColor: "var(--theme-primary, #10B981)",
            backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 10%, var(--theme-bg, #0a0a0c))",
            boxShadow: "0 0 10px color-mix(in srgb, var(--theme-primary, #10B981) 20%, transparent)",
          }}
        >
          <span className="text-[7.5px] uppercase font-bold tracking-tight" style={{ color: "var(--theme-primary, #10B981)" }}>
            RRF MERGE ENGINE
          </span>
          <div
            className="mt-0.5 rounded px-1.5 py-0.5 text-[7px] font-mono tracking-tighter"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 92%, var(--theme-text, #f8fafc) 8%)",
              border: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 15%, transparent)",
              color: "var(--theme-text, #f8fafc)",
            }}
          >
            Score = Σ 1 / (60 + rank)
          </div>
        </div>
      </div>

      {/* Output Node & Telemetry */}
      <div
        className="flex items-center justify-between pt-1 text-[8.5px] font-mono"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
        }}
      >
        <span
          className="rounded px-2 py-0.5 font-bold tracking-tight"
          style={{
            color: "var(--theme-primary, #10B981)",
            backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--theme-primary, #10B981) 35%, transparent)",
          }}
        >
          [96.4% TOP-3 RECALL // 0 HALLUCINATED SKUS]
        </span>
        <span className="text-[7.5px]" style={textMutedStyle}>
          125,000 SKUs Index • 14ms Fusion
        </span>
      </div>
    </div>
  );
}

// ─── 16. InngestEventBusVisual: Non-Blocking Event Fan-Out Pipeline ─────────

export function InngestEventBusVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between gap-1.5"
      style={{
        ...outerContainerStyle,
        minHeight: "140px",
      }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <Network className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>ASYNC_EVENT_BUS // INNGEST ENGINE</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          0ms THREAD BLOCK
        </span>
      </div>

      {/* Top Fast Path: Direct user mutation response */}
      <div
        className="flex items-center justify-between rounded px-2 py-1 text-[8.5px] font-mono"
        style={{
          backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, var(--theme-bg, #0a0a0c))",
          border: "1px solid color-mix(in srgb, var(--theme-primary, #10B981) 35%, transparent)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <Zap className="h-3 w-3 animate-pulse" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span className="font-bold tracking-tight" style={textSecondaryStyle}>
            USER CHECKOUT / MUTATION
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-8 sm:w-14 bg-current opacity-30 relative overflow-hidden" style={{ color: "var(--theme-primary, #10B981)" }}>
            <motion.div
              className="absolute h-full w-3 bg-current"
              animate={{ x: [-10, 56] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <span
            className="rounded px-1.5 py-0.5 text-[8px] font-bold"
            style={{
              color: "var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 20%, transparent)",
            }}
          >
            [HTTP 200 OK in 45ms (0ms Thread Block)]
          </span>
        </div>
      </div>

      {/* Bottom Durable Event Bus: 3 Parallel Workers */}
      <div className="space-y-1 font-mono">
        <div className="flex items-center justify-between text-[7.5px]" style={textMutedStyle}>
          <span className="uppercase font-semibold tracking-wider flex items-center gap-1">
            <span className="text-[9px]">↳</span> INNGEST ASYNC FAN-OUT (step.run)
          </span>
          <span>DURABLE RETRIES (3x)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
          {/* Worker 01 */}
          <div
            className="flex items-center gap-1.5 rounded px-1.5 py-1 text-[7.5px]"
            style={{
              ...inactiveSlotStyle,
              borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 14%, transparent)",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: 0 }}
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
            />
            <span className="font-medium truncate" style={textSecondaryStyle}>
              [01: Evict Stale L2 Cache]
            </span>
          </div>

          {/* Worker 02 */}
          <div
            className="flex items-center gap-1.5 rounded px-1.5 py-1 text-[7.5px]"
            style={{
              ...inactiveSlotStyle,
              borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 14%, transparent)",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: 0.3 }}
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
            />
            <span className="font-medium truncate" style={textSecondaryStyle}>
              [02: Re-Embed Updated SKU]
            </span>
          </div>

          {/* Worker 03 */}
          <div
            className="flex items-center gap-1.5 rounded px-1.5 py-1 text-[7.5px]"
            style={{
              ...inactiveSlotStyle,
              borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 14%, transparent)",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: 0.6 }}
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
            />
            <span className="font-medium truncate" style={textSecondaryStyle}>
              [03: Sync Inventory Ledger]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 17. ZodAstParserVisual: Natural Language to Validated Cinematic AST ─────

export function ZodAstParserVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-3 flex flex-col justify-between gap-2"
      style={{
        ...outerContainerStyle,
        minHeight: "155px",
      }}
    >
      {/* Top Header telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <Terminal className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>CINEMATIC_COMPILER // ZOD_AST_ENGINE</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase flex items-center gap-1"
          style={activeHighlightStyle}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          100% STRICT TYPE LOCK
        </span>
      </div>

      {/* 3-Column Pipeline: Raw Prompt -> Scanning Validator Gate -> AST Output Tree */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center my-0.5 font-mono">
        {/* Left: Raw Director Prompt (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[8px]" style={textMutedStyle}>
            <span>RAW DIRECTOR PROMPT</span>
            <span className="text-[7.5px] opacity-70">NL_INPUT</span>
          </div>
          <div
            className="rounded-lg p-2 text-[8px] leading-relaxed relative overflow-hidden"
            style={{
              ...inactiveSlotStyle,
              borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 18%, transparent)",
            }}
          >
            <div className="italic" style={textSecondaryStyle}>
              &ldquo;Cyberpunk alley, 35mm anamorphic, low-key neon rain...&rdquo;
            </div>
            <motion.div
              className="mt-1 flex items-center gap-1 text-[7px]"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: "var(--theme-primary, #10B981)" }}
            >
              <span>●</span>
              <span className="truncate">Unstructured Prose Stream</span>
            </motion.div>
          </div>
        </div>

        {/* Center: Compiler Scanner Gate (2 cols) */}
        <div className="md:col-span-2 flex flex-col items-center justify-center relative py-1">
          <div
            className="relative flex flex-col items-center justify-center rounded-md p-1.5 text-center border w-full"
            style={{
              borderColor: "var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 8%, var(--theme-bg, #0a0a0c))",
              boxShadow: "0 0 10px color-mix(in srgb, var(--theme-primary, #10B981) 20%, transparent)",
            }}
          >
            {/* Animated vertical scanner bar */}
            <motion.div
              className="absolute inset-x-0 h-0.5"
              style={{
                backgroundColor: "var(--theme-primary, #10B981)",
                boxShadow: "0 0 8px var(--theme-primary, #10B981)",
              }}
              animate={{ top: ["5%", "90%", "5%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-[7px] font-bold uppercase tracking-tight" style={{ color: "var(--theme-primary, #10B981)" }}>
              ZOD AST GATE
            </span>
            <span className="text-[6.5px] mt-0.5" style={textMutedStyle}>
              Schema Filter
            </span>
          </div>
          <div className="flex items-center gap-1 text-[9px] mt-1" style={{ color: "var(--theme-primary, #10B981)" }}>
            <motion.span
              animate={{ x: [-2, 3, -2] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              ➔
            </motion.span>
          </div>
        </div>

        {/* Right: Validated Cinematic AST (6 cols) */}
        <div className="md:col-span-6 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[8px]" style={textSecondaryStyle}>
            <span className="font-bold">VALIDATED CINEMATIC AST</span>
            <span
              className="rounded px-1 py-0.2 text-[7px] font-bold"
              style={{
                color: "var(--theme-primary, #10B981)",
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 14%, transparent)",
              }}
            >
              TYPED // DTO
            </span>
          </div>

          <div className="space-y-1">
            {/* node.camera */}
            <div
              className="flex items-center justify-between rounded px-2 py-0.5 text-[7.5px]"
              style={{
                ...inactiveSlotStyle,
                borderColor: "color-mix(in srgb, var(--theme-primary, #10B981) 30%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 4%, var(--theme-bg, #0a0a0c))",
              }}
            >
              <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
                node.camera:
              </span>
              <span className="truncate" style={textSecondaryStyle}>
                &#123; lens: &quot;35mm Anamorphic&quot;, move: &quot;Dolly In&quot; &#125;
              </span>
            </div>

            {/* node.lighting */}
            <div
              className="flex items-center justify-between rounded px-2 py-0.5 text-[7.5px]"
              style={{
                ...inactiveSlotStyle,
                borderColor: "color-mix(in srgb, var(--theme-primary, #10B981) 30%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 4%, var(--theme-bg, #0a0a0c))",
              }}
            >
              <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
                node.lighting:
              </span>
              <span className="truncate" style={textSecondaryStyle}>
                &#123; key: &quot;Low-Key Neon&quot;, ratio: &quot;8:1&quot; &#125;
              </span>
            </div>

            {/* node.duration */}
            <div
              className="flex items-center justify-between rounded px-2 py-0.5 text-[7.5px]"
              style={{
                ...inactiveSlotStyle,
                borderColor: "color-mix(in srgb, var(--theme-primary, #10B981) 30%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 6%, var(--theme-bg, #0a0a0c))",
              }}
            >
              <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
                node.duration:
              </span>
              <span className="truncate flex items-center gap-1" style={textSecondaryStyle}>
                <span>&#123; frames: 120, fps: 24,</span>
                <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
                  status: &quot;VERIFIED ✓&quot; &#125;
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div
        className="flex items-center justify-between pt-1 text-[8.5px] font-mono tracking-tight"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
        }}
      >
        <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
          0% MALFORMED JSON CRASHES
        </span>
        <span style={textMutedStyle}>
          DETERMINISTIC AST OUTPUT // ZERO LLM RUNTIME DROPS
        </span>
      </div>
    </div>
  );
}

// ─── 18. TanstackOptimisticSyncVisual: Sub-16ms Optimistic UI vs Async Queue ─

export function TanstackOptimisticSyncVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between gap-1.5"
      style={{
        ...outerContainerStyle,
        minHeight: "140px",
      }}
    >
      {/* Top Header telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <Activity className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>MUTATION_PIPELINE // TANSTACK_SYNC</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase flex items-center gap-1"
          style={activeHighlightStyle}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          60 FPS LOCKED
        </span>
      </div>

      {/* Two Lanes: Fast UI Thread vs Background Network Queue */}
      <div className="flex flex-col gap-1.5 font-mono">
        {/* Top Fast Lane: Client UI Thread */}
        <div
          className="flex flex-col gap-1 rounded-lg px-2.5 py-1.5"
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 10%, var(--theme-bg, #0a0a0c))",
            border: "1px solid color-mix(in srgb, var(--theme-primary, #10B981) 35%, transparent)",
          }}
        >
          <div className="flex items-center justify-between text-[7.5px]">
            <span className="font-bold flex items-center gap-1" style={{ color: "var(--theme-primary, #10B981)" }}>
              <Zap className="h-2.5 w-2.5 animate-pulse" />
              CLIENT UI THREAD // OPTIMISTIC CACHE
            </span>
            <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
              SUB-16ms
            </span>
          </div>

          <div className="flex items-center justify-between gap-1 text-[8px]">
            <span
              className="rounded px-1.5 py-0.5 font-semibold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 90%, var(--theme-text, #f8fafc) 10%)",
                border: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 14%, transparent)",
                color: "var(--theme-text, #f8fafc)",
              }}
            >
              [Scene_04 Reordered]
            </span>

            {/* Fast animated tracer arrow */}
            <div className="flex-1 flex items-center justify-center px-1">
              <div className="h-0.5 w-full bg-current opacity-30 relative overflow-hidden" style={{ color: "var(--theme-primary, #10B981)" }}>
                <motion.div
                  className="absolute h-full w-6 bg-current"
                  animate={{ x: [-20, 100] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <span className="text-[9px] font-bold ml-1" style={{ color: "var(--theme-primary, #10B981)" }}>➔</span>
            </div>

            <motion.span
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="rounded px-2 py-0.5 font-bold"
              style={{
                color: "var(--theme-primary, #10B981)",
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 18%, transparent)",
                border: "1px solid var(--theme-primary, #10B981)",
                boxShadow: "0 0 8px color-mix(in srgb, var(--theme-primary, #10B981) 30%, transparent)",
              }}
            >
              [TanStack Cache Mutated in &lt;16ms (60 FPS)]
            </motion.span>
          </div>
        </div>

        {/* Bottom Async Lane: Background Sync / Mutation Queue */}
        <div
          className="flex flex-col gap-1 rounded-lg px-2.5 py-1.5 opacity-85"
          style={{
            ...inactiveSlotStyle,
            borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 14%, transparent)",
          }}
        >
          <div className="flex items-center justify-between text-[7.5px]" style={textMutedStyle}>
            <span className="flex items-center gap-1 font-semibold">
              <RefreshCw className="h-2.5 w-2.5" />
              BACKGROUND SYNC // MUTATION QUEUE
            </span>
            <span>NON-BLOCKING ASYNC LOOP</span>
          </div>

          <div className="flex items-center justify-between gap-1 text-[7.5px]">
            <span
              className="rounded px-1.5 py-0.2"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 6%, transparent)",
                color: "color-mix(in srgb, var(--theme-text, #f8fafc) 80%, transparent)",
              }}
            >
              [Batch Delta Payload]
            </span>
            <span style={textMutedStyle}>╌╌➔</span>
            <span
              className="rounded px-1.5 py-0.2"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 6%, transparent)",
                color: "color-mix(in srgb, var(--theme-text, #f8fafc) 80%, transparent)",
              }}
            >
              [LLM / DB Reconcile (1.8s)]
            </span>
            <span style={textMutedStyle}>╌╌➔</span>
            <span
              className="rounded px-1.5 py-0.2 font-semibold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, transparent)",
                color: "var(--theme-primary, #10B981)",
              }}
            >
              [Commit or Auto-Rollback]
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Badge */}
      <div
        className="flex items-center justify-between pt-1 text-[8.5px] font-mono tracking-tight"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
        }}
      >
        <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
          UI LATENCY: &lt;16ms (INSTANT)
        </span>
        <span style={textMutedStyle}>
          0 FRAME DROPS // ZERO CLIENT FREEZE
        </span>
      </div>
    </div>
  );
}

// ─── 19. ContextWindowCompressorVisual: Bloated Log to Scene Invariants ───────

export function ContextWindowCompressorVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between gap-1.5"
      style={{
        ...outerContainerStyle,
        minHeight: "140px",
      }}
    >
      {/* Top Header telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <Filter className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>CONTEXT_COMPRESSOR // INVARIANT_EXTRACTION</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase flex items-center gap-1"
          style={activeHighlightStyle}
        >
          -68.4% TOKENS
        </span>
      </div>

      {/* Funnel Pipeline: Raw 30-Turn Stack -> Invariant Extractor -> Locked Scene Capsule */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center my-0.5 font-mono">
        {/* Left: Raw 30-Turn Chat Log (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[8px]" style={textMutedStyle}>
            <span>RAW 30-TURN CHAT LOG</span>
            <span className="text-[7px] text-red-400">BLOATED</span>
          </div>

          <div
            className="rounded p-1.5 flex flex-col gap-0.5 relative overflow-hidden"
            style={{
              ...inactiveSlotStyle,
              borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 16%, transparent)",
            }}
          >
            {/* Layered faded bars simulating chat log messages */}
            <div className="h-1.5 w-full rounded-xs bg-current opacity-20" style={{ color: "var(--theme-text, #f8fafc)" }} />
            <div className="h-1.5 w-4/5 rounded-xs bg-current opacity-30" style={{ color: "var(--theme-text, #f8fafc)" }} />
            <div className="h-1.5 w-full rounded-xs bg-current opacity-25" style={{ color: "var(--theme-text, #f8fafc)" }} />
            <div className="h-1.5 w-3/4 rounded-xs bg-current opacity-20" style={{ color: "var(--theme-text, #f8fafc)" }} />

            <div
              className="mt-1 rounded px-1.5 py-0.5 text-[7px] font-semibold text-center border"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 90%, var(--theme-text, #f8fafc) 10%)",
                borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 15%, transparent)",
                color: "color-mix(in srgb, var(--theme-text, #f8fafc) 80%, transparent)",
              }}
            >
              5,200 Tokens (High Drift &amp; Cost)
            </div>
          </div>
        </div>

        {/* Center: Invariant Extractor Funnel (3 cols) */}
        <div className="md:col-span-3 flex flex-col items-center justify-center py-1">
          <div
            className="rounded-lg p-1.5 text-center border w-full flex flex-col items-center justify-center gap-0.5"
            style={{
              borderColor: "var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 10%, var(--theme-bg, #0a0a0c))",
            }}
          >
            <span className="text-[7.5px] font-bold uppercase tracking-tight" style={{ color: "var(--theme-primary, #10B981)" }}>
              INVARIANT EXTRACTOR
            </span>
            {/* Animated compression arrows */}
            <div className="flex items-center gap-1 my-0.5">
              <motion.span
                animate={{ scaleX: [1, 0.6, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-[10px] font-bold"
                style={{ color: "var(--theme-primary, #10B981)" }}
              >
                ⇶ ➔
              </motion.span>
            </div>
            <span className="text-[6.5px]" style={textMutedStyle}>
              12x Compression Ratio
            </span>
          </div>
        </div>

        {/* Right: Locked Scene Capsule (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[8px]" style={textSecondaryStyle}>
            <span className="font-bold">LOCKED SCENE INVARIANTS</span>
            <span
              className="rounded px-1.5 py-0.2 text-[7px] font-bold"
              style={{
                color: "var(--theme-primary, #10B981)",
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 14%, transparent)",
              }}
            >
              420 TOKENS
            </span>
          </div>

          <div
            className="rounded-lg p-1.5 flex flex-col gap-1 border"
            style={{
              borderColor: "color-mix(in srgb, var(--theme-primary, #10B981) 35%, transparent)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 5%, var(--theme-bg, #0a0a0c))",
            }}
          >
            {/* 3 Locked Invariant Chips */}
            <div className="flex flex-wrap gap-1">
              <span
                className="rounded px-1.5 py-0.5 text-[7px] font-bold flex items-center gap-1"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 18%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--theme-primary, #10B981) 40%, transparent)",
                  color: "var(--theme-primary, #10B981)",
                }}
              >
                <Lock className="h-2 w-2" />
                [LENS: 35mm]
              </span>
              <span
                className="rounded px-1.5 py-0.5 text-[7px] font-bold flex items-center gap-1"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 18%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--theme-primary, #10B981) 40%, transparent)",
                  color: "var(--theme-primary, #10B981)",
                }}
              >
                <Lock className="h-2 w-2" />
                [PALETTE: Noir Teal]
              </span>
              <span
                className="rounded px-1.5 py-0.5 text-[7px] font-bold flex items-center gap-1"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 18%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--theme-primary, #10B981) 40%, transparent)",
                  color: "var(--theme-primary, #10B981)",
                }}
              >
                <Lock className="h-2 w-2" />
                [WARDROBE: ID_01]
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Badge */}
      <div
        className="flex items-center justify-between pt-1 text-[8.5px] font-mono tracking-tight"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
        }}
      >
        <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
          -68.4% INPUT TOKENS
        </span>
        <span style={textMutedStyle}>
          0 SCENE CONTINUITY DRIFT // IMMUTABLE CONTEXT
        </span>
      </div>
    </div>
  );
}

// ─── 20. BullMqAsyncWorkersVisual: Redis + BullMQ Isolated Ingestion Pool ────

export function BullMqAsyncWorkersVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-3 flex flex-col justify-between gap-2"
      style={{
        ...outerContainerStyle,
        minHeight: "155px",
      }}
    >
      {/* Top Header telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <Server className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>INGESTION_PIPELINE // REDIS_BULLMQ</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase flex items-center gap-1"
          style={activeHighlightStyle}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          ACK: &lt;12ms (0% BLOCK)
        </span>
      </div>

      {/* 3-Tier Pipeline: Top Fast Path -> Middle Queue Buffer -> Bottom Worker Cluster */}
      <div className="flex flex-col gap-1.5 font-mono">
        {/* Top Fast Path: Main Node.js Event Loop */}
        <div
          className="flex items-center justify-between rounded-lg px-2.5 py-1 text-[8px]"
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 10%, var(--theme-bg, #0a0a0c))",
            border: "1px solid color-mix(in srgb, var(--theme-primary, #10B981) 35%, transparent)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <Zap className="h-2.5 w-2.5 animate-pulse" style={{ color: "var(--theme-primary, #10B981)" }} />
            <span className="font-bold tracking-tight" style={textSecondaryStyle}>
              MAIN NODE.JS EVENT LOOP
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span
              className="rounded px-1.5 py-0.2"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 90%, var(--theme-text, #f8fafc) 10%)",
                border: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 14%, transparent)",
                color: "var(--theme-text, #f8fafc)",
              }}
            >
              [PDF Upload Payload]
            </span>
            <span className="text-[7.5px]" style={textMutedStyle}>➔</span>
            <span
              className="rounded px-1 py-0.2"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 8%, transparent)",
                color: "color-mix(in srgb, var(--theme-text, #f8fafc) 85%, transparent)",
              }}
            >
              [API Gateway]
            </span>
            <span className="text-[7.5px]" style={textMutedStyle}>➔</span>
            <motion.span
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="rounded px-1.5 py-0.2 font-bold"
              style={{
                color: "var(--theme-primary, #10B981)",
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 18%, transparent)",
                border: "1px solid var(--theme-primary, #10B981)",
              }}
            >
              [HTTP 202 Accepted in &lt;12ms]
            </motion.span>
          </div>
        </div>

        {/* Middle Queue Buffer: Redis + BullMQ */}
        <div
          className="flex items-center justify-between rounded px-2 py-0.5 text-[7.5px]"
          style={{
            ...inactiveSlotStyle,
            borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 15%, transparent)",
          }}
        >
          <span className="font-semibold flex items-center gap-1" style={textMutedStyle}>
            <Database className="h-2.5 w-2.5" />
            REDIS + BULLMQ JOB QUEUE (ASYNC DISPATCH)
          </span>

          <div className="flex items-center gap-1">
            <span
              className="rounded px-1.5 py-0.2 font-mono"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, transparent)",
                color: "var(--theme-primary, #10B981)",
              }}
            >
              [JOB #401]
            </span>
            <span
              className="rounded px-1.5 py-0.2 font-mono"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, transparent)",
                color: "var(--theme-primary, #10B981)",
              }}
            >
              [JOB #402]
            </span>
            <span
              className="rounded px-1.5 py-0.2 font-mono"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, transparent)",
                color: "var(--theme-primary, #10B981)",
              }}
            >
              [JOB #403]
            </span>
            <span className="text-[7.5px]" style={{ color: "var(--theme-primary, #10B981)" }}>➔ ⇊</span>
          </div>
        </div>

        {/* Bottom Worker Cluster: 3 Parallel Isolated Workers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
          {/* Worker 01 */}
          <div
            className="flex items-center gap-1.5 rounded px-2 py-1 text-[7.5px]"
            style={{
              ...inactiveSlotStyle,
              borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 14%, transparent)",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
            />
            <div className="flex flex-col truncate">
              <span className="text-[6.5px] font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>WORKER_01</span>
              <span className="font-medium truncate" style={textSecondaryStyle}>
                [Multimodal PDF Parse]
              </span>
            </div>
          </div>

          {/* Worker 02 */}
          <div
            className="flex items-center gap-1.5 rounded px-2 py-1 text-[7.5px]"
            style={{
              ...inactiveSlotStyle,
              borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 14%, transparent)",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 }}
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
            />
            <div className="flex flex-col truncate">
              <span className="text-[6.5px] font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>WORKER_02</span>
              <span className="font-medium truncate" style={textSecondaryStyle}>
                [Semantic AST Chunking]
              </span>
            </div>
          </div>

          {/* Worker 03 */}
          <div
            className="flex items-center gap-1.5 rounded px-2 py-1 text-[7.5px]"
            style={{
              ...inactiveSlotStyle,
              borderColor: "color-mix(in srgb, var(--theme-primary, #10B981) 30%, transparent)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 6%, var(--theme-bg, #0a0a0c))",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.6 }}
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
            />
            <div className="flex flex-col truncate">
              <span className="text-[6.5px] font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>WORKER_03</span>
              <span className="font-bold truncate" style={{ color: "var(--theme-primary, #10B981)" }}>
                [Vector DB Upsert ✓]
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div
        className="flex items-center justify-between pt-1 text-[8.5px] font-mono tracking-tight"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
        }}
      >
        <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
          INGESTION ACK: &lt;12ms
        </span>
        <span style={textMutedStyle}>
          0.00% EVENT LOOP STARVATION // HEAVY CPU OFF-THREAD
        </span>
      </div>
    </div>
  );
}

// ─── 21. ProviderFactoryRouterVisual: SOLID LLM Hot-Swapping Switchboard ────

export function ProviderFactoryRouterVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between gap-1.5"
      style={{
        ...outerContainerStyle,
        minHeight: "140px",
      }}
    >
      {/* Top Header telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <Cpu className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>PROVIDER_FACTORY // DEPENDENCY_INVERSION</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase flex items-center gap-1"
          style={activeHighlightStyle}
        >
          HOT-SWAPPABLE
        </span>
      </div>

      {/* 3-Part Architecture: Core Interface -> Switchboard -> Pluggable Adapters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center my-0.5 font-mono">
        {/* Left: Core Interface (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[8px]" style={textMutedStyle}>
            <span>CORE RAG ENGINE</span>
            <span className="text-[7px]">SOLID_DIP</span>
          </div>

          <div
            className="rounded p-2 flex flex-col gap-1"
            style={{
              ...inactiveSlotStyle,
              borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 18%, transparent)",
            }}
          >
            <span className="text-[7.5px]" style={textMutedStyle}>Abstract Contract:</span>
            <span className="font-bold text-[8px]" style={{ color: "var(--theme-primary, #10B981)" }}>
              ILLMProvider.generate()
            </span>
            <span className="text-[7px] italic" style={textMutedStyle}>
              Zero direct SDK imports
            </span>
          </div>
        </div>

        {/* Center: Switchboard (3 cols) */}
        <div className="md:col-span-3 flex flex-col items-center justify-center py-1">
          <div
            className="rounded-lg p-1.5 text-center border w-full flex flex-col items-center justify-center gap-0.5"
            style={{
              borderColor: "var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 10%, var(--theme-bg, #0a0a0c))",
              boxShadow: "0 0 10px color-mix(in srgb, var(--theme-primary, #10B981) 20%, transparent)",
            }}
          >
            <span className="text-[7px] font-bold uppercase tracking-tight" style={{ color: "var(--theme-primary, #10B981)" }}>
              SOLID FACTORY
            </span>
            <div
              className="mt-0.5 rounded px-1.5 py-0.5 text-[6.5px] font-mono tracking-tighter"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 92%, var(--theme-text, #f8fafc) 8%)",
                border: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 15%, transparent)",
                color: "var(--theme-text, #f8fafc)",
              }}
            >
              ENV: RUNTIME_PROVIDER
            </div>
            <motion.div
              animate={{ x: [-2, 3, -2] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-[9px] font-bold mt-0.5"
              style={{ color: "var(--theme-primary, #10B981)" }}
            >
              ➔
            </motion.div>
          </div>
        </div>

        {/* Right: Pluggable Adapters (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[8px]" style={textSecondaryStyle}>
            <span className="font-bold">PLUGGABLE ADAPTERS</span>
            <span className="text-[7px] font-mono" style={{ color: "var(--theme-primary, #10B981)" }}>
              0ms SWAP
            </span>
          </div>

          <div className="space-y-1">
            {/* Adapter 01: Active NVIDIA NIM */}
            <div
              className="flex items-center justify-between rounded px-2 py-0.5 text-[7.5px]"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 16%, var(--theme-bg, #0a0a0c))",
                border: "1px solid var(--theme-primary, #10B981)",
                boxShadow: "0 0 8px color-mix(in srgb, var(--theme-primary, #10B981) 25%, transparent)",
              }}
            >
              <div className="flex items-center gap-1.5 font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                <span>NVIDIA NIM (Llama-70B)</span>
              </div>
              <span className="font-bold text-[7px]" style={{ color: "var(--theme-primary, #10B981)" }}>
                ACTIVE // 0ms Swap
              </span>
            </div>

            {/* Adapter 02: Standby OpenAI */}
            <div
              className="flex items-center justify-between rounded px-2 py-0.5 text-[7.5px] opacity-75"
              style={{
                ...inactiveSlotStyle,
                borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 14%, transparent)",
              }}
            >
              <div className="flex items-center gap-1.5" style={textSecondaryStyle}>
                <span className="h-1.5 w-1.5 rounded-full border border-current" />
                <span>OpenAI (GPT-4o)</span>
              </div>
              <span className="text-[7px]" style={textMutedStyle}>
                STANDBY FALLBACK
              </span>
            </div>

            {/* Adapter 03: Groq / Local vLLM */}
            <div
              className="flex items-center justify-between rounded px-2 py-0.5 text-[7.5px] opacity-65"
              style={{
                ...inactiveSlotStyle,
                borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 14%, transparent)",
              }}
            >
              <div className="flex items-center gap-1.5" style={textMutedStyle}>
                <span className="h-1.5 w-1.5 rounded-full border border-current" />
                <span>Groq / Local vLLM</span>
              </div>
              <span className="text-[7px]" style={textMutedStyle}>
                HOT-SWAPPABLE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Badge */}
      <div
        className="flex items-center justify-between pt-1 text-[8.5px] font-mono tracking-tight"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
        }}
      >
        <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
          0% VENDOR LOCK-IN
        </span>
        <span style={textMutedStyle}>
          INSTANT RUNTIME FAILOVER // ZERO CODE RE-DEPLOY
        </span>
      </div>
    </div>
  );
}

// ─── 22. LlmJudgeHarnessVisual: 150-Item Golden Dataset Evaluation Pipeline ──

export function LlmJudgeHarnessVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between gap-1.5"
      style={{
        ...outerContainerStyle,
        minHeight: "140px",
      }}
    >
      {/* Top Header telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <ShieldCheck className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>EVALUATION_HARNESS // LLM_AS_A_JUDGE</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase flex items-center gap-1"
          style={activeHighlightStyle}
        >
          <CheckCircle2 className="h-2.5 w-2.5" />
          PASS GATE: VERIFIED ✓
        </span>
      </div>

      {/* Top Row: Golden Dataset Benchmark flow */}
      <div
        className="flex items-center justify-between rounded px-2 py-0.5 text-[7.5px] font-mono"
        style={{
          ...inactiveSlotStyle,
          borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 16%, transparent)",
        }}
      >
        <span className="font-semibold" style={textSecondaryStyle}>
          GOLDEN DATASET BENCHMARK:
        </span>
        <div className="flex items-center gap-1">
          <span
            className="rounded px-1.5 py-0.2 font-semibold"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, transparent)",
              color: "var(--theme-primary, #10B981)",
            }}
          >
            [150 Adversarial Test Cases]
          </span>
          <span style={textMutedStyle}>➔</span>
          <span
            className="rounded px-1.5 py-0.2"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 8%, transparent)",
              color: "color-mix(in srgb, var(--theme-text, #f8fafc) 85%, transparent)",
            }}
          >
            [RAG Output vs. Ground Truth]
          </span>
        </div>
      </div>

      {/* Middle Evaluation Meters: 3 Horizontal Telemetry Score Bars */}
      <div className="space-y-1 font-mono text-[7.5px]">
        {/* Metric 1: Faithfulness */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold" style={textSecondaryStyle}>
              FAITHFULNESS (NO HALLUCINATION)
            </span>
            <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
              98.2%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={inactiveSlotStyle}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
              initial={{ width: "0%" }}
              animate={{ width: "98.2%" }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Metric 2: Context Recall Precision */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold" style={textSecondaryStyle}>
              CONTEXT RECALL PRECISION
            </span>
            <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
              95.6%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={inactiveSlotStyle}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
              initial={{ width: "0%" }}
              animate={{ width: "95.6%" }}
              transition={{ duration: 1.4, delay: 0.1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Metric 3: Answer Relevance */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold" style={textSecondaryStyle}>
              ANSWER RELEVANCE
            </span>
            <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
              96.8%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={inactiveSlotStyle}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
              initial={{ width: "0%" }}
              animate={{ width: "96.8%" }}
              transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Badge */}
      <div
        className="flex items-center justify-between pt-1 text-[8.5px] font-mono tracking-tight"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
        }}
      >
        <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
          PASS GATE: VERIFIED ✓
        </span>
        <span style={textMutedStyle}>
          0 REGRESSIONS DETECTED // CONTINUOUS CI/CD EVAL
        </span>
      </div>
    </div>
  );
}

// ─── 23. EnclaveKeySignerVisual: Air-Gapped Local Enclave Private Key Signer ─

export function EnclaveKeySignerVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between gap-1.5"
      style={{
        ...outerContainerStyle,
        minHeight: "150px",
      }}
    >
      {/* Top Header telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <Key className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>AIR_GAPPED_ENCLAVE // SECP256K1</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase flex items-center gap-1"
          style={activeHighlightStyle}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          0-BYTE LEAK GUARANTEE
        </span>
      </div>

      {/* Main 3-Section Flow: Unsigned Intent -> Shielded Vault Enclave -> Signed RLP Stream */}
      <div className="relative flex flex-col sm:flex-row items-stretch justify-between gap-1.5 my-0.5 font-mono">
        {/* Left Input: UNSIGNED TX INTENT */}
        <div
          className="flex-1 rounded p-1.5 flex flex-col justify-between text-[7.5px]"
          style={{
            ...inactiveSlotStyle,
            borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 16%, transparent)",
          }}
        >
          <div className="flex items-center justify-between border-b pb-1 mb-1" style={{ borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 10%, transparent)" }}>
            <span className="font-bold tracking-tight" style={textSecondaryStyle}>
              UNSIGNED TX INTENT
            </span>
            <span className="text-[6.5px] px-1 py-0.2 rounded" style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 8%, transparent)", color: "var(--theme-text, #f8fafc)" }}>
              MEM_IN
            </span>
          </div>
          <div className="space-y-0.5 leading-tight font-mono text-[7px]" style={textMutedStyle}>
            <div className="truncate"><span style={textSecondaryStyle}>to:</span> &quot;0x71C...89A&quot;</div>
            <div className="truncate"><span style={textSecondaryStyle}>val:</span> &quot;1.5 ETH&quot;</div>
            <div className="truncate"><span style={textSecondaryStyle}>nonce:</span> 42</div>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[6.5px]" style={{ color: "var(--theme-primary, #10B981)" }}>
            <span className="h-1 w-1 rounded-full animate-pulse" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
            <span>RAW PAYLOAD INGEST</span>
          </div>
        </div>

        {/* Animated Connector Arrow Left -> Center */}
        <div className="hidden sm:flex items-center justify-center shrink-0 px-0.5">
          <motion.div
            animate={{ x: [-2, 3, -2], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[10px] font-bold"
            style={{ color: "var(--theme-primary, #10B981)" }}
          >
            ➔
          </motion.div>
        </div>

        {/* Center: SHIELDED VAULT (AIR-GAPPED LOCAL ENCLAVE) */}
        <div
          className="flex-[1.4] rounded-lg p-1.5 flex flex-col justify-between text-[7.5px] relative overflow-hidden"
          style={{
            border: "2px solid var(--theme-primary, #10B981)",
            backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 10%, var(--theme-bg, #0a0a0c))",
            boxShadow: "0 0 12px color-mix(in srgb, var(--theme-primary, #10B981) 25%, transparent), inset 0 0 8px color-mix(in srgb, var(--theme-primary, #10B981) 15%, transparent)",
          }}
        >
          {/* Top Blocked Indicator */}
          <div
            className="flex items-center justify-between rounded px-1.5 py-0.5 mb-1"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
              border: "1px dashed color-mix(in srgb, var(--theme-text, #f8fafc) 25%, transparent)",
            }}
          >
            <div className="flex items-center gap-1">
              <X className="h-2.5 w-2.5 text-red-400 shrink-0" />
              <span className="font-bold text-[6.5px] tracking-tight" style={{ color: "color-mix(in srgb, #f87171 90%, var(--theme-text, #f8fafc))" }}>
                RAW KEY EXPORT: BLOCKED ✕
              </span>
            </div>
            <span className="text-[5.5px] uppercase tracking-wider" style={textMutedStyle}>ISOLATED</span>
          </div>

          {/* Enclave Center Core */}
          <div className="flex flex-col items-center justify-center py-0.5 text-center">
            <div className="flex items-center gap-1 mb-0.5">
              <Lock className="h-3 w-3 animate-pulse" style={{ color: "var(--theme-primary, #10B981)" }} />
              <span className="font-bold text-[8px] tracking-tight" style={{ color: "var(--theme-primary, #10B981)" }}>
                [AIR-GAPPED LOCAL ENCLAVE]
              </span>
            </div>
            <div
              className="rounded px-1.5 py-0.5 text-[6.5px] font-mono leading-tight tracking-tighter"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 92%, var(--theme-text, #f8fafc) 8%)",
                border: "1px solid color-mix(in srgb, var(--theme-primary, #10B981) 30%, transparent)",
                color: "var(--theme-text, #f8fafc)",
              }}
            >
              [PRIVATE KEY: ISOLATED IN MEMORY]
            </div>
            <span className="text-[6px] mt-0.5 font-bold tracking-wider" style={{ color: "var(--theme-primary, #10B981)" }}>
              [secp256k1 ECDSA SIGNER]
            </span>
          </div>

          {/* Enclave status badge */}
          <div className="mt-1 flex items-center justify-between text-[6px]" style={textMutedStyle}>
            <span>HW SECURE STORAGE</span>
            <span style={{ color: "var(--theme-primary, #10B981)" }}>0-BYTE BOUNDARY</span>
          </div>
        </div>

        {/* Animated Connector Arrow Center -> Right */}
        <div className="hidden sm:flex items-center justify-center shrink-0 px-0.5">
          <motion.div
            animate={{ x: [-2, 3, -2], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="text-[10px] font-bold"
            style={{ color: "var(--theme-primary, #10B981)" }}
          >
            ➔
          </motion.div>
        </div>

        {/* Right Output: RLP SIGNED HEX STREAM */}
        <div
          className="flex-1 rounded p-1.5 flex flex-col justify-between text-[7.5px]"
          style={{
            ...inactiveSlotStyle,
            borderColor: "color-mix(in srgb, var(--theme-primary, #10B981) 35%, transparent)",
            backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 6%, var(--theme-bg, #0a0a0c))",
          }}
        >
          <div className="flex items-center justify-between border-b pb-1 mb-1" style={{ borderColor: "color-mix(in srgb, var(--theme-primary, #10B981) 20%, transparent)" }}>
            <span className="font-bold tracking-tight" style={{ color: "var(--theme-primary, #10B981)" }}>
              RLP SIGNED HEX STREAM
            </span>
            <CheckCircle2 className="h-2.5 w-2.5" style={{ color: "var(--theme-primary, #10B981)" }} />
          </div>
          <div className="space-y-0.5 leading-tight font-mono text-[6.5px]">
            <div className="break-all font-mono opacity-90 truncate" style={textSecondaryStyle}>
              0xf86c2a8504a817c800825208...
            </div>
            <div
              className="rounded px-1 py-0.5 text-[6.5px] font-bold flex items-center gap-1"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 15%, transparent)",
                color: "var(--theme-primary, #10B981)",
              }}
            >
              <Check className="h-2 w-2 stroke-[2.5]" />
              <span>[VERIFIED SIGNATURE ✓]</span>
            </div>
          </div>
          <div className="mt-1 flex items-center justify-between text-[6.5px]" style={textMutedStyle}>
            <span>Target:</span>
            <span className="font-semibold" style={textSecondaryStyle}>JSON-RPC Broadcast</span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div
        className="flex items-center justify-between pt-1 text-[8.5px] font-mono tracking-tight"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
        }}
      >
        <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
          PRIVATE KEY NETWORK EXPOSURE: 0 BYTES
        </span>
        <span style={textMutedStyle}>
          100% LOCAL ECDSA SIGNING // AIR-GAPPED BOUNDARY
        </span>
      </div>
    </div>
  );
}

// ─── 24. RpcFailoverMeshVisual: Multi-RPC Circuit Breaker & Instant Failover ─

export function RpcFailoverMeshVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between gap-1.5"
      style={{
        ...outerContainerStyle,
        minHeight: "150px",
      }}
    >
      {/* Top Header telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <Network className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>MULTI_RPC // CIRCUIT_BREAKER_MESH</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase flex items-center gap-1"
          style={activeHighlightStyle}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          &lt;120MS AUTO-REROUTE
        </span>
      </div>

      {/* Main Grid: Left Dispatcher & Circuit Breaker -> Right 3-Node Pool */}
      <div className="relative flex items-center justify-between gap-2 my-0.5 font-mono">
        {/* Left Section: Origin Dispatcher -> Circuit Breaker Monitor */}
        <div className="flex flex-col gap-1.5 flex-[1.1]">
          {/* JSON-RPC Dispatcher */}
          <div
            className="flex items-center justify-between rounded px-2 py-1 text-[8px]"
            style={inactiveSlotStyle}
          >
            <div className="flex items-center gap-1.5">
              <Zap className="h-2.5 w-2.5" style={{ color: "var(--theme-primary, #10B981)" }} />
              <span className="font-bold text-[8px]" style={textSecondaryStyle}>
                JSON-RPC DISPATCHER
              </span>
            </div>
            <span className="text-[6.5px] opacity-75" style={textMutedStyle}>eth_sendRawTx</span>
          </div>

          {/* Central Circuit Breaker Monitor */}
          <div
            className="rounded p-1.5 flex flex-col justify-center border"
            style={{
              borderColor: "var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 10%, var(--theme-bg, #0a0a0c))",
              boxShadow: "0 0 10px color-mix(in srgb, var(--theme-primary, #10B981) 18%, transparent)",
            }}
          >
            <div className="flex items-center justify-between text-[7.5px] font-bold">
              <span style={{ color: "var(--theme-primary, #10B981)" }}>[CIRCUIT BREAKER MONITOR]</span>
              <Activity className="h-2.5 w-2.5 animate-pulse" style={{ color: "var(--theme-primary, #10B981)" }} />
            </div>
            <div className="mt-1 flex items-center justify-between text-[6.5px]" style={textMutedStyle}>
              <span>Health Interval: 250ms</span>
              <span className="font-semibold" style={{ color: "var(--theme-primary, #10B981)" }}>Zero Dropouts</span>
            </div>
          </div>
        </div>

        {/* Fanout SVG Connectors */}
        <div className="relative w-8 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full" viewBox="0 0 32 80" fill="none" preserveAspectRatio="none">
            {/* Top Node Connector (Bypassed) */}
            <path d="M 2 40 C 14 40, 18 14, 30 14" stroke="color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent)" strokeWidth="1" strokeDasharray="2 2" />
            {/* Middle Node Connector (Active Glowing Beam) */}
            <path d="M 2 40 L 30 40" stroke="var(--theme-primary, #10B981)" strokeWidth="1.8" />
            {/* Bottom Node Connector (Standby) */}
            <path d="M 2 40 C 14 40, 18 66, 30 66" stroke="color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent)" strokeWidth="1" />

            {/* Glowing moving pulse on Active middle beam */}
            <motion.circle
              r="2"
              fill="var(--theme-primary, #10B981)"
              animate={{ cx: [2, 30], cy: [40, 40] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>

        {/* Right Section: 3-Node RPC Pool */}
        <div className="flex flex-col gap-1 flex-[1.6] text-[7.5px]">
          {/* Node 01: PRIMARY RPC // ALCHEMY (Bypassed) */}
          <div
            className="flex items-center justify-between rounded px-2 py-1 opacity-65"
            style={{
              ...inactiveSlotStyle,
              borderStyle: "dashed",
              borderColor: "color-mix(in srgb, #ef4444 40%, var(--theme-text, #f8fafc))",
            }}
          >
            <div className="flex flex-col">
              <span className="line-through font-bold text-[7px]" style={textMutedStyle}>
                NODE 01: PRIMARY RPC // ALCHEMY
              </span>
              <span className="text-[6px] text-red-400 font-semibold">
                HTTP 429 RATE LIMIT • 850ms
              </span>
            </div>
            <span
              className="rounded px-1 py-0.2 text-[6.5px] font-bold text-red-400"
              style={{
                backgroundColor: "color-mix(in srgb, #ef4444 15%, transparent)",
              }}
            >
              [CIRCUIT: OPEN / BYPASSED]
            </span>
          </div>

          {/* Node 02: FAILOVER RPC // INFURA (Active Reroute) */}
          <div
            className="flex items-center justify-between rounded px-2 py-1"
            style={{
              border: "1px solid var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 14%, var(--theme-bg, #0a0a0c))",
              boxShadow: "0 0 10px color-mix(in srgb, var(--theme-primary, #10B981) 25%, transparent)",
            }}
          >
            <div className="flex flex-col">
              <span className="font-bold text-[7.5px]" style={{ color: "var(--theme-primary, #10B981)" }}>
                NODE 02: FAILOVER RPC // INFURA
              </span>
              <span className="text-[6.5px] font-bold" style={textSecondaryStyle}>
                [● ACTIVE REROUTE // 64ms LATENCY ✓]
              </span>
            </div>
            <span
              className="rounded px-1.5 py-0.5 text-[6.5px] font-bold animate-pulse"
              style={{
                backgroundColor: "var(--theme-primary, #10B981)",
                color: "var(--theme-bg, #0a0a0c)",
              }}
            >
              ACTIVE ROUTE
            </span>
          </div>

          {/* Node 03: BACKUP RPC // QUICKNODE (Warm Standby) */}
          <div
            className="flex items-center justify-between rounded px-2 py-0.5 opacity-80"
            style={inactiveSlotStyle}
          >
            <div className="flex flex-col">
              <span className="font-bold text-[7px]" style={textSecondaryStyle}>
                NODE 03: BACKUP RPC // QUICKNODE
              </span>
              <span className="text-[6px]" style={textMutedStyle}>
                [○ WARM STANDBY // 78ms]
              </span>
            </div>
            <span className="text-[6.5px]" style={textMutedStyle}>
              [STANDBY]
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Badge */}
      <div
        className="flex items-center justify-between pt-1 text-[8.5px] font-mono tracking-tight"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
        }}
      >
        <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
          FAILOVER SWAP TIME: &lt;120ms
        </span>
        <span style={textMutedStyle}>
          99.98% BROADCAST UPTIME // SUB-SECOND RECOVERY
        </span>
      </div>
    </div>
  );
}

// ─── 25. MempoolStateMachineVisual: Deterministic Nonce Queue & 4-Stage Pipeline

export function MempoolStateMachineVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between gap-1.5"
      style={{
        ...outerContainerStyle,
        minHeight: "150px",
      }}
    >
      {/* Top Header telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <Workflow className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>MEMPOOL_STATE_MACHINE // LIFECYCLE</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase flex items-center gap-1"
          style={activeHighlightStyle}
        >
          <CheckCircle2 className="h-2.5 w-2.5" />
          DETERMINISTIC RECEIPT LOCK
        </span>
      </div>

      {/* Top Bar: ATOMIC NONCE SEQUENCER */}
      <div
        className="flex items-center justify-between rounded px-2 py-1 text-[7.5px] font-mono"
        style={{
          ...inactiveSlotStyle,
          borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 16%, transparent)",
        }}
      >
        <span className="font-bold tracking-tight" style={textSecondaryStyle}>
          ATOMIC NONCE SEQUENCER:
        </span>
        <div className="flex items-center gap-1.5">
          {/* Nonce 41 Confirmed */}
          <span
            className="rounded px-1.5 py-0.2 font-semibold"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, transparent)",
              color: "var(--theme-primary, #10B981)",
            }}
          >
            [NONCE #41 ✓]
          </span>
          <span style={textMutedStyle}>──➔</span>
          {/* Nonce 42 In-Flight */}
          <span
            className="rounded px-1.5 py-0.2 font-bold animate-pulse"
            style={{
              border: "1px solid var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 20%, transparent)",
              color: "var(--theme-primary, #10B981)",
            }}
          >
            [NONCE #42 ● IN FLIGHT]
          </span>
          <span style={textMutedStyle}>──➔</span>
          {/* Nonce 43 Queued */}
          <span
            className="rounded px-1.5 py-0.2 font-medium"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 8%, transparent)",
              color: "color-mix(in srgb, var(--theme-text, #f8fafc) 70%, transparent)",
            }}
          >
            [NONCE #43 QUEUED]
          </span>
          <span
            className="hidden sm:inline-block rounded px-1 py-0.2 text-[6.5px] font-bold"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, transparent)",
              color: "var(--theme-primary, #10B981)",
            }}
          >
            0.00% Collision
          </span>
        </div>
      </div>

      {/* Middle: 4-Stage Lifecycle Pipeline */}
      <div className="relative my-0.5 font-mono">
        {/* Horizontal Connecting Progress Track */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 rounded-full overflow-hidden" style={inactiveSlotStyle}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
            animate={{ width: ["15%", "50%", "85%", "100%", "15%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* 4 Connected State Nodes */}
        <div className="relative flex items-center justify-between gap-1 z-10 text-[7px]">
          {/* Stage 1: SIGNED */}
          <div
            className="flex-1 flex flex-col items-center justify-center rounded p-1 text-center"
            style={{
              ...inactiveSlotStyle,
              borderColor: "color-mix(in srgb, var(--theme-primary, #10B981) 35%, transparent)",
              backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 94%, var(--theme-primary, #10B981) 6%)",
            }}
          >
            <span className="font-bold text-[7.5px]" style={{ color: "var(--theme-primary, #10B981)" }}>
              [01: SIGNED]
            </span>
            <span className="text-[6px] opacity-80" style={textMutedStyle}>ECDSA Ok</span>
          </div>

          {/* Stage 2: MEMPOOL */}
          <div
            className="flex-1 flex flex-col items-center justify-center rounded p-1 text-center"
            style={{
              ...inactiveSlotStyle,
              borderColor: "color-mix(in srgb, var(--theme-primary, #10B981) 40%, transparent)",
              backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 92%, var(--theme-primary, #10B981) 8%)",
            }}
          >
            <span className="font-bold text-[7.5px]" style={{ color: "var(--theme-primary, #10B981)" }}>
              [02: MEMPOOL]
            </span>
            <span className="text-[6px] opacity-80" style={textMutedStyle}>Propagated</span>
          </div>

          {/* Stage 3: MINED (12/12) */}
          <div
            className="flex-1 flex flex-col items-center justify-center rounded p-1 text-center"
            style={{
              border: "1px solid var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, var(--theme-bg, #0a0a0c))",
            }}
          >
            <span className="font-bold text-[7.5px]" style={{ color: "var(--theme-primary, #10B981)" }}>
              [03: MINED]
            </span>
            <span className="text-[6px] font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
              (12/12)
            </span>
          </div>

          {/* Stage 4: STATE FINALIZED */}
          <div
            className="flex-1 flex flex-col items-center justify-center rounded p-1 text-center"
            style={{
              border: "1px solid var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 18%, var(--theme-bg, #0a0a0c))",
              boxShadow: "0 0 8px color-mix(in srgb, var(--theme-primary, #10B981) 25%, transparent)",
            }}
          >
            <div className="flex items-center gap-0.5">
              <Check className="h-2 w-2 stroke-[3]" style={{ color: "var(--theme-primary, #10B981)" }} />
              <span className="font-bold text-[7.5px]" style={{ color: "var(--theme-primary, #10B981)" }}>
                [04: STATE FINALIZED ✓]
              </span>
            </div>
            <span className="text-[6px] font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
              Receipt Locked
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Badge */}
      <div
        className="flex items-center justify-between pt-1 text-[8.5px] font-mono tracking-tight"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
        }}
      >
        <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
          0 STUCK TRANSACTIONS
        </span>
        <span style={textMutedStyle}>
          DETERMINISTIC RECEIPT LOCK // ZERO NONCE GAPS
        </span>
      </div>
    </div>
  );
}

// ─── 26. CohereRerankFunnelVisual: 2-Stage Cross-Encoder Compression Funnel ─

export function CohereRerankFunnelVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between gap-1.5"
      style={{
        ...outerContainerStyle,
        minHeight: "155px",
      }}
    >
      {/* Top Header telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <Filter className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>2-STAGE_RETRIEVAL // COHERE_RERANK</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase flex items-center gap-1"
          style={activeHighlightStyle}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          +34.2% PRECISION
        </span>
      </div>

      {/* 3-Stage Retrieval Funnel Grid */}
      <div className="relative flex flex-col sm:flex-row items-stretch justify-between gap-1.5 my-0.5 font-mono">
        {/* Stage 01: MONGODB ATLAS VECTOR SEARCH */}
        <div
          className="flex-1 rounded p-1.5 flex flex-col justify-between text-[7px]"
          style={{
            ...inactiveSlotStyle,
            borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 16%, transparent)",
          }}
        >
          <div className="flex items-center justify-between border-b pb-1 mb-1" style={{ borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 10%, transparent)" }}>
            <span className="font-bold tracking-tight text-[7.5px]" style={textSecondaryStyle}>
              STAGE 1: MONGODB ATLAS
            </span>
            <Database className="h-2.5 w-2.5" style={{ color: "color-mix(in srgb, var(--theme-text, #f8fafc) 70%, transparent)" }} />
          </div>
          <div className="space-y-1">
            <span className="block text-[6.5px] leading-tight" style={textMutedStyle}>
              Top-25 Bi-Encoder Candidates (~22ms Recall • Noisy Ranking)
            </span>
            {/* Pill cluster */}
            <div className="flex flex-wrap gap-1">
              {["Doc #14", "Doc #07", "Doc #21", "Doc #03", "Doc #19", "+20 more"].map((doc, idx) => (
                <span
                  key={idx}
                  className="rounded px-1 py-0.2 text-[6px]"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 8%, transparent)",
                    color: "color-mix(in srgb, var(--theme-text, #f8fafc) 75%, transparent)",
                  }}
                >
                  {doc}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-1 flex items-center justify-between text-[6.5px]" style={textMutedStyle}>
            <span>Cosine Recall:</span>
            <span className="font-bold" style={textSecondaryStyle}>~22ms</span>
          </div>
        </div>

        {/* Funnel Connector 1 -> 2 */}
        <div className="hidden sm:flex items-center justify-center shrink-0 px-0.5">
          <motion.div
            animate={{ x: [-2, 3, -2], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[10px] font-bold"
            style={{ color: "var(--theme-primary, #10B981)" }}
          >
            ➔
          </motion.div>
        </div>

        {/* Stage 02: COHERE CROSS-ENCODER RERANK */}
        <div
          className="flex-[1.4] rounded-lg p-1.5 flex flex-col justify-between text-[7px] relative overflow-hidden"
          style={{
            border: "1.5px solid var(--theme-primary, #10B981)",
            backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 10%, var(--theme-bg, #0a0a0c))",
            boxShadow: "0 0 10px color-mix(in srgb, var(--theme-primary, #10B981) 20%, transparent)",
          }}
        >
          <div className="flex items-center justify-between border-b pb-0.5 mb-1" style={{ borderColor: "color-mix(in srgb, var(--theme-primary, #10B981) 25%, transparent)" }}>
            <span className="font-bold text-[7.5px] tracking-tight" style={{ color: "var(--theme-primary, #10B981)" }}>
              STAGE 2: COHERE CROSS-ENCODER
            </span>
            <span className="text-[6px] font-bold px-1 py-0.2 rounded" style={activeHighlightStyle}>
              RERANK FILTER
            </span>
          </div>

          {/* Promoted and Pruned Rows */}
          <div className="space-y-0.5 leading-tight">
            <div
              className="flex items-center justify-between rounded px-1.5 py-0.5 text-[6.5px] font-bold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 15%, transparent)",
                color: "var(--theme-primary, #10B981)",
              }}
            >
              <span>Doc #14 ➔ Score: 0.98</span>
              <span>[PROMOTED TO #1 ✓]</span>
            </div>
            <div
              className="flex items-center justify-between rounded px-1.5 py-0.5 text-[6.5px] font-bold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, transparent)",
                color: "var(--theme-primary, #10B981)",
              }}
            >
              <span>Doc #07 ➔ Score: 0.94</span>
              <span>[PROMOTED TO #2 ✓]</span>
            </div>
            <div
              className="flex items-center justify-between rounded px-1.5 py-0.5 text-[6.5px] opacity-75"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 8%, transparent)",
                color: "color-mix(in srgb, var(--theme-text, #f8fafc) 65%, transparent)",
              }}
            >
              <span>22 Low-Signal Chunks (&lt; 0.75)</span>
              <span className="text-red-400 font-semibold">[PRUNED ✕]</span>
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between text-[6px]" style={textMutedStyle}>
            <span>Cross-Attention Deep Score</span>
            <span style={{ color: "var(--theme-primary, #10B981)" }}>-88% Context Noise</span>
          </div>
        </div>

        {/* Funnel Connector 2 -> 3 */}
        <div className="hidden sm:flex items-center justify-center shrink-0 px-0.5">
          <motion.div
            animate={{ x: [-2, 3, -2], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="text-[10px] font-bold"
            style={{ color: "var(--theme-primary, #10B981)" }}
          >
            ➔
          </motion.div>
        </div>

        {/* Stage 03: GROUNDED LLM CONTEXT WINDOW */}
        <div
          className="flex-1 rounded p-1.5 flex flex-col justify-between text-[7px]"
          style={{
            ...inactiveSlotStyle,
            borderColor: "color-mix(in srgb, var(--theme-primary, #10B981) 35%, transparent)",
            backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 6%, var(--theme-bg, #0a0a0c))",
          }}
        >
          <div className="flex items-center justify-between border-b pb-1 mb-1" style={{ borderColor: "color-mix(in srgb, var(--theme-primary, #10B981) 20%, transparent)" }}>
            <span className="font-bold tracking-tight text-[7.5px]" style={{ color: "var(--theme-primary, #10B981)" }}>
              GROUNDED LLM CONTEXT
            </span>
            <CheckCircle2 className="h-2.5 w-2.5" style={{ color: "var(--theme-primary, #10B981)" }} />
          </div>
          <div className="space-y-1">
            <div
              className="rounded p-1 text-[6.5px] font-bold leading-tight"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 14%, transparent)",
                color: "var(--theme-primary, #10B981)",
                border: "1px solid color-mix(in srgb, var(--theme-primary, #10B981) 30%, transparent)",
              }}
            >
              [Top-3 Verified Policy Docs ➔ 0.00% Hallucination]
            </div>
            <span className="block text-[6px]" style={textMutedStyle}>
              Exact grounding citations attached to final output payload
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[6.5px]" style={textMutedStyle}>
            <span>Context Purity:</span>
            <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>100% Gated</span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div
        className="flex items-center justify-between pt-1 text-[8.5px] font-mono tracking-tight"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
        }}
      >
        <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
          +34.2% TOP-3 PRECISION
        </span>
        <span style={textMutedStyle}>
          -88% CONTEXT NOISE PRUNED // ZERO TOKEN WASTE
        </span>
      </div>
    </div>
  );
}

// ─── 27. AsyncIntentTriageVisual: Sub-18ms Intent Classifier & Priority Router 

export function AsyncIntentTriageVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between gap-1.5"
      style={{
        ...outerContainerStyle,
        minHeight: "155px",
      }}
    >
      {/* Top Header telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <Zap className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>ASYNC_INTENT_TRIAGE // MULTI-ROUTER</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase flex items-center gap-1"
          style={activeHighlightStyle}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          &lt;18MS CLASSIFIER
        </span>
      </div>

      {/* Main Grid: Left Ingest Node -> Router Mesh -> Right 3 Priority Lanes */}
      <div className="relative flex items-center justify-between gap-2 my-0.5 font-mono">
        {/* Left Section: Inbound Ingest & Classifier */}
        <div className="flex flex-col gap-1.5 flex-[1.1]">
          {/* Inbound Ticket Stream */}
          <div
            className="flex items-center justify-between rounded px-2 py-1 text-[7.5px]"
            style={inactiveSlotStyle}
          >
            <div className="flex items-center gap-1.5">
              <Radio className="h-2.5 w-2.5 animate-pulse" style={{ color: "var(--theme-primary, #10B981)" }} />
              <span className="font-bold text-[7.5px]" style={textSecondaryStyle}>
                INBOUND @APPLESUPPORT
              </span>
            </div>
            <span className="text-[6.5px] opacity-75" style={textMutedStyle}>LIVE STREAM</span>
          </div>

          {/* Async Intent Classifier */}
          <div
            className="rounded p-1.5 flex flex-col justify-center border"
            style={{
              borderColor: "var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 10%, var(--theme-bg, #0a0a0c))",
              boxShadow: "0 0 10px color-mix(in srgb, var(--theme-primary, #10B981) 18%, transparent)",
            }}
          >
            <div className="flex items-center justify-between text-[7.5px] font-bold">
              <span style={{ color: "var(--theme-primary, #10B981)" }}>[ASYNC INTENT CLASSIFIER]</span>
              <Activity className="h-2.5 w-2.5 animate-pulse" style={{ color: "var(--theme-primary, #10B981)" }} />
            </div>
            <div className="mt-1 flex items-center justify-between text-[6.5px]" style={textMutedStyle}>
              <span>Speed: &lt;18ms</span>
              <span className="font-semibold" style={{ color: "var(--theme-primary, #10B981)" }}>Parallel Embedding</span>
            </div>
          </div>
        </div>

        {/* Fanout SVG Connectors */}
        <div className="relative w-8 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full" viewBox="0 0 32 80" fill="none" preserveAspectRatio="none">
            {/* Top Node Connector (P0) */}
            <path d="M 2 40 C 14 40, 18 14, 30 14" stroke="color-mix(in srgb, #f59e0b 50%, var(--theme-text, #f8fafc))" strokeWidth="1" strokeDasharray="2 2" />
            {/* Middle Node Connector (P1 Active) */}
            <path d="M 2 40 L 30 40" stroke="var(--theme-primary, #10B981)" strokeWidth="1.8" />
            {/* Bottom Node Connector (P2) */}
            <path d="M 2 40 C 14 40, 18 66, 30 66" stroke="color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent)" strokeWidth="1" />

            {/* Glowing moving pulse on Active middle beam */}
            <motion.circle
              r="2"
              fill="var(--theme-primary, #10B981)"
              animate={{ cx: [2, 30], cy: [40, 40] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>

        {/* Right Section: 3 Priority Triage Lanes */}
        <div className="flex flex-col gap-1 flex-[1.6] text-[7.5px]">
          {/* Lane 01: P0: SECURITY / BILLING */}
          <div
            className="flex items-center justify-between rounded px-2 py-1"
            style={{
              ...inactiveSlotStyle,
              borderColor: "color-mix(in srgb, #f59e0b 35%, var(--theme-text, #f8fafc))",
              backgroundColor: "color-mix(in srgb, #f59e0b 8%, var(--theme-bg, #0a0a0c))",
            }}
          >
            <div className="flex flex-col">
              <span className="font-bold text-[7px]" style={{ color: "#f59e0b" }}>
                LANE 01: P0 SECURITY / BILLING
              </span>
              <span className="text-[6px]" style={textMutedStyle}>
                [⚡ Fast-Track Human Escalation Lock]
              </span>
            </div>
            <span
              className="rounded px-1 py-0.2 text-[6.5px] font-bold"
              style={{
                backgroundColor: "color-mix(in srgb, #f59e0b 20%, transparent)",
                color: "#f59e0b",
              }}
            >
              ESCALATE
            </span>
          </div>

          {/* Lane 02: P1: IOS / HARDWARE DEBUG (Highlighted) */}
          <div
            className="flex items-center justify-between rounded px-2 py-1"
            style={{
              border: "1px solid var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 14%, var(--theme-bg, #0a0a0c))",
              boxShadow: "0 0 10px color-mix(in srgb, var(--theme-primary, #10B981) 25%, transparent)",
            }}
          >
            <div className="flex flex-col">
              <span className="font-bold text-[7.5px]" style={{ color: "var(--theme-primary, #10B981)" }}>
                LANE 02: P1 IOS / HARDWARE DEBUG
              </span>
              <span className="text-[6.5px] font-bold" style={textSecondaryStyle}>
                ● Route to Cohere RAG + Provider Factory
              </span>
            </div>
            <span
              className="rounded px-1.5 py-0.5 text-[6.5px] font-bold animate-pulse"
              style={{
                backgroundColor: "var(--theme-primary, #10B981)",
                color: "var(--theme-bg, #0a0a0c)",
              }}
            >
              RAG ACTIVE
            </span>
          </div>

          {/* Lane 03: P2: GENERAL FAQ */}
          <div
            className="flex items-center justify-between rounded px-2 py-0.5 opacity-80"
            style={inactiveSlotStyle}
          >
            <div className="flex flex-col">
              <span className="font-bold text-[7px]" style={textSecondaryStyle}>
                LANE 03: P2 GENERAL FAQ
              </span>
              <span className="text-[6px]" style={textMutedStyle}>
                [○ Instant Cached Resolution]
              </span>
            </div>
            <span className="text-[6.5px]" style={textMutedStyle}>
              [CACHED]
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Badge */}
      <div
        className="flex items-center justify-between pt-1 text-[8.5px] font-mono tracking-tight"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
        }}
      >
        <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
          TRIAGE LATENCY: &lt;18ms
        </span>
        <span style={textMutedStyle}>
          HOT-SWAPPABLE LLM FACTORY // ZERO DRIFT
        </span>
      </div>
    </div>
  );
}

// ─── 28. GoldenEvalMatrixVisual: 150-Case Baseline vs Hiver Reranked Benchmark 

export function GoldenEvalMatrixVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between gap-1.5"
      style={{
        ...outerContainerStyle,
        minHeight: "155px",
      }}
    >
      {/* Top Header telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5" style={textSecondaryStyle}>
          <ShieldCheck className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span>150-ITEM GOLDEN DATASET // A/B BENCHMARK</span>
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase flex items-center gap-1"
          style={activeHighlightStyle}
        >
          <CheckCircle2 className="h-2.5 w-2.5" />
          LLM-AS-A-JUDGE VERIFIED ✓
        </span>
      </div>

      {/* Comparison Legend */}
      <div
        className="flex items-center justify-between rounded px-2 py-0.5 text-[7px] font-mono"
        style={{
          ...inactiveSlotStyle,
          borderColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 16%, transparent)",
        }}
      >
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 40%, transparent)" }} />
          <span style={textMutedStyle}>[Baseline Vector RAG]</span>
        </div>
        <span style={textMutedStyle}>vs.</span>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
            [Hiver Reranked Pipeline]
          </span>
        </div>
      </div>

      {/* 3 Evaluation Pillars (Middle Comparative Bars) */}
      <div className="space-y-1.5 font-mono text-[7px]">
        {/* Pillar 1: GROUNDED FAITHFULNESS */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[7.5px]" style={textSecondaryStyle}>
              1. GROUNDED FAITHFULNESS
            </span>
            <div className="flex items-center gap-2 text-[7px]">
              <span style={textMutedStyle}>Baseline: 71%</span>
              <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
                Hiver: 99.2%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 h-2 w-full rounded-full overflow-hidden p-0.5" style={inactiveSlotStyle}>
            <div
              className="h-full rounded-full"
              style={{
                width: "71%",
                backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 35%, transparent)",
              }}
            />
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: "var(--theme-primary, #10B981)",
                boxShadow: "0 0 6px var(--theme-primary, #10B981)",
              }}
              initial={{ width: "0%" }}
              animate={{ width: "99.2%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Pillar 2: TOP-3 CONTEXT PRECISION */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[7.5px]" style={textSecondaryStyle}>
              2. TOP-3 CONTEXT PRECISION
            </span>
            <div className="flex items-center gap-2 text-[7px]">
              <span style={textMutedStyle}>Baseline: 62%</span>
              <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
                Hiver: 96.2%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 h-2 w-full rounded-full overflow-hidden p-0.5" style={inactiveSlotStyle}>
            <div
              className="h-full rounded-full"
              style={{
                width: "62%",
                backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 35%, transparent)",
              }}
            />
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: "var(--theme-primary, #10B981)",
                boxShadow: "0 0 6px var(--theme-primary, #10B981)",
              }}
              initial={{ width: "0%" }}
              animate={{ width: "96.2%" }}
              transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Pillar 3: SAFE HUMAN ABSTENTION */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[7.5px]" style={textSecondaryStyle}>
              3. SAFE HUMAN ABSTENTION
            </span>
            <div className="flex items-center gap-2 text-[7px]">
              <span style={textMutedStyle}>Baseline: 68%</span>
              <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
                Hiver: 98.5%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 h-2 w-full rounded-full overflow-hidden p-0.5" style={inactiveSlotStyle}>
            <div
              className="h-full rounded-full"
              style={{
                width: "68%",
                backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 35%, transparent)",
              }}
            />
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: "var(--theme-primary, #10B981)",
                boxShadow: "0 0 6px var(--theme-primary, #10B981)",
              }}
              initial={{ width: "0%" }}
              animate={{ width: "98.5%" }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Badge */}
      <div
        className="flex items-center justify-between pt-1 text-[8.5px] font-mono tracking-tight"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
        }}
      >
        <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
          LLM-AS-A-JUDGE VERIFIED ✓
        </span>
        <span style={textMutedStyle}>
          0.00% POLICY HALLUCINATIONS // GOLDEN BENCHMARK
        </span>
      </div>
    </div>
  );
}

// ─── VisualRegistry: Switch-based Visual Dispatcher ─────────────────────────

export default function VisualRegistry({ visualKey }: { visualKey: string }) {
  const normalizedKey = visualKey ? visualKey.toLowerCase().replace(/visual$/, "") : "";
  switch (normalizedKey) {
    case "chart":
      return <ChartVisual />;
    case "security":
      return <SecurityVisual />;
    case "server":
      return <ServerVisual />;
    case "layout-orchestrator":
    case "layoutorchestrator":
    case "layout":
      return <LayoutOrchestratorVisual />;
    case "block-ast":
    case "blockast":
    case "block":
      return <BlockAstVisual />;
    case "schema-compiler":
    case "schemacompiler":
    case "schema":
      return <SchemaCompilerVisual />;
    case "service-mesh":
    case "servicemesh":
    case "mesh":
      return <ServiceMeshVisual />;
    case "pubsub-stream":
    case "pubsubstream":
    case "pubsub":
    case "stream":
      return <PubSubStreamVisual />;
    case "rls-shield":
    case "rlsshield":
    case "rls":
      return <RlsShieldVisual />;
    case "state-loop":
    case "stateloop":
    case "gameloop":
      return <StateLoopVisual />;
    case "escrow-ledger":
    case "escrowledger":
    case "escrow":
    case "ledger":
      return <EscrowLedgerVisual />;
    case "webgl-pipeline":
    case "webglpipeline":
    case "webgl":
    case "r3f":
      return <WebGlPipelineVisual />;
    case "two-tier-cache":
    case "twotiercache":
    case "cache-waterfall":
      return <TwoTierCacheVisual />;
    case "hybrid-rrf-fusion":
    case "hybridrrffusion":
    case "rrf-fusion":
      return <HybridRrfFusionVisual />;
    case "inngest-event-bus":
    case "inngesteventbus":
    case "event-bus":
      return <InngestEventBusVisual />;
    case "zod-ast-parser":
    case "zodastparser":
    case "zod-ast":
    case "zodast":
      return <ZodAstParserVisual />;
    case "tanstack-optimistic-sync":
    case "tanstackoptimisticsync":
    case "optimistic-sync":
    case "optimisticsync":
      return <TanstackOptimisticSyncVisual />;
    case "context-window-compressor":
    case "contextwindowcompressor":
    case "context-compressor":
    case "compressor":
      return <ContextWindowCompressorVisual />;
    case "bullmq-async-workers":
    case "bullmqasyncworkers":
    case "bullmq":
    case "bullmq-workers":
      return <BullMqAsyncWorkersVisual />;
    case "provider-factory-router":
    case "providerfactoryrouter":
    case "provider-router":
    case "providerfactory":
      return <ProviderFactoryRouterVisual />;
    case "llm-judge-harness":
    case "llmjudgeharness":
    case "llm-judge":
    case "judge-harness":
      return <LlmJudgeHarnessVisual />;
    case "enclave-key-signer":
    case "enclavekeysigner":
    case "enclave-signer":
    case "enclave":
      return <EnclaveKeySignerVisual />;
    case "rpc-failover-mesh":
    case "rpcfailovermesh":
    case "rpc-failover":
    case "failover-mesh":
      return <RpcFailoverMeshVisual />;
    case "mempool-state-machine":
    case "mempoolstatemachine":
    case "mempool-state":
    case "mempool":
      return <MempoolStateMachineVisual />;
    case "cohere-rerank-funnel":
    case "coherererankfunnel":
    case "cohere-rerank":
    case "rerank-funnel":
      return <CohereRerankFunnelVisual />;
    case "async-intent-triage":
    case "asyncintenttriage":
    case "intent-triage":
    case "async-intent":
      return <AsyncIntentTriageVisual />;
    case "golden-eval-matrix":
    case "goldenevalmatrix":
    case "golden-eval":
    case "eval-matrix":
      return <GoldenEvalMatrixVisual />;
    default:
      return <DefaultVisual />;
  }
}



